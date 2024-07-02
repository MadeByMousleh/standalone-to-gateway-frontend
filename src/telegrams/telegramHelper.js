


function getValueFromReply(field, hexValue) {
    let start = field.byteNumber * 2;
    let end = (field.fieldSize * 2) + start;
    let value = `0x${hexValue.slice(start, end).match(/[a-fA-F0-9]{2}/g).reverse().join('')}`;

    return Number(value);
}


function setObjectPropertiesFromHexReply(obj, hexValue) {
    Object.entries(obj).forEach((currentProp) => {
        if (currentProp[1].byteNumber)
            currentProp[1].value = getValueFromReply(currentProp[1], hexValue)
    })
}

function getHexValueFromProperties(obj) {
    let hexVal = "";

    for (const [_, propValue] of Object.entries(obj)) {

        // const { fieldSize, value } = propValue;
        const { value } = propValue;

        if (value !== undefined) {
            // hexVal += value.toString(16).padStart(fieldSize * 2, '0').toUpperCase().match(/[a-fA-F0-9]{2}/g).reverse().join('');
            hexVal += value.toString(16).match(/[a-fA-F0-9]{2}/g).reverse().join('');
        }
    }

    return hexVal;
}

let TelegramHelper = {
    setObjectPropertiesFromHexReply,
    getHexValueFromProperties
}




export default TelegramHelper;