import ByteHelper from "../../../../../../helper/ByteHelper";


export default class FunctionTwo {

    byte;
    byteHelper = new ByteHelper();

    functions = {
        NO_FUNCTION: 0,
        ONLY_ON: 1,
        ON_OFF: 2,
        ONLY_OFF: 3,
        RESERVED_ONE: 4,
        RESERVED_TWO: 5,
        TW_WARMER: 6,
        TW_COOLER: 7,
        CALL_SCENE: 8,
        FOLDING_DOOR_OPEN: 9,
        FOLDING_DOOR_CLOSED: 10,
        TW_ONE: 11,
        TW_TWO: 12,
        TW_THREE: 13,
        TW_FOUR: 14,
        RESERVED_THREE: 15,
        RESERVED_FOUR: 16,
        RESERVED_FIVE: 17,
        RESERVED_SIX: 18,
        AUTO: 19,
        RESERVED_SEVEN: 20,
        RESERVED_EIGHT: 21,
        RESERVED_NINE: 22,
        RESERVED_TEN: 23,
        TWO_LEVEL_aCTIVE: 24,
        DLC_ACTIVE: 25,
        RESERVED_ELEVEN: 26,
        LEVEL: 27,
        RESERVED_TWELVE: 28,

    }

    constructor(byte) {
        this.byte = byte;
    }


    setFunction(value) {
        this.byte = value;
    }

    getFunction() {
        return this.byte;
    }



}