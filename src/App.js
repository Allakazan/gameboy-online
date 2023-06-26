import React, { useEffect, useRef, useState, useMemo } from 'react'

import CanvasApp from './Canvas';

import UIControls from './components/UIControls'
import Emulation from './components/Emulation'

function App() {
    const emulationCanvasRef = useRef();
    const cameraSpring = useRef(null);

    const cameraPositions = useMemo(() => ({
        console: [0, -2, 35],
        list: [62.93, -2, 35]
    }), [])

    const [pageState, setPageState] = useState(0);

    const goToHome = () => {
        setPageState(0);
    }

    const goToList = () => {
        setPageState(1);
    }

    useEffect(() => {
        if (cameraSpring.current) {
            cameraSpring.current[1].start({
                position: pageState === 0 ? cameraPositions.console : cameraPositions.list
            })
        }
    }, [cameraPositions, cameraSpring, pageState])

    return (
        <>
            <Emulation canvasRef={emulationCanvasRef}/>
            <div style={{ width: "100vw", height: "100vh" }}>
                <UIControls pageState={[pageState, setPageState]} {...{goToHome, goToList}}/>
                <CanvasApp {...{emulationCanvasRef, cameraSpring, cameraPositions}}/>
            </div>
        </>
    );
}


export default App;
