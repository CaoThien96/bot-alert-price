import React, { useEffect, useState } from "react";
import "./App.css";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { TrackingController } from "./Controllers/TrackingController";
import { JsonRpcProvider } from "ethers/node_modules/@ethersproject/providers";
import {HE_FILTER,BFC_FILTER} from './Constants/Filters/index'
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
    useEffect(()=>{
       
        const bFCTrackingController  = new TrackingController({
            provider:new  JsonRpcProvider("https://bsc-dataseed.binance.org/"),
            filters:BFC_FILTER.default,
            upPrice:2.5,
            downPrice:2
        })
        bFCTrackingController.start()
    },[])
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
