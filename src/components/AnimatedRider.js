import React, { useEffect, useState } from "react";
import { Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import heart from "../assets/HeartSVGFile.svg";

const heartIcon = new L.Icon({
  iconUrl: heart,
  iconSize: [20, 20],
});

const AnimatedRider = ({ fullPath, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePath, setVisiblePath] = useState(fullPath);

  useEffect(() => {
    if (!fullPath?.length) return;

    let index = 0;

    const interval = setInterval(() => {
      if (index >= fullPath?.length - 1) {
        clearInterval(interval);
        onFinish?.(fullPath?.[fullPath?.length - 1]);
        return;
      }

      index += 1;
      setCurrentIndex(index);
      setVisiblePath(fullPath?.slice(index));
    }, 100);

    return () => clearInterval(interval);
  }, [fullPath, onFinish]);

  return (
    <>
      <Polyline
        positions={visiblePath}
        pathOptions={{ color: "blue", weight: 4 }}
      />
      <Marker position={fullPath?.[currentIndex]} icon={heartIcon} />
    </>
  );
};

export default AnimatedRider;
