import React, { useEffect, Suspense } from 'react'

import { Canvas, useThree } from '@react-three/fiber'
import { Stats, useGLTF, Preload } from '@react-three/drei'
import { useSpring } from '@react-spring/three'
import { subscribe, unsubscribe } from './utils/events'

import GameBoy from './models/Gameboy'
import GameboyScreen from './models/GameboyScreen'

import CartridgeCatalog from './components/CartridgeCatalog'

const CanvasApp = React.memo(({emulationCanvasRef}) => {

    const cameraPositions = {
        console: [0, -2, 35],
        consolePlay: [0, 0, 26],
        list: [62.93, -2, 35]
    }

    const CameraAnimation = () => {

        const { camera } = useThree()

        const [, api] = useSpring(
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

        useEffect(() => {
            const onChangeToHome = () => {
                api.start({
                    position: cameraPositions.console
                })
            }

            const onChangeToList = () => {
                api.start({
                    position: cameraPositions.list
                })
            }

            const onChangePlayGame = () => {
                api.start({
                    position: cameraPositions.consolePlay
                })
            }

            subscribe('custom-GoToHome', onChangeToHome)
            subscribe('custom-GoToList', onChangeToList)
            subscribe('custom-PlayGame', onChangePlayGame)

            return () => {
                unsubscribe('custom-GoToHome', onChangeToHome)
                unsubscribe('custom-GoToList', onChangeToList)
                unsubscribe('custom-PlayGame', onChangePlayGame)
            }
        }, [api]);

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
}, () => true)

useGLTF.preload('./models/gameboy/scene.gltf');

export default CanvasApp;