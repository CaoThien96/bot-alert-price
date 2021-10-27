import { toChecksumAddress } from "ethereumjs-util";
import { BFC_BUSD, TOPIC0 } from "../index";
const filter = [
    {
        address: toChecksumAddress(BFC_BUSD), // HE/BUSD
        topics: [TOPIC0],
    },
];
export default filter;
