import ByteHelper from "../../../../../../helper/ByteHelper";


export default class ParamOne {

    byte;
    byteHelper = new ByteHelper();


    constructor(byte) {
        this.byte = byte;
    }


    setByte(value)
    {
        this.byte = value;
    }

    getByte()
    {
        return this.byte;
    }


}