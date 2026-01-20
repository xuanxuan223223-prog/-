import React, { useEffect, useState } from 'react';

interface FlashlightProps {
  active: boolean;
  intensity: number; // 0 to 1
}

const Flashlight: React.FC<FlashlightProps> = ({ active, intensity }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    // Initial center position
    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!active || intensity <= 0.1) return null;

  const size = 300 + (intensity * 200); // Dynamic size based on darkness
  const transparency = 0.98; // How dark the darkness is

  return (
    <div 
      className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-700"
      style={{
        background: `radial-gradient(circle ${size}px at ${position.x}px ${position.y}px, transparent 0%, rgba(0,0,0,${transparency}) 100%)`
      }}
    />
  );
};

export default Flashlight;