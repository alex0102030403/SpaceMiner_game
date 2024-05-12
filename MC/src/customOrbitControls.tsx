// CustomOrbitControls.tsx
import React, { useRef } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei'

extend({ OrbitControls });

interface CustomOrbitControlsProps {
  minPolarAngle: number;
  maxPolarAngle: number;
}

const CustomOrbitControls: React.FC<CustomOrbitControlsProps> = ({
  minPolarAngle,
  maxPolarAngle,
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls>();

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} minPolarAngle={minPolarAngle} maxPolarAngle={maxPolarAngle} />;
};

export default CustomOrbitControls;
