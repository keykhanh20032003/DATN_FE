import React, { useState } from 'react';
interface ImageMagnifierProps {
  src: string;
  width: number;
  height: number;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
}

const ImageMagnifier = ({
  src,
  width,
  height,
  magnifierHeight = 300,
  magnifierWidth = 300,
  zoomLevel = 1.5,
}: ImageMagnifierProps) => {
  const [[x, y], setXY] = useState<[number, number]>([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState<[number, number]>([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);

  return (
    <div
      style={{
        position: 'relative',
        height: height,
        width: width,
      }}
    >
      <img
        src={src}
        style={{ height: height, width: width }}
        onMouseEnter={(e) => {
          const elem = e.currentTarget as HTMLImageElement;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          const elem = e.currentTarget as HTMLImageElement;
          const { top, left } = elem.getBoundingClientRect();
          const x = e.pageX - left - window.pageXOffset;
          const y = e.pageY - top - window.pageYOffset;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          setShowMagnifier(false);
        }}
        alt={'img'}
      />

      <div
        style={{
          display: showMagnifier ? '' : 'none',
          position: 'absolute',
          pointerEvents: 'none',
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifierWidth / 2}px`,
          opacity: '1',
          border: '1px solid lightgray',
          backgroundColor: 'white',
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
          backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      ></div>
    </div>
  );
};

export default ImageMagnifier;
