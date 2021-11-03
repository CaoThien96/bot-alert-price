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
export default class TrackingControllerV2 {
    provider: any;
    decimal = 4;
    blockTracked: number = 0;
    latestBlock: number = 0;
    filter: any;
    address: string;
    getLogProcessing?: boolean;
    percent: number = 0.5;
    constructor({ filter, address }: { filter: any; address: string }) {
        this.filter = filter;
        this.provider = new JsonRpcProvider(
            "https://bsc-dataseed.binance.org/"
        );
        this.address = address;

        this.getInfoPair();
    }
    emitPrice?: Function;
    on(name = "onPrice", cb: Function) {
        this.emitPrice = cb;
    }
    token0?: {
        symbol: string;
        address: string;
    };
    token1?: {
        symbol: string;
        address: string;
    };
    async getInfoPair() {
        const address = Array.isArray(this.filter.address)
            ? this.filter.address[0]
            : this.filter.address;
        const pairContract = new ethers.Contract(
            toChecksumAddress(address),
            ABI,
            this.provider
        );

        const [token0, token1] = await Promise.all([
            pairContract.token0(),
            pairContract.token1(),
        ]);
        const token0Contract = new ethers.Contract(
            toChecksumAddress(token0),
            ABI,
            this.provider
        );
        const token1Contract = new ethers.Contract(
            toChecksumAddress(token1),
            ABI,
            this.provider
        );
        const [symbol0, symbol1] = await Promise.all([
            token0Contract.symbol(),
            token1Contract.symbol(),
        ]);

        this.token0 = {
            symbol: symbol0,
            address: toChecksumAddress(token0),
        };
        this.token1 = {
            symbol: symbol1,
            address: toChecksumAddress(token1),
        };
        const price = await this.getPrice();
        this.alertPrice(price);
        this.onBlock();

        console.log({
            token0,
            token1,
            symbol0,
            symbol1,
        });
    }
    onBlock() {
        this.provider.on("block", async (block: number) => {
            this.latestBlock = block;
            if (!this.getLogProcessing) {
                if (this.blockTracked === 0) {
                    this.blockTracked = this.latestBlock;
                }
                this.getLog();
            }
        });
    }
    async getPrice() {
        const result = await multicallv2(routerABI, [
            {
                address: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
                name: "getAmountsOut",
                params: [
                    "1000000000000000000",
                    this.token0?.address == this.address
                        ? [this.token0?.address, this.token1?.address]
                        : [this.token1?.address, this.token0?.address],
                ],
            },
        ]);
        const amounts = result[0]["amounts"];
        return parseFloat(formatEther(amounts[1]));
    }
    async getLog() {
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

        const price = await this.getPrice();
        this.alertPrice(price);

        this.blockTracked = Math.max(
            maxBy(logs, "blockNumber")?.blockNumber || this.blockTracked,
            this.latestBlock
        );
        // console.log("this.blockTracked", this.blockTracked);
        // orderBy(logs, ["blockNumber", "logIndex"], ["asc", "asc"]);
        // console.log("logs", logs);
        // this.handleLogs(logs);
        this.getLog();
    }
    price: number = 0;
    alertPrice(newPrice: number) {
        newPrice = parseFloat(newPrice.toFixed(this.decimal));
        this.emitPrice && this.emitPrice(newPrice);
        const symbol =
            this.address === this.token0?.address
                ? this.token0?.symbol
                : this.token1?.symbol;
        if (this.price === 0) {
            this.price = newPrice;
            return;
        }
        const percent = ((newPrice - this.price) * 100) / this.price;
        console.log(`${symbol} giá ${newPrice} percent: ${percent}`);
        if (
            (Math.abs(this.price - newPrice) * 100) / this.price >=
            this.percent
        ) {
            this.log(
                `${symbol} ${
                    newPrice - this.price > 0 ? "Tăng lên" : "Giảm xuống"
                } ${newPrice}`
            );
        }
        this.price = newPrice;
    }
    handleLogs(logs: any[] = []) {
        logs.map(({ data }) => {
            const abiCoder = new utils.AbiCoder();
            const result = abiCoder.decode(
                ["uint", "uint", "uint", "uint"],
                data
            );
            const amount0In: BN = result[0]; //BFC
            const amount0Out: BN = result[2]; //BDC
            const amount1In: BN = result[1]; //USDC
            const amount1Out: BN = result[3]; //BUSD
            // console.log({
            //     amount0In: formatEther(amount0In),
            //     amount0Out: formatEther(amount0Out),
            //     amount1In: formatEther(amount1In),
            //     amount1Out: formatEther(amount1Out),
            // });

            if (this.address === this.token0?.address) {
                if (amount0In.gt(0) && amount1Out.gt(0)) {
                    const price = new BigNumber(amount1Out.toString()).div(
                        new BigNumber(amount0In.toString())
                    );
                    // this.alertPrice(price.toNumber());

                    console.log(
                        `Sell ${formatEther(amount0In)} ${
                            this.token0.symbol
                        } with price ${price.toFixed(this.decimal)} ${
                            this.token1?.symbol
                        }`
                    );
                    // document.title = price.toJSON();
                } else {
                    const price = new BigNumber(amount1In.toString()).div(
                        new BigNumber(amount0Out.toString())
                    );
                    // this.alertPrice(price.toNumber());

                    console.log(
                        `Buy ${formatEther(amount0Out)} ${
                            this.token0.symbol
                        } with price ${price.toFixed(this.decimal)} ${
                            this.token1?.symbol
                        }`
                    );
                    // document.title = price.toJSON();
                }
            } else {
                if (amount0In.gt(0) && amount1Out.gt(0)) {
                    const price = new BigNumber(amount0In.toString()).div(
                        new BigNumber(amount1Out.toString())
                    );
                    // this.alertPrice(price.toNumber());

                    console.log(
                        `Buy ${formatEther(amount1Out)} ${
                            this.token1?.symbol
                        } with price ${price.toFixed(this.decimal)} ${
                            this.token0?.symbol
                        }`
                    );
                    // document.title = price.toJSON();
                } else {
                    const price = new BigNumber(amount0Out.toString()).div(
                        new BigNumber(amount1In.toString())
                    );
                    // this.alertPrice(price.toNumber());

                    console.log(
                        `Sell ${formatEther(amount1In)} ${
                            this.token1?.symbol
                        }  with price ${price.toFixed(this.decimal)} ${
                            this.token0?.symbol
                        }`
                    );
                    // document.title = price.toJSON();
                }
            }
        });
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
