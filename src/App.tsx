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
        const controller = new TrackingControllerV3([
            {
                token0: toChecksumAddress(
                    "0x9e5965d28e8d44cae8f9b809396e0931f9df71ca"
                ),
                symbol0: "SIP",
                symbol1: "BUSD",
                token1: toChecksumAddress(
                    "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                ),
                address: toChecksumAddress(
                    "0xe948e8bc62ee35d06a015199954c6c2a99e157af"
                ),
            },
            {
                token0: toChecksumAddress(
                    "0xf3147987a00d35eecc10c731269003ca093740ca"
                ),
                symbol0: "MAT",
                symbol1: "BUSD",
                token1: toChecksumAddress(
                    "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                ),
                address: toChecksumAddress(
                    "0x21db3df90ccbffcc47670dcd083a6ff8cd4751fa"
                ),
            },
            {
                token0: toChecksumAddress(
                    "0x20d39a5130f799b95b55a930e5b7ebc589ea9ed8"
                ),
                symbol0: "HE",
                symbol1: "BUSD",
                token1: toChecksumAddress(
                    "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                ),
                address: toChecksumAddress(
                    "0xd89d71fa750c899ed777a9237e4863c8e18a2576"
                ),
            },
            {
                token0: toChecksumAddress(
                    "0x339c72829ab7dd45c3c52f965e7abe358dd8761e"
                ),
                symbol0: "WAKANA",
                symbol1: "BUSD",
                token1: toChecksumAddress(
                    "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                ),
                address: toChecksumAddress(
                    "0x65b51bc890C24C0Da163289B68480020222B4332"
                ),
            },
        ]);
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
