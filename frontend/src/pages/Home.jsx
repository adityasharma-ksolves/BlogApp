import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

function Home() {
const { isAuthenticated } = useAuth0();

return ( <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4"> <h1 className="text-4xl font-bold mb-4">
Welcome to Blog App 🚀 </h1>

  <p className="text-gray-600 mb-6">
    Read, write and manage your blogs easily.
  </p>

  {isAuthenticated ? (
    <Link
      to="/dashboard"
      className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
    >
      Go to Dashboard
    </Link>
  ) : (
    <p className="text-gray-500">
      Please login to access your dashboard
    </p>
  )}
</div>

);
}

export default Home;
