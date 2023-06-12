import React, { useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useGLTF, Text } from '@react-three/drei'
import { TextureLoader } from 'three';

const labelUrl = 'https://res.cloudinary.com/dnv6e2zkh/image/upload/w_200/';

const Cartridge = ({ position, index, data }) => {
    const { nodes, materials } = useGLTF('./models/gameboy/scene.gltf');

    let [labelTexture, setLabelTexture] = useState(new TextureLoader().load('loading.png'));

    materials.mat_default.depthWrite = true;
    materials.mat_default.normalScale.set(1, 1);
    materials.mat_default.aoMap = materials.mat_default.roughnessMap.clone();
    
    const [springs, api] = useSpring(
      () => ({
        scale: 0.0,
        config: {
          mass: 1,
          friction: 30,
        }
      }),
      []
    );

    useEffect(() => {
      
      if (data.imageUrl) {
        (async () => {
          setLabelTexture(await new TextureLoader().loadAsync(labelUrl + data.imageUrl));
        })();
      } else {
        setLabelTexture(new TextureLoader().load('placeholder.png'));
      }
    }, [data]);

    useEffect(() => {
      setTimeout(() => {
        api.start({
          scale: 0.75,
        })
      }, 25 * index);
    }, [index, api]);

    const handlePointerEnter = () => {
      api.start({
        scale: 0.6,
      })
    }
  
    const handlePointerLeave = () => {
      api.start({
        scale: 0.75,
      })
    }

    return (
      <group position={position} dispose={null}>
        <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={1.481}>
          <group position={[0, 0, 0]}>
          <animated.mesh
            geometry={nodes.Cartridge_low001_mat_default_0.geometry} 
            material={materials.mat_default} 
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            scale={springs.scale}
            position={[0, 0, 0]}/>
          <animated.mesh 
            scale={springs.scale}
            position={[-.12, .04, .03]}
            rotation={[-Math.PI / 2, 0, -Math.PI ]}>
            <planeGeometry args={[4.1,3.75]}/>
            <meshBasicMaterial 
              map={labelTexture}
              transparent={true}/>
          </animated.mesh>
          </group>
        </group>
        <Text 
          position={[0, -4.2, 0]} 
          maxWidth={7}
          font="fonts/Monocraft-no-ligatures.ttf"
          characters="abcdefghijklmnopqrstuvwxyz0123456789!"
          sdfGlyphSize={128}
          whiteSpace="overflowWrap"
          overflowWrap="break-word"
          textAlign="center" 
          anchorX="center"
          anchorY="top-baseline"
          fontSize={.6}
          lineHeight={1.05}
          color={0xffffff}
          >{data.name}</Text>
      </group>
    );
}

export default Cartridge;