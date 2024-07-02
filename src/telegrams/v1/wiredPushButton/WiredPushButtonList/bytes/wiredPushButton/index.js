import TelegramHelper from "../../../../../telegramHelper";
import ConfigType from "./configType";
import FunctionOne from "./functionOne";


export default class WiredPushButton {

    paramTwo = {
        byteNumber: 4,
        fieldSize: 1,
        description: "This is a param for function two",
        value: null
    }

    configType = {
        byteNumber: 0,
        fieldSize: 1,
        description: "What the button is configured to control",
        value: null
    }

    functionOne = {
        byteNumber: 1,
        fieldSize: 1,
        description: "The first function of the button",
        value: null
    }

    functionTwo = {
        byteNumber: 2,
        fieldSize: 1,
        description: "The second function of the button",
        value: null
    }

    paramOne = {
        byteNumber: 3,
        fieldSize: 1,
        description: "This is a param for function one",
        value: 5
    }


    amountOfBytes = 5;
    byteSizeInHex = 2;
    hexString;


    constructor(hexString) {
        this.hexString = hexString.padStart(this.byteSizeInHex * this.amountOfBytes, '0');

        Object.entries(this).forEach((currentProp) => {
            const { byteNumber, fieldSize } = currentProp[1];
            if (!fieldSize) return;
            let byte = this.extractByte(byteNumber, fieldSize, this.hexString)
            currentProp[1].value = Number(byte);
        })
    }


    extractByte(byteNumber, fieldSize, hexString) {
        let start = byteNumber * 2;
        let end = (fieldSize * 2) + start;
        return hexString.slice(start, end)
    }

    getRawData() {
        let newHexString = "";
        let props = Object.entries(this).sort((a,b) => a[1].byteNumber - b[1].byteNumber);

        props.forEach((currentProp) => {
            const {fieldSize, value } = currentProp[1];
            if (!fieldSize) return;
            newHexString += value.toString(16).padStart(2, '0');
        })
        return newHexString;
    }


    getButtonType() {
        let type = new ConfigType(this.configType.value);
        console.log(type);
        return type.getBit(type.Bits.BUTTON_TYPE);
    }

    getZone(zoneNumber) {

        let type = new ConfigType(this.configType.value);
        switch (zoneNumber) {
            case 1: return type.getBit(type.Bits.ZONE_ONE_CH_ONE);
            case 2: return type.getBit(type.Bits.ZONE_TWO_CH_TWO);
            case 3: return type.getBit(type.Bits.ZONE_THREE);
            case 4: return type.getBit(type.Bits.ZONE_FOUR);
            case 5: return type.getBit(type.Bits.ZONE_FIVE_INTERNAL_RELAY);
            case 6: return type.getBit(type.Bits.MULTI_ZONE);
            default: return type.getBit(type.Bits.NOT_IN_USE);
        }

    }

    getActiveZones() {

        let type = new ConfigType(this.configType.value);
        let arr = [];
        if (type.getBit(type.Bits.ZONE_ONE_CH_ONE)) arr.push(1);
        if (type.getBit(type.Bits.ZONE_TWO_CH_TWO)) arr.push(2);
        if (type.getBit(type.Bits.ZONE_THREE)) arr.push(3);
        if (type.getBit(type.Bits.ZONE_FOUR)) arr.push(4);
        if (type.getBit(type.Bits.ZONE_FIVE_INTERNAL_RELAY)) arr.push(5);
        if (type.getBit(type.Bits.MULTI_ZONE)) arr.push(5);

        return arr;
    }

    getActiveChannels() {
        let type = new ConfigType(this.configType.value);
        let arr = [];
        if (type.getBit(type.Bits.ZONE_ONE_CH_ONE)) arr.push(1);
        if (type.getBit(type.Bits.ZONE_TWO_CH_TWO)) arr.push(2);
        return arr;
    }

    getFunctionOne() {
        let fOne = new FunctionOne(this.functionOne.value);
        return fOne.getActiveFunction();
    }

    isNotUsed() {
        let type = new ConfigType(this.configType.value);
        return type.getBit(type.Bits.NOT_IN_USE);
    }


    getChannelOne() {
        this.getZone(1)
    }

    getChannelTwo() {
        this.getZone(2)
    }

}