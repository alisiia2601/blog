import React, { useEffect, useRef, useState } from "react";
import Button from "@components/button";
import BlogImageBanner from "@components/blog-image-banner";

const ImageUpload = ({ onImageUpload, onReset, src, className }) => {
  const [previewUrl, setPreviewUrl] = useState(() => {
    if (src) {
      if (typeof src === "string") {
        return src;
      }
      return URL.createObjectURL(src);
    }
    return null;
  });
  const hiddenImageInputRef = useRef(null);

  // Update the previewUrl whenever the src prop is updated
  useEffect(() => {
    if (src) {
      if (typeof src === "string") {
        setPreviewUrl(src);
      } else {
        setPreviewUrl(URL.createObjectURL(src));
      }
    } else {
      setPreviewUrl(null);
    }
  }, [src]);

  const handleImageSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onImageUpload(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      onImageUpload(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewUrl(null);

    if (typeof onReset === "function") {
      onReset();
    }
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      {previewUrl ? (
        <>
          <BlogImageBanner src={previewUrl} alt="Preview" />
          <div>
            <Button
              type="button"
              onClick={() => {
                if (hiddenImageInputRef.current) {
                  hiddenImageInputRef.current.click();
                }
              }}
            >
              Edit
            </Button>
            <Button type="button" onClick={resetImage}>
              Trash
            </Button>
          </div>
        </>
      ) : (
        <label>
          <span>Upload photo</span>
          {/* <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="py-4"
          /> */}
          
        </label>
      )}
      <input
        ref={hiddenImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="py-4"
      />
    </div>
  );
};

export default ImageUpload;