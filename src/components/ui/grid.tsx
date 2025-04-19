"use client";
import React from "react";

interface GridProps {
  photos: string[];
}

export const Grid: React.FC<GridProps> = ({ photos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <img key={index} src={photo} alt={`Uploaded photo ${index + 1}`} className="rounded-md shadow-md" />
      ))}
    </div>
  );
};
