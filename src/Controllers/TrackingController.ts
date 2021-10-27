import { PollingController } from "./PollingController";
import { maxBy } from "lodash";
import { utils } from "ethers";
import { toChecksumAddress } from "ethereumjs-util";
import BigNumber from "bignumber.js";
import { formatEther } from "@ethersproject/units";
import axios from "axios";
interface FILTER {
    address: string; // HE/BUSD
    topics: any[];
    fromBlock?: number;
}
export class TrackingController extends PollingController {
    provider: any;
    blockTracked: number = 0;
    latestBlock: number;

    filters: FILTER[];
    upPrice: any = 0.4;
    downPrice: any = 0.3;
    constructor({
        provider,
        filters,
        upPrice,
        downPrice,
    }: {
        provider: any;
        filters: FILTER[];
        upPrice: any;
        downPrice: any;
    }) {
        super();
        this.provider = provider;
        this.filters = filters;
        this.latestBlock = 0;
        this.upPrice = upPrice;
        this.downPrice = downPrice;
        this.onBlock();
    }
    onBlock() {
        this.provider.on("block", (block: number) => {
            this.latestBlock = block;
            /**
             * When querying or discovered block is larger than latestBlock, latestBlock is updated but not run action start()
             */
        });
    }
    async start() {
        const latestBlock = await this.provider.getBlockNumber();
        this.latestBlock = latestBlock;
        this.blockTracked = this.latestBlock - 1;
        this.startPoll();
    }
    pollAction = async () => {
        try {
            const tasks = this.filters.map((filter) => {
                return (async () => {
                    filter.fromBlock = this.blockTracked + 1;
                    const logs = await this.provider.getLogs(filter);
                    return logs;
                })();
            });
            const logs = await Promise.all(tasks);
            const result = logs.flat();
            if (!result.length) return;
            const maxLogNumber =
                maxBy(result, "blockNumber") || Number.NEGATIVE_INFINITY;
            this.blockTracked = Math.max(
                this.latestBlock,
                maxLogNumber.blockNumber
            );
            this.handleLogs(result);
        } catch (error) {
            console.log("errr", error);
        }
    };
    log(data: any) {
        const instance = axios.create({
            baseURL: "https://api.telegram.org/",
            timeout: 1000,
            headers: { "X-Custom-Header": "foobar" },
        });
        const api = `/bot2067736235:AAHZGJgJkjgTZiUhHjC9rubkBd1z-Hc-PM8/sendMessage?chat_id=873815426&text=${
            typeof data == "string" ? data : JSON.stringify(data)
        }`;
        instance
            .get(api)
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
    prePrice: BigNumber = new BigNumber(0);
    alertPrice(price: BigNumber) {
        if (price.gt(this.upPrice)) {
            this.prePrice &&
                price
                    .minus(this.prePrice)
                    .abs()
                    .div(this.prePrice)
                    .times(100)
                    .gt(1) &&
                this.log(`Tăng ${price.toString()}`);
        }
        if (price.lt(this.downPrice)) {
            // this.log(price.toString());
            this.prePrice &&
                price
                    .minus(this.prePrice)
                    .abs()
                    .div(this.prePrice)
                    .times(100)
                    .gt(1) &&
                this.log(`Giảm ${price.toString()}`);
        }
        this.prePrice = price;
    }
    handleLogs(result: any[]) {
        result.map((log: any) => {
            const { address, data, transactionHash } = log;

            const abiCoder = new utils.AbiCoder();
            const result = abiCoder.decode(
                ["uint", "uint", "uint", "uint"],
                data
            );
            const amount0In = result[0]; //BFC
            const amount1In = result[1]; //USDC
            const amount0Out = result[2]; //BDC
            const amount1Out = result[3]; //BUSD
            // console.log({
            //     amount0In: amount0In.toString(),
            //     amount1In: amount1In.toString(),
            //     amount0Out: amount0Out.toString(),
            //     amount1Out: amount1Out.toString(),
            //     transactionHash,
            // });
            // console.log({
            //     amount0In: formatEther(amount0In),
            //     amount1In: formatEther(amount1In),
            //     amount0Out: formatEther(amount0Out),
            //     amount1Out: formatEther(amount1Out),
            //     transactionHash,
            // });
            if (address == toChecksumAddress(this.filters[0].address)) {
                // Sell
                if (amount0In.gt(0) && amount1Out.gt(0)) {
                    const price = new BigNumber(amount0In.toString()).div(
                        new BigNumber(amount1Out.toString())
                    );
                    console.log(
                        `Sell ${formatEther(
                            amount1Out
                        )} BFC with price ${price.toJSON()} BUSD`
                    );
                    document.title = price.toJSON();
                    this.alertPrice(price);
                } else {
                    const price = new BigNumber(amount0Out.toString()).div(
                        new BigNumber(amount1In.toString())
                    );
                    console.log(
                        `Buy ${formatEther(
                            amount1In
                        )} BFC with price ${price.toJSON()} BUSD`
                    );
                    document.title = price.toJSON();
                    this.alertPrice(price);
                }
            }
        });
    }
}
