import { toChecksumAddress } from "ethereumjs-util";
import { HE_BNB, HE_BUSD, TOPIC0 } from "../index";
const filter = [
    {
        address: toChecksumAddress(HE_BUSD), // HE/BUSD
        topics: [TOPIC0],
    },
    {
        address: toChecksumAddress(HE_BNB), // HE/WBNB
        topics: [TOPIC0],
    },
];
export default filter;
