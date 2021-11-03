import { toChecksumAddress } from "ethereumjs-util";
import { TOPIC0 } from "../index";
const filter = [
    {
        address: toChecksumAddress(
            "0xe948e8bc62ee35d06a015199954c6c2a99e157af"
        ), // HE/BUSD
        topics: [TOPIC0],
    },
];
export default filter;
