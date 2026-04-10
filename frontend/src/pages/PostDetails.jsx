// // src/pages/PostDetails.jsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function PostDetails() {
//   const { id } = useParams();
//   const { getAccessTokenSilently } = useAuth0();

//   const [post, setPost] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState("");

//   const fetchData = async () => {
//     const res1 = await fetch(`http://localhost:3000/api/post/details/${id}`);
//     const data1 = await res1.json();

//     const token = await getAccessTokenSilently();
//     const res2 = await fetch(
//       `http://localhost:3000/api/post/comment/${id}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     const data2 = await res2.json();

//     setPost(data1.posts);
//     setComments(data2.comments);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const addComment = async () => {
//     const token = await getAccessTokenSilently();

//     await fetch(`http://localhost:3000/api/post/${id}/comment`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ comment }),
//     });

//     setComment("");
//     fetchData();
//   };

//   if (!post) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h2>{post.title}</h2>
//       <p>{post.content}</p>

//       <h3>Comments</h3>
//       {comments.map((c) => (
//         <div key={c.comment_id}>
//           <b>{c.name}</b>: {c.content}
//         </div>
//       ))}

//       <input value={comment} onChange={(e) => setComment(e.target.value)} />
//       <button onClick={addComment}>Add</button>
//     </div>
//   );
// }

// src/pages/PostDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function PostDetails() {
  const { id } = useParams();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const fetchData = async () => {
    const res1 = await fetch(`http://localhost:3000/api/post/details/${id}`);
    const data1 = await res1.json();

    let commentsData = { comments: [] };

    if (isAuthenticated) {
      const token = await getAccessTokenSilently();
      const res2 = await fetch(
        `http://localhost:3000/api/post/comment/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      commentsData = await res2.json();
    }

    setPost(data1.posts);
    setComments(commentsData.comments || []);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;

    const token = await getAccessTokenSilently();

    await fetch(`http://localhost:3000/api/post/${id}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    });

    setComment("");
    fetchData();
  };

  if (!post)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 mt-12">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        
        {/* IMAGE */}
        <img
          src={`https://picsum.photos/seed/post${id}/800/400`}
          alt="post"
          className="w-full h-[300px] object-cover rounded-lg mb-6"
        />

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        {/* CONTENT */}
        <p className="text-gray-700 leading-relaxed mb-6">
          {post.content}
        </p>

        {/* LIKES */}
        <p className="text-sm text-gray-500 mb-6">
          ❤️ {post.total_likes} likes
        </p>

        {/* COMMENTS */}
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {comments.length === 0 ? (
          <p className="text-gray-500 mb-4">No comments yet</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.map((c) => (
              <div
                key={c.comment_id}
                className="bg-gray-100 p-3 rounded-lg"
              >
                <p className="font-semibold">{c.name}</p>
                <p className="text-gray-700">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* ADD COMMENT */}
        {isAuthenticated ? (
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg p-2"
            />
            <button
              onClick={addComment}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        ) : (
          <p className="text-gray-500">
            Login to add comments
          </p>
        )}
      </div>
    </div>
  );
}