// "use client";
// import { useState, useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { collection, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";
// import { isAdmin, isSuperAdmin, getAdminUsers } from "@/lib/checkAdmin";
// import Link from "next/link";

// export default function AdminSettingsPage() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userIsAdmin, setUserIsAdmin] = useState(false);
//   const [userIsSuperAdmin, setUserIsSuperAdmin] = useState(false);
//   const [admins, setAdmins] = useState([]);
//   const [loadingAdmins, setLoadingAdmins] = useState(true);

//   // Form state
//   const [newAdminEmail, setNewAdminEmail] = useState("");
//   const [newAdminUid, setNewAdminUid] = useState("");
//   const [makeSuperAdmin, setMakeSuperAdmin] = useState(false);
//   const [adding, setAdding] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setUser(user);

//       if (user) {
//         const adminStatus = await isAdmin(user.uid);
//         const superAdminStatus = await isSuperAdmin(user.uid);
//         setUserIsAdmin(adminStatus);
//         setUserIsSuperAdmin(superAdminStatus);
//       }

//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (userIsAdmin) {
//       loadAdmins();
//     }
//   }, [userIsAdmin]);

//   const loadAdmins = async () => {
//     setLoadingAdmins(true);
//     const adminList = await getAdminUsers();
//     setAdmins(adminList);
//     setLoadingAdmins(false);
//   };

//   const handleAddAdmin = async (e) => {
//     e.preventDefault();
//     setAdding(true);
//     setError("");
//     setMessage("");

//     try {
//       if (!newAdminUid || !newAdminEmail) {
//         setError("Både UID och email krävs!");
//         setAdding(false);
//         return;
//       }

//       // Add admin to Firestore
//       await setDoc(doc(db, "admins", newAdminUid), {
//         email: newAdminEmail,
//         isAdmin: true,
//         isSuperAdmin: makeSuperAdmin,
//         addedBy: user.uid,
//         addedAt: new Date(),
//       });

//       setMessage(`✅ ${newAdminEmail} har lagts till som ${makeSuperAdmin ? "super-admin" : "admin"}!`);
//       setNewAdminEmail("");
//       setNewAdminUid("");
//       setMakeSuperAdmin(false);

//       // Reload admin list
//       await loadAdmins();
//     } catch (err) {
//       console.error(err);
//       setError("❌ Kunde inte lägga till admin: " + err.message);
//     } finally {
//       setAdding(false);
//     }
//   };

//   const handleRemoveAdmin = async (uid, email) => {
//     if (!confirm(`Är du säker på att du vill ta bort ${email} som admin?`)) return;

//     try {
//       await deleteDoc(doc(db, "admins", uid));
//       setMessage(`✅ ${email} har tagits bort som admin`);
//       await loadAdmins();
//     } catch (err) {
//       setError("❌ Kunde inte ta bort admin: " + err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-20">
//         <div className="text-4xl mb-4">⏳</div>
//         <p className="text-xl">Laddar...</p>
//       </div>
//     );
//   }

//   if (!user || !userIsAdmin) {
//     return (
//       <div className="max-w-md mx-auto mt-20">
//         <div className="bg-red-100 border-2 border-red-500 rounded-lg p-8 text-center">
//           <div className="text-6xl mb-4">🚫</div>
//           <h1 className="text-2xl font-bold text-red-700 mb-4">Ingen Åtkomst</h1>
//           <p className="text-red-600 mb-6">Endast administratörer kan se denna sida.</p>
//           <Link href="/dashboard" className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent font-semibold">
//             ← Tillbaka till Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-4xl font-bold text-primary">⚙️ Hantera Admins</h1>
//         <Link href="/dashboard" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold">
//           ← Tillbaka
//         </Link>
//       </div>

//       {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{message}</div>}

//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

//       {/* Add Admin Form */}
//       {userIsSuperAdmin && (
//         <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-bold text-primary mb-6">➕ Lägg Till Ny Admin</h2>

//           <form onSubmit={handleAddAdmin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 User UID <span className="text-red-500">*</span>
//               </label>
//               <input type="text" value={newAdminUid} onChange={(e) => setNewAdminUid(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="Från Firebase Authentication" required />
//               <p className="text-xs text-gray-500 mt-1">📝 Hitta UID i Firebase Console → Authentication → Users</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="admin@alrahmamoske.se" required />
//             </div>

//             <div className="flex items-center gap-3">
//               <input type="checkbox" id="superAdmin" checked={makeSuperAdmin} onChange={(e) => setMakeSuperAdmin(e.target.checked)} className="w-5 h-5" />
//               <label htmlFor="superAdmin" className="text-sm font-medium">
//                 ⭐ Gör till Super Admin (kan lägga till/ta bort andra admins)
//               </label>
//             </div>

//             <button type="submit" disabled={adding} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50">
//               {adding ? "⏳ Lägger till..." : "➕ Lägg Till Admin"}
//             </button>
//           </form>

//           {/* Instructions */}
//           <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h3 className="font-bold text-blue-900 mb-2">📝 Så här lägger du till en admin:</h3>
//             <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
//               <li>Gå till Firebase Console → Authentication</li>
//               <li>Skapa en ny användare eller hitta befintlig</li>
//               <li>
//                 Kopiera användarens <strong>UID</strong> (unikt ID)
//               </li>
//               <li>Klistra in UID och email här</li>
//               <li>Klicka "Lägg Till Admin"</li>
//             </ol>
//           </div>
//         </div>
//       )}

//       {/* Current Admins List */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-primary mb-6">👥 Nuvarande Administratörer ({admins.length})</h2>

//         {loadingAdmins ? (
//           <div className="text-center py-8 text-gray-500">
//             <div className="text-4xl mb-2">⏳</div>
//             <p>Laddar admins...</p>
//           </div>
//         ) : admins.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <div className="text-4xl mb-2">📭</div>
//             <p>Inga admins hittades</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {admins.map((admin) => (
//               <div key={admin.uid} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary transition">
//                 <div className="flex items-center gap-3">
//                   <span className="text-2xl">{admin.isSuperAdmin ? "⭐" : "👤"}</span>
//                   <div>
//                     <p className="font-semibold text-gray-800">{admin.email}</p>
//                     <p className="text-xs text-gray-500">UID: {admin.uid}</p>
//                     {admin.uid === user.uid && <p className="text-xs text-green-600 font-semibold">✓ Du är inloggad</p>}
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span className={`px-3 py-1 rounded text-sm font-semibold ${admin.isSuperAdmin ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{admin.isSuperAdmin ? "⭐ Super Admin" : "✅ Admin"}</span>

//                   {userIsSuperAdmin && admin.uid !== user.uid && (
//                     <button onClick={() => handleRemoveAdmin(admin.uid, admin.email)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm font-semibold">
//                       🗑️ Ta Bort
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {!userIsSuperAdmin && (
//         <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
//           <p className="text-yellow-800">
//             ℹ️ Du kan se admins men inte lägga till/ta bort dem.
//             <br />
//             Endast <strong>Super Admins</strong> kan hantera andra admins.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { isAdmin, isSuperAdmin, getAdminUsers } from "@/lib/checkAdmin";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [userIsSuperAdmin, setUserIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  // Form state
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminUid, setNewAdminUid] = useState("");
  const [makeSuperAdmin, setMakeSuperAdmin] = useState(false);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const adminStatus = await isAdmin(user.uid);
        const superAdminStatus = await isSuperAdmin(user.uid);
        setUserIsAdmin(adminStatus);
        setUserIsSuperAdmin(superAdminStatus);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userIsAdmin) {
      loadAdmins();
    }
  }, [userIsAdmin]);

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    const adminList = await getAdminUsers();
    setAdmins(adminList);
    setLoadingAdmins(false);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setMessage("");

    try {
      if (!newAdminUid || !newAdminEmail) {
        setError("Både UID och email krävs!");
        setAdding(false);
        return;
      }

      // Add admin to Firestore
      await setDoc(doc(db, "admins", newAdminUid), {
        email: newAdminEmail,
        isAdmin: true,
        isSuperAdmin: makeSuperAdmin,
        addedBy: user.uid,
        addedAt: new Date(),
      });

      setMessage(`✅ ${newAdminEmail} har lagts till som ${makeSuperAdmin ? "super-admin" : "admin"}!`);
      setNewAdminEmail("");
      setNewAdminUid("");
      setMakeSuperAdmin(false);

      // Reload admin list
      await loadAdmins();
    } catch (err) {
      console.error(err);
      setError("❌ Kunde inte lägga till admin: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (uid, email) => {
    if (!confirm(`Är du säker på att du vill ta bort ${email} som admin?`)) return;

    try {
      await deleteDoc(doc(db, "admins", uid));
      setMessage(`✅ ${email} har tagits bort som admin`);
      await loadAdmins();
    } catch (err) {
      setError("❌ Kunde inte ta bort admin: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-xl">Laddar...</p>
      </div>
    );
  }

  if (!user || !userIsAdmin) {
    return (
      <div className="max-w-md mx-auto mt-10 sm:mt-20 px-4">
        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 sm:p-8 text-center">
          <div className="text-5xl sm:text-6xl mb-4">🚫</div>
          <h1 className="text-xl sm:text-2xl font-bold text-red-700 mb-4">Ingen Åtkomst</h1>
          <p className="text-sm sm:text-base text-red-600 mb-6">Endast administratörer kan se denna sida.</p>
          <Link href="/dashboard" className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent font-semibold text-sm sm:text-base">
            ← Tillbaka till Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* MOBILE OPTIMIZED HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">⚙️ Hantera Admins</h1>
        <Link href="/dashboard" className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-600 font-semibold text-center text-sm sm:text-base whitespace-nowrap">
          ← Tillbaka
        </Link>
      </div>

      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-3 rounded mb-4 sm:mb-6 text-sm break-words">{message}</div>}

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded mb-4 sm:mb-6 text-sm break-words">{error}</div>}

      {/* MOBILE OPTIMIZED ADD ADMIN FORM */}
      {userIsSuperAdmin && (
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">➕ Lägg Till Ny Admin</h2>

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                User UID <span className="text-red-500">*</span>
              </label>
              <input type="text" value={newAdminUid} onChange={(e) => setNewAdminUid(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" placeholder="Från Firebase Authentication" required />
              <p className="text-xs text-gray-500 mt-1">📝 Hitta UID i Firebase Console → Authentication → Users</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" placeholder="admin@alrahmamoske.se" required />
            </div>

            <div className="flex items-start sm:items-center gap-3">
              <input type="checkbox" id="superAdmin" checked={makeSuperAdmin} onChange={(e) => setMakeSuperAdmin(e.target.checked)} className="w-5 h-5 mt-0.5 sm:mt-0 flex-shrink-0" />
              <label htmlFor="superAdmin" className="text-sm font-medium">
                ⭐ Gör till Super Admin (kan lägga till/ta bort andra admins)
              </label>
            </div>

            <button type="submit" disabled={adding} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 text-sm sm:text-base">
              {adding ? "⏳ Lägger till..." : "➕ Lägg Till Admin"}
            </button>
          </form>

          {/* MOBILE OPTIMIZED INSTRUCTIONS */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2 text-sm sm:text-base">📝 Så här lägger du till en admin:</h3>
            <ol className="text-xs sm:text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Gå till Firebase Console → Authentication</li>
              <li>Skapa en ny användare eller hitta befintlig</li>
              <li>
                Kopiera användarens <strong>UID</strong> (unikt ID)
              </li>
              <li>Klistra in UID och email här</li>
              <li>Klicka "Lägg Till Admin"</li>
            </ol>
          </div>
        </div>
      )}

      {/* MOBILE OPTIMIZED CURRENT ADMINS LIST */}
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">👥 Nuvarande Administratörer ({admins.length})</h2>

        {loadingAdmins ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl sm:text-4xl mb-2">⏳</div>
            <p className="text-sm sm:text-base">Laddar admins...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl sm:text-4xl mb-2">📭</div>
            <p className="text-sm sm:text-base">Inga admins hittades</p>
          </div>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.uid} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary transition gap-3 sm:gap-0">
                {/* ADMIN INFO - MOBILE OPTIMIZED */}
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5 sm:mt-0">{admin.isSuperAdmin ? "⭐" : "👤"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base break-words">{admin.email}</p>
                    <p className="text-xs text-gray-500 break-all">UID: {admin.uid}</p>
                    {admin.uid === user.uid && <p className="text-xs text-green-600 font-semibold">✓ Du är inloggad</p>}
                  </div>
                </div>

                {/* BADGES & BUTTONS - MOBILE OPTIMIZED */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <span className={`px-3 py-1.5 sm:py-1 rounded text-xs sm:text-sm font-semibold text-center whitespace-nowrap ${admin.isSuperAdmin ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{admin.isSuperAdmin ? "⭐ Super Admin" : "✅ Admin"}</span>

                  {userIsSuperAdmin && admin.uid !== user.uid && (
                    <button onClick={() => handleRemoveAdmin(admin.uid, admin.email)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-xs sm:text-sm font-semibold whitespace-nowrap">
                      🗑️ Ta Bort
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE OPTIMIZED INFO MESSAGE */}
      {!userIsSuperAdmin && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800 text-xs sm:text-sm">
            ℹ️ Du kan se admins men inte lägga till/ta bort dem.
            <br />
            Endast <strong>Super Admins</strong> kan hantera andra admins.
          </p>
        </div>
      )}
    </div>
  );
}
