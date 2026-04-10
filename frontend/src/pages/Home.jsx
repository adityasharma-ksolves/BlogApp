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
        console.log(res.data)
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

  // if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (loading) return (
    <div className="max-w-6xl mx-auto mt-20 space-y-8 animate-pulse p-6">
      <div className="h-40 bg-gray-200 rounded-xl"></div>
      <div className="h-64 bg-gray-200 rounded-xl"></div>
    </div>
  );

  return (
    // <div className="bg-gray-100 py-10 px-6">
    //   {/* Create Post Banner */}
    //   <div className="bg-white p-4 rounded-lg shadow mb-10 flex justify-between items-center max-w-6xl mx-auto">
    //     <p className="text-gray-600 font-medium">
    //       Share something with the world...
    //     </p>
    //     <button
    //       onClick={() => navigate("/create")}
    //       className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
    //     >
    //       + Create Post
    //     </button>
    //   </div>

    //   {/* Posts List */}
    //   <div className="max-w-6xl mx-auto space-y-16">
    //     {posts.length === 0 && (
    //       <p className="text-center text-gray-500">No posts found</p>
    //     )}

    //     {posts.map((post, index) => (
    //       <div
    //         key={post.post_id}
    //         className={`flex flex-col md:flex-row items-center gap-8 ${
    //           index % 2 !== 0 ? "md:flex-row-reverse" : ""
    //         }`}
    //       >
    //         {/* Post Text */}
    //         <div className="flex-1 flex flex-col justify-between">
    //           <div>
    //             <h1 className="text-3xl font-bold mb-3">{post.name}</h1>
    //             <h2 className="text-3xl font-bold mb-3">{post.title}</h2>
    //             <p className="text-gray-700 mb-4">{post.content.slice(0, 200)}...</p>
    //           </div>

    //           <div className="flex items-center gap-4">
                // <button
                //   onClick={() => navigate(`/post/${post.post_id}`)}
                //   className="border border-orange-400 px-4 py-2 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition"
                // >
                //   Read More
                // </button>

    //             <button
    //               onClick={() => likePost(post.post_id)}
    //               className="flex items-center gap-2 text-red-500 font-semibold hover:scale-105 transition"
    //             >
    //               ❤️ {post.total_likes}
    //             </button>
    //           </div>
    //           <div>
    //               {post.tags.length==0?(<p>No tags</p>):(
    //                 post.tags.map((t,i)=>{
    //                   return <p key={i}>{t}</p>
    //                 })
    //               )}
    //           </div>
    //         </div>

    //         {/* Post Image */}
    //         <div className="flex-1 relative w-full md:w-[600px] h-[300px]">
    //           <div className="absolute top-4 left-4 w-full h-full bg-orange-200 rounded-lg z-0"></div>
    //           <img
    //             src={`https://picsum.photos/seed/post${post.post_id}/600/400`}
    //             alt="post"
    //             className="relative z-10 w-full h-full object-cover rounded-lg shadow-md"
    //           />
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="bg-white min-h-screen pb-20 mt-12">
      {/* Action Header */}
      <div className="max-w-6xl mx-auto pt-10 px-6">
        <div className="flex justify-between items-end border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Featured Stories</h1>
            <p className="text-gray-500 mt-2">Handpicked content from our community</p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg"
          >
            + New Post
          </button>
        </div>
      </div>

      {/* Zig-Zag Feed */}
      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-24">
        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-20">No stories found.</p>
        )}

        {posts.map((post, index) => (
          <article
            key={post.post_id}
            className={`flex flex-col md:flex-row items-center gap-12 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image Section with Decorative Background */}
            <div className="flex-1 relative w-full group">
              <div className={`absolute -top-4 -left-4 w-full h-full rounded-2xl z-0 transition-colors duration-500 ${
                index % 2 === 0 ? "bg-orange-100" : "bg-blue-100"
              }`}></div>
              <div 
                className="relative z-10 overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
                onClick={() => navigate(`/post/${post.post_id}`)}
              >
                <img
                  src={`https://picsum.photos/seed/${post.post_id}/800/500`}
                  alt={post.title}
                  className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-5">
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <h2 
                className="text-4xl font-extrabold leading-tight text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                onClick={() => navigate(`/post/${post.post_id}`)}
              >
                {post.title}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-gray-100 pl-4">
                "{post.content.slice(0, 180)}..."
              </p>

              <div className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                    {post.name?.charAt(0) || "A"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{post.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-400">{post. created_at}• 4 min read</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => likePost(post.post_id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-colors font-bold text-gray-600"
                  >
                    ❤️ {post.total_likes}
                  </button>
                  <button
                  onClick={() => navigate(`/post/${post.post_id}`)}
                  className="border border-orange-400 px-4 py-2 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition"
                >
                  Read More
                </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}