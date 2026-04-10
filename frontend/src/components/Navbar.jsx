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
import { Link ,useLocation} from "react-router-dom";
import { useEffect ,useState} from "react";
// import { Link, useLocation } from "react-router-dom";
import API from "../api/axios";

function Navbar() {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const location = useLocation(); // Used to highlight the current page
  const [scrolled, setScrolled] = useState(false);

  // Add a scroll listener to change navbar opacity
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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


  // Helper for active link styling
  const isActive = (path) => location.pathname === path ? "text-blue-400 font-bold" : "text-gray-300 hover:text-white";

  return (
    // <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
    //   <h1 className="text-xl font-bold" on>📝 Blog App</h1>

    //   <div className="flex items-center gap-4">
    //     <Link to="/">Home</Link>

    //     {isAuthenticated && (
    //       <>
    //         <Link to="/my-posts">My Posts</Link>
    //       </>
    //     )}

    //     {!isAuthenticated ? (
    //       <>
    //         <button onClick={() => loginWithRedirect()}>Login</button>
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
    //         <span>{user.name}</span>
    //         <button
    //           onClick={() =>
    //             logout({ logoutParams: { returnTo: window.location.origin } })
    //           }
    //         >
    //           Logout
    //         </button>
    //       </>
    //     )}
    //   </div>
    // </nav>


    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 ${
      scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-gray-900"
    }`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">📝</span>
          <h1 className="text-xl font-black tracking-tighter uppercase">DevJournal</h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className={`text-sm uppercase tracking-widest transition ${isActive("/")}`}>
            Home
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/my-posts" className={`text-sm uppercase tracking-widest transition ${isActive("/my-posts")}`}>
                My Workspace
              </Link>
              <Link to="/create" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold transition">
                Write
              </Link>
            </>
          )}

          <div className="h-6 w-[1px] bg-gray-700 hidden md:block"></div>

          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-6">
              <button onClick={() => loginWithRedirect()} className="text-sm text-white font-medium hover:text-blue-400 transition">
                Sign In
              </button>
              <button
                onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })}
                className="bg-white text-gray-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-400">Contributor</p>
              </div>
              
              {/* Profile Image/Avatar */}
              <img 
                src={user.picture} 
                alt="profile" 
                className="w-9 h-9 rounded-full border-2 border-gray-700 shadow-sm"
              />

              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="text-xs text-gray-400 hover:text-red-400 transition uppercase tracking-tighter"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
