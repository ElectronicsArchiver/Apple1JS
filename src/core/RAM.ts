const DEFAULT_RAM_BANK_SIZE = 4096;

class RAM implements IoAddressable {
    private data: Array<number>;

    constructor(byteSize: number = DEFAULT_RAM_BANK_SIZE) {
        this.data = new Array(byteSize).fill(0);
    }

    read(address: number): number {
        return this.data[address] || 0;
    }

    write(address: number, value: number): void {
        if (address < this.data.length && address >= 0) {
            this.data[address] = value;
        }
    }

    flash(data: Array<number>): void {
        // LOAD A PROG
        const [highAddr, lowAddr, ...coreData] = data;

        if (coreData.length > this.data.length) {
            throw new Error(`Flash Data too large (${coreData.length} -> ${this.data.length})`);
        }

        const prgAddr: number = highAddr | (lowAddr << 8);

        for (let i = 0; i < coreData.length; i++) {
            this.data[prgAddr + i] = coreData[i];
        }
    }
}

export default RAM;
