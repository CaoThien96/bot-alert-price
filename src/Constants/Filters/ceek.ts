import { toChecksumAddress } from "ethereumjs-util";
import { TOPIC0 } from "../index";
const filter = [
    {
        address: toChecksumAddress(
            "0x58f876857a02d6762e0101bb5c46a8c1ed44dc16"
        ), // HE/BUSD
        topics: [TOPIC0],
    },
];
export default filter;
