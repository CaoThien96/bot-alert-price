import { toChecksumAddress } from "ethereumjs-util";
import { BFC_BUSD, TOPIC0, BFC_USDC } from "../index";
const filter = [
    {
        address: [toChecksumAddress(BFC_USDC)], // HE/BUSD
        topics: [TOPIC0],
    },
];
export default filter;
