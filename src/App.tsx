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
            [
                // {
                //     token0: toChecksumAddress(
                //         "0x9e5965d28e8d44cae8f9b809396e0931f9df71ca"
                //     ),
                //     symbol0: "SIP",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                //     address: toChecksumAddress(
                //         "0xe948e8bc62ee35d06a015199954c6c2a99e157af"
                //     ),
                // },
            ],
            [
                {
                    token0: toChecksumAddress(
                        "0xe0f94ac5462997d2bc57287ac3a3ae4c31345d66"
                    ),
                    symbol0: "CEEK",
                    symbol1: "BUSD",
                    token1: toChecksumAddress(
                        "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                    ),
                    paths: [
                        "0xe0f94ac5462997d2bc57287ac3a3ae4c31345d66",
                        "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                        "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                    ],
                },

                {
                    token0: toChecksumAddress(
                        "0x549cc5df432cdbaebc8b9158a6bdfe1cbd0ba16d"
                    ),
                    symbol0: "HWL",
                    symbol1: "BUSD",
                    token1: toChecksumAddress(
                        "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                    ),
                },
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
