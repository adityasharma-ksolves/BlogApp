import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

function Navbar() {
const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

return ( <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md"> <h1 className="text-xl font-bold">📝 Blog App</h1>
  <div className="flex items-center gap-4">
    <Link to="/" className="hover:text-gray-300">
      Home
    </Link>

    {isAuthenticated && (
      <Link
        to="/dashboard"
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Dashboard
      </Link>
    )}

    {!isAuthenticated ? (
      <>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Login
        </button>

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
        <span className="text-sm">{user.name}</span>

        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
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
