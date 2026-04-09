import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function PostCard({ post }) {
  const navigate = useNavigate();
    const { getAccessTokenSilently,isAuthenticated } = useAuth0();

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please login to like posts!");
      return;
    }

    try {
      // 3. Fetch the token from Auth0
      const token = await getAccessTokenSilently();

      // 4. Send the request with the Authorization header
      await API.post(
        `/post/${post.post_id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert("Toggled like");
    } catch (err) {
      console.error("Like failed:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      }
    }
  };

  return (
    // <div style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
    //   <h3>{post.title}</h3>
    //   <p>{post.content}</p>

    //   <p>Tags: {post.tags.join(", ")}</p>

    //   <button onClick={handleLike}>❤️ Like</button>
    //   <button onClick={() => navigate(`/post/${post.post_id}`)}>View</button>
    // </div>

    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      {/* <h3 className="text-xl font-semibold mb-2">{post.title}</h3>

      <p className="text-gray-600 mb-3 line-clamp-3">
        {post.content}
      </p>

      <div className="mb-3">
        {post.tags?.map((tag, i) => (
          <span
            key={i}
            className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mr-2"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => navigate(`/post/${post.post_id}`)}
          className="text-blue-500 hover:underline"
        >
          View
        </button>

        {isAuthenticated && (
          <button
            onClick={handleLike}
            className="text-red-500 hover:scale-110 transition"
          >
            ❤️
          </button>
        )}
      </div>       */}
      
      <div className="max-w-6xl mx-auto space-y-20">
        {/* {post.map((post, index) => ( */}
          {/* <div
            key={post.post_id}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          > */}
            {/* TEXT */}
            <div className="flex-1">
            {/* IMAGE */}
            <div className="flex-1 relative">
              <div className="absolute top-4 left-4 w-full h-full bg-orange-200 z-0"></div>

              <img
                src={`https://picsum.photos/seed/post${post.post_id}/500/400`}
                alt="post"
                className="relative z-10 w-full h-[300px] object-cover"
              />
            </div>
              <h2 className="text-3xl font-bold mb-4">{post.title}</h2>

              <p className="text-gray-600 mb-4">
                {post.content.slice(0, 200)}...
              </p>

              {/* <button className="border border-orange-400 px-4 py-2 text-orange-500 hover:bg-orange-500 hover:text-white transition">
                Read More
              </button> */}

              <button
                className="border border-orange-400 px-4 py-2 text-orange-500 hover:bg-orange-500 hover:text-white transition"
                onClick={() => navigate(`/post/${post.post_id}`)}
              >
                Read More
              </button>
              {/* <button onClick={() => likePost(post.post_id)}>{post.total_likes} ❤️ Like</button> */}
              <button
                onClick={() => likePost(post.post_id)}
                className="mt-2 text-red-500 hover:scale-105 transition"
              >
                ❤️ {post.total_likes}
              </button>
            </div>


          {/* </div> */}
        {/* ))} */}
      </div>

      
    </div>



  );
}
