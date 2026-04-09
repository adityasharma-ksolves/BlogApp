// // src/pages/Admin.jsx
// import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function Admin() {
//   const { getAccessTokenSilently } = useAuth0();
//   const [posts, setPosts] = useState([]);

//   const fetchPosts = async () => {
//     const res = await fetch("http://localhost:3000/api/post/get");
//     const data = await res.json();
//     setPosts(data.posts);
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const approve = async (id) => {
//     const token = await getAccessTokenSilently();

//     await fetch(`http://localhost:3000/api/post/approve/${id}`, {
//       method: "PUT",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     alert("Approved");
//   };

//   return (
//     <div className="p-6">
//       <h2>Admin Panel</h2>

//       {posts.map((p) => (
//         <div key={p.post_id}>
//           <h3>{p.title}</h3>
//           <p>Status: {p.status}</p>

//           {p.status !== "approved" && (
//             <button onClick={() => approve(p.post_id)}>
//               Approve
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import API from "../api/axios";

export default function Admin() {
  const { getAccessTokenSilently } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/post/get");
      const data = await res.json();
      setPosts(data.posts || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const approve = async (id) => {
    const token = await getAccessTokenSilently();

    try {
      const res = await fetch(`http://localhost:3000/api/post/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      //   console.log(res)
      // ✅ Update UI instantly

      if (res.status == 200) {
        setPosts((prev) =>
          prev.map((p) =>
            p.post_id === id ? { ...p, status: "approved" } : p,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">🛠 Admin Panel</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map((p) => (
            <div
              key={p.post_id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>

              <p className="text-gray-600 mb-3">{p.content.slice(0, 120)}...</p>

              {/* STATUS */}
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    p.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {p.status}
                </span>

                {/* APPROVE BUTTON */}
                {p.status !== "approved" && (
                  <button
                    onClick={() => approve(p.post_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Approve
                  </button>
                )}

                {/* {role === "super_admin" && p.status !== "approved" && (
  <button
    onClick={() => approve(p.post_id)}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Approve
  </button>
)}

{role !== "super_admin" && p.status !== "approved" && (
  <span className="text-red-500 text-sm">
    Only super admins can approve
  </span>
)} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
