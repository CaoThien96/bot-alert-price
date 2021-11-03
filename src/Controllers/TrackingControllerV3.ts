import { formatEther } from "@ethersproject/units";
import axios from "axios";
import BigNumber from "bignumber.js";
import { toChecksumAddress } from "ethereumjs-util";
import { ethers, utils, BigNumber as BN } from "ethers";
import { JsonRpcProvider } from "ethers/node_modules/@ethersproject/providers";

import { maxBy, orderBy } from "lodash";
import ABI from "../Constants/pairAbi.json";
import routerABI from "../Constants/UniswapV2Router02.json";
import { multicallv2 } from "../Utils/multicall";
export default class TrackingControllerV3 {
    provider: any;
    decimal = 4;
    blockTracked: number = 0;
    latestBlock: number = 0;
    filter: any;
    getLogProcessing?: boolean;
    percent: number = 1;
    pairs: any[];
    prices: any[];
    constructor(
        pairs: {
            token0: string;
            symbol0: string;
            price0?: number;
            token1: string;
            price1?: number;
            symbol1: string;
            address: string;
        }[]
    ) {
        this.pairs = pairs;
        this.prices = this.pairs.map((_) => 0);
        this.filter = {
            address: pairs.map((el) => el.address),
            topics: [
                "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
            ],
        };
        this.provider = new JsonRpcProvider(
            "https://bsc-dataseed.binance.org/"
        );
        this.onBlock();
        this.getPrice().then((prices) => this.alertPrice(prices));
    }

    onBlock() {
        this.provider.on("block", async (block: number) => {
            this.latestBlock = block;
            if (!this.getLogProcessing) {
                if (this.blockTracked === 0) {
                    this.blockTracked = this.latestBlock - 1;
                }
                this.getLog();
            }
        });
    }
    async getPrice() {
        const result = await multicallv2(
            routerABI,
            this.pairs.map((pair) => ({
                address: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
                name: "getAmountsOut",
                params: ["1000000000000000000", [pair.token0, pair.token1]],
            }))
        );
        const prices = this.pairs.map((pair, i) => {
            const amounts = result[i]["amounts"];
            console.log(
                `1 ${pair.symbol0} = ${parseFloat(formatEther(amounts[1]))} ${
                    pair.symbol1
                }`
            );
            // this.prices[i] = parseFloat(formatEther(amounts[1]));
            return parseFloat(formatEther(amounts[1]));
        });
        return prices;
    }
    emitPrice?: Function;
    on(name = "onPrice", cb: Function) {
        this.emitPrice = cb;
    }
    alertPrice(prices: number[]) {
        let title = "";

        prices.forEach((price, i) => {
            const newPrice = price;
            title += `${this.pairs[i].symbol0}:` + price.toFixed(3) + "-";
            const oldPrice = this.prices[i];
            if (oldPrice === 0) {
                this.prices[i] = newPrice;
            } else {
                this.prices[i] = newPrice;
                const percent = ((newPrice - oldPrice) * 100) / oldPrice;
                if (percent > 0 && percent >= this.percent) {
                    this.log(
                        `${this.pairs[i].symbol0} giá ${newPrice.toFixed(
                            4
                        )} tăng  ${percent.toFixed(3)}%`
                    );
                } else if (percent < 0 && Math.abs(percent) >= this.percent) {
                    this.log(
                        `${this.pairs[i].symbol0} giá ${newPrice.toFixed(
                            4
                        )} giảm  ${(percent * -1).toFixed(3)}%`
                    );
                }
            }
        });
        document.title = title;
        this.emitPrice && this.emitPrice(title);
    }
    async getLog() {
        try {
            this.getLogProcessing = true;
            this.filter.fromBlock = ethers.BigNumber.from(
                this.blockTracked + 1
            ).toHexString();
            // console.log("query from", this.blockTracked + 1, this.latestBlock);
            const logs: { blockNumber: number }[] = await this.provider.send(
                "eth_getLogs",
                [this.filter]
            );
            if (!logs || (logs && logs.length === 0)) {
                this.getLogProcessing = false;
                return;
            }

            const prices: number[] = await this.getPrice();
            this.alertPrice(prices);

            this.blockTracked = Math.max(
                maxBy(logs, "blockNumber")?.blockNumber || this.blockTracked,
                this.latestBlock
            );
            this.getLogProcessing = false;
        } catch (error) {
            console.info({ error });
        }
    }

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
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
}
