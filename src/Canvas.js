import React, { Suspense } from 'react'

import { Canvas, useThree } from '@react-three/fiber'
import { Stats, useGLTF, Preload } from '@react-three/drei'
import { useSpring } from '@react-spring/three'

import GameBoy from './models/Gameboy'
import GameboyScreen from './models/GameboyScreen'

import CartridgeCatalog from './components/CartridgeCatalog'

const CanvasApp = React.memo(({emulationCanvasRef, cameraSpring, cameraPositions}) => {

    const CameraAnimation = () => {

        const { camera } = useThree()

        cameraSpring.current = useSpring(
            () => ({
                position: cameraPositions.console,
                config: {
                    mass: 1,
                    friction: 28
                },
                onChange: ({value: {position}}) => {
                    camera.position.set(position[0], position[1], position[2]);
                }
            })
        )

        return (<group></group>)
    }

    return (
        <Canvas dpr={[1, 2]}
            camera={{
                fov: 45,
                aspect: document.documentElement.clientWidth / document.documentElement.clientHeight,
                position: cameraPositions.console,
                rotation: [0,0,0],
                onUpdate: (c) => c.updateProjectionMatrix()
            }}>
            <color attach="background" args={['black']} />
            <Preload all />
            <CameraAnimation/>
            {/*<OrbitControls
                listenToKeyEvents={window}
                keyEvents={false}
                enableDamping={true}
                enablePan={true}
                target={[14, 6, 0]}
                dampingFactor={.05}
                minDistance={10}
                maxDistance={50}/>*/}
            <ambientLight color={0xd4d4d4} />
            <directionalLight color={0xffffff} intensity={.5} ></directionalLight>
            <Suspense fallback={null}>
                <GameBoy />
            </Suspense>
            <GameboyScreen
                canvasRef={emulationCanvasRef}/>
            <CartridgeCatalog position={[50, 2, 0]} />
            <Stats className="fps-stats"/>
        </Canvas>
    )
})

useGLTF.preload('./models/gameboy/scene.gltf');

export default CanvasApp;