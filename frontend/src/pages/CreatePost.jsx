// // src/pages/CreatePost.jsx
// import { useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function CreatePost() {
//   const { getAccessTokenSilently } = useAuth0();

//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     tags: "",
//   });

//   const handleSubmit = async () => {
//     const token = await getAccessTokenSilently();

//     await fetch("http://localhost:3000/api/post/create", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         ...form,
//         tags: form.tags.split(","),
//       }),
//     });

//     alert("Post created!");
//   };

//   return (
//     <div className="p-6">
//       <h2>Create Post</h2>

//       <input
//         placeholder="Title"
//         onChange={(e) => setForm({ ...form, title: e.target.value })}
//       />

//       <textarea
//         placeholder="Content"
//         onChange={(e) => setForm({ ...form, content: e.target.value })}
//       />

//       <input
//         placeholder="tags (comma separated)"
//         onChange={(e) => setForm({ ...form, tags: e.target.value })}
//       />

//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// }



// // src/pages/CreatePost.jsx
// import { useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useNavigate } from "react-router-dom";

// export default function CreatePost(existingPost, onSubmit) {
//   const { getAccessTokenSilently } = useAuth0();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     tags: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!form.title || !form.content) {
//       alert("Title and content are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const token = await getAccessTokenSilently();

//       await fetch("http://localhost:3000/api/post/create", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title: form.title,
//           content: form.content,
//           tags: form.tags
//             .split(",")
//             .map((t) => t.trim())
//             .filter((t) => t !== ""),
//         }),
//       });

//       alert("Post created successfully!");

//       // reset form
//       setForm({ title: "", content: "", tags: "" });

//       // redirect to posts
//       navigate("/posts");
//     } catch (err) {
//       console.error(err);
//       alert("Error creating post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           ✍️ Create New Post
//         </h2>

//         {/* TITLE */}
//         <input
//           type="text"
//           placeholder="Post Title"
//           value={form.title}
//           onChange={(e) =>
//             setForm({ ...form, title: e.target.value })
//           }
//           className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* CONTENT */}
//         <textarea
//           placeholder="Write your content..."
//           value={form.content}
//           onChange={(e) =>
//             setForm({ ...form, content: e.target.value })
//           }
//           className="w-full border p-3 rounded-lg mb-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* TAGS */}
//         <input
//           type="text"
//           placeholder="Tags (comma separated)"
//           value={form.tags}
//           onChange={(e) =>
//             setForm({ ...form, tags: e.target.value })
//           }
//           className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* BUTTON */}
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className={`w-full py-3 rounded-lg text-white font-semibold transition ${
//             loading
//               ? "bg-gray-400"
//               : "bg-blue-500 hover:bg-blue-600"
//           }`}
//         >
//           {loading ? "Creating..." : "Create Post"}
//         </button>
//       </div>
//     </div>
//   );
// }


// src/pages/CreatePost.jsx
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ existingPost = null, onSubmit }) {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);

  // Initialize form if editing
  useEffect(() => {
    if (existingPost) {
      setForm({
        title: existingPost.title,
        content: existingPost.content,
        tags: existingPost.tags ? existingPost.tags.join(", ") : "",
      });
    }
  }, [existingPost]);

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      alert("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const token = await getAccessTokenSilently();

      const body = {
        title: form.title,
        content: form.content,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
      };

      if (existingPost && onSubmit) {
        // Editing mode
        await fetch(`http://localhost:3000/api/post/edit/${existingPost.post_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        onSubmit({ ...existingPost, ...body });
      } else {
        // Creating new post
        await fetch("http://localhost:3000/api/post/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        alert("Post created successfully!");
        setForm({ title: "", content: "", tags: "" });
        navigate("/posts");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {existingPost ? "✍️ Edit Post" : "✍️ Create New Post"}
        </h2>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Post Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* CONTENT */}
        <textarea
          placeholder="Write your content..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-3 rounded-lg mb-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* TAGS */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? (existingPost ? "Updating..." : "Creating...") : existingPost ? "Update Post" : "Create Post"}
        </button>
      </div>
    </div>
  );
}