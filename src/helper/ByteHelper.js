
class ByteHelper {

    swapBytes(bytes) {
        let high = bytes >> 8;
        let low = bytes & 0xff
        return [high, low];
    }

    encode(m, l) {
        return m + l * 4;
    }

    getBit(byte, bitPlace) {
        if (!!((byte >> (bitPlace - 1)) & 1)) {
            return 1;
        }
        return 0;
    }

    isBitActive(byte, bitPlace) {
        return !!((byte >> (bitPlace - 1)) & 1);
    }

    activateBit(byte, bitPlace) {

        // 1 0 = 1
        // 0 1 = 1
        // 1 1 = 1
        // 0 0 = 0

        let mask = 1 << (bitPlace - 1);
        return byte | mask
    }

    deactivateBit(byte, bitPlace) {
        let mask = 1 << (bitPlace - 1);
        return byte ^ mask
    }

    reverse(bytes) {

        let hex = bytes.match(/[a-fA-F0-9]{2}/g).reverse().join('');
        return Number(`0x${hex}`);
        // let high = (bytes >> 8).toString(16);
        // let low = (bytes & 0xff).toString(16);


        // return Number(`0x${high}${low}`)
    }

    reverseDec(bytes) {

        return (~bytes * -1)
        // let high = (bytes >> 8).toString(16);
        // let low = (bytes & 0xff).toString(16);


        // return Number(`0x${high}${low}`)
    }


    hexStringToNumber(hexString)
    {
        return Number(`0x${hexString}`);
    }

}

export default ByteHelper;