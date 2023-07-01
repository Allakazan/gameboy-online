import React, { useRef } from 'react'

import CanvasApp from './Canvas';

import UIControls from './components/UIControls'
import Emulation from './components/Emulation'

function App() {
    const emulationCanvasRef = useRef();

    return (
        <>
            <Emulation canvasRef={emulationCanvasRef}/>
            <div style={{ width: "100vw", height: "100vh" }}>
                <UIControls/>
                <CanvasApp {...{emulationCanvasRef}}/>
            </div>
        </>
    );
}


export default App;
