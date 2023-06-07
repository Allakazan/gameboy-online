import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MathUtils } from 'three';
import { WasmBoy } from 'wasmboy'

const GameBoy = (props) => {
    const { nodes, materials } = useGLTF('./models/gameboy/scene.gltf');

    const btnRef = useRef({});

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
                btnRef.current.B.position.y = state.B || state.Y ? .07 : 0;
                btnRef.current.A.position.y = state.A || state.X ? .07 : 0;
                btnRef.current.SELECT.position.y = state.SELECT ? .05 : 0;
                btnRef.current.START.position.y = state.START ? .05 : 0;

                setDPadRotation(state);
            }
        );   
    });

    const setDPadRotation = (state) => {
        const rotAmount = 6;
        let xRotation = 0;
        let yRotation = 0;

        if (state.DPAD_UP === true || state.LEFT_ANALOG_UP === true) {
            xRotation = -rotAmount;
        } else if (state.DPAD_DOWN === true || state.LEFT_ANALOG_DOWN === true) {
            xRotation = rotAmount;
        }

        if (state.DPAD_LEFT === true || state.LEFT_ANALOG_LEFT === true) {
            yRotation = -rotAmount;
        } else if (state.DPAD_RIGHT === true || state.LEFT_ANALOG_RIGHT === true) {
            yRotation = rotAmount;
        }

        btnRef.current.DPAD.rotation.x = MathUtils.degToRad(xRotation);
        btnRef.current.DPAD.rotation.z = MathUtils.degToRad(yRotation);
    }

    return (
        <group {...props} dispose={null}>
            <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.481}>
                <group position={[0, .12, 0]}>
                    <group position={[0.012, 2.816, 0.012]}>
                        <mesh geometry={nodes.Button_a.geometry} material={materials.mat_default} ref={e => btnRef.current.A = e}/>
                        <mesh geometry={nodes.Button_b.geometry} material={materials.mat_default} ref={e => btnRef.current.B = e}/>
                        <mesh geometry={nodes.Button_d_pad.geometry} material={materials.mat_default} position={[-2.595, -3.126, -2.623]} ref={e => btnRef.current.DPAD = e}/>
                        <mesh geometry={nodes.Button_select.geometry} material={materials.mat_default} ref={e => btnRef.current.SELECT = e}/>
                        <mesh geometry={nodes.Button_start.geometry} material={materials.mat_default} ref={e => btnRef.current.START = e}/>
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