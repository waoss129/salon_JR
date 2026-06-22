"use client";

import React, { useState, useEffect } from "react";

export default function ServiceCard({ item }: { item: any }) {
  const [images, setImages] = useState<string[]>([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/get-images?folder=${item.folder}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) setImages(data.images);
      })
      .catch((err) => console.error("Lỗi nạp ảnh:", err));
  }, [item.folder]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      className={`bg-stone-900 rounded-3xl aspect-[3/4] flex flex-col justify-end p-6 border ${item.borderColor} relative overflow-hidden cursor-pointer transform transition-all duration-500 ease-out hover:-translate-y-2 ${item.glowShadow} group ${item.extraClass}`}
    >
      {images.map((imgUrl, imgIndex) => (
        <div
          key={imgIndex}
          className="absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-in-out scale-100 group-hover:scale-[1.03]"
          style={{
            backgroundImage: `url('${imgUrl}')`,
            opacity: imgIndex === currentImgIndex ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent z-10" />
      <span
        className={`text-[11px] font-bold tracking-widest uppercase mb-1.5 z-20 block ${item.textColor}`}
      >
        {item.tag}
      </span>
      <h3 className="font-bold text-white text-base text-left z-20">
        {item.title}
      </h3>
    </div>
  );
}
