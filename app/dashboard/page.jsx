// // ============================================
// // 1. app/dashboard/page.jsx (UPDATED WITH CLOUDINARY)
// // Supports: Images, Announcements, YouTube videos
// // ============================================
// "use client";
// import { useState, useEffect } from "react";
// import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
// import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";

// export default function DashboardPage() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   // Password reset state
//   const [showResetForm, setShowResetForm] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");
//   const [resetMessage, setResetMessage] = useState("");

//   // Hero slides state
//   const [slides, setSlides] = useState([]);
//   const [editingSlide, setEditingSlide] = useState(null);

//   // Updated form state with slide type and video URL
//   const [formData, setFormData] = useState({
//     title: "",
//     subtitle: "",
//     order: 1,
//     active: true,
//     type: "image", // "image", "announcement", or "video"
//     videoUrl: "", // For YouTube links
//     link: "", // For external links (non-YouTube)
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // NEW: Gallery state
//   const [galleryPhotos, setGalleryPhotos] = useState([]);
//   const [editingPhoto, setEditingPhoto] = useState(null);
//   const [photoFormData, setPhotoFormData] = useState({
//     title: "",
//     description: "",
//     category: "Evenemang",
//     active: true,
//   });
//   const [photoFile, setPhotoFile] = useState(null);
//   const [uploadingPhoto, setUploadingPhoto] = useState(false);
//   const [activeTab, setActiveTab] = useState("hero"); // "hero" or "gallery"

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     const q = query(collection(db, "heroSlides"), orderBy("order", "asc"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const slidesData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setSlides(slidesData);
//     });
//     return () => unsubscribe();
//   }, [user]);

//   // Fetch gallery photos
//   useEffect(() => {
//     if (!user) return;
//     const q = query(collection(db, "galleryPhotos"), orderBy("uploadedAt", "desc"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const photosData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       // Filter active photos in JavaScript instead of Firestore to avoid composite index
//       const filteredPhotos = photosData; // Show all photos in admin dashboard
//       setGalleryPhotos(filteredPhotos);
//     });
//     return () => unsubscribe();
//   }, [user]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (err) {
//       setError("Fel email eller lösenord!");
//     }
//   };

//   // Password reset function
//   const handlePasswordReset = async (e) => {
//     e.preventDefault();
//     setError("");
//     setResetMessage("");

//     try {
//       await sendPasswordResetEmail(auth, resetEmail);
//       setResetMessage("✅ Återställningslänk skickad till din email!");
//       setResetEmail("");

//       // Auto-switch back to login after 3 seconds
//       setTimeout(() => {
//         setShowResetForm(false);
//         setResetMessage("");
//       }, 3000);
//     } catch (err) {
//       if (err.code === "auth/user-not-found") {
//         setError("❌ Ingen admin hittades med denna email");
//       } else {
//         setError("❌ Kunde inte skicka återställningslänk");
//       }
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Upload to Cloudinary (FREE - no Firebase Storage needed!)
//   const uploadToCloudinary = async (file) => {
//     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//     const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

//     if (process.env.NODE_ENV === "development") {
//       console.log("☁️ Uploading to Cloudinary...");
//       console.log("📸 File:", { name: file.name, type: file.type, sizeMB: (file.size / 1024 / 1024).toFixed(2) });
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", uploadPreset);
//     formData.append("folder", "mosque-hero-images");

//     try {
//       const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Cloudinary upload failed");
//       }

//       const data = await response.json();
//       if (process.env.NODE_ENV === "development") {
//         console.log("✅ Cloudinary upload success:", { url: data.secure_url });
//       }
//       return data.secure_url;
//     } catch (err) {
//       console.error("❌ Cloudinary error:", err);
//       throw new Error("Kunde inte ladda upp bild: " + err.message);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUploading(true);
//     setError("");

//     try {
//       let imageUrl = editingSlide?.imageUrl || "";

//       // Upload image if type is "image" and file is selected
//       if (formData.type === "image" && imageFile) {
//         imageUrl = await uploadToCloudinary(imageFile);
//       }

//       // Handle YouTube links - save in link field for HeroCarousel compatibility
//       let finalLink = formData.link || "";
//       if (formData.type === "video" && formData.videoUrl) {
//         // For video type, save YouTube URL in link field (not videoUrl)
//         finalLink = formData.videoUrl;
//       }

//       const slideData = {
//         title: formData.title,
//         subtitle: formData.subtitle,
//         imageUrl: imageUrl,
//         order: Number(formData.order),
//         active: formData.active,
//         type: formData.type,
//         videoUrl: "", // Keep empty - HeroCarousel uses link field for YouTube
//         link: finalLink, // YouTube links go here for proper detection
//       };

//       if (editingSlide) {
//         await updateDoc(doc(db, "heroSlides", editingSlide.id), slideData);
//         alert("Slide uppdaterad!");
//       } else {
//         await addDoc(collection(db, "heroSlides"), slideData);
//         alert("Ny slide skapad!");
//       }

//       // Reset form
//       setFormData({
//         title: "",
//         subtitle: "",
//         order: 1,
//         active: true,
//         type: "image",
//         videoUrl: "",
//         link: "", // Reset link field
//       });
//       setImageFile(null);
//       setEditingSlide(null);
//     } catch (err) {
//       console.error(err);
//       setError("Fel: " + err.message);
//       alert("Något gick fel: " + err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Extract YouTube video ID from various URL formats
//   const extractYouTubeId = (url) => {
//     const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/];

//     for (const pattern of patterns) {
//       const match = url.match(pattern);
//       if (match) return match[1];
//     }
//     return null;
//   };

//   const handleEdit = (slide) => {
//     setEditingSlide(slide);
//     setFormData({
//       title: slide.title,
//       subtitle: slide.subtitle,
//       order: slide.order,
//       active: slide.active,
//       type: slide.type || "image",
//       // For video slides, load YouTube URL from link field, not videoUrl
//       videoUrl: slide.type === "video" ? slide.link || "" : "",
//       // For non-video slides, load external link
//       link: slide.type !== "video" ? slide.link || "" : "",
//     });
//   };

//   const handleDelete = async (slideId) => {
//     if (!confirm("Är du säker på att du vill radera denna slide?")) return;
//     try {
//       await deleteDoc(doc(db, "heroSlides", slideId));
//       alert("Slide raderad!");
//     } catch (err) {
//       alert("Kunde inte radera slide!");
//     }
//   };

//   const handleCancel = () => {
//     setEditingSlide(null);
//     setFormData({
//       title: "",
//       subtitle: "",
//       order: 1,
//       active: true,
//       type: "image",
//       videoUrl: "",
//       link: "", // Reset link field in cancel
//     });
//     setImageFile(null);
//   };

//   // Pre-defined categories
//   const photoCategories = ["Evenemang", "Eid-firande", "Ramadan", "Fredagsbön", "Koranskola", "Barn & Ungdom", "Gemenskapsaktiviteter", "Moskébyggnad", "Annat"];

//   // Upload photo to Cloudinary
//   const uploadPhotoToCloudinary = async (file) => {
//     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//     const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", uploadPreset);
//     formData.append("folder", "mosque-gallery"); // Different folder from hero images

//     const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     return data.secure_url;
//   };

//   // Handle gallery photo submit
//   const handlePhotoSubmit = async (e) => {
//     e.preventDefault();
//     setUploadingPhoto(true);

//     try {
//       if (!photoFile && !editingPhoto) {
//         alert("Välj en bild att ladda upp!");
//         setUploadingPhoto(false);
//         return;
//       }

//       let imageUrl = editingPhoto?.imageUrl || "";

//       if (photoFile) {
//         imageUrl = await uploadPhotoToCloudinary(photoFile);
//       }

//       const photoData = {
//         title: photoFormData.title,
//         description: photoFormData.description,
//         category: photoFormData.category,
//         imageUrl: imageUrl,
//         active: photoFormData.active,
//         uploadedAt: serverTimestamp(),
//       };

//       if (editingPhoto) {
//         await updateDoc(doc(db, "galleryPhotos", editingPhoto.id), photoData);
//         alert("Bild uppdaterad!");
//       } else {
//         await addDoc(collection(db, "galleryPhotos"), photoData);
//         alert("Bild tillagd i galleriet!");
//       }

//       // Reset form
//       setPhotoFormData({
//         title: "",
//         description: "",
//         category: "Evenemang",
//         active: true,
//       });
//       setPhotoFile(null);
//       setEditingPhoto(null);
//     } catch (err) {
//       console.error(err);
//       alert("Något gick fel: " + err.message);
//     } finally {
//       setUploadingPhoto(false);
//     }
//   };

//   const handleEditPhoto = (photo) => {
//     setEditingPhoto(photo);
//     setPhotoFormData({
//       title: photo.title,
//       description: photo.description || "",
//       category: photo.category,
//       active: photo.active,
//     });
//     setActiveTab("gallery");
//     // Scroll to form
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDeletePhoto = async (photoId) => {
//     if (!confirm("Är du säker på att du vill radera denna bild?")) return;
//     try {
//       await deleteDoc(doc(db, "galleryPhotos", photoId));
//       alert("Bild raderad!");
//     } catch (err) {
//       alert("Kunde inte radera bild!");
//     }
//   };

//   const handleCancelPhotoEdit = () => {
//     setEditingPhoto(null);
//     setPhotoFormData({
//       title: "",
//       description: "",
//       category: "Evenemang",
//       active: true,
//     });
//     setPhotoFile(null);
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-20">
//         <div className="text-4xl mb-4">⏳</div>
//         <p className="text-xl">Laddar...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="max-w-md mx-auto mt-20">
//         <div className="bg-white shadow-lg rounded-lg p-8">
//           <h1 className="text-3xl font-bold text-primary mb-6 text-center">🔐 Admin Inloggning</h1>

//           {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

//           {resetMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{resetMessage}</div>}

//           {!showResetForm ? (
//             // Login Form
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Email</label>
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="admin@alrahmamoske.se" required />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Lösenord</label>
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
//               </div>

//               <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
//                 Logga In
//               </button>

//               {/* Forgot Password Link */}
//               <button type="button" onClick={() => setShowResetForm(true)} className="w-full text-primary text-sm hover:underline">
//                 Glömt lösenord?
//               </button>
//             </form>
//           ) : (
//             // Password Reset Form
//             <form onSubmit={handlePasswordReset} className="space-y-4">
//               <p className="text-sm text-gray-600 mb-4">Ange din email så skickar vi en återställningslänk</p>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Email</label>
//                 <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="admin@alrahmamoske.se" required />
//               </div>

//               <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
//                 Skicka Återställningslänk
//               </button>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowResetForm(false);
//                   setError("");
//                 }}
//                 className="w-full text-gray-600 text-sm hover:underline"
//               >
//                 ← Tillbaka till inloggning
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-2">Inloggad som: {user.email}</p>
//         </div>
//         <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-semibold">
//           Logga Ut
//         </button>
//       </div>

//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

//       {/* Tab Navigation */}
//       <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
//         <button onClick={() => setActiveTab("hero")} className={`px-6 py-3 font-semibold transition ${activeTab === "hero" ? "text-primary border-b-4 border-primary -mb-0.5" : "text-gray-600 hover:text-primary"}`}>
//           🎠 Hero Slides
//         </button>
//         <button onClick={() => setActiveTab("gallery")} className={`px-6 py-3 font-semibold transition ${activeTab === "gallery" ? "text-primary border-b-4 border-primary -mb-0.5" : "text-gray-600 hover:text-primary"}`}>
//           📸 Galleri ({galleryPhotos.length})
//         </button>
//       </div>

//       {/* Hero Slides Section */}
//       {activeTab === "hero" && (
//         <div>
//           {/* Add/Edit Form */}
//           <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
//             <h2 className="text-2xl font-bold text-primary mb-6">{editingSlide ? "✏️ Redigera Slide" : "➕ Lägg till Ny Slide"}</h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Slide Type Selection */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">Typ av Slide</label>
//                 <div className="grid grid-cols-3 gap-4">
//                   <button type="button" onClick={() => setFormData({ ...formData, type: "image" })} className={`p-4 border-2 rounded-lg text-center ${formData.type === "image" ? "border-primary bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
//                     <div className="text-3xl mb-2">🖼️</div>
//                     <div className="font-semibold">Bild</div>
//                     <div className="text-xs text-gray-600">Foto eller grafik</div>
//                   </button>

//                   <button type="button" onClick={() => setFormData({ ...formData, type: "announcement" })} className={`p-4 border-2 rounded-lg text-center ${formData.type === "announcement" ? "border-primary bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
//                     <div className="text-3xl mb-2">📢</div>
//                     <div className="font-semibold">Annons</div>
//                     <div className="text-xs text-gray-600">Endast text</div>
//                   </button>

//                   <button type="button" onClick={() => setFormData({ ...formData, type: "video" })} className={`p-4 border-2 rounded-lg text-center ${formData.type === "video" ? "border-primary bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
//                     <div className="text-3xl mb-2">🎥</div>
//                     <div className="font-semibold">Video</div>
//                     <div className="text-xs text-gray-600">YouTube länk</div>
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Titel <span className="text-red-500">*</span>
//                 </label>
//                 <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="Välkommen till Al-Rahma Moské" required />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Undertitel <span className="text-red-500">*</span>
//                 </label>
//                 <textarea value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" rows="3" placeholder="Tjänar gemenskapen genom bön, utbildning och stöd" required />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Ordning</label>
//                   <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" min="1" required />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Status</label>
//                   <select value={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
//                     <option value="true">Aktiv ✅</option>
//                     <option value="false">Inaktiv ❌</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Image Upload (only for type="image") */}
//               {formData.type === "image" && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Bild (Valfritt)</label>
//                   <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e) => setImageFile(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
//                   <p className="text-xs text-gray-500 mt-1">
//                     📸 Laddas upp till Cloudinary (GRATIS!)
//                     <br />
//                     Format: JPG, PNG, WebP
//                   </p>
//                   {imageFile && (
//                     <p className="text-sm text-green-600 mt-2">
//                       ✅ Bild vald: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
//                     </p>
//                   )}
//                   {editingSlide?.imageUrl && !imageFile && (
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-600 mb-2">Nuvarande bild:</p>
//                       <img src={editingSlide.imageUrl} alt="Current" className="h-32 object-cover rounded" />
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* YouTube Video URL (only for type="video") */}
//               {formData.type === "video" && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     YouTube Video Länk <span className="text-red-500">*</span>
//                   </label>
//                   <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="https://www.youtube.com/watch?v=..." required={formData.type === "video"} />
//                   <p className="text-xs text-gray-500 mt-1">
//                     🎥 Klistra in YouTube-länk här. Accepterar:
//                     <br />
//                     • https://www.youtube.com/watch?v=VIDEO_ID
//                     <br />
//                     • https://youtu.be/VIDEO_ID
//                     <br />• VIDEO_ID (bara ID:t)
//                   </p>
//                   {formData.videoUrl && extractYouTubeId(formData.videoUrl) && <p className="text-sm text-green-600 mt-2">✅ Giltig YouTube video ID: {extractYouTubeId(formData.videoUrl)}</p>}
//                 </div>
//               )}

//               {/* External Link (for all types except video) */}
//               {formData.type !== "video" && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Extern Länk (valfri)</label>
//                   <input type="url" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="https://example.com/event-registration" />
//                   <p className="text-xs text-gray-500 mt-1">
//                     🔗 Lägg till extern länk (ex: anmälan, Facebook-event, webbsida)
//                     <br />
//                     • Lämna tom för vanlig annons
//                     <br />• Användare kan klicka på slide för att öppna länken
//                   </p>
//                   {formData.link && <p className="text-sm text-blue-600 mt-2">🔗 Länk kommer att öppnas i nytt fönster</p>}
//                 </div>
//               )}

//               <div className="flex gap-4">
//                 <button type="submit" disabled={uploading} className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                   {uploading ? "⏳ Laddar upp..." : editingSlide ? "💾 Uppdatera" : "➕ Skapa"}
//                 </button>

//                 {editingSlide && (
//                   <button type="button" onClick={handleCancel} className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600">
//                     ❌ Avbryt
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {/* Existing Slides */}
//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <h2 className="text-2xl font-bold text-primary mb-6">📋 Befintliga Slides ({slides.length})</h2>

//             {slides.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <div className="text-6xl mb-4">📭</div>
//                 <p className="text-lg">Inga slides ännu</p>
//                 <p className="text-sm">Lägg till din första slide ovan!</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {slides.map((slide) => (
//                   <div key={slide.id} className="border-2 rounded-lg p-4 flex gap-4 hover:border-primary transition">
//                     {/* Slide Preview */}
//                     {slide.type === "image" && slide.imageUrl ? (
//                       <img src={slide.imageUrl} alt={slide.title} className="w-32 h-20 object-cover rounded" />
//                     ) : slide.type === "video" ? (
//                       <div className="w-32 h-20 bg-red-100 rounded flex items-center justify-center">
//                         <span className="text-3xl">🎥</span>
//                       </div>
//                     ) : (
//                       <div className="w-32 h-20 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center text-white text-xs">{slide.type === "announcement" ? "📢" : "Ingen bild"}</div>
//                     )}

//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         {slide.type === "video" && <span className="text-xl">🎥</span>}
//                         {slide.type === "announcement" && <span className="text-xl">📢</span>}
//                         {slide.type === "image" && <span className="text-xl">🖼️</span>}
//                         <h3 className="font-bold text-lg text-primary">{slide.title}</h3>
//                       </div>
//                       <p className="text-sm text-gray-600 mt-1">{slide.subtitle}</p>
//                       <div className="flex gap-4 mt-2">
//                         <span className="text-xs bg-gray-100 px-2 py-1 rounded">📊 Ordning: {slide.order}</span>
//                         <span className={`text-xs px-2 py-1 rounded ${slide.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{slide.active ? "✅ Aktiv" : "❌ Inaktiv"}</span>
//                         <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
//                           {slide.type === "image" && "🖼️ Bild"}
//                           {slide.type === "announcement" && "📢 Annons"}
//                           {slide.type === "video" && "🎥 Video"}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex flex-col gap-2">
//                       <button onClick={() => handleEdit(slide)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold">
//                         ✏️ Redigera
//                       </button>
//                       <button onClick={() => handleDelete(slide.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold">
//                         🗑️ Radera
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Gallery Section */}
//       {activeTab === "gallery" && (
//         <div>
//           {/* Add Photo Form */}
//           <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
//             <h2 className="text-2xl font-bold text-primary mb-6">{editingPhoto ? "✏️ Redigera Bild" : "➕ Lägg till Bild i Galleri"}</h2>

//             <form onSubmit={handlePhotoSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Titel <span className="text-red-500">*</span>
//                 </label>
//                 <input type="text" value={photoFormData.title} onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="T.ex. Eid al-Fitr Firande 2025" required />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Beskrivning (Valfritt)</label>
//                 <textarea value={photoFormData.description} onChange={(e) => setPhotoFormData({ ...photoFormData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" rows="3" placeholder="Kort beskrivning av bilden..." />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Kategori <span className="text-red-500">*</span>
//                   </label>
//                   <select value={photoFormData.category} onChange={(e) => setPhotoFormData({ ...photoFormData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" required>
//                     {photoCategories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Status</label>
//                   <select
//                     value={photoFormData.active}
//                     onChange={(e) =>
//                       setPhotoFormData({
//                         ...photoFormData,
//                         active: e.target.value === "true",
//                       })
//                     }
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
//                   >
//                     <option value="true">Aktiv ✅</option>
//                     <option value="false">Inaktiv ❌</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Bild {!editingPhoto && <span className="text-red-500">*</span>}</label>
//                 <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e) => setPhotoFile(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required={!editingPhoto} />
//                 <p className="text-xs text-gray-500 mt-1">
//                   📸 Laddas upp till Cloudinary (mapp: mosque-gallery)
//                   <br />
//                   Format: JPG, PNG, WebP
//                 </p>
//                 {photoFile && (
//                   <p className="text-sm text-green-600 mt-2">
//                     ✅ Bild vald: {photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)
//                   </p>
//                 )}
//                 {editingPhoto?.imageUrl && !photoFile && (
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-600 mb-2">Nuvarande bild:</p>
//                     <img src={editingPhoto.imageUrl} alt="Current" className="h-32 object-cover rounded" />
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-4">
//                 <button type="submit" disabled={uploadingPhoto} className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                   {uploadingPhoto ? "⏳ Laddar upp..." : editingPhoto ? "💾 Uppdatera Bild" : "➕ Lägg till i Galleri"}
//                 </button>

//                 {editingPhoto && (
//                   <button type="button" onClick={handleCancelPhotoEdit} className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600">
//                     ❌ Avbryt
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {/* Gallery Photos List */}
//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <h2 className="text-2xl font-bold text-primary mb-6">📋 Galleri Bilder ({galleryPhotos.length})</h2>

//             {galleryPhotos.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <div className="text-6xl mb-4">📭</div>
//                 <p className="text-lg">Inga bilder i galleriet ännu</p>
//                 <p className="text-sm">Lägg till din första bild ovan!</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {galleryPhotos.map((photo) => (
//                   <div key={photo.id} className="border-2 rounded-lg overflow-hidden hover:border-primary transition">
//                     <img src={photo.imageUrl} alt={photo.title} className="w-full h-48 object-cover" />
//                     <div className="p-4">
//                       <h3 className="font-bold text-lg text-primary mb-1">{photo.title}</h3>
//                       {photo.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description}</p>}
//                       <div className="flex gap-2 mb-3 text-xs">
//                         <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">📂 {photo.category}</span>
//                         <span className={`px-2 py-1 rounded ${photo.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{photo.active ? "✅ Aktiv" : "❌ Inaktiv"}</span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button onClick={() => handleEditPhoto(photo)} className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm font-semibold">
//                           ✏️ Redigera
//                         </button>
//                         <button onClick={() => handleDeletePhoto(photo.id)} className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-semibold">
//                           🗑️ Radera
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// app/dashboard/page.jsx
// MOBILE OPTIMIZED VERSION - Responsive design
"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { isAdmin } from "@/lib/checkAdmin";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Password reset state
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Hero slides state
  const [slides, setSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);

  // Updated form state with slide type and video URL
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    order: 1,
    active: true,
    type: "image",
    videoUrl: "",
    link: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Gallery state
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [photoFormData, setPhotoFormData] = useState({
    title: "",
    description: "",
    category: "Evenemang",
    active: true,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        setCheckingAdmin(true);
        const adminStatus = await isAdmin(user.uid);
        setUserIsAdmin(adminStatus);
        setCheckingAdmin(false);
      } else {
        setUserIsAdmin(false);
        setCheckingAdmin(false);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch slides
  useEffect(() => {
    if (!user || !userIsAdmin) return;
    const q = query(collection(db, "heroSlides"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slidesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlides(slidesData);
    });
    return () => unsubscribe();
  }, [user, userIsAdmin]);

  // Fetch gallery photos
  useEffect(() => {
    if (!user || !userIsAdmin) return;
    const q = query(collection(db, "galleryPhotos"), orderBy("uploadedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleryPhotos(photosData);
    });
    return () => unsubscribe();
  }, [user, userIsAdmin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Fel email eller lösenord!");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("✅ Återställningslänk skickad till din email!");
      setResetEmail("");

      setTimeout(() => {
        setShowResetForm(false);
        setResetMessage("");
      }, 3000);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("❌ Ingen admin hittades med denna email");
      } else {
        setError("❌ Kunde inte skicka återställningslänk");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "mosque-hero-images");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error("❌ Cloudinary error:", err);
      throw new Error("Kunde inte ladda upp bild: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      let imageUrl = editingSlide?.imageUrl || "";

      if (formData.type === "image" && imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      let finalLink = formData.link || "";
      if (formData.type === "video" && formData.videoUrl) {
        finalLink = formData.videoUrl;
      }

      const slideData = {
        title: formData.title,
        subtitle: formData.subtitle,
        imageUrl: imageUrl,
        order: Number(formData.order),
        active: formData.active,
        type: formData.type,
        videoUrl: "",
        link: finalLink,
      };

      if (editingSlide) {
        await updateDoc(doc(db, "heroSlides", editingSlide.id), slideData);
        alert("Slide uppdaterad!");
      } else {
        await addDoc(collection(db, "heroSlides"), slideData);
        alert("Ny slide skapad!");
      }

      setFormData({
        title: "",
        subtitle: "",
        order: 1,
        active: true,
        type: "image",
        videoUrl: "",
        link: "",
      });
      setImageFile(null);
      setEditingSlide(null);
    } catch (err) {
      console.error(err);
      setError("Fel: " + err.message);
      alert("Något gick fel: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const extractYouTubeId = (url) => {
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      order: slide.order,
      active: slide.active,
      type: slide.type || "image",
      videoUrl: slide.type === "video" ? slide.link || "" : "",
      link: slide.type !== "video" ? slide.link || "" : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (slideId) => {
    if (!confirm("Är du säker på att du vill radera denna slide?")) return;
    try {
      await deleteDoc(doc(db, "heroSlides", slideId));
      alert("Slide raderad!");
    } catch (err) {
      alert("Kunde inte radera slide!");
    }
  };

  const handleCancel = () => {
    setEditingSlide(null);
    setFormData({
      title: "",
      subtitle: "",
      order: 1,
      active: true,
      type: "image",
      videoUrl: "",
      link: "",
    });
    setImageFile(null);
  };

  const photoCategories = ["Evenemang", "Eid-firande", "Ramadan", "Fredagsbön", "Koranskola", "Barn & Ungdom", "Gemenskapsaktiviteter", "Moskébyggnad", "Annat"];

  const uploadPhotoToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "mosque-gallery");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    setUploadingPhoto(true);

    try {
      if (!photoFile && !editingPhoto) {
        alert("Välj en bild att ladda upp!");
        setUploadingPhoto(false);
        return;
      }

      let imageUrl = editingPhoto?.imageUrl || "";

      if (photoFile) {
        imageUrl = await uploadPhotoToCloudinary(photoFile);
      }

      const photoData = {
        title: photoFormData.title,
        description: photoFormData.description,
        category: photoFormData.category,
        imageUrl: imageUrl,
        active: photoFormData.active,
        uploadedAt: serverTimestamp(),
      };

      if (editingPhoto) {
        await updateDoc(doc(db, "galleryPhotos", editingPhoto.id), photoData);
        alert("Bild uppdaterad!");
      } else {
        await addDoc(collection(db, "galleryPhotos"), photoData);
        alert("Bild tillagd i galleriet!");
      }

      setPhotoFormData({
        title: "",
        description: "",
        category: "Evenemang",
        active: true,
      });
      setPhotoFile(null);
      setEditingPhoto(null);
    } catch (err) {
      console.error(err);
      alert("Något gick fel: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setPhotoFormData({
      title: photo.title,
      description: photo.description || "",
      category: photo.category,
      active: photo.active,
    });
    setActiveTab("gallery");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Är du säker på att du vill radera denna bild?")) return;
    try {
      await deleteDoc(doc(db, "galleryPhotos", photoId));
      alert("Bild raderad!");
    } catch (err) {
      alert("Kunde inte radera bild!");
    }
  };

  const handleCancelPhotoEdit = () => {
    setEditingPhoto(null);
    setPhotoFormData({
      title: "",
      description: "",
      category: "Evenemang",
      active: true,
    });
    setPhotoFile(null);
  };

  if (loading || checkingAdmin) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-xl">Laddar...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 sm:mt-20 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center">🔐 Admin Inloggning</h1>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

          {resetMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{resetMessage}</div>}

          {!showResetForm ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" placeholder="admin@alrahmamoske.se" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lösenord</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" required />
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                Logga In
              </button>

              <button type="button" onClick={() => setShowResetForm(true)} className="w-full text-primary text-sm hover:underline">
                Glömt lösenord?
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Ange din email så skickar vi en återställningslänk</p>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" placeholder="admin@alrahmamoske.se" required />
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                Skicka Återställningslänk
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowResetForm(false);
                  setError("");
                }}
                className="w-full text-gray-600 text-sm hover:underline"
              >
                ← Tillbaka till inloggning
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Check if logged-in user is admin
  if (!userIsAdmin) {
    return (
      <div className="max-w-md mx-auto mt-10 sm:mt-20 px-4">
        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 sm:p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-xl sm:text-2xl font-bold text-red-700 mb-4">Ingen Åtkomst</h1>
          <p className="text-sm sm:text-base text-red-600 mb-6 break-words">
            Du är inloggad som <strong className="block sm:inline mt-1">{user.email}</strong>
            <br className="hidden sm:block" />
            men har inte admin-behörighet.
          </p>
          <button onClick={handleLogout} className="w-full sm:w-auto bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-semibold">
            Logga Ut
          </button>
        </div>
      </div>
    );
  }

  // MOBILE OPTIMIZED DASHBOARD
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* MOBILE OPTIMIZED HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-2 break-words">
            <span className="block sm:inline">Inloggad som: {user.email}</span>
            <Link href="/admin-settings" className="block sm:inline sm:ml-3 mt-2 sm:mt-0 text-sm text-primary hover:underline">
              ⚙️ Hantera Admins
            </Link>
          </p>
        </div>
        <button onClick={handleLogout} className="w-full sm:w-auto bg-red-500 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-600 font-semibold whitespace-nowrap text-sm sm:text-base">
          Logga Ut
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded mb-4 sm:mb-6 text-sm">{error}</div>}

      {/* MOBILE OPTIMIZED TAB NAVIGATION */}
      <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b-2 border-gray-200 overflow-x-auto">
        <button onClick={() => setActiveTab("hero")} className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition whitespace-nowrap text-sm sm:text-base ${activeTab === "hero" ? "text-primary border-b-4 border-primary -mb-0.5" : "text-gray-600 hover:text-primary"}`}>
          🎠 Hero Slides
        </button>
        <button onClick={() => setActiveTab("gallery")} className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition whitespace-nowrap text-sm sm:text-base ${activeTab === "gallery" ? "text-primary border-b-4 border-primary -mb-0.5" : "text-gray-600 hover:text-primary"}`}>
          📸 Galleri ({galleryPhotos.length})
        </button>
      </div>

      {/* Hero Slides Section - CONTINUED IN NEXT FILE DUE TO LENGTH */}
      {activeTab === "hero" && (
        <div>
          {/* Add/Edit Form */}
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">{editingSlide ? "✏️ Redigera Slide" : "➕ Lägg till Ny Slide"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Slide Type Selection - MOBILE OPTIMIZED */}
              <div>
                <label className="block text-sm font-medium mb-2">Typ av Slide</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <button type="button" onClick={() => setFormData({ ...formData, type: "image" })} className={`p-3 sm:p-4 border-2 rounded-lg text-center ${formData.type === "image" ? "border-primary bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🖼️</div>
                    <div className="font-semibold text-sm sm:text-base">Bild</div>
                    <div className="text-xs text-gray-600">Foto eller grafik</div>
                  </button>

                  <button type="button" onClick={() => setFormData({ ...formData, type: "announcement" })} className={`p-3 sm:p-4 border-2 rounded-lg text-center ${formData.type === "announcement" ? "border-primary bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📢</div>
                    <div className="font-semibold text-sm sm:text-base">Annons</div>
                    <div className="text-xs text-gray-600">Endast text</div>
                  </button>

                  <button type="button" onClick={() => setFormData({ ...formData, type: "video" })} className={`p-3 sm:p-4 border-2 rounded-lg text-center ${formData.type === "video" ? "border-primary bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎥</div>
                    <div className="font-semibold text-sm sm:text-base">Video</div>
                    <div className="text-xs text-gray-600">YouTube länk</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" placeholder="Välkommen till Al-Rahma Moské" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Undertitel <span className="text-red-500">*</span>
                </label>
                <textarea value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" rows="3" placeholder="Tjänar gemenskapen genom bön, utbildning och stöd" required />
              </div>

              {/* MOBILE OPTIMIZED GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ordning</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base">
                    <option value="true">Aktiv ✅</option>
                    <option value="false">Inaktiv ❌</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              {formData.type === "image" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Bild (Valfritt)</label>
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e) => setImageFile(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                  <p className="text-xs text-gray-500 mt-1">
                    📸 Laddas upp till Cloudinary (GRATIS!)
                    <br />
                    Format: JPG, PNG, WebP
                  </p>
                  {imageFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✅ Bild vald: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  {editingSlide?.imageUrl && !imageFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Nuvarande bild:</p>
                      <img src={editingSlide.imageUrl} alt="Current" className="h-32 object-cover rounded" />
                    </div>
                  )}
                </div>
              )}

              {/* YouTube Video URL */}
              {formData.type === "video" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    YouTube Video Länk <span className="text-red-500">*</span>
                  </label>
                  <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" placeholder="https://www.youtube.com/watch?v=..." required={formData.type === "video"} />
                  <p className="text-xs text-gray-500 mt-1">🎥 Klistra in YouTube-länk här</p>
                  {formData.videoUrl && extractYouTubeId(formData.videoUrl) && <p className="text-sm text-green-600 mt-2">✅ Giltig YouTube video ID: {extractYouTubeId(formData.videoUrl)}</p>}
                </div>
              )}

              {/* External Link */}
              {formData.type !== "video" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Extern Länk (valfri)</label>
                  <input type="url" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" placeholder="https://example.com/event" />
                  <p className="text-xs text-gray-500 mt-1">🔗 Extern länk (anmälan, Facebook-event, etc)</p>
                </div>
              )}

              {/* MOBILE OPTIMIZED BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="submit" disabled={uploading} className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                  {uploading ? "⏳ Laddar upp..." : editingSlide ? "💾 Uppdatera" : "➕ Skapa"}
                </button>

                {editingSlide && (
                  <button type="button" onClick={handleCancel} className="sm:px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 text-sm sm:text-base">
                    ❌ Avbryt
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing Slides - MOBILE OPTIMIZED */}
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">📋 Befintliga Slides ({slides.length})</h2>

            {slides.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl sm:text-6xl mb-4">📭</div>
                <p className="text-base sm:text-lg">Inga slides ännu</p>
                <p className="text-sm">Lägg till din första slide ovan!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide) => (
                  <div key={slide.id} className="border-2 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 hover:border-primary transition">
                    {/* Slide Preview */}
                    {slide.type === "image" && slide.imageUrl ? (
                      <img src={slide.imageUrl} alt={slide.title} className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded" />
                    ) : slide.type === "video" ? (
                      <div className="w-full sm:w-32 h-32 sm:h-20 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-3xl">🎥</span>
                      </div>
                    ) : (
                      <div className="w-full sm:w-32 h-32 sm:h-20 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center text-white text-xs">{slide.type === "announcement" ? "📢" : "Ingen bild"}</div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {slide.type === "video" && <span className="text-lg sm:text-xl">🎥</span>}
                        {slide.type === "announcement" && <span className="text-lg sm:text-xl">📢</span>}
                        {slide.type === "image" && <span className="text-lg sm:text-xl">🖼️</span>}
                        <h3 className="font-bold text-base sm:text-lg text-primary break-words">{slide.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 break-words">{slide.subtitle}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">📊 Ordning: {slide.order}</span>
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${slide.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{slide.active ? "✅ Aktiv" : "❌ Inaktiv"}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">
                          {slide.type === "image" && "🖼️ Bild"}
                          {slide.type === "announcement" && "📢 Annons"}
                          {slide.type === "video" && "🎥 Video"}
                        </span>
                      </div>
                    </div>

                    {/* MOBILE OPTIMIZED BUTTONS */}
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <button onClick={() => handleEdit(slide)} className="flex-1 sm:flex-none bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 font-semibold text-sm whitespace-nowrap">
                        ✏️ Redigera
                      </button>
                      <button onClick={() => handleDelete(slide.id)} className="flex-1 sm:flex-none bg-red-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-600 font-semibold text-sm whitespace-nowrap">
                        🗑️ Radera
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery Section - MOBILE OPTIMIZED */}
      {activeTab === "gallery" && (
        <div>
          {/* Add Photo Form */}
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">{editingPhoto ? "✏️ Redigera Bild" : "➕ Lägg till Bild i Galleri"}</h2>

            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input type="text" value={photoFormData.title} onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" placeholder="T.ex. Eid al-Fitr Firande 2025" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beskrivning (Valfritt)</label>
                <textarea value={photoFormData.description} onChange={(e) => setPhotoFormData({ ...photoFormData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" rows="3" placeholder="Kort beskrivning..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select value={photoFormData.category} onChange={(e) => setPhotoFormData({ ...photoFormData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base" required>
                    {photoCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={photoFormData.active}
                    onChange={(e) =>
                      setPhotoFormData({
                        ...photoFormData,
                        active: e.target.value === "true",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base"
                  >
                    <option value="true">Aktiv ✅</option>
                    <option value="false">Inaktiv ❌</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bild {!editingPhoto && <span className="text-red-500">*</span>}</label>
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e) => setPhotoFile(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" required={!editingPhoto} />
                <p className="text-xs text-gray-500 mt-1">📸 Format: JPG, PNG, WebP</p>
                {photoFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✅ Bild vald: {photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {editingPhoto?.imageUrl && !photoFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Nuvarande bild:</p>
                    <img src={editingPhoto.imageUrl} alt="Current" className="h-32 object-cover rounded" />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="submit" disabled={uploadingPhoto} className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                  {uploadingPhoto ? "⏳ Laddar upp..." : editingPhoto ? "💾 Uppdatera Bild" : "➕ Lägg till i Galleri"}
                </button>

                {editingPhoto && (
                  <button type="button" onClick={handleCancelPhotoEdit} className="sm:px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 text-sm sm:text-base">
                    ❌ Avbryt
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Gallery Photos List - MOBILE OPTIMIZED GRID */}
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">📋 Galleri Bilder ({galleryPhotos.length})</h2>

            {galleryPhotos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl sm:text-6xl mb-4">📭</div>
                <p className="text-base sm:text-lg">Inga bilder i galleriet ännu</p>
                <p className="text-sm">Lägg till din första bild ovan!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="border-2 rounded-lg overflow-hidden hover:border-primary transition">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-base sm:text-lg text-primary mb-1 break-words">{photo.title}</h3>
                      {photo.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2 break-words">{photo.description}</p>}
                      <div className="flex flex-wrap gap-2 mb-3 text-xs">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">📂 {photo.category}</span>
                        <span className={`px-2 py-1 rounded whitespace-nowrap ${photo.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{photo.active ? "✅ Aktiv" : "❌ Inaktiv"}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditPhoto(photo)} className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm font-semibold whitespace-nowrap">
                          ✏️ Redigera
                        </button>
                        <button onClick={() => handleDeletePhoto(photo.id)} className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-semibold whitespace-nowrap">
                          🗑️ Radera
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
