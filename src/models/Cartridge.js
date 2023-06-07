import React from 'react'
import { useGLTF } from '@react-three/drei'

const Cartridge = (props) => {
    const { nodes, materials } = useGLTF('./models/gameboy/scene.gltf');

    materials.mat_default.depthWrite = true;
    materials.mat_default.normalScale.set(1, 1);
    materials.mat_default.aoMap = materials.mat_default.roughnessMap.clone();
    
    return (
      <group {...props} dispose={null}>
        <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={1.481}>
          <group position={[0, 0, 0]}>
            <mesh geometry={nodes.Cartridge_low001_mat_default_0.geometry} material={materials.mat_default} position={[0, 0, 0]} />
          </group>
        </group>
      </group>
    );
}

export default Cartridge;