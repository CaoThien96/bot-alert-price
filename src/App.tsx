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
                {
                    token0: toChecksumAddress(
                        "0xa9d75cc3405f0450955050c520843f99aff8749d"
                    ),
                    symbol0: "WARENA",
                    symbol1: "BUSD",
                    token1: toChecksumAddress(
                        "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                    ),
                    address: toChecksumAddress(
                        "0x65b51bc890C24C0Da163289B68480020222B4332"
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
            ],
            [
                // {
                //     token0: toChecksumAddress(
                //         "0xe0f94ac5462997d2bc57287ac3a3ae4c31345d66"
                //     ),
                //     symbol0: "CEEK",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                //     paths: [
                //         "0xe0f94ac5462997d2bc57287ac3a3ae4c31345d66",
                //         "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                //     ],
                // },
                // {
                //     token0: toChecksumAddress(
                //         "0xba0b46f556633bd742546e4f37d66d416753003b"
                //     ),
                //     symbol0: "AFK",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                // },
                {
                    token0: toChecksumAddress(
                        "0x6cad12b3618a3c7ef1feb6c91fdc3251f58c2a90"
                    ),
                    symbol0: "NINO",
                    symbol1: "BUSD",
                    token1: toChecksumAddress(
                        "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                    ),
                },
                // {
                //     token0: toChecksumAddress(
                //         "0x411ec510c85c9e56271bf4e10364ffa909e685d9"
                //     ),
                //     symbol0: "MOWA",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                // },
                // {
                //     token0: toChecksumAddress(
                //         "0x00e1656e45f18ec6747f5a8496fd39b50b38396d"
                //     ),
                //     symbol0: "BCOIN",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                // },
                // {
                //     token0: toChecksumAddress(
                //         "0x8255e7b6fd3467adf0c092a18ae01879627a9755"
                //     ),
                //     symbol0: "CMC",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                //     paths: [
                //         "0x8255e7b6fd3467adf0c092a18ae01879627a9755",
                //         "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                //     ],
                // },
                // {
                //     token0: toChecksumAddress(
                //         "0x5649e392a1bac3e21672203589adf8f6c99f8db3"
                //     ),
                //     symbol0: "ZDC",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                //     paths: [
                //         "0x5649e392a1bac3e21672203589adf8f6c99f8db3",
                //         "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                //     ],
                // },
                // {
                //     token0: toChecksumAddress(
                //         "0x9d12cc56d133fc5c60e9385b7a92f35a682da0bd"
                //     ),
                //     symbol0: "FGSPORT",
                //     symbol1: "BUSD",
                //     token1: toChecksumAddress(
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                //     ),
                //     paths: [
                //         "0x9d12cc56d133fc5c60e9385b7a92f35a682da0bd",
                //         "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                //         "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                //     ],
                // },
                {
                    token0: toChecksumAddress(
                        "0x74c1815474a75dcb366223107cde1bba4a1a7296"
                    ),
                    symbol0: "OLY",
                    symbol1: "BUSD",
                    token1: toChecksumAddress(
                        "0xe9e7cea3dedca5984780bafc599bd69add087d56"
                    ),
                    paths: [
                        "0x74c1815474a75dcb366223107cde1bba4a1a7296",
                        "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                        "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                    ],
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
