import { ethers } from "ethers";
import MultiCallAbi from "../Constants/Multicall.json";
export type MultiCallResponse<T> = T | null;
export interface Call {
    address: string; // Address of the contract
    name: string; // Function name on the contract (example: balanceOf)
    params?: any[]; // Function params
}

interface MulticallOptions {
    requireSuccess?: boolean;
}
export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/"
);
const getContract = (
    abi: any,
    address: string,
    signer?: ethers.Signer | ethers.providers.Provider
) => {
    const signerOrProvider = signer ?? simpleRpcProvider;
    return new ethers.Contract(address, abi, signerOrProvider);
};
export const getMulticallContract = (
    signer?: ethers.Signer | ethers.providers.Provider
) => {
    return getContract(
        MultiCallAbi,
        "0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B",
        signer
    );
};
const multicall = async <T = any>(abi: any[], calls: Call[]): Promise<T> => {
    try {
        const multi = getMulticallContract();
        const itf = new ethers.utils.Interface(abi);

        const calldata = calls.map((call) => [
            call.address.toLowerCase(),
            itf.encodeFunctionData(call.name, call.params),
        ]);
        const { returnData } = await multi.aggregate(calldata);

        const res = returnData.map((call: any, i: any) =>
            itf.decodeFunctionResult(calls[i].name, call)
        );

        return res;
    } catch (error) {
        throw error;
    }
};

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
export const multicallv2 = async <T = any>(
    abi: any[],
    calls: Call[],
    options: MulticallOptions = { requireSuccess: true }
): Promise<MultiCallResponse<T>> => {
    const { requireSuccess } = options;
    const multi = getMulticallContract();
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => [
        call.address.toLowerCase(),
        itf.encodeFunctionData(call.name, call.params),
    ]);
    const returnData = await multi.tryAggregate(requireSuccess, calldata);
    const res = returnData.map((call: any, i: any) => {
        const [result, data] = call;
        return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
    });

    return res;
};

export default multicall;
