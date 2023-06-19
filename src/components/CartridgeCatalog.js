import React, { useState, useEffect } from 'react'
import CartridgeList from './CartridgeList';

import { GetRomFiles } from '../services/HttpService';

const CartridgeCatalog = ({ position }) => {

    const [romList, setRomList] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await GetRomFiles();

            setRomList(data);
        })();
    }, []);

    return (
        <CartridgeList
            {...{position, romList}}/>
    );
}

export default CartridgeCatalog;