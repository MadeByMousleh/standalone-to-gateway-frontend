import TelegramHelper from "../../../telegramHelper";

export default class WiredPushButtonList {



    protocolVersion = {
        byteNumber: 0,
        fieldSize: 1,
        description: ``,
        value: null
    }

    telegramType = {
        byteNumber: 1,
        fieldSize: 2,
        description: "Telegram type",
        value: null,
    };

    totalLength = {
        byteNumber: 3,
        fieldSize: 2,
        description: "Total length",
        value: null
    }

    crc16 = {
        byteNumber: 5,
        fieldSize: 2,
        description: "CRC 16 value",
        value: null,
    }


    version = {
        byteNumber: 7,
        fieldSize: 1,
        description: "Holds the current version of the Wired push Button list. Range(2)",
        value: null,
    }

    wiredPushButtonOne = {
        byteNumber: 8,
        fieldSize: 5,
        description: "Holds the data for wired push button 1",
        value: null,

    }

    wiredPushButtonTwo = {
        byteNumber: 13,
        fieldSize: 5,
        description: "Holds the data for wired push button 2",
        value: null,

    }

    wiredPushButtonThree = {
        byteNumber: 18,
        fieldSize: 5,
        description: "Holds the data for wired push button 3",
        value: null,

    }


    wiredPushButtonFour = {
        byteNumber: 23,
        fieldSize: 5,
        description: "Holds the data for wired push button 4",
        value: null,

    }

    headerSize = 7;
    hexString
    byteSizeInHex = 2;
    amountOfBytes = 28;
    constructor(hexString) {

        this.hexString = hexString.padStart(this.byteSizeInHex * this.amountOfBytes, '0');
        console.log(this.hexString);

        Object.entries(this).forEach((currentProp) => {
            const { byteNumber, fieldSize } = currentProp[1];
            if (!fieldSize) return;
            let byte = this.extractByte(byteNumber, fieldSize, this.hexString)
            currentProp[1].value = Number(`0x${byte}`);
        })
    }


    extractByte(byteNumber, fieldSize, hexString) {
        let start = byteNumber * 2;
        let end = (fieldSize * 2) + start;
        return hexString.slice(start, end)
    }


    getRawData() {
        let newHexString = "";
        let props = Object.entries(this).sort((a, b) => a[1].byteNumber - b[1].byteNumber);

        props.forEach((currentProp) => {
            const { fieldSize, value } = currentProp[1];
            if (!fieldSize) return;
            newHexString += value.toString(16).padStart(fieldSize * 2, '0');
        })
        return newHexString;
    }

    getPayload() {
        let newHexString = "";
        let props = Object.entries(this).sort((a, b) => a[1].byteNumber - b[1].byteNumber);

        props.forEach((currentProp) => {
            const { fieldSize, value } = currentProp[1];
            if (!fieldSize) return;
            newHexString += value.toString(16).padStart(fieldSize * 2, '0');
        })
        return newHexString.slice((7 * this.byteSizeInHex), newHexString.length);
    }


}