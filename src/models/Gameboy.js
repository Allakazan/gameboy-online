import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { MathUtils } from 'three';
import { WasmBoy } from 'wasmboy'

const GameBoy = (props) => {
    const { nodes, materials } = useGLTF('./models/gameboy/scene.gltf');

    const [springs, api] = useSpring(
        () => ({
            A: 0,
            B: 0,
            SELECT: 0,
            START: 0,
            DPAD: [0, 0],
            config: {
                mass: .5,
                friction: 0,
                clamp: true,
                precision: 0.0001,
            }
        }),
        []
    );

    materials.mat_default.depthWrite = true;
    materials.mat_default.normalScale.set(1,1);
    materials.mat_default.aoMap = materials.mat_default.roughnessMap.clone();

    useEffect(() => {
        WasmBoy.ResponsiveGamepad.onInputsChange(
            [
            'DPAD_UP', 'DPAD_DOWN', 'DPAD_LEFT', 'DPAD_RIGHT', 'A', 'B', 'X', 'Y', 'SELECT', 'START',
            'LEFT_ANALOG_DOWN', 'LEFT_ANALOG_LEFT', 'LEFT_ANALOG_RIGHT', 'LEFT_ANALOG_UP'
            ], 
            state => {
                api.start({ A: state.B || state.Y ? .07 : 0 });
                api.start({ B: state.A || state.X ? .07 : 0 });
                api.start({ SELECT: state.SELECT ? .05 : 0 });
                api.start({ START: state.START ? .05 : 0 });

                setDPadRotation(state);
            }
        );   
    });


    const setDPadRotation = (state) => {
        const rotAmount = 6;
        let xRotation = 0;
        let zRotation = 0;

        if (state.DPAD_UP === true || state.LEFT_ANALOG_UP === true) {
            xRotation = -rotAmount;
        } else if (state.DPAD_DOWN === true || state.LEFT_ANALOG_DOWN === true) {
            xRotation = rotAmount;
        }

        if (state.DPAD_LEFT === true || state.LEFT_ANALOG_LEFT === true) {
            zRotation = -rotAmount;
        } else if (state.DPAD_RIGHT === true || state.LEFT_ANALOG_RIGHT === true) {
            zRotation = rotAmount;
        }

        api.start({
            DPAD: [
                MathUtils.degToRad(xRotation),
                MathUtils.degToRad(zRotation)
            ],
            config: {
                friction: 10,
            },
        });
    }

    return (
        <group {...props} dispose={null}>
            <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.481}>
                <group position={[0, .12, 0]}>
                    <group position={[0.012, 2.816, 0.012]}>
                        <animated.mesh 
                            geometry={nodes.Button_a.geometry}
                            material={materials.mat_default}
                            position={springs.A.to(y => [0, y, 0])} />
                        <animated.mesh
                            geometry={nodes.Button_b.geometry}
                            material={materials.mat_default}
                            position={springs.B.to(y => [0, y, 0])} />
                        <animated.mesh
                            geometry={nodes.Button_d_pad.geometry}
                            material={materials.mat_default}
                            position={[-2.595, -3.126, -2.623]}
                            rotation={springs.DPAD.to((x, z) => [x, 0, z])} />
                        <animated.mesh
                            geometry={nodes.Button_select.geometry}
                            material={materials.mat_default}
                            position={springs.SELECT.to(y => [0, y, 0])} />
                        <animated.mesh
                            geometry={nodes.Button_start.geometry}
                            material={materials.mat_default}
                            position={springs.START.to(y => [0, y, 0])} />
                    </group>
                    <mesh geometry={nodes.game_low_mat_default_0.geometry} material={materials.mat_default} />
                    <mesh geometry={nodes.Box_low_mat_default_0.geometry} material={materials.mat_default} position={[-3.236, 1.25, 7.248]} />
                    <mesh geometry={nodes.Cartridge_low001_mat_default_0.geometry} material={materials.mat_default} visible={false} position={[0.128, 2.524, 3.413]} />
                    <mesh geometry={nodes.Cyl_1_low_mat_default_0.geometry} material={materials.mat_default} position={[-3.924, 0.716, 3.144]} />
                    <mesh geometry={nodes.Cyl_2_low_mat_default_0.geometry} material={materials.mat_default} position={[3.859, 1.439, 2.801]} />
                    <mesh geometry={nodes.Object001_mat_default_0.geometry} material={materials.mat_default} visible={false} />
                    <mesh geometry={nodes.Open_low_mat_default_0.geometry} material={materials.mat_default} position={[0.006, 2.438, -0.822]} />
                </group>
            </group>
        </group>
    );
}

export default GameBoy;