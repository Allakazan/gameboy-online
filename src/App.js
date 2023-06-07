import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls, useGLTF } from '@react-three/drei'

import GameBoy from './models/Gameboy'
import GameboyScreen from './models/GameboyScreen'
import Cartridge from './models/Cartridge'
import Emulation from './components/Emulation'

function App() {
    const emulationCanvasRef = useRef();

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Emulation canvasRef={emulationCanvasRef} />
            <Canvas dpr={[1, 2]}
                camera={{
                    fov: 45,
                    aspect: document.documentElement.clientWidth / document.documentElement.clientHeight,
                    position: [0, 0, 15],
                    onUpdate: (c) => c.updateProjectionMatrix()
                }}>
                <color attach="background" args={['black']} />
                <OrbitControls
                    listenToKeyEvents={window}
                    keyEvents={false}
                    enableDamping={true}
                    enablePan={true}
                    dampingFactor={.05}
                    minDistance={10}
                    maxDistance={50}/>
                <ambientLight color={0xd4d4d4} />
                <directionalLight color={0xffffff} intensity={.5} ></directionalLight>
                <GameBoy />
                <GameboyScreen
                    canvasRef={emulationCanvasRef}/>
                <Cartridge position={[15, 5, 0]} />
                <Cartridge position={[25, 5, 0]} />
                <Cartridge position={[15, -6, 0]} />
                <Cartridge position={[25, -6, 0]} />
                <Stats />
            </Canvas>
        </div>
    );
}

useGLTF.preload('./models/gameboy/scene.gltf');

export default App;
