// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import Spinner from "./components/ui/Spinner.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import Navbar from "./components/layout/Navbar.jsx";
// import HomePage from "./pages/HomePage.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import WritePost from "./pages/WritePost.jsx";
// import PostDetail from "./pages/PostDetail.jsx";
// import Profile from "./pages/Profile.jsx";
// import AdminPanel from "./pages/AdminPanel.jsx";
// import EditPost from "./pages/EditPost.jsx";

// // Main layout component
// function Layout({ children }) {
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <main className="pt-4 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {children}
//       </main>
//     </div>
//   );
// }

// // Error boundary / fallback
// function NotFound() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background">
//       <div className="text-center">
//         <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
//         <p className="text-xl text-gray-600 mb-8">Page not found</p>
//         <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
//           Go home
//         </a>
//       </div>
//     </div>
//   );
// }

// function App() {
//   const { isLoading } = useAuth0();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public routes */}
//         <Route
//           path="/"
//           element={
//             <Layout>
//               <HomePage />
//             </Layout>
//           }
//         />
//         <Route
//           path="/post/:id"
//           element={
//             <Layout>
//               <PostDetail />
//             </Layout>
//           }
//         />

//         {/* Protected routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Dashboard />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/write"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <WritePost />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Profile />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/edit/:id"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <EditPost />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <AdminPanel />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         {/* Redirects & catch-all */}
//         <Route path="/home" element={<Navigate to="/" replace />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import PostDetails from "./pages/PostDetails";
import Navbar from "./components/Navbar"; // ✅ IMPORT

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* <Route path="/posts" element={<Posts />} /> */}

        <Route path="/post/:id" element={<PostDetails />} />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;