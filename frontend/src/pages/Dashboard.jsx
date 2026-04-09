// import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// function Dashboard() {
// const { user, getAccessTokenSilently } = useAuth0();
// const [profile, setProfile] = useState(null);

// useEffect(() => {
// const fetchProfile = async () => {
// const token = await getAccessTokenSilently();

//   const res = await fetch("http://localhost:5000/api/profile", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await res.json();
//   setProfile(data);
// };

// fetchProfile();

// }, []);

// return ( <div className="p-6"> <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

//   <div className="grid md:grid-cols-2 gap-6">
//     {/* Auth0 Info */}
//     <div className="bg-white shadow-md rounded-lg p-4">
//       <h2 className="text-xl font-semibold mb-2">Auth0 Info</h2>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Name:</strong> {user.name}</p>
//     </div>

//     {/* Backend Profile */}
//     <div className="bg-white shadow-md rounded-lg p-4">
//       <h2 className="text-xl font-semibold mb-2">Backend Profile</h2>

//       {profile ? (
//         <pre className="text-sm bg-gray-100 p-2 rounded">
//           {JSON.stringify(profile, null, 2)}
//         </pre>
//       ) : (
//         <p>Loading profile...</p>
//       )}
//     </div>
//   </div>
// </div>

// );
// }

// export default Dashboard;

// import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// function Dashboard() {
//   const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
//   const [isSynced, setIsSynced] = useState(false);
//   const [showAgeInput, setShowAgeInput] = useState(false);
//   const [age, setAge] = useState("");

//   useEffect(() => {
//     if (isAuthenticated && user && !isSynced) {
//       // Check if we already have age; if not, prompt user
//       if (!user?.age) {
//         setShowAgeInput(true);
//       } else {
//         syncUser(user.age);
//       }
//     }
//   }, [isAuthenticated, user, isSynced]);

//   const syncUser = async (userAge) => {
//     try {
//       const token = await getAccessTokenSilently();

//       const res = await fetch("http://localhost:3000/api/auth/sync-user", {
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

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Dashboard</h1>

//       {showAgeInput && (
//         <div className="mt-4">
//           <input
//             type="number"
//             placeholder="Enter your age"
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//             className="border p-2 rounded mr-2"
//           />
//           <button
//             onClick={() => syncUser(age)}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Save
//           </button>
//         </div>
//       )}

//       {!showAgeInput && <p>Welcome, {user.name}</p>}
//     </div>
//   );
// }

// export default Dashboard;

// import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// function Dashboard() {
//   const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
//   const [isSynced, setIsSynced] = useState(false);
//   const [showAgeInput, setShowAgeInput] = useState(false);
//   const [age, setAge] = useState("");
//   const [profile, setProfile] = useState(null);

//   // 🔁 Sync user and fetch profile
//   useEffect(() => {
//     const handleUser = async () => {
//       if (!isAuthenticated || !user) return;
//       console.log("user data",user)

//       const token = await getAccessTokenSilently();

//       // 1️⃣ If user not synced, check age
//       if (!isSynced) {
//         if (!user?.age && !age) {
//           setShowAgeInput(true);
//           return;
//         }

//         // 2️⃣ Sync user to backend
//         await fetch("http://localhost:3000/api/auth/sync-user", {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: user.name,
//             email: user.email,
//             age: user?.age || age,
//           }),
//         });

//         setIsSynced(true);
//         setShowAgeInput(false);
//       }

//       // 3️⃣ Fetch user profile from backend
//       const res = await fetch("http://localhost:3000/api/auth/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setProfile(data);
//     };

//     handleUser();
//   }, [isAuthenticated, user, isSynced, age, getAccessTokenSilently]);

//   if (!isAuthenticated) return <p>Please login to view your dashboard</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

//       {showAgeInput && (
//         <div className="mt-4">
//           <input
//             type="number"
//             placeholder="Enter your age"
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//             className="border p-2 rounded mr-2"
//           />
//           <button
//             onClick={() => setIsSynced(false)} // triggers useEffect to sync
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Save
//           </button>
//         </div>
//       )}

//       {profile && (
//         <div className="mt-6">
//           <p>
//             <strong>Name:</strong> {profile.name}
//           </p>
//           <p>
//             <strong>Email:</strong> {profile.email}
//           </p>
//           <p>
//             <strong>Age:</strong> {profile.age}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Dashboard() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [isSynced, setIsSynced] = useState(false);
  const [showAgeInput, setShowAgeInput] = useState(false);
  const [age, setAge] = useState("");
  const [profile, setProfile] = useState(null);

  // 🔁 Fetch profile only after user is synced
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user || !isSynced) return;

      try {
        const token = await getAccessTokenSilently();
        const res = await fetch("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setProfile(data);
        console.log(data);
        if (!data.age || data.age === 0) {
          setShowAgeInput(true);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, isSynced, getAccessTokenSilently]);

  // 🔁 Sync user to backend
  const syncUser = async (userAge) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:3000/api/auth/sync-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          age: userAge,
        }),
      });

      const data = await res.json();
      console.log("Synced user:", data);

      setIsSynced(true);
      setShowAgeInput(false);
    } catch (err) {
      console.error("Sync error:", err);
    }
  };

  // Show age input only if not synced and age missing
  useEffect(() => {
    if (isAuthenticated && user && !isSynced && !user?.age) {
      setShowAgeInput(true);
    }
  }, [isAuthenticated, user, isSynced]);

  if (!isAuthenticated) return <p>Please login to view your dashboard</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {showAgeInput && (
        <div className="mt-4">
          <input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={() => syncUser(age)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      )}

      {profile && !showAgeInput && (
        <div className="mt-6">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Age:</strong> {profile.age}
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
