import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
// import { AuthProvider } from "./context/AuthContext.jsx";
// import { ToastProvider } from './context/Toast';
import "./index.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-c8zdmgqrwhub0oz4.us.auth0.com"
      clientId="ul4mp0708ixtqS3NDcWkJ3d59RTxV6AO"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-c8zdmgqrwhub0oz4.us.auth0.com/api/v2/",
      }}
    >
      {/* <AuthProvider> */}
        {/* <ToastProvider> */}
        <App />
        {/* </ToastProvider> */}
      {/* </AuthProvider> */}
      
    </Auth0Provider>
  </StrictMode>,
);
