import React, { useState, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/three'

import Cartridge from '../models/Cartridge';
import { GetRomFiles } from '../services/HttpService';

const CartridgeCatalog = ({ position, ...props }) => {

    const horizontalIncrement = 8.5;
    const verticalIncrement = -10.5;
    const romPerRow = 4;

    
    const [page, setPage] = useState('view');

    const [romList, setRomList] = useState([]);
    //const [romOffset, setRomOffset] = useState(0);
    //const [romLimit, setRomLimit] = useState(80);

    let pagePosition = position[1];

    const [springs, api] = useSpring(
        () => ({
          yPosition: position[1],
          onChange: ({value}) => {
            pagePosition = value.yPosition;
          },
          config: {
            mass: 1,
            friction: 30
          }
        }),
        [position]
    );

    useEffect(() => {
        setRomList([
            {
                "name": "Aa Harimanada (Japan)",
                "fileID": "1hw0mgWxDK0RzOiCSMzSYjkOFpBQvRQ69"
            },
            {
                "name": "Addams Family, The (USA, Europe)",
                "fileID": "1GgvjDae-I8rAut-MyFbmHzaX4s8zhwAp"
            },
            {
                "name": "Addams Family, The (Europe) (En,Fr,De)",
                "fileID": "1bEeWVK1BHM2KNXf_FoJgocSfrhmd5Qme"
            },
            {
                "name": "Addams Family, The (Japan)",
                "fileID": "1Uy5RXzGU-Qy4u-Fh8nZl6suPFa2oXwAK"
            },
        ]);
    }, []);
    
    /*useEffect(() => {
        (async () => {
            const data = await GetRomFiles();

            setRomList(data.slice(romOffset, romLimit));
        })();
    }, [romOffset, romLimit]);*/

    useEffect(() => {
        const onScrollWheel = e => {
            api.start({
                yPosition: pagePosition + (e.deltaY > 0 ? 10: -10),
            })
        }
        window.addEventListener("wheel", onScrollWheel); 

        return () => {
            window.removeEventListener("wheel", onScrollWheel); 
        }
    }, [api, pagePosition]);

    return (
    <animated.group 
        {...props}
        position={springs.yPosition.to(y => [position[0], y, position[2]])}>
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
    </animated.group>
    );
}

export default CartridgeCatalog;