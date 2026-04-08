const express = require("express");
const {
  createPost,
  getPosts,
  getMyPosts,
  deletePost,
  editPost,
  addComments,
  getPostDetails,
  toggleLikes,
  getCommentsWithReplies,
  approvePost,
  getAllAdmins,
} = require("../controllers/postController");
const {checkJwt} = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/get", getPosts);
router.post("/create", checkJwt, createPost);
router.get("/my-posts", checkJwt, getMyPosts); // side on profile button
router.delete("/delete/:id", checkJwt, deletePost);
router.put("/edit/:id", checkJwt, editPost);

// comments and likes
router.post("/:id/comment", checkJwt, addComments); // done
router.post("/:id/like", checkJwt, toggleLikes); // done like button
router.get("/details/:id", getPostDetails); // done
router.get("/comment/:id", checkJwt, getCommentsWithReplies); //done

// Post Approval: Accessible by Admin AND Super Admin
router.put(
  "/approve/:id",
  checkJwt,
  authorize("admin", "super_admin"),
  approvePost,
);

// Admin List: ONLY accessible by Super Admin and admin
router.get(
  "/admins/list",
  checkJwt,
  authorize("super_admin"),
  getAllAdmins,
);

module.exports = router;
