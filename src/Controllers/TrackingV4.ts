import { hexZeroPad } from '@ethersproject/bytes';
import { formatEther } from '@ethersproject/units';
import axios from 'axios';
import BigNumber from 'bignumber.js';
// import BigNumber from "bignumber.js";
// import { toChecksumAddress } from "ethereumjs-util";
import { ethers, utils, BigNumber as BN } from 'ethers';
import { JsonRpcProvider } from 'ethers/node_modules/@ethersproject/providers';

import {
    maxBy,
    // orderBy
} from 'lodash';
// import ABI from "../Constants/pairAbi.json";
import routerABI from '../Constants/UniswapV2Router02.json';
import { multicallv2 } from '../Utils/multicall';
const rpc = [
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed1.ninicoin.io/',
    'https://bsc-dataseed2.defibit.io/',
    'https://bsc-dataseed3.defibit.io/',
    'https://bsc-dataseed4.binance.org/',
    'https://bsc-dataseed3.binance.org/',
    'https://bsc-dataseed2.binance.org/',
    'https://bsc-dataseed1.binance.org/',
    'https://dataseed1.defibit.io/',
    'https://dataseed2.defibit.io/',
    'https://dataseed3.defibit.io/',
    'https://dataseed4.defibit.io/',
];
const sleep = async (time = 25 * 1000) =>
    new Promise((r) => setTimeout(r, time));
let count = 0
export default class TrackingV4 {
    provider: any;
    decimal = 5;
    blockTracked: number = 0;
    latestBlock: number = 0;
    filter: any;
    getLogProcessing?: boolean;
    percent: number = 1;
    pairs: any[];
    prices: any[];
    tokenOnlyPrice: any[];
    currentRpc: string;
    constructor(
        pairs: {
            token0: string;
            symbol0: string;
            price0?: number;
            token1: string;
            price1?: number;
            symbol1: string;
            address: string;
            minPrice?: number;
            maxPrice?: number;
            ignorePercent?: boolean;
        }[],
        onlyPrice: {
            token0: string;
            symbol0: string;
            price0?: number;
            token1: string;
            price1?: number;
            symbol1: string;
            paths?: string[];
            minPrice?: number;
            maxPrice: number;
            ignorePercent?: boolean;
        }[] = []
    ) {
        this.pairs = pairs;
        this.tokenOnlyPrice = onlyPrice;
        this.prices = this.pairs.concat(this.tokenOnlyPrice).map((_) => 0);
        this.filter = {
            address: pairs.map((el) => el.address),
            topics: [
                '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
            ],
        };
        this.currentRpc = 'https://bsc-dataseed1.defibit.io/';
        this.provider = new JsonRpcProvider(this.currentRpc);
        this.onBlock();
        // this.getPrice().then((prices) => this.alertPrice(prices));
    }

    onBlock() {
        this.getLog();
        let numberBlock = 0;
        this.provider.on('block', async (block: number) => {
            this.latestBlock = block;
            // const prices: number[] = await this.getPrice();
            // this.alertPrice(prices);
            // if (!this.getLogProcessing) {
            //     if (this.blockTracked === 0) {
            //         this.blockTracked = this.latestBlock - 1;
            //     }
            //     this.latestBlock - this.blockTracked > 30 && this.updatePrice();
            // }
            if (!this.getLogProcessing && numberBlock >= 2) {
                this.getLog();
                numberBlock = 0;
            } else {
                ++numberBlock;
            }
        });
    }
    async getPrice(): Promise<any> {
        try {
            const result = await multicallv2(
                routerABI,
                this.pairs.concat(this.tokenOnlyPrice).map((pair) => ({
                    address: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
                    name: 'getAmountsOut',
                    params: [
                        '1000000000000000000',
                        pair.paths ? pair.paths : [pair.token0, pair.token1],
                    ],
                }))
            );
            const prices = this.pairs
                .concat(this.tokenOnlyPrice)
                .map((pair, i) => {
                    const amounts = result[i]['amounts'];

                    // this.prices[i] = parseFloat(formatEther(amounts[1]));
                    return parseFloat(formatEther(amounts[amounts.length - 1]));
                });
            return prices;
        } catch (error) {
            this.currentRpc = rpc[Math.floor(Math.random() * rpc.length)];
            this.provider = new JsonRpcProvider(this.currentRpc);
            console.info({
                currentRpc: this.currentRpc,
            });
            await sleep(5 * 1000);
            return this.getPrice();
        }
    }
    emitPrice?: Function;
    on(name = 'onPrice', cb: Function) {
        this.emitPrice = cb;
    }
    alertPrice(prices: number[]) {
        let title = '';
        const tokens = this.pairs.concat(this.tokenOnlyPrice);
        prices.forEach((price, i) => {
            const newPrice = price;
            title +=
                `${tokens[i].symbol0}:` + price.toFixed(this.decimal) + '-';
            const oldPrice = this.prices[i];
            if (oldPrice === 0) {
                this.prices[i] = newPrice;
            } else {
                this.prices[i] = newPrice;
                if (tokens[i].maxPrice && newPrice >= tokens[i].maxPrice) {
                    this.log(
                        `${tokens[i].symbol0} lớn hơn ${tokens[i].maxPrice}`
                    );
                }
                if (tokens[i].minPrice && newPrice < tokens[i].minPrice) {
                    this.log(
                        `${tokens[i].symbol0} nhỏ hơn ${tokens[i].minPrice}`
                    );
                }
                const percent = ((newPrice - oldPrice) * 100) / oldPrice;
                if (percent > 0 && percent >= this.percent) {
                    this.log(
                        `${tokens[i].symbol0} giá ${newPrice.toFixed(
                            4
                        )} tăng  ${percent.toFixed(3)}%`
                    );
                } else if (percent < 0 && Math.abs(percent) >= this.percent) {
                    this.log(
                        `${tokens[i].symbol0} giá ${newPrice.toFixed(
                            4
                        )} giảm  ${(percent * -1).toFixed(3)}%`
                    );
                } else if (Math.abs(percent) > 0) {
                    console.log(
                        `${tokens[i].symbol0} giá ${newPrice.toFixed(4)} ${
                            percent < 0 ? 'Giảm' : 'Tăng'
                        }  ${Math.abs(percent * -1).toFixed(3)}%`
                    );
                }
            }
        });
        document.title = title;
        this.emitPrice && this.emitPrice(title);
    }
    async updatePrice() {
        this.getLogProcessing = true;
        const prices: number[] = await this.getPrice();
        this.blockTracked = this.latestBlock;
        this.alertPrice(prices);
        this.getLogProcessing = false;
    }
    async getLog() {
        try {
            // const prices: number[] = await this.getPrice();
            // this.alertPrice(prices);
            this.getLogProcessing = true;
            if (!this.blockTracked) {
                this.blockTracked = await this.provider.getBlockNumber();
            }
            this.filter.fromBlock = ethers.BigNumber.from(
                this.blockTracked
            ).toHexString();
            // console.log('query from', this.blockTracked, this.filter);
            const logs: { blockNumber: number }[] = await this.provider.send(
                'eth_getLogs',
                [this.filter]
            );

            // const prices: number[] = await this.getPrice();
            // this.alertPrice(prices);
            const maxBlock = parseInt(
                maxBy(logs, (log) =>
                    parseInt(log.blockNumber.toString())
                )?.blockNumber.toString() ?? '0'
            );

            this.blockTracked = Math.max(
                ...[maxBlock ? maxBlock + 1 : 0, this.blockTracked]
            );
            // console.info({
            //     logs: logs,
            //     blockTracked: this.blockTracked,
            //     latestBlock: this.latestBlock,
            // });
            this.getLogProcessing = false;
            if (logs.length) {
                this.handleLogs(logs);
            }
        } catch (error) {
            this.getLogProcessing = true;
            this.currentRpc = rpc[Math.floor(Math.random() * rpc.length)];
            this.provider = new JsonRpcProvider(this.currentRpc);
            console.info({
                currentRpc: this.currentRpc,
            });
            await sleep(5 * 1000);
            this.getLog();
            // console.info({ error });
        }
    }

    log(data: any) {
        data='dd'
        const instance = axios.create({
            baseURL: 'https://api.telegram.org/',
            timeout: 1000,
            headers: { 'X-Custom-Header': 'foobar' },
        });
        const api = `/bot2067736235:AAE4odY1Q_3c54R3V1ye_jBA_WZYFwOrxxE/sendMessage?chat_id=873815426&text=${
            typeof data == 'string' ? data : JSON.stringify(data)
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
    handleLogs(logs: any[] = []) {
        logs.map(({ data, address, topics,transactionHash }) => {
            const abiCoder = new utils.AbiCoder();
            const result = abiCoder.decode(
                ['uint', 'uint', 'uint', 'uint'],
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
            const pair = this.pairs.find((el) => el.address == address);
            
            if (true) {
                if (amount0In.gt(0) && amount1Out.gt(0)) {
                    // const price = new BigNumber(amount1Out.toString()).div(
                    //     new BigNumber(amount0In.toString())
                    // );
                    // this.alertPrice(price.toNumber());
                    if(parseFloat(formatEther(amount0In))<=5300 &&parseFloat(formatEther(amount0In))>=5100 ){
                        ++count
                        console.info({
                            count
                        })
                    }
                    console.log(
                        `Sell ${formatEther(amount0In)} ${
                            pair.symbol0
                        } with price about ${(parseFloat(formatEther(amount1Out))*574.98).toFixed(0)} USD ${`https://bscscan.com/tx/`+transactionHash}`
                    );
                    // document.title = price.toJSON();
                } else {
                    // const price = new BigNumber(amount1In.toString()).div(
                    //     new BigNumber(amount0Out.toString())
                    // );
                    // this.alertPrice(price.toNumber());

                    console.log(
                        `Buy ${formatEther(amount0Out)} ${
                            pair.symbol0
                        } with price about ${(parseFloat(formatEther(amount1In))*574.98).toFixed(0)} USD ${`https://bscscan.com/tx/`+transactionHash}`
                    );
                    // document.title = price.toJSON();
                }
                console.info('----------------------------')
            } else {
                if (amount0In.gt(0) && amount1Out.gt(0)) {
                    const price = new BigNumber(amount0In.toString()).div(
                        new BigNumber(amount1Out.toString())
                    );
                    // this.alertPrice(price.toNumber());

                    console.log(
                        `Buy ${formatEther(amount1Out)} ${
                            pair.symbol1
                        } with price ${price.toFixed(this.decimal)} ${
                            pair.symbol0
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
                            pair.symbol1
                        }  with price ${price.toFixed(this.decimal)} ${
                            pair.symbol0
                        }`
                    );
                    // document.title = price.toJSON();
                }
            }
        });
    }
}
