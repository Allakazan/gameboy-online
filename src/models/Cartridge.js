import React, { useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { Text } from '@react-three/drei'
import { TextureLoader, Vector2 } from 'three';

const labelUrl = 'https://res.cloudinary.com/dnv6e2zkh/image/upload/';

const Cartridge = ({
    position,
    index,
    data,
    model: [node, material],
    textures: [loadingTexture, placeholderTexture]
  }) => {
    let [labelTexture, setLabelTexture] = useState(loadingTexture);

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
        setLabelTexture(placeholderTexture);
      }
    }, [data, placeholderTexture]);

    useEffect(() => {
      setTimeout(() => {
        api.start({
          scale: 0.75,
        })
      }, 100);
    }, [api]);

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
              geometry={node} 
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              scale={springs.scale}
              position={[0, 0, 0]}>
                <meshStandardMaterial
                    map={material.map}
                    normalMap={material.normalMap}
                    normalScale={new Vector2(1,1)}/>
              </animated.mesh>
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