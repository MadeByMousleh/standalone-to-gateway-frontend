

let sensorSeries = {
    0: "Not yet in use",
    1: "Mini",
    2: "Outdoor",
    3: "Not yet in use",
    4: "Not yet in use",
    5: "Not yet in use",
    6: "Medium range",
    7: "Long range",
    8: "High Cieling",
    9: "Accessories"
};

let technology = {
    0: "230V",
    1: "NHC",
    2: "24 V",
    3: "KNX",
    4: "Not yet in use",
    5: "DALI",
    6: "DALI wireless",
    7: "On/Off wireless",
    8: "Not yet in use",
    9: "No value"
};

let mounting = {
    0: "Ceiling, flush box",
    1: "ceiling, flush",
    2: "ceiling, surface",
    3: "Wall",
    4: "Wall flush",
    5: "Not yet in use",
    6: "Not yet in use",
    7: "Not yet in use",
    8: "Not yet in use",
    9: "No value"
};

let output = {
    0: "BMS",
    1: "1 channel",
    2: "2 channels",
    3: "Standard",
    4: "Comfort",
    5: "Not yet in use",
    6: "Not yet in use",
    7: "Not yet in use",
    8: "Not yet in use",
    9: "No value"
};

let detection = {
    0: "No value",
    1: "Motion detector",
    2: "Presence detector",
    3: "True presence",
    4: "Not yet in use",
    5: "Not yet in use",
    6: "Not yet in use",
    7: "Not yet in use",
    8: "No value",
    9: "No value"
};

let variant = {
    0: "Wago 1 cable",
    1: "White",
    2: "Black",
    3: "Silver",
    4: "Wago 2 cables",
    5: "Wieland 1 cable",
    6: "Wieland 2 cables",
    7: "Not yet in use",
    8: "Remote control",
    9: "No value"
};

let wiredButtonFunctions = {
    0: { name: 'NO_FUNCTION', description: 'No function', detectorVariant: 'COMMON' },
    1: { name: 'ONLY_ON', description: 'Only switch ON', detectorVariant: 'COMMON' },
    2: { name: 'ON_OFF', description: 'ON and OFF', detectorVariant: 'COMMON' },
    3: { name: 'ONLY_OFF', description: 'ONLY OFF', detectorVariant: 'COMMON' },
    // 4: { name: 'RESERVED_ONE', description: 'Reserved', detectorVariant: 'COMMON' },
    // 5: { name: 'RESERVED_TWO', description: 'Reserved', detectorVariant: 'COMMON' },
    6: { name: 'TW_WARMER', description: 'Tunable white - warmer', detectorVariant: 'COMFORT' },
    7: { name: 'TW_COOLER', description: 'Tunable white - colder' },
    8: { name: 'ALL_SCENE', description: 'All scenes' },
    9: { name: 'FOLDING_DOOR_OPEN', description: 'Folding door open' },
    10: { name: 'FOLDING_DOOR_CLOSED', description: 'Folding door closed' },
    11: { name: 'TW_ONE', description: 'Tunable white - one' },
    12: { name: 'TW_TWO', description: 'Tunable white - two' },
    13: { name: 'TW_THREE', description: 'Tunable white - three' },
    14: { name: 'TW_FOUR', description: 'Tunable white - four' },
    // 15: { name: 'RESERVED_THREE', description: 'Reserved' },
    // 16: { name: 'RESERVED_FOUR', description: 'Reserved' },
    // 17: { name: 'RESERVED_FIVE', description: 'Reserved' },
    // 18: { name: 'RESERVED_SIX', description: 'Reserved' },
    19: { name: 'AUTO', description: 'Daylight control' },
    // 20: { name: 'RESERVED_SEVEN', description: 'Reserved' },
    // 21: { name: 'RESERVED_EIGHT', description: 'Reserved' },
    // 22: { name: 'RESERVED_NINE', description: 'Reserved' },
    // 23: { name: 'RESERVED_TEN', description: 'Reserved' },
    24: { name: 'TWO_LEVEL_ACTIVE', description: 'Two level active' },
    25: { name: 'DLC_ACTIVE', description: 'DLC active' },
    // 26: { name: 'RESERVED_ELEVEN', description: 'Reserved' },
    27: { name: 'LEVEL', description: 'Go to level' },
    // 28: { name: 'RESERVED_TWELVE', description: 'Reserved' },
}


const extractProductInfo = (productNumber) => {

    const number = productNumber.split("-");
    const arr = number[1].split("");

    let seriesName = sensorSeries[arr[0]];
    let technologyName = technology[arr[1]];
    let mountingName = mounting[arr[2]];
    let outputName = output[arr[3]];
    let detectionName = detection[arr[4]];
    let variantName = variant[arr[5]];

    return {
        series: seriesName,
        technology: technologyName,
        mounting: mountingName,
        output: outputName,
        detection: detectionName,
        variant: variantName,
    }

}

const GeneralHelper = {
    extractProductInfo,
    wiredButtonFunctions
}

export default GeneralHelper;