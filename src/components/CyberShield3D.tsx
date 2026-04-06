import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const GlowRing = ({ radius, speed, color }: { radius: number; speed: number; color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
      ref.current.rotation.x += delta * speed * 0.3;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.02, 16, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.7} />
    </mesh>
  );
};

const FloatingShield = () => {
  const groupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);

  const shieldShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.2);
    shape.quadraticCurveTo(1, 0.9, 1, 0);
    shape.quadraticCurveTo(1, -0.6, 0, -1.2);
    shape.quadraticCurveTo(-1, -0.6, -1, 0);
    shape.quadraticCurveTo(-1, 0.9, 0, 1.2);
    return shape;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={0.55}>
      <mesh ref={shieldRef}>
        <extrudeGeometry args={[shieldShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 }]} />
        <meshStandardMaterial color="#00e69d" emissive="#00e69d" emissiveIntensity={0.4} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Lock icon (simplified keyhole) */}
      <mesh position={[0, 0.15, 0.1]}>
        <torusGeometry args={[0.22, 0.05, 16, 32]} />
        <meshStandardMaterial color="#00e69d" emissive="#00e69d" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, -0.15, 0.1]}>
        <boxGeometry args={[0.12, 0.35, 0.08]} />
        <meshStandardMaterial color="#00e69d" emissive="#00e69d" emissiveIntensity={1.5} />
      </mesh>

      <GlowRing radius={1.5} speed={0.4} color="#00e69d" />
      <GlowRing radius={1.7} speed={-0.25} color="#00bfff" />
      <GlowRing radius={1.9} speed={0.15} color="#00e69d" />
    </group>
  );
};

const Particles = () => {
  const count = 60;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00e69d" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const CyberShield3D = () => (
  <div className="w-full h-40 relative">
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#00e69d" />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#00bfff" />
      <FloatingShield />
      <Particles />
    </Canvas>
  </div>
);

export default CyberShield3D;
