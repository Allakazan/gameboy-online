import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
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
    const [romListFiltered, setRomListFiltered] = useState(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const paginatedRomList = useMemo(
        () => (romListFiltered === null ? romList : romListFiltered).slice(0, romLimit),
        [romList, romListFiltered, romLimit]
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

    const backToTop = useCallback(() => {
        api.start({
            yPosition: position[1],
            immediate: true
        })
    }, [api, position]);

    useEffect(() => {

        const normalizeString = str =>
            str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();


        const onRomSearch = ({detail: {search, region}}) => {
            const normalizedValue = normalizeString(search);

            setRomLimit(20);

            let filteredList = [...romList];

            if (normalizedValue.length) {
                filteredList = filteredList
                    .filter(rom => normalizeString(rom.name).includes(normalizedValue))
            }

            if (region !== 'all') {
                filteredList = filteredList
                .filter(rom => rom.countries.includes(region))
            }

            setRomListFiltered(filteredList.map((data, index) => ({...data, romIndex: index})))
            backToTop();
        }
        
        subscribe('custom-RomSearch', onRomSearch);

        return () => {
            unsubscribe('custom-RomSearch', onRomSearch);
        }
    }, [romList, backToTop]);

    const onRomOpened = (index) => {
        setScrollEnabled(false);
        api.start({
            backdropOpacity: .75,
            config: {
                friction: 50
            }
        })

        publish('custom-GoToListDetail', (romListFiltered === null ? romList : romListFiltered)[index])
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
                    {paginatedRomList.map((rom) => (
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