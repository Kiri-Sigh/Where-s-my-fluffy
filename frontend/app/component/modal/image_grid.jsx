import React, { useState } from "react";

const ImageSliderGrid = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3 >= images.length ? 0 : prev + 3));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev - 3 < 0 ? Math.max(images.length - 3, 0) : prev - 3
    );
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex gap-2 transition-transform duration-300"
        style={{
          width: `${(images.length / 3) * 100}%`,
          transform: `translateX(-${(currentIndex / images.length) * 100}%)`,
        }}
      >
        {images.length > 0 &&
          images.map((img, i) => (
            <div key={i} className="flex-1">
              <img
                src={img}
                alt={`img-${i}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        {images.length === 0 && (
          <div className="flex-1">
            <img
              src={"https://placehold.co/600x400"}
              alt={`img-none`}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {images.length > 3 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute bottom-2 left-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="absolute bottom-2 right-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSliderGrid;
