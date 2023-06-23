import React, { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { Text, Instance } from '@react-three/drei'
import { TextureLoader, MathUtils } from 'three';

const labelUrl = 'https://res.cloudinary.com/dnv6e2zkh/image/upload/';

const Cartridge = React.memo(({
    position,
    data,
    textures: [loadingTexture, placeholderTexture]
}) => {
    const instanceRef = useRef()
    const labelRef = useRef()

    let [labelTexture, setLabelTexture] = useState(loadingTexture);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (data.imageUrl) {
            (async () => {
                setLabelTexture(await new TextureLoader().loadAsync(labelUrl + data.imageUrl));
            })();
        } else {
            setLabelTexture(placeholderTexture);
        }
    }, [data, placeholderTexture]);

    useFrame((state) => {
        const newScale = MathUtils.lerp(instanceRef.current.scale.z, hovered ? .6 : .75, 0.17);

        instanceRef.current.scale.set(newScale, newScale, newScale)
        labelRef.current.scale.set(newScale, newScale, newScale)
    })

    return (
        <group position={position} dispose={null} >
            <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={1.481}>
                <group position={[0, 0, 0]}>
                    <Instance 
                        ref={instanceRef}
                        scale={0.75}
                        onPointerOver={(e) => {e.stopPropagation(); setHovered(true)}}
                        onPointerOut={() => setHovered(false)}/>
                    <mesh 
                        ref={labelRef}
                        scale={.75}
                        frustumCulled={true}
                        position={[-.12, .04, .03]}
                        rotation={[-Math.PI / 2, 0, -Math.PI ]}>
                        <planeGeometry args={[4.1,3.75]}/>
                        <meshBasicMaterial 
                            map={labelTexture}
                            alphaTest={0.4}
                            toneMapped={false}
                            transparent={true}/>
                    </mesh>
                </group>
            </group>
            <Text 
                position={[0, -4.2, 0]} 
                maxWidth={8}
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
                >
                    {data.name}
                </Text>
        </group>
    );
}, ({ data: prevData }, { data }) => data.romIndex === prevData.romIndex);

export default Cartridge;