import React, { useEffect } from 'react'
import { WasmBoy } from 'wasmboy'
import { GetFile } from '../services/HttpService';
import { subscribe, unsubscribe } from '../utils/events';

function Emulation({canvasRef}) {

    useEffect(() => {

        let gainFilter = undefined;

        // Web Audio API callback to add the volume settings
        const updateAudioCallback = (audioContext, audioBufferSourceNode) => {
          if(!gainFilter) {
            gainFilter = audioContext.createGain();
            gainFilter.gain.value = .5;
          }
        
          audioBufferSourceNode.connect(gainFilter);
        
          return gainFilter;
        }

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
            updateAudioCallback,
            saveStateCallback: false
        }

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

        const onPlayGame = async ({detail}) => {
            const blobFile = await GetFile(detail);
            const file = new File([blobFile], 'rom.gb', {
                type: blobFile.type,
            });

            await WasmBoy.loadROM(file);
            await WasmBoy.play();
            canvasRef.current.style.display = 'none';
        }
        
        subscribe('custom-PlayGame', onPlayGame);

        return () => unsubscribe('custom-PlayGame', onPlayGame);
    }, [canvasRef]);

    return (
        <div style={{position: 'fixed', zIndex: 20, left: '85px'}}>
            <canvas ref={canvasRef} width="160" height="144"/>
        </div>
    )
}

export default Emulation;