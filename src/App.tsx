import React, { useEffect, useState } from "react";
import "./App.css";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    HE_FILTER,
    BFC_FILTER,
    WANAKA_FILTER,
} from "./Constants/Filters/index";
import TrackingControllerV2 from "./Controllers/TrackingControllerV2";
import { toChecksumAddress } from "ethereumjs-util";
function App() {
    // useEffect(()=>{
    //     const heTrackingController  = new TrackingController({
    //         provider:new  JsonRpcProvider("https://bsc-dataseed.binance.org/"),
    //         filters:HE_FILTER.default,
    //         upPrice:0.4,
    //         downPrice:0.3
    //     })
    //     heTrackingController.start()
    // },[])
    useEffect(() => {
        new TrackingControllerV2({
            filter: BFC_FILTER.default[0],
            address: toChecksumAddress(
                "0x727b531038198E27A1a4d0Fd83e1693c1da94892"
            ),
        });
        new TrackingControllerV2({
            filter: HE_FILTER.default[0],
            address: toChecksumAddress(
                "0x20d39a5130f799b95b55a930e5b7ebc589ea9ed8"
            ),
        });
        new TrackingControllerV2({
            filter: WANAKA_FILTER.default[0],
            address: toChecksumAddress(
                "0x339c72829ab7dd45c3c52f965e7abe358dd8761e"
            ),
        });
        // const bFCTrackingController  = new TrackingController({
        //     provider:new  JsonRpcProvider("https://bsc-dataseed.binance.org/"),
        //     filters:BFC_FILTER.default,
        //     upPrice:2.5,
        //     downPrice:2
        // })
        // bFCTrackingController.start()
    }, []);
    return (
        <div className="App">
            <div>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control placeholder="Enter token address" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Button
                        onClick={(e) => e.preventDefault()}
                        variant="primary"
                        type="submit"
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default App;
