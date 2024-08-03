import React, { useState } from 'react';
import "./slider.css";

const Slider = ({ images, openFullscreenImage, selectedItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <p>No images available</p>;
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="slider">
      <button onClick={prevSlide} className="slider-button">{"<"}</button>
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="slider-image"
        onClick={() => openFullscreenImage(currentIndex, selectedItem)} 
      />
      <button onClick={nextSlide} className="slider-button">{">"}</button>
    </div>
  );
};

export default Slider;