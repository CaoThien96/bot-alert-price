import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    HE_FILTER,
    BFC_FILTER,
    WANAKA_FILTER,
    MAT_FILTER,
    SIP_FILTER,
    CEEK_FILTER,
} from "./Constants/Filters/index";
import TrackingControllerV2 from "./Controllers/TrackingControllerV2";
import { toChecksumAddress } from "ethereumjs-util";
import TrackingControllerV3 from "./Controllers/TrackingControllerV3";

function App() {
    const [title, setTitle] = useState("");
    useEffect(() => {
        const controller = new TrackingControllerV3(
            [],
            [
                {
                    token0: toChecksumAddress(
                        "0x12bb890508c125661e03b09ec06e404bc9289040"
                    ),
                    symbol0: "RACA",
                    symbol1: "BUSD",
                    token1: toChecksumAddress(
                        "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                    ),
                    maxPrice: 0.0096,
                    minPrice: 0.0091,
                },
                // {
                //     token0: toChecksumAddress(
                //         "0x20d39a5130f799b95b55a930e5b7ebc589ea9ed8"
                //     ),
                //     symbol0: "HE",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
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
        controller.on("onPrice", (title: string) => {
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
