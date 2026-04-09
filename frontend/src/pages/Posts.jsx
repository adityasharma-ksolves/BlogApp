// src/pages/Posts.jsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Posts() {
  const { getAccessTokenSilently } = useAuth0();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await fetch("http://localhost:3000/api/post/get");
    const data = await res.json();
    console.log(data)
    setPosts(data.posts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = async (id) => {
    const token = await getAccessTokenSilently();

    await fetch(`http://localhost:3000/api/post/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Liked!");
  };

  return (
    <div className="p-6">
      <h2>All Posts</h2>

      {posts.length === 0 ? (
        <p>No Post  here</p>
      ) : (
        posts.map((p) => (
          <div key={p.post_id} className="border p-4 my-3">
            <h3>{p.title}</h3>
            <p>{p.content}</p>
            <p>{p.tags.join(", ")}</p>

            <button onClick={() => likePost(p.post_id)}>❤️ Like</button>
          </div>
        ))
      )}
    </div>
  );
}
