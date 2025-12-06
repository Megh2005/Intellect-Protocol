"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { TextureLoader } from "three";
import * as THREE from "three";

function Coin() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load texture
  const texture = useLoader(
    TextureLoader,
    "https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png"
  );

  // Rotate the coin
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5; // Smooth rotation
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[2.5, 2.5, 0.2, 64]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.8}
        roughness={0.3}
        color="#fbbf24" // Fallback gold color
      />
      {/* Create distinct materials for faces vs edge if needed, 
          but usually mapping texture to cylinder UVs wraps it. 
          For a simple coin, mapping the face texture usually works well on top/bottom 
          and stretches on sides. We can improve if needed.
       */}
    </mesh>
  );
}

// Improved Coin mesh with specific materials for faces and edge
function BetterCoin() {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useLoader(
    TextureLoader,
    "https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png"
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.0;
    }
  });

  const cylinderGeo = useMemo(
    () => new THREE.CylinderGeometry(2, 2, 0.2, 64),
    []
  );

  // Front face
  const frontMat = new THREE.MeshStandardMaterial({
    map: texture,
    metalness: 0.7,
    roughness: 0.2,
    color: "white", // Ensure texture colors pop
  });

  // Side/Edge material (Gold)
  const sideMat = new THREE.MeshStandardMaterial({
    color: "#fbbf24",
    metalness: 1,
    roughness: 0.3,
  });

  return (
    <group ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
      {/* 
                We use a group to rotate on Y axis (spinning like a Coin on a table? No we want upright spin).
                If we want it spinning like a logo:
                Cylinder default is upright (Y axis is height).
                To make it look like a coin facing camera:
                Rotate X by 90deg (Math.PI/2).
             */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.15, 64]} />
        {/* Array of materials: [side, top, bottom] */}
        {/* Actually for CylinderGeometry: [side, top, bottom] */}
        <primitive object={sideMat} attach="material-0" />
        <primitive object={frontMat} attach="material-1" />
        <primitive object={frontMat} attach="material-2" />
      </mesh>
    </group>
  );
}

export function ThreeCoin() {
  return (
    <div className="w-10 h-10 hover:scale-110 transition-transform duration-300">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <BetterCoin />
      </Canvas>
    </div>
  );
}
