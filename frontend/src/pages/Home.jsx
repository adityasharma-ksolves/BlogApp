// import { useEffect, useState } from "react";
// import API from "../api/axios";
// import PostCard from "../components/PostCard";

// export default function Home() {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await API.get("/post/get");
//         console.log(res.data);

//         setPosts(res.data?.posts || []);
//       } catch (err) {
//         console.error(err);
//         setPosts([]);
//       }
//     };

//     fetchPosts();
//   }, []);

//   return (
//     <div>
//       <h2>All Posts</h2>

//       {posts.length === 0 ? (
//         <p>No posts found</p>
//       ) : (
//         posts.map((p) => <PostCard key={p.post_id} post={p} />)
//       )}
//     </div>
//   );
// }








//////////////////////////////////////////////////////////

// import { useEffect, useState } from "react";
// import API from "../api/axios";
// import { useNavigate } from "react-router-dom";
// import PostCard from "../components/PostCard";
// // import { SkeletonCard } from "../components/Spinner";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function Home() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { getAccessTokenSilently } = useAuth0();

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await API.get("/post/get");
//         console.log(res.data); // should log an array
//         // const res1 = await fetch(`http://localhost:3000/api/post/details/${id}`);
//         // const data1 = await res1.json();

//         setPosts(res.data.posts || []);
//         setLoading(false);
//         console.log(posts);
//       } catch (err) {
//         console.error(err);
//         setPosts([]);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const likePost = async (id) => {
//     const token = await getAccessTokenSilently();

//     try {
//       const res = await fetch(`http://localhost:3000/api/post/${id}/like`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();

//       setPosts((prev) =>
//         prev.map((p) => {
//           if (p.post_id !== id) return p;

//           return {
//             ...p,
//             total_likes:
//               data.message === "Post liked"
//                 ? p.total_likes + 1
//                 : p.total_likes - 1,
//           };
//         }),
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // console.log(typeof posts);

//   return (
//     //     <>
//     //       <div className="min-h-screen bg-gray-100 p-6">
//     //         <h2 className="text-3xl font-bold mb-6 text-center">📝 All Posts</h2>

//     //         {posts.length > 0 ? (
//     //           <div className="max-w-2xl mx-auto space-y-6">
//     //   {posts.map((p) => (
//     //     <PostCard key={p.post_id} post={p} />
//     //   ))}
//     // </div>
//     //         ) : (
//     //           <p className="text-center text-gray-500">No posts found...</p>
//     //         )}
//     //       </div>
//     //     </>

//     <div className="bg-gray-100 py-10 px-6">
//       <div className="bg-white p-4 rounded-lg shadow mb-8 flex justify-between items-center">
//         <p className="text-gray-600">Share something with the world...</p>

//         <button
//           onClick={() => navigate("/create")}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           + Create Post
//         </button>
        
//       </div>
//       <div className="max-w-6xl mx-auto space-y-20">
//         {posts.map((post, index) => (
//           <div
//             key={post.post_id}
//             className={`flex flex-col md:flex-row items-center gap-10 ${
//               index % 2 !== 0 ? "md:flex-row-reverse" : ""
//             }`}
//           >
          
//             <div className="flex-1">
//               <h2 className="text-3xl font-bold mb-4">{post.title}</h2>

//               <p className="text-gray-600 mb-4">
//                 {post.content.slice(0, 200)}...
//               </p>

//               <button
//                 className="border border-orange-400 px-4 py-2 text-orange-500 hover:bg-orange-500 hover:text-white transition"
//                 onClick={() => navigate(`/post/${post.post_id}`)}
//               >
//                 Read More
//               </button>
              
//               <button
//                 onClick={() => likePost(post.post_id)}
//                 className="mt-2 text-red-500 hover:scale-105 transition"
//               >
//                 ❤️ {post.total_likes}
//               </button>
//             </div>
//             <div className="flex-1 relative">
//               <div className="absolute top-4 left-4 w-full h-full bg-orange-200 z-0"></div>

//               <img
//                 src={`https://picsum.photos/seed/post${post.post_id}/600/400`}
//                 alt="post"
//                 className="relative z-10 w-full h-[300px] object-cover"
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/post/get");
        setPosts(res.data.posts || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setPosts([]);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const likePost = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`http://localhost:3000/api/post/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setPosts((prev) =>
        prev.map((p) => {
          if (p.post_id !== id) return p;

          // If message says "Post liked" increase, else decrease
          const updatedLikes =
            data.message === "Post liked"
              ? p.total_likes + 1
              : Math.max(p.total_likes - 1, 0);

          return { ...p, total_likes: updatedLikes };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-100 py-10 px-6">
      {/* Create Post Banner */}
      <div className="bg-white p-4 rounded-lg shadow mb-10 flex justify-between items-center max-w-6xl mx-auto">
        <p className="text-gray-600 font-medium">
          Share something with the world...
        </p>
        <button
          onClick={() => navigate("/create")}
          className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
        >
          + Create Post
        </button>
      </div>

      {/* Posts List */}
      <div className="max-w-6xl mx-auto space-y-16">
        {posts.length === 0 && (
          <p className="text-center text-gray-500">No posts found</p>
        )}

        {posts.map((post, index) => (
          <div
            key={post.post_id}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Post Text */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-3">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.content.slice(0, 200)}...</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(`/post/${post.post_id}`)}
                  className="border border-orange-400 px-4 py-2 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition"
                >
                  Read More
                </button>

                <button
                  onClick={() => likePost(post.post_id)}
                  className="flex items-center gap-2 text-red-500 font-semibold hover:scale-105 transition"
                >
                  ❤️ {post.total_likes}
                </button>
              </div>
            </div>

            {/* Post Image */}
            <div className="flex-1 relative w-full md:w-[600px] h-[300px]">
              <div className="absolute top-4 left-4 w-full h-full bg-orange-200 rounded-lg z-0"></div>
              <img
                src={`https://picsum.photos/seed/post${post.post_id}/600/400`}
                alt="post"
                className="relative z-10 w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}