import { toChecksumAddress } from "ethereumjs-util";
import { WANAKA_BUSD, TOPIC0 } from "../index";
const filter = [
    {
        address: toChecksumAddress(WANAKA_BUSD), // HE/BUSD
        topics: [TOPIC0],
    },
];
export default filter;
