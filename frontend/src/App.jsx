// import { useAuth0 } from "@auth0/auth0-react";

// function App() {
//   const {
//     isLoading, // Loading state, the SDK needs to reach Auth0 on load
//     isAuthenticated,
//     error,
//     loginWithRedirect: login, // Starts the login flow
//     logout: auth0Logout, // Starts the logout flow
//     user, // User profile
//   } = useAuth0();

//   const signup = () =>
//     login({ authorizationParams: { screen_hint: "signup" } });

//   const logout = () =>
//     auth0Logout({ logoutParams: { returnTo: window.location.origin } });

//   if (isLoading) return "Loading...";

//   return isAuthenticated ? (
//     <>
//       <p>Logged in as {user.email}</p>

//       <h1>User Profile</h1>

//       <pre>{JSON.stringify(user, null, 2)}</pre>

//       <button onClick={logout}>Logout</button>
//     </>
//   ) : (
//     <>
//       {error && <p>Error: {error.message}</p>}

//       <button onClick={signup}>Signup</button>

//       <button onClick={login}>Login</button>
//     </>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// function App() {
//   const {
//     isLoading,
//     isAuthenticated,
//     error,
//     loginWithRedirect,
//     logout,
//     user,
//     getAccessTokenSilently,
//   } = useAuth0();

//   const [age, setAge] = useState("");
//   const [isSynced, setIsSynced] = useState(false);
//   const [showAgeInput, setShowAgeInput] = useState(false);

//   const callProtectedRoute = async () => {
//     try {
//       const token = await getAccessTokenSilently();

//       const res = await fetch("http://localhost:5000/api/profile", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       console.log("Protected data:", data);
//     } catch (err) {
//       console.error("Error calling protected route:", err);
//     }
//   };

//   // 🔁 Sync user with backend
//   const syncUser = async (userAge) => {
//     try {
//       const token = await getAccessTokenSilently();

//       const res = await fetch("http://localhost:5000/api/sync-user", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: user.name,
//           email: user.email,
//           age: userAge,
//         }),
//       });

//       const data = await res.json();
//       console.log("Synced user:", data);

//       setIsSynced(true);
//       setShowAgeInput(false);
//     } catch (err) {
//       console.error("Sync error:", err);
//     }
//   };

//   // 👇 Runs after login
//   useEffect(() => {
//     if (isAuthenticated && user && !isSynced) {
//       // You can improve this later by checking from backend if age exists
//       setShowAgeInput(true);
//     }
//   }, [isAuthenticated, user, isSynced]);

//   if (isLoading) return <h2>Loading...</h2>;

//   if (error) return <h2>Error: {error.message}</h2>;

//   return (
//     <div style={{ padding: "20px" }}>
//       {!isAuthenticated ? (
//         <>
//           {" "}
//           <h1>Welcome</h1>
//           <button onClick={() => loginWithRedirect()}>Login</button>
//           <button
//             onClick={() =>
//               loginWithRedirect({
//                 authorizationParams: { screen_hint: "signup" },
//               })
//             }
//           >
//             Signup
//           </button>
//         </>
//       ) : (
//         <>
//           <h2>Logged in as {user.email}</h2>

//           <pre>{JSON.stringify(user, null, 2)}</pre>

//           {/* 👇 Age Input for first-time user */}
//           {showAgeInput && !isSynced && (
//             <div style={{ marginTop: "20px" }}>
//               <h3>Enter your age</h3>

//               <input
//                 type="number"
//                 value={age}
//                 onChange={(e) => setAge(e.target.value)}
//                 placeholder="Enter age"
//               />

//               <button
//                 onClick={() => {
//                   if (!age) return alert("Please enter age");
//                   syncUser(age);
//                 }}
//               >
//                 Submit
//               </button>
//             </div>
//           )}

//           {/* ✅ After sync */}
//           {isSynced && <p>✅ User synced with backend</p>}

//           <button
//             onClick={() =>
//               logout({ logoutParams: { returnTo: window.location.origin } })
//             }
//             style={{ marginTop: "20px" }}
//           >
//             Logout
//           </button>
//           <button onClick={callProtectedRoute}>Call Protected API</button>
//         </>
//       )}
//     </div>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
return ( <BrowserRouter> <Navbar />


  <Routes>
    <Route path="/" element={<Home />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
</BrowserRouter>

);
}

export default App;
