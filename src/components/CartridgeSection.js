import React, { useState, useEffect } from 'react'
import Cartridge from '../models/Cartridge';

const CartridgeSection = (props) => {

    const horizontalIncrement = 8.5;
    const verticalIncrement = -10;
    const romPerRow = 3;

    const [romList, setRomList] = useState([]);

    useEffect(() => {
        setRomList([
            {name: "Mega Man V (USA) (SGB Enhanced)"},
            {name: "Pokemon - Red Version (USA, Europe) (SGB Enhanced)"},
            {name: "Super Mario Land (World) (Rev 1)"},
            {name: "Super Mario Land 2 - 6 Golden Coins (USA, Europe) (Rev 2)"},
            {name: "Game 5"},
            {name: "Game 6"}
        ]);
    }, []);

    return (
    <group {...props} dispose={null}>
        {romList.map((rom, romIndex) => (
            <Cartridge 
                key={romIndex}
                index={romIndex}
                data={rom}
                position={[
                    horizontalIncrement * (romIndex % romPerRow), 
                    verticalIncrement * Math.floor(romIndex / romPerRow), 
                    0
                ]} />
        ))}
    </group>
    );
}

export default CartridgeSection;