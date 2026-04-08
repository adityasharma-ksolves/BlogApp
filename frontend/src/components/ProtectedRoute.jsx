import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({ children }) => {
const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

if (isLoading) return <p>Loading...</p>;

if (!isAuthenticated) {
loginWithRedirect();
return <p>Redirecting...</p>;
}

return children;
};

export default ProtectedRoute;
