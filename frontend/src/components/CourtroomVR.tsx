//frontend/src/components/CourtroomVR.tsx
import React, { useEffect, useRef } from 'react';
import { initCourtroomSceneWithParticipants, Participant, Evidence3D } from '../three/CourtroomScene';

interface CourtroomVRProps {
  participants: Participant[];
  evidence: Evidence3D[];
}

const CourtroomVR: React.FC<CourtroomVRProps> = ({ participants, evidence }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mountRef.current) {
      const { renderer } = initCourtroomSceneWithParticipants(mountRef.current, { participants, evidence });
      return () => {
        renderer.dispose();
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, [participants, evidence]);

  return <div ref={mountRef} style={{ width: '100vw', height: '60vh', background: '#222' }} />;
};

export default CourtroomVR; 