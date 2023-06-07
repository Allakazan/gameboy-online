import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls, useGLTF } from '@react-three/drei'

import GameBoy from './models/Gameboy'
import GameboyScreen from './models/GameboyScreen'

import Emulation from './components/Emulation'
import CartridgeSection from './components/CartridgeSection'

function App() {
    const emulationCanvasRef = useRef();

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Emulation canvasRef={emulationCanvasRef} />
            <Canvas dpr={[1, 2]}
                camera={{
                    fov: 45,
                    aspect: document.documentElement.clientWidth / document.documentElement.clientHeight,
                    position: [15, 0, 35],
                    onUpdate: (c) => c.updateProjectionMatrix()
                }}>
                <color attach="background" args={['black']} />
                <OrbitControls
                    listenToKeyEvents={window}
                    keyEvents={false}
                    enableDamping={true}
                    enablePan={true}
                    target={[15, 0, 0]}
                    dampingFactor={.05}
                    minDistance={10}
                    maxDistance={50}/>
                <ambientLight color={0xd4d4d4} />
                <directionalLight color={0xffffff} intensity={.5} ></directionalLight>
                <GameBoy />
                <GameboyScreen
                    canvasRef={emulationCanvasRef}/>
                <CartridgeSection position={[14, 6, 0]} />
                <Stats />
            </Canvas>
        </div>
    );
}

useGLTF.preload('./models/gameboy/scene.gltf');

export default App;
