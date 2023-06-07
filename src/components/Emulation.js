import React, { useEffect } from 'react'
import { WasmBoy } from 'wasmboy'

function Emulation({canvasRef}) {

    const WasmBoyOptions = {
        headless: false,
        isGbcEnabled: false,
        isGbcColorizationEnabled: false,
        isAudioEnabled: true,
        frameSkip: 1,
        audioBatchProcessing: true,
        timersBatchProcessing: false,
        audioAccumulateSamples: true,
        graphicsBatchProcessing: false,
        graphicsDisableScanlineRendering: false,
        tileRendering: true,
        tileCaching: true,
        gameboyFPSCap: 60,
        updateGraphicsCallback: false,
        updateAudioCallback: false,
        saveStateCallback: false
    }

    useEffect(() => {

        const loadEmulator = async () => {
            try {
                await WasmBoy.config(WasmBoyOptions, canvasRef.current);
                canvasRef.current.style.display = 'none';

                console.log('WasmBoy is configured!');
            } catch (error) {
                console.error('Error Configuring WasmBoy...');
            }
        }
        
        loadEmulator();
    });

    const onLoadRom = async e => {
        try {
            await WasmBoy.loadROM(e.target.files[0]);
            await WasmBoy.play();
            canvasRef.current.style.display = 'none';
            
            console.log('WasmBoy is configured!');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{position: 'fixed', zIndex: 20, left: '85px'}}>
            <input 
                type="file"
                onChange={onLoadRom}/>
            <canvas ref={canvasRef} width="160" height="144"/>
        </div>
    )
}

export default Emulation;