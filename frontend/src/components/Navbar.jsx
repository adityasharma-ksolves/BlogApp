// import { useAuth0 } from "@auth0/auth0-react";
// import { Link } from "react-router-dom";

// function Navbar() {
// const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

// return ( <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md"> <h1 className="text-xl font-bold">📝 Blog App</h1>
//   <div className="flex items-center gap-4">
//     <Link to="/" className="hover:text-gray-300">
//       Home
//     </Link>

//     {isAuthenticated && (
//       <Link
//         to="/dashboard"
//         className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
//       >
//         Dashboard
//       </Link>
//     )}

//     {!isAuthenticated ? (
//       <>
//         <button
//           onClick={() => loginWithRedirect()}
//           className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
//         >
//           Login
//         </button>

//         <button
//           onClick={() =>
//             loginWithRedirect({
//               authorizationParams: { screen_hint: "signup" },
//             })
//           }
//           className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 transition"
//         >
//           Signup
//         </button>
//       </>
//     ) : (
//       <>
//         <span className="text-sm">{user.name}</span>

//         <button
//           onClick={() =>
//             logout({ logoutParams: { returnTo: window.location.origin } })
//           }
//           className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       </>
//     )}
//   </div>
// </nav>

// );
// }

// export default Navbar;

// src/components/Navbar.jsx

// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav style={{ padding: 10, borderBottom: "1px solid gray" }}>
//       <Link to="/" style={{ marginRight: 10 }}>Home</Link>
//       <Link to="/create" style={{ marginRight: 10 }}>Create</Link>
//       <Link to="/my-posts" style={{ marginRight: 10 }}>My Posts</Link>
//       <Link to="/profile" style={{ marginRight: 10 }}>Profile</Link>
//       <Link to="/admin">Admin</Link>
//     </nav>
//   );
// }

// src/components/Navbar.jsx

import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import API from "../api/axios";

function Navbar() {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const syncUserToDb = async () => {
      // Only sync if we have a user and they are authenticated
      if (isAuthenticated && user) {
        const syncKey = `synced_${user.sub}`;
        if (sessionStorage.getItem(syncKey)) {
          return; // Stop here, no need to call the API
        }
        try {
          // 1. Get the JWT token from Auth0
          const token = await getAccessTokenSilently();

          // 2. Send user data to your backend
          await API.post(
            `/auth/sync-user`,
            {
              sub: user.sub,
              email: user.email,
              name: user.name,
              picture: user.picture,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          sessionStorage.setItem(syncKey, "true");
          console.log("User successfully synced to Postgres via Backend");
        } catch (error) {
          console.error(
            "Failed to sync user:",
            error.response?.data || error.message,
          );
        }
      }
    };

    syncUserToDb();
  }, [isAuthenticated, user, getAccessTokenSilently]); // Runs whenever these values change

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">📝 Blog App</h1>

      <div className="flex items-center gap-4">
        <Link to="/">Home</Link>

        {isAuthenticated && (
          <>
            <Link to="/my-posts">My Posts</Link>
          </>
        )}

        {!isAuthenticated ? (
          <>
            <button onClick={() => loginWithRedirect()}>Login</button>
            <button
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: { screen_hint: "signup" },
                })
              }
              className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 transition"
            >
              Signup
            </button>
          </>
        ) : (
          <>
            <span>{user.name}</span>
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
