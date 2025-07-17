import React, { useEffect, useRef } from 'react';
import { initCourtroomScene } from '../three/CourtroomScene';

const CourtroomVR: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mountRef.current) {
      const { renderer } = initCourtroomScene(mountRef.current);
      return () => {
        renderer.dispose();
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '60vh', background: '#222' }} />;
};

export default CourtroomVR; 