// 1. app/gallery/page.jsx
// Public gallery page with filtering by category
// ============================================
"use client";
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all photos
  useEffect(() => {
    const q = query(collection(db, "galleryPhotos"), orderBy("uploadedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter active photos in JavaScript to avoid composite index requirement
      const activePhotos = photosData.filter((photo) => photo.active === true);

      setPhotos(activePhotos);
      setFilteredPhotos(activePhotos);

      // Extract unique categories
      const uniqueCategories = [...new Set(activePhotos.map((p) => p.category))];
      setCategories(uniqueCategories);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter photos by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory, photos]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-xl">Laddar galleri...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Galleri</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Bilder från moskéns aktiviteter, evenemang och gemenskap</p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => setSelectedCategory("all")} className={`px-6 py-2 rounded-lg font-semibold transition ${selectedCategory === "all" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
            Alla ({photos.length})
          </button>
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-6 py-2 rounded-lg font-semibold transition ${selectedCategory === category ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
              {category} ({photos.filter((p) => p.category === category).length})
            </button>
          ))}
        </div>
      )}

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Inga bilder än</h2>
          <p className="text-gray-600">{selectedCategory === "all" ? "Inga bilder har lagts till ännu" : `Inga bilder i kategorin "${selectedCategory}"`}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
              </div>

              {/* Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-1 ">{photo.title}</h3>
                  {photo.description && <p className="text-sm text-white/90 line-clamp-2">{photo.description}</p>}
                  <span className="inline-block mt-2 text-xs bg-white/20 px-2 py-1 rounded">{photo.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300" onClick={() => setSelectedPhoto(null)}>
            ×
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            <div className="bg-white p-6 rounded-b-lg">
              <h2 className="text-2xl font-bold text-primary mb-2">{selectedPhoto.title}</h2>
              {selectedPhoto.description && <p className="text-gray-700 mb-3">{selectedPhoto.description}</p>}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="bg-gray-100 px-3 py-1 rounded">📂 {selectedPhoto.category}</span>
                {selectedPhoto.uploadedAt && <span>📅 {new Date(selectedPhoto.uploadedAt.seconds * 1000).toLocaleDateString("sv-SE")}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
