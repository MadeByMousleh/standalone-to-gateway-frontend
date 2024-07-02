export default class ZoneCommonFuncTwo {

    byte = {
        0: { value: 0, description: 'RESERVED' },
        1: { value: 0, description: 'RESERVED' },
        2: { value: 0, description: 'RESERVED' },
        3: { value: 0, description: 'RESERVED' },
        4: { value: 0, description: 'RESERVED' },
        5: { value: 0, description: 'RESERVED' },
        6: { value: 0, description: 'RESERVED' },
        7: { value: 0, description: 'RESERVED' },
    }


    constructor(hexValue) {
        let changedByte = hexValue;

        for (let index = 0; index < 8; index++) {
            const bitType = this.byte[index];
            const lsb = changedByte & 1;
            bitType.value = lsb;
            changedByte = changedByte >> 1;
        }
    }
}