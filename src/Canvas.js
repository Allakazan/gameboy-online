import React, { useEffect, Suspense, useCallback } from 'react'

import { Canvas, useThree, useLoader } from '@react-three/fiber'
import { Stats, useGLTF, Preload } from '@react-three/drei'
import { useSpring } from '@react-spring/three'
import { TextureLoader, SRGBColorSpace } from 'three'
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

        return null;
    }


    const SceneBackGround = () => {
        const { scene } = useThree();

        const maintainBgAspect = useCallback((bgWidth, bgHeight) => {

            const windowSize = function (withScrollBar) {
                var wid = 0;
                var hei = 0;
                if (typeof window.innerWidth != "undefined") {
                    wid = window.innerWidth;
                    hei = window.innerHeight;
                } else {
                    if (document.documentElement.clientWidth === 0) {
                        wid = document.body.clientWidth;
                        hei = document.body.clientHeight;
                    } else {
                        wid = document.documentElement.clientWidth;
                        hei = document.documentElement.clientHeight;
                    }
                }
                return {
                    width: wid - (withScrollBar ? wid - document.body.offsetWidth + 1 : 0),
                    height: hei
                };
            };

            if (scene.background) {
                var size = windowSize(true);
                var factor =
                bgWidth / bgHeight / (size.width / size.height);

                scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
                scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;

                scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
                scene.background.repeat.y = factor > 1 ? 1 : factor;
            }
        }, [scene]);

        const backdrop = useLoader(TextureLoader, 'starfield.png');
        backdrop.colorSpace = SRGBColorSpace;
        scene.background = backdrop;

        maintainBgAspect(backdrop.image.width, backdrop.image.height);
        
        useEffect(() => {
            const onResize = () => {
                maintainBgAspect(backdrop.image.width, backdrop.image.height);
            }
            
            window.addEventListener("resize", onResize);

            return () => {
                window.removeEventListener("resize", onResize);
            }
        }, [backdrop, maintainBgAspect])

        return null;
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
            <SceneBackGround/>
            <Preload all />
            <CameraAnimation/>
            <ambientLight color={0xd4d4d4} />
            <directionalLight color={0xffffff} intensity={.5} ></directionalLight>
            <Suspense fallback={null}>
                <GameBoy />
                <GameboyScreen
                canvasRef={emulationCanvasRef}/>
                <CartridgeCatalog position={[50, 2, 0]} />
            </Suspense>
            <Stats className="fps-stats"/>
        </Canvas>
    )
}, () => true)

useGLTF.preload('./models/gameboy/scene.gltf');

export default CanvasApp;