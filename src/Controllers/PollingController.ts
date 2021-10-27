const DefaultInterval = 1.5 * 1000;
export class PollingController {
    interval: number = DefaultInterval;
    private handle?: NodeJS.Timer;
    constructor(interval?: number) {
        this.interval = interval || DefaultInterval;
    }
    /**
     * Start polling
     */
    async startPoll(): Promise<void> {
        this.handle && clearTimeout(this.handle);
        await this.pollAction().catch((err) => {
            this.onError && this.onError(err);
            this.handle = setTimeout(() => {
                this.startPoll();
            }, this.interval);
        });
        this.handle = setTimeout(() => {
            this.startPoll();
        }, this.interval);
    }
    /**
     * Start polling
     */
    async stopPoll() {
        if (this.handle) clearTimeout(this.handle);
    }
    async pollAction(): Promise<any> {
        Promise.resolve([]);
    }
    onError(err: any) {
        return err;
    }
}
