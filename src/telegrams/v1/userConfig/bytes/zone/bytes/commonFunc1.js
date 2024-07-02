import ByteHelper from "../../../../../../helper/ByteHelper";

export default class ZoneCommonFunc1 {

    byte;
    byteHelper = new ByteHelper();

    Bits = {
        DLC_ACTIVE: 1,
        OVEREXPOSED_ACTIVE: 2,
        EIGHT_HOUR_ACTIVE: 3,
        RESERVED_1: 4,
        MANUAL_OFF: 5,
        MANUAL_ON: 6,
        AUTO_ON: 7,
        RESERVED_2: 8
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

    activateDLC() {
        this.activateBit(1)
    }

    deactivateDLC() {
        this.deactivateBit(1)
    }

    activateOverexposed() {
        this.activateBit(2)
    }

    deactivateOverexposed() {
        this.deactivateBit(2)
    }

    activateEightOurActive() {
        this.activateBit(3)
    }

    deactivateEightOurActive() {
        this.deactivateBit(3)
    }

    activateReserved1() {
        this.activateBit(4)
    }

    deactivateReserved1() {
        this.deactivateBit(4)
    }

    activateManualOff() {
        this.activateBit(5)
    }

    deactivateManualOff() {
        this.deactivateBit(5)
    }

    activateManualOn() {
        this.activateBit(6)
    }

    deactivateManualOn() {
        this.deactivateBit(6)
    }

    activateAutoOn() {
        this.activateBit(7)
    }

    deactivateAutoOn() {
        this.deactivateBit(7)
    }

    activateReserved2() {
        this.activateBit(8)
    }

    deactivateReserved2() {
        this.deactivateBit(8)
    }

}