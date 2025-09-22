import RippleGrid from "@/components/RippleGrid";
import React from "react";

const page = () => {
  return (
    <div>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <RippleGrid
          enableRainbow={true}
          gridColor="#ffffff"
          rippleIntensity={0.05}
          gridSize={15}
          gridThickness={50}
          mouseInteraction={true}
          mouseInteractionRadius={0.8}
          opacity={0.8}
          glowIntensity={1}
        />
      </div>
    </div>
  );
};

export default page;
