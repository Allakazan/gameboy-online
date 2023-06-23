import React, { useState, useEffect } from 'react'
import { useGLTF, Instances, Instance, Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three'
import { GetRomFiles } from '../services/HttpService';

const horizontalIncrement = 8.5;
const verticalIncrement = -10.5;
const romPerRow = 4;

const InstancedItem = React.memo(({rom})=> {
    //console.log(rom.romIndex)
    return (
        <group 
            position={[
                horizontalIncrement * (rom.romIndex % romPerRow), 
                verticalIncrement * Math.floor(rom.romIndex / romPerRow), 
                0
            ]}
            scale={0.75}>
            <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={1.481}>
                <group position={[0, 0, 0]}>
                    <Instance/>
                    <mesh 
                        scale={1}
                        position={[-.18, .055, .03]}
                        rotation={[-Math.PI / 2, 0, 0 ]}>
                        <planeGeometry args={[4.1,3.75]}/>
                        <meshBasicMaterial 
                            color={0xff00ff}
                            transparent={true}/>
                    </mesh>
                </group>
            </group>
            <Text 
            position={[0, -5.2, 0]} 
            maxWidth={10}
            font="fonts/Monocraft-no-ligatures.ttf"
            characters="abcdefghijklmnopqrstuvwxyz0123456789!"
            sdfGlyphSize={128}
            whiteSpace="overflowWrap"
            overflowWrap="break-word"
            textAlign="center" 
            anchorX="center"
            anchorY="top-baseline"
            fontSize={.7}
            lineHeight={1.05}
            color={0xffffff}
            >{rom.name}</Text>
        </group>
    )
},({rom: prevRom}, {rom}) => rom.romIndex === prevRom.romIndex);

const CartridgeInstanced = ({ position }) => {

    const { nodes, materials } = useGLTF('./models/gameboy/scene.gltf');

    materials.mat_default.depthWrite = true;
    materials.mat_default.normalScale.set(1, 1);
    materials.mat_default.aoMap = materials.mat_default.roughnessMap.clone();

    const [romList, setRomList] = useState([]);
    const [romLimit, setRomLimit] = useState(20);
    
    const [filtredRomList, setFiltredRomList] = useState([]);

    let pagePosition = position[1];

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
        (async () => {
            const data = await GetRomFiles();

            setRomList(data);
        })();
    }, []);

    useEffect(() => {
        setFiltredRomList(prev => [...prev, ...romList.slice(prev.length, romLimit)]);
    }, [romList, romLimit]);

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
    }, [api, pagePosition]);

    return (
        <animated.group position={springs.yPosition.to(y => [position[0], y, position[2]])}>
            <Instances
                range={romList.length}
                frustumCulled={false}
                geometry={nodes.Cartridge_low001_mat_default_0.geometry}
                material={materials.mat_default}
            >
                {filtredRomList.map((rom) => <InstancedItem key={rom.romIndex} rom={rom}/>)}
            </Instances>
        </animated.group>
    );
}

export default CartridgeInstanced;