// // src/pages/MyPosts.jsx
// import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function MyPosts() {
//   const { getAccessTokenSilently } = useAuth0();
//   const [posts, setPosts] = useState([]);

//   const fetchMyPosts = async () => {
//     const token = await getAccessTokenSilently();

//     const res = await fetch("http://localhost:3000/api/post/my-posts", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     console.log(res ,"on my posts")
//     const data = await res.json();
//     console.log(data)
//     setPosts(data);
//   };

//   useEffect(() => {
//     fetchMyPosts();
//   }, []);

// //    useEffect(() => {
// //     const fetchPosts = async () => {
// //       try {
// //         const res = await API.get("/post/get");
// //         console.log(res.data); // should log an array

// //         setPosts(res.data || []);
// //       } catch (err) {
// //         console.error(err);
// //         setPosts([]);
// //       }
// //     };

// //     fetchPosts();
// //   }, []);

//   const deletePost = async (id) => {
//     const token = await getAccessTokenSilently();

//     await fetch(`http://localhost:3000/api/post/delete/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     fetchMyPosts();
//   };

//   return (
//     <div className="p-6">
//       <h2>My Posts</h2>

//       {posts.length === 0 ? (
//         <p>No posts</p>
//       ) : (
//         posts.map((p) => (
//           <div key={p.post_id}>
//             <h3>{p.title}</h3>
//             <p>{p.content}</p>
//             <button onClick={() => deletePost(p.post_id)}>Delete</button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// // src/pages/MyPosts.jsx
// import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function MyPosts() {
//   const { getAccessTokenSilently } = useAuth0();
//   const [posts, setPosts] = useState([]);

//   const fetchMyPosts = async () => {
//     const token = await getAccessTokenSilently();

//     const res = await fetch("http://localhost:3000/api/post/my-posts", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     setPosts(data);
//   };

//   useEffect(() => {
//     fetchMyPosts();
//   }, []);

//   const deletePost = async (id) => {
//     const token = await getAccessTokenSilently();

//     await fetch(`http://localhost:3000/api/post/delete/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     fetchMyPosts();
//   };

//   const editPost = async (id) => {
//     const title = prompt("Enter new title:");
//     const content = prompt("Enter new content:");

//     if (!title && !content) return;

//     const token = await getAccessTokenSilently();

//     await fetch(`http://localhost:3000/api/post/edit/${id}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ title, content }),
//     });

//     fetchMyPosts();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h2 className="text-3xl font-bold text-center mb-8">My Posts</h2>

//       {posts.length === 0 ? (
//         <p className="text-center text-gray-500">No posts yet...</p>
//       ) : (
//         <div className="max-w-4xl mx-auto space-y-6">
//           {posts.map((p, index) => (
//             <div
//               key={p.post_id}
//               className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
//             >
//               {/* IMAGE */}
//               <img
//                 src={`https://picsum.photos/seed/post${p.post_id}/700/600`}
//                 alt="post"
//                 className="w-full h-[400px] object-cover"
//               />

//               {/* CONTENT */}
//               <div className="p-5">
//                 <h3 className="text-xl font-semibold mb-2">{p.title}</h3>

//                 <p className="text-gray-600 mb-4">
//                   {p.content.slice(0, 120)}...
//                 </p>

//                 {/* ACTIONS */}
//                 <div className="flex justify-between items-center">
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => editPost(p.post_id)}
//                       className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => deletePost(p.post_id)}
//                       className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                     >
//                       Delete
//                     </button>
//                   </div>

//                   <span className="text-sm text-gray-400">ID: {p.post_id}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




// src/pages/MyPosts.jsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CreatePost from "./CreatePost"; // Reuse your form
import Modal from "../components/Modal"; // Optional modal wrapper you can create

export default function MyPosts() {
  const { getAccessTokenSilently } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // Post being edited
  const [modalOpen, setModalOpen] = useState(false);

  const fetchMyPosts = async () => {
    const token = await getAccessTokenSilently();
    const res = await fetch("http://localhost:3000/api/post/my-posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const deletePost = async (id) => {
    const token = await getAccessTokenSilently();
    await fetch(`http://localhost:3000/api/post/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMyPosts();
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const handleUpdate = async (updatedPost) => {
    const token = await getAccessTokenSilently();
    await fetch(`http://localhost:3000/api/post/edit/${updatedPost.post_id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updatedPost.title,
        content: updatedPost.content,
        tags: updatedPost.tags,
      }),
    });

    setModalOpen(false);
    setEditingPost(null);
    fetchMyPosts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">My Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet...</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map((p) => (
            <div
              key={p.post_id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <img
                src={`https://picsum.photos/seed/post${p.post_id}/700/400`}
                alt="post"
                className="w-full h-[300px] object-cover"
              />

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-600 mb-4">
                  {p.content.slice(0, 120)}...
                </p>

                {/* ACTIONS */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(p.post_id)}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">ID: {p.post_id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {modalOpen && editingPost && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
          <CreatePost
            existingPost={editingPost}
            onSubmit={handleUpdate}
          />
        </Modal>
      )}
    </div>
  );
}