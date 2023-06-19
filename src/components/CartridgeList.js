import React, { useState, useEffect, useMemo } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useGLTF, useTexture } from '@react-three/drei'

import Cartridge from '../models/Cartridge';

const CartridgeList = ({ position, romList }) => {

    const { nodes, materials } = useGLTF('./models/gameboy/scene.gltf');

    materials.mat_default.depthWrite = true;
    materials.mat_default.normalScale.set(1, 1);
    materials.mat_default.aoMap = materials.mat_default.roughnessMap.clone();

    const loadingTexture = useTexture('loading.png')
    const placeholderTexture = useTexture('placeholder.png')

    let pagePosition = position[1];

    const horizontalIncrement = 8.5;
    const verticalIncrement = -10.5;
    const romPerRow = 4;

    //const [romOffset, setRomOffset] = useState(0);
    const [romLimit, setRomLimit] = useState(20);

    const filtredRomList = useMemo(
        () => romList.slice(0, romLimit),
        [romList, romLimit]
    );
    const [springs, api] = useSpring(
        () => ({
          yPosition: position[1],
          onChange: ({value}) => {
            pagePosition = value.yPosition;
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

            const newPosition = pagePosition + (e.deltaY > 0 ? 10: -10);

            api.start({
                yPosition: newPosition,
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
    }, [api, pagePosition, verticalIncrement]);

    return (
    <animated.group
        position={springs.yPosition.to(y => [position[0], y, position[2]])}>
        {filtredRomList.map((rom) => (
            <Cartridge 
                key={rom.romIndex}
                index={rom.romIndex}
                data={rom}
                model={[
                    nodes.Cartridge_low001_mat_default_0.geometry,
                    materials.mat_default
                ]}
                textures={[loadingTexture, placeholderTexture]}
                position={[
                    horizontalIncrement * (rom.romIndex % romPerRow), 
                    verticalIncrement * Math.floor(rom.romIndex / romPerRow), 
                    0
                ]}/>
        ))}
    </animated.group>
    );
}

export default CartridgeList;