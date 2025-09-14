"use client";

interface SimpleImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
}

export function SimpleImage({ src, alt, onClick }: SimpleImageProps) {
  return (
    <div 
      onClick={onClick}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative'
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          backgroundColor: '#ffffff',
          border: 'none',
          outline: 'none'
        }}
        onLoad={() => console.log("Simple image loaded:", src)}
        onError={(e) => console.error("Simple image failed:", src, e)}
      />
    </div>
  );
}
