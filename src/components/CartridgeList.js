import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useGLTF, useTexture, Instances } from '@react-three/drei'
import { publish, subscribe, unsubscribe } from '../utils/events';

import Cartridge from '../models/Cartridge';

const CartridgeList = ({ position, romList }) => {

    const { nodes, materials } = useGLTF('./models/gameboy/scene.gltf');

    materials.mat_default.depthWrite = true;
    materials.mat_default.normalScale.set(1, 1);
    materials.mat_default.aoMap = materials.mat_default.roughnessMap.clone();

    const loadingTexture = useTexture('loading.png')
    const placeholderTexture = useTexture('placeholder.png')

    const backdropPosition = [
        position[0] + 13,
        position[1],
        position[2] + 1,
    ];

    let pagePosition = useRef(position[1]);

    const horizontalIncrement = 8.5;
    const verticalIncrement = -10.5;
    const romPerRow = 4;

    const [romLimit, setRomLimit] = useState(20);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const filtredRomList = useMemo(
        () => romList.slice(0, romLimit),
        [romList, romLimit]
    );
    const [springs, api] = useSpring(
        () => ({
          yPosition: position[1],
          backdropOpacity: 0,
          onChange: ({value}) => {
            pagePosition.current = value.yPosition;
          },
          config: {
            mass: 1,
            friction: 30
          }
        }),
        [position]
    );

    useEffect(() => {
        const onScrollWheel = e => {
            const newPosition = pagePosition.current + (e.deltaY > 0 ? 10: -10);

            api.start({
                yPosition: scrollEnabled ? newPosition : pagePosition.current,
            })

            setRomLimit(prev => {
                const scrollAmount = Math.abs(Math.floor((prev - 1) / romPerRow) * verticalIncrement);

                return newPosition >= scrollAmount ? prev + 20 : prev
            });
        }

        window.addEventListener("wheel", onScrollWheel);

        return () => {
            window.removeEventListener("wheel", onScrollWheel); 
        }
    }, [api, pagePosition, verticalIncrement, scrollEnabled]);

    useEffect(() => {
        const onBackToList = () => {
            setScrollEnabled(true);
            
            api.start({
                backdropOpacity: 0,
                config: {
                    friction: 50
                }
            })
        }
        
        subscribe('custom-BackToList', onBackToList);
        subscribe('custom-PlayGame', onBackToList);

        return () => {
            unsubscribe('custom-BackToList', onBackToList);
            unsubscribe('custom-PlayGame', onBackToList);
        }
    }, [api]);

    const onRomOpened = (index) => {
        setScrollEnabled(false);
        api.start({
            backdropOpacity: .75,
            config: {
                friction: 50
            }
        })

        publish('custom-GoToListDetail', romList[index])
    }

    return (
        <>
            <mesh
                position={backdropPosition}
                onPointerOver={(e) => {if (!scrollEnabled) e.stopPropagation()}}
                onClick={(e) => {if (!scrollEnabled) e.stopPropagation()}}
            >
                <planeGeometry args={[60, 50]} />
                <animated.meshBasicMaterial 
                    transparent={true}
                    opacity={springs.backdropOpacity}
                    color={0x111111}/>
            </mesh>
            <animated.group
                position={springs.yPosition.to(y => [position[0], y, position[2]])}>
                <Instances
                    range={romList.length}
                    frustumCulled={false}
                    geometry={nodes.Cartridge_low001_mat_default_0.geometry}
                    material={materials.mat_default}
                >
                    {filtredRomList.map((rom) => (
                        <Cartridge 
                            key={rom.romIndex}
                            data={rom} 
                            textures={[loadingTexture, placeholderTexture]}
                            position={[
                                horizontalIncrement * (rom.romIndex % romPerRow), 
                                verticalIncrement * Math.floor(rom.romIndex / romPerRow), 
                                0
                            ]}
                            {...{onRomOpened}}/>
                    ))}
                </Instances>
            </animated.group>
        </>
    );
}

export default CartridgeList;