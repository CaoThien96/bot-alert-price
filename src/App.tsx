import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    HE_FILTER,
    BFC_FILTER,
    WANAKA_FILTER,
    MAT_FILTER,
    SIP_FILTER,
    CEEK_FILTER,
} from './Constants/Filters/index';
import TrackingControllerV2 from './Controllers/TrackingControllerV2';
import { toChecksumAddress } from 'ethereumjs-util';
import TrackingControllerV3 from './Controllers/TrackingControllerV3';
import TrackingV4 from './Controllers/TrackingV4';
function App() {
    const [title, setTitle] = useState('');
    useEffect(() => {
        // new TrackingV4([{
        //     token0:'0x5649e392a1bac3e21672203589adf8f6c99f8db3',
        //     token1:'0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        //     symbol0:'ZDC',
        //     symbol1:'WBNB',
        //     address:'0x13c921afc19ddf5803a92c78751a49cfd4f5fdf8'
        // },
        // {
        //     token0:'0x5649e392a1bac3e21672203589adf8f6c99f8db3',
        //     token1:'0xe9e7cea3dedca5984780bafc599bd69add087d56',
        //     symbol0:'ZDC',
        //     symbol1:'BUSD',
        //     address:'0x5f7a2a0a32c0616898ca7957c1d58bc92a7e2f6f'
        // }])
        const controller = new TrackingControllerV3(
            [],
            [
                // {
                //     token0: toChecksumAddress(
                //         '0x9a26e6d24df036b0b015016d1b55011c19e76c87'
                //     ),
                //     symbol0: 'DMS',
                //     symbol1: 'BUSD',
                //     token1: toChecksumAddress(
                //         '0x55d398326f99059ff775485246999027b3197955'
                //     ),
                //     maxPrice: 1,
                //     minPrice: 0.3,
                //     paths: [
                //         '0x55d398326f99059ff775485246999027b3197955',
                //         '0x9a26e6d24df036b0b015016d1b55011c19e76c87',
                //     ],
                //     isBuy: true,
                // },
                {
                    token0: toChecksumAddress(
                        '0xf66a8a197d5cb0e2799d79be115208899332a0ba'
                    ),
                    symbol0: 'CB',
                    symbol1: 'BUSD',
                    token1: toChecksumAddress(
                        '0x55d398326f99059ff775485246999027b3197955'
                    ),
                    maxPrice: 1.2,
                    minPrice: 0.65,
                    paths: [
                        '0xf66a8a197d5cb0e2799d79be115208899332a0ba',

                        '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
                        '0x55d398326f99059ff775485246999027b3197955',

                    ],
                    // isBuy: true,
                },
                // {
                //     token0: toChecksumAddress(
                //         '0x74c1815474a75dcb366223107cde1bba4a1a7296'
                //     ),
                //     symbol0: 'OLY',
                //     symbol1: 'BUSD',
                //     token1: toChecksumAddress(
                //         '0x55d398326f99059ff775485246999027b3197955'
                //     ),
                //     maxPrice: 1,
                //     minPrice: 0.2,
                //     paths: [
                //         '0x55d398326f99059ff775485246999027b3197955',
                //         '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
                //         '0x74c1815474a75dcb366223107cde1bba4a1a7296',
                //     ],
                //     isBuy: true,
                // },
                // {
                //     token0: toChecksumAddress(
                //         "0xf3147987a00d35eecc10c731269003ca093740ca"
                //     ),
                //     symbol0: "MAT",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                // },
            ]
        );
        controller.on('onPrice', (title: string) => {
            console.log(title)
            setTitle(title);
        });
    }, []);
    return (
        <div className="App">
            <div>{title}</div>
        </div>
    );
}

export default App;
