import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats, useGLTF } from '@react-three/drei'

import GameBoy from './models/Gameboy'
import GameboyScreen from './models/GameboyScreen'

import UIControls from './components/UIControls'
import Emulation from './components/Emulation'
import CartridgeCatalog from './components/CartridgeCatalog'

function App() {
    const emulationCanvasRef = useRef();

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Emulation canvasRef={emulationCanvasRef} />
            <UIControls/>
            <Canvas dpr={[1, 2]}
                camera={{
                    fov: 45,
                    aspect: document.documentElement.clientWidth / document.documentElement.clientHeight,
                    position: [30+ 13.04, 0, 35],
                    rotation: [0,0,0],
                    onUpdate: (c) => c.updateProjectionMatrix()
                }}>
                <color attach="background" args={['black']} />
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
                <GameBoy />
                <GameboyScreen
                    canvasRef={emulationCanvasRef}/>
                <CartridgeCatalog position={[30, 2, 0]} />
                <Stats />
            </Canvas>
        </div>
    );
}

useGLTF.preload('./models/gameboy/scene.gltf');

export default App;
