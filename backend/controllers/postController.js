const pool = require("../config/db");
const { redisClient } = require("../redis.js");

exports.createPost = async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, content, tags = [] } = req.body;
    const userId = req.user.userId;
    // console.log(req.user);
    await client.query("BEGIN");

    // 1. Create the post
    const result = await client.query(
      "Insert into posts (user_id,title,content) values ($1,$2,$3) RETURNING *",
      [userId, title, content],
    );
    // console.log(result);
    const post = result.rows[0];
    // console.log(post);

    // 2. process the tags
    for (let tagName of tags) {
      const normalizedTag = tagName.trim().toLowerCase();
      if (!normalizedTag) continue;

      let tagResult = await client.query(
        "select id from tags where lower(name)=lower($1)",
        [normalizedTag],
      );
      // console.log(tagResult);

      let tagId;
      if (tagResult.rows.length === 0) {
        const newTags = await client.query(
          "Insert into tags (name) values ($1) RETURNING id",
          [normalizedTag],
        );
        tagId = newTags.rows[0].id;
      } else {
        tagId = tagResult.rows[0].id;
      }

      // 3. Insert into post_tags
      await client.query(
        "Insert into post_tags (post_id,tag_id) values ($1,$2) ON CONFLICT DO NOTHING",
        [post.post_id, tagId],
      ); //ON CONFLICT DO NOTHING
    }

    await client.query("COMMIT");
    await redisClient.del("posts:all");

    res.status(201).json({
      ...post,
      tags,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const cached = await redisClient.get("posts:all");
    const { limit = 5, offset = 0 } = req.query;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    if (cached) {
      // console.log("cache hit")
      // console.log(typeof cached)
      return res.json(JSON.parse(cached));
    }

    // const result = await pool.query(
    //   "select posts.post_id,users.id,users.name,posts.title,posts.content from posts join users on users.id=posts.user_id order by posts.post_id",
    // );

    const result = await pool.query(
      `
      SELECT 
        posts.post_id,
        users.name,
        posts.title,
        posts.content,
        posts.status,
        COALESCE(array_agg(tags.name) FILTER (WHERE tags.name IS NOT NULL), '{}') AS tags
      FROM posts
      JOIN users ON users.id = posts.user_id
      LEFT JOIN post_tags ON post_tags.post_id = posts.post_id
      LEFT JOIN tags ON tags.id = post_tags.tag_id
      GROUP BY posts.post_id, users.name
      ORDER BY posts.post_id DESC limit $1 offset $2
    `,
      [limitNum, offsetNum],
    );
    // console.log(result);

    await redisClient.setEx("posts:all", 60, JSON.stringify(result.rows));
    // const totalPosts = parseInt(result.rows.count);
    res.status(200).json({
      posts: result.rows,
      // total:totalPosts,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    // const {user_id}=req.body;
    // const result = await pool.query(`select * from posts where user_id=${user_id}`);

    const userId = req.user.userId;
    const result = await pool.query(`select * from posts where user_id=$1`, [
      userId,
    ]);
    res.status(200).json(result.rows);
    // console.log(result);
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
};

exports.editPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;
    const postId = req.params.id;
    console.log(userId);
    const result = await pool.query(
      "Update posts Set title=COALESCE($1,title),content=COALESCE($2,content) where post_id=$3 and user_id=$4 RETURNING *",
      [title, content, postId, userId],
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Not authorised or post not found" });
    }
    await redisClient.del("posts:all");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;
    const result = await pool.query(
      "Delete from posts where post_id=$1 and user_id=$2 RETURNING *",
      [postId, userId],
    );
    console.log(result);
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Not authorised or post not found" });
    }
    await redisClient.del("posts:all");
    return res.json({ message: "Post deleted sucessfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;
    const { comment, parent_id } = req.body;

    if (parent_id) {
      const parent_check = await pool.query(
        "select comment_id from comments where comment_id=$1 and post_id=$2",
        [parent_id, postId],
      );

      if (parent_check.rows.length === 0) {
        return res.status(404).json({ error: "Parent comment not found" });
      }
    }

    const newComent = await pool.query(
      "Insert into comments (post_id,user_id,content,parent_id) values ($1,$2,$3,$4) RETURNING *",
      [postId, userId, comment, parent_id || null],
    );
    res.status(201).json({
      message: "Comment added successfully",
      comment: newComent.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Comments for posts with replies
// const jwt = require("jsonwebtoken");
exports.getCommentsWithReplies = async (req, res) => {
  try {
    // const token = req.cookies.token; // Access the cookie directly
    // const decoded = jwt.verify(token,"secret-key");
    // req.user = decoded;
    // console.log("check this",decoded)

    const postId = req.params.id;
    // const postId=2;
    const { limit = 1, offset = 0 } = req.query;

    const postCheck = await pool.query(
      "Select post_id from posts where post_id=$1",
      [postId],
    );
    if (postCheck.rows.length === 0) {
      res.status(401).json({ error: "Post not Found." });
    }

    // get main comment

    const mainComments = await pool.query(
      `Select c.* , u.name,u.email from comments c join users u on c.user_id=u.id where c.post_id=$1 and c.parent_id IS NULL order by c.created_at DESC limit $2 offset ${offset}`,
      [postId, limit],
    );

    // For each main comment, get replies
    const commentsWithReplies = await Promise.all(
      mainComments.rows.map(async (mainComment) => {
        const replies = await pool.query(
          `SELECT comments.comment_id,
            comments.post_id,
            comments.user_id,
            comments.content,
            comments.parent_id,
            comments.created_at,
            users.name,
            users.email
          FROM comments
          JOIN users ON comments.user_id = users.id
          WHERE comments.parent_id = $1
          ORDER BY comments.created_at ASC`,
          [mainComment.comment_id],
        );

        return {
          ...mainComment,
          replies: replies.rows,
        };
      }),
    );

    // Get total count
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM comments WHERE post_id = $1 AND parent_id IS NULL",
      [postId],
    );
    const totalComments = parseInt(countResult.rows[0].count);

    res.json({
      comments: commentsWithReplies,
      total: totalComments,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleLikes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;
    // Check Existing like
    const existingLike = await pool.query(
      "select * from likes where user_id=$1 and post_id=$2",
      [userId, postId],
    );
    if (existingLike.rows.length > 0) {
      await pool.query("Delete From likes where user_id=$1 and post_id=$2", [
        userId,
        postId,
      ]);
      return res.json({ message: "Post unliked" });
    } else {
      await pool.query("Insert into likes (user_id,post_id) values ($1,$2)", [
        userId,
        postId,
      ]);
      await redisClient.del(`post:${postId}`);
      return res.json({ message: "Post liked" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostDetails = async (req, res) => {
  try {
    // const userId=req.user.userId;
    const postId = req.params.id;
    const cacheKey = `post:${postId}`;
    const cached = await redisClient.get(cacheKey);
    console.log(cached);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Get Post and Likes
    const postData = await pool.query(
      "select p.* ,COUNT(l.like_id) as total_likes from posts p left join likes l ON p.post_id = l.post_id where p.post_id=$1 group by p.post_id",
      [postId],
    );

    // Get all Comments

    const commentsData = await pool.query(
      "select c.* , u.name From comments c join users u on u.id=c.user_id where c.post_id=$1 order by c.created_at ASC",
      [postId],
    );
    // SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC
    const response = {
      posts: postData.rows[0],
      comments: commentsData.rows,
    };
    await redisClient.setEx(cacheKey, 60, JSON.stringify(response));
    res.status(200).json({
      posts: postData.rows[0],
      comments: commentsData.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approvePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const adminId = req.user.id; // From authMiddleware

    const result = await pool.query(
      "UPDATE posts SET status = 'approved', approved_by = $1 WHERE post_id = $2 RETURNING *",
      [adminId, postId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Post not found" });

    res.json({ message: "Post approved and is now live!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    // Fetch all users where role is 'admin'
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE role = 'admin' ",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// {
// 	 "name":"Aditya",
//   "email": "aditya@example.com",
//   "password": "password123"
//    "age":35,
//    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3NDMyODkzMSwiZXhwIjoxNzc0NDE1MzMxfQ.6BblHfT5shFAigjOd5LyC-GUjnWhahoM0huc5DuW_Cs"
// }

// {
// "name":"Rohan",
// "email": "rohan@example.com",
// "password": "password123",
// "age":24,
// "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3NDMzMTkyMywiZXhwIjoxNzc0NDE4MzIzfQ.ZydZaHEBqRVnoC9Wy6rMrXT2MmgRBfDomqVjsMt42w4"
// }

{
  // "name":"Ram",
  // "email": "ram@example.com",
  // "password": "password123",
  // "age":24,
  // "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc3NDM0MzA3NSwiZXhwIjoxNzc0NDI5NDc1fQ.iR_1o-r8Qbr_Zp_EfEMbDGPsSQc3q8mnmfpfNsbw_AQ"
}
