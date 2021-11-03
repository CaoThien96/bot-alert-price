import { toChecksumAddress } from "ethereumjs-util";
import { TOPIC0 } from "../index";
const filter = [
    {
        address: toChecksumAddress(
            "0x21db3df90ccbffcc47670dcd083a6ff8cd4751fa"
        ), // HE/BUSD
        topics: [TOPIC0],
    },
];
export default filter;
