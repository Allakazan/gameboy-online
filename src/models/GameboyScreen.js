import React, {useRef} from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { NearestFilter, SRGBColorSpace, CanvasTexture } from 'three'

const GameboyScreen = ({canvasRef}) => {

    const shaderMatRef = useRef();

    /*useEffect(() => {
        setInterval(() => {

            shaderMatRef.current.uniforms.colorTableIndex = {
                value: shaderMatRef.current.uniforms.colorTableIndex.value === 3 ? 0 :
                shaderMatRef.current.uniforms.colorTableIndex.value + 1
            }
        }, 500);
    })*/

    const paletteTexture = useTexture('colorPalettes.png');
    paletteTexture.magFilter = NearestFilter;

    const canvasTexture = new CanvasTexture(canvasRef.current);

    canvasTexture.magFilter = NearestFilter;
    canvasTexture.colorSpace = SRGBColorSpace;

    useFrame((state, delta) => canvasTexture.needsUpdate = true);

    const vert = /*glsl*/`
        varying vec2 v_uv;

        void main() {
            v_uv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    const frag = /*glsl*/`
        uniform sampler2D cTexture;
        uniform sampler2D colorTable;
        uniform float colorTableSize;
        uniform float colorTableIndex;
        varying vec2 v_uv;

        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec3 mainScreen = texture2D( cTexture, v_uv ).rgb;
            vec4 colorCorrected = LinearTosRGB(vec4(mainScreen, 0.));

            vec2 paletteUv = vec2(colorCorrected.r, clamp(1./colorTableSize * colorTableIndex, 0., 1.));
            vec3 paletteTexture = texture2D( colorTable, paletteUv, -3.5).rgb;
            gl_FragColor = vec4(paletteTexture.rgb, 1.0);
        }
    `;

    return (
        <mesh
            position={[.09, 4.83, 0]}
            scale={[.71, .71, .71]}>
            <planeGeometry args={[10, 9.3]} />
            <shaderMaterial
                attach="material"
                ref={shaderMatRef}
                uniforms={{
                    cTexture: {
                        value: canvasTexture,
                    },
                    colorTable: {
                        value: paletteTexture
                    },
                    colorTableSize: {
                        value: paletteTexture.source.data.height
                    },
                    colorTableIndex: {
                        value: 1
                    }
                }}
                fragmentShader={frag}
                vertexShader={vert}
                />
        </mesh>
    )
}

export default GameboyScreen;
