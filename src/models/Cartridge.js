import React, { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { Text, Instance } from '@react-three/drei'
import { MathUtils } from 'three';
import { GetThumbnail } from '../services/ImageService';
import { subscribe, unsubscribe } from '../utils/events';

const Cartridge = React.memo(({
    position,
    data,
    textures: [loadingTexture, placeholderTexture],
    onRomOpened
}) => {
    const groupRef = useRef()
    const instanceRef = useRef()
    const labelRef = useRef()
    const textRef = useRef()

    let [labelTexture, setLabelTexture] = useState(loadingTexture);
    const [hovered, setHovered] = useState(false);
    const [selected, setSelected] = useState(false);
    const [mouseData, setMouseData] = useState({x: 0, y: 0});

    useEffect(() => {
        if (data.imageUrl) {
            (async () => {
                setLabelTexture(await GetThumbnail(data.imageUrl, data.imageFromIGDB ? 'igdb' : 'cloudinary'));
            })();
        } else {
            setLabelTexture(placeholderTexture);
        }
    }, [data, placeholderTexture]);

    const range = (value, in_min, in_max, out_min, out_max) => {
        return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    useEffect(() => {
        const onMouseMove = e => {
            const {clientX, clientY} = e;

            setMouseData({
                x: range(clientX, 0, window.innerWidth, 1, -1) * .5,
                y: range(clientY, 0, window.innerHeight, 1, -1) * .7
            });
        }

        const onBackToList = () => {
            setSelected(false);
        }
        
        if (selected) {
            window.addEventListener('mousemove', onMouseMove);
            subscribe('custom-BackToList', onBackToList);
            subscribe('custom-PlayGame', onBackToList);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            unsubscribe('custom-BackToList', onBackToList);
            unsubscribe('custom-PlayGame', onBackToList);
        }
    }, [data, selected]);

    useFrame(({camera}) => {
        const newScale = MathUtils.lerp(instanceRef.current.scale.z, hovered && !selected ? .6 : .75, 0.17);

        instanceRef.current.scale.set(newScale, newScale, newScale)
        labelRef.current.scale.set(newScale, newScale, newScale)

        const parentPos = groupRef.current.parent.parent.position;

        groupRef.current.position.set(
            MathUtils.lerp(groupRef.current.position.x, selected ? camera.position.x - parentPos.x - 5 : position[0], .05),
            MathUtils.lerp(groupRef.current.position.y, selected ? camera.position.y - parentPos.y : position[1], .05),
            MathUtils.lerp(groupRef.current.position.z, selected ? 17 : 0, .05)
        )

        textRef.current.fillOpacity = MathUtils.lerp(textRef.current.fillOpacity, selected ? 0 : 1, .2);

        if (selected) {
            groupRef.current.rotation.set(
                MathUtils.lerp(groupRef.current.rotation.x, mouseData.y, .05), 
                MathUtils.lerp(groupRef.current.rotation.y, mouseData.x, .05), 
                0)
        } else {
            groupRef.current.rotation.set(
                MathUtils.lerp(groupRef.current.rotation.x, 0, .05), 
                MathUtils.lerp(groupRef.current.rotation.y, 0, .05), 
            0);
        }
    })

    return (
        <group position={position} dispose={null} ref={groupRef} >
            <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={1.481}>
                <group position={[0, 0, 0]}>
                    <Instance 
                        ref={instanceRef}
                        scale={0.75}
                        onPointerOver={(e) => {e.stopPropagation(); setHovered(true)}}
                        onPointerOut={() => setHovered(false)}
                        onClick={() => {
                            if (!selected) {
                                setSelected(true); 
                                onRomOpened(data.romIndex);
                            }
                        }}
                        />
                    <mesh 
                        ref={labelRef}
                        scale={.75}
                        frustumCulled={true}
                        position={[-.12, .06, .03]}
                        rotation={[-Math.PI / 2, 0, -Math.PI ]}>
                        <planeGeometry args={[4.1,3.75]}/>
                        <meshStandardMaterial 
                            map={labelTexture}
                            roughness={.3}
                            alphaTest={0.4}
                            toneMapped={true}
                            transparent={true}/>
                    </mesh>
                </group>
            </group>
            <Text 
                ref={textRef}
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
}, ({ data: prevData }, { data }) => data.fileID === prevData.fileID);

export default Cartridge;