import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
/* highlight-start auth0-provider */
import { Auth0Provider } from "@auth0/auth0-react";
/* highlight-end auth0-provider */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* highlight-start auth0-provider */}
  <Auth0Provider
  domain="dev-c8zdmgqrwhub0oz4.us.auth0.com"
  clientId="ul4mp0708ixtqS3NDcWkJ3d59RTxV6AO"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "https://dev-c8zdmgqrwhub0oz4.us.auth0.com/api/v2/",
  }}
>
  <App />
</Auth0Provider>
    {/* highlight-end auth0-provider */}
  </StrictMode>,
);





    // <Auth0Provider
    //   domain={import.meta.env.VITE_AUTH0_DOMAIN}
    //   clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    //   authorizationParams={{
    //     redirect_uri: window.location.origin,
    //     audience: import.meta.env.VITE_AUTH0_AUDIENCE, // ADD THIS
    //   }}
    // >
    //   {/* highlight-end auth0-provider */}
    //   <App />
    //   {/* highlight-start auth0-provider */}
    // </Auth0Provider>