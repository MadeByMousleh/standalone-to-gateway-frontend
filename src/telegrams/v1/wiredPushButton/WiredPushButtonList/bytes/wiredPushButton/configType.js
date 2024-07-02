import ByteHelper from "../../../../../../helper/ByteHelper";

export default class ConfigType {

    byte;
    byteHelper = new ByteHelper();

    Bits = {
        BUTTON_TYPE: 1,
        ZONE_ONE_CH_ONE: 2,
        ZONE_TWO_CH_TWO: 3,
        ZONE_THREE: 4,
        ZONE_FOUR: 5,
        ZONE_FIVE_INTERNAL_RELAY: 6,
        MULTI_ZONE: 7,
        NOT_IN_USE: 8
    }

    Values = {
        BUTTON_TYPE: 1,
        ZONE_ONE_CH_ONE: 2,
        ZONE_TWO_CH_TWO: 4,
        ZONE_THREE: 8,
        ZONE_FOUR: 16,
        ZONE_FIVE_INTERNAL_RELAY: 32,
        MULTI_ZONE: 64,
        NOT_IN_USE: 128
    }


    constructor(byte) {
        this.byte = byte;
    }

    activateBit(bitPosition) {
        this.byte = this.byteHelper.activateBit(this.byte, bitPosition)
    }

    deactivateBit(bitPosition) {
        let result = this.byteHelper.deactivateBit(this.byte, bitPosition)
        this.byte = result;
    }

    getBit(bitPosition) {
        return this.byteHelper.getBit(this.byte, bitPosition)
    }

}