// components/HeroCarousel.jsx
// Updated with YouTube Thumbnails
// Shows video thumbnail with play button overlay
// ============================================
"use client";
import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Get YouTube thumbnail URL (high quality)
  const getYouTubeThumbnail = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) return null;
    // Try maxresdefault first (1280x720), fallback to hqdefault (480x360)
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Fetch slides
  useEffect(() => {
    try {
      const q = query(collection(db, "heroSlides"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const slidesData = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((slide) => slide.active === true)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          setSlides(slidesData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error("❌ Firestore error:", err);
          setError(err.message);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) {
    return (
      <div className="relative h-[500px] md:h-[600px] bg-primary rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl">Laddar slides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[500px] md:h-[600px] bg-red-100 border-2 border-red-500 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-700 p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Fel vid laddning av slides</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="text-6xl mb-4">🕌</div>
          <h2 className="text-3xl font-bold mb-2">Välkommen till Al-Rahma Moské</h2>
          <p className="text-lg mb-4">Inga slides hittades</p>
          <p className="text-sm opacity-75">Gå till /dashboard för att lägga till slides</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl">
      {/* Render based on slide type */}
      {currentSlide.type === "video" && currentSlide.videoUrl ? (
        // YouTube Video Slide with Thumbnail
        <a href={currentSlide.videoUrl.replace("/embed/", "/watch?v=")} target="_blank" rel="noopener noreferrer" className="absolute inset-0 group cursor-pointer">
          {/* YouTube Thumbnail Background */}
          <div className="absolute inset-0">
            <img
              src={getYouTubeThumbnail(currentSlide.videoUrl)}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to standard quality thumbnail if maxres not available
                const videoId = getYouTubeVideoId(currentSlide.videoUrl);
                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            {/* Dark overlay for text readability + hover effect */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300" />
          </div>

          {/* Large Play Button Overlay (YouTube style) */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative">
              {/* Pulsing effect */}
              <div className="absolute inset-0 bg-red-600 w-24 h-24 rounded-full animate-ping opacity-20"></div>

              {/* Main play button */}
              <div className="relative bg-red-600 group-hover:bg-red-700 w-24 h-24 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl">
                <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Text Content Overlay (Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
            <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
              {/* YouTube Badge */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">🎥</span>
                <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">YouTube Video</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white text-center animate-fade-in">{currentSlide.title}</h1>

              {/* Subtitle */}
              <p className="text-base md:text-xl text-white/90 text-center mb-4 animate-fade-in-delay">{currentSlide.subtitle}</p>

              {/* Call to action */}
              <div className="flex items-center justify-center gap-2 text-white/80 group-hover:text-white text-sm transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="font-semibold">Klicka för att titta på YouTube</span>
              </div>
            </div>
          </div>
        </a>
      ) : currentSlide.type === "announcement" ? (
        // Text Announcement Slide
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <div className="text-center text-white px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">{currentSlide.title}</h1>
            <p className="text-xl md:text-3xl animate-fade-in-delay leading-relaxed">{currentSlide.subtitle}</p>
          </div>
        </div>
      ) : (
        // Image Slide (default)
        <>
          {currentSlide.imageUrl && currentSlide.imageUrl.trim() !== "" ? (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
                loading="eager"
                crossOrigin="anonymous"
                onLoad={(e) => {
                  console.log("✅ Image loaded successfully:", currentSlide.imageUrl);
                  e.target.parentElement.style.background = "none";
                }}
                onError={(e) => {
                  console.error("❌ Image failed to load:", currentSlide.imageUrl);
                  e.target.style.display = "none";
                }}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent" />
          )}

          {/* Text Content Overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">{currentSlide.title}</h1>
            <p className="text-lg md:text-2xl max-w-3xl animate-fade-in-delay">{currentSlide.subtitle}</p>
          </div>
        </>
      )}

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`h-3 rounded-full transition-all ${index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75 w-3"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition z-30"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition z-30"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}

      {/* Type Indicator Badge */}
      <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm z-30">
        {currentSlide.type === "video" && "🎥 Video"}
        {currentSlide.type === "announcement" && "📢 Annons"}
        {currentSlide.type === "image" && "🖼️ Bild"}
      </div>
    </div>
  );
}
