import { backendUrl } from "../../constant/BaseUrl";
import React, { useEffect, useState } from "react";

function Carousel({ banners = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full group">
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[38rem] overflow-hidden rounded-lg mx-auto">
        {banners.map((banner, index) => (
          <div
            key={banner.banner_id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={`${backendUrl}/${banner.banner_image}`}
              className="object-cover w-full h-full"
              alt={banner.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {banners.map((banner, index) => (
          <button
            key={banner.banner_id}
            type="button"
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-current={index === currentSlide}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;