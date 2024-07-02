const ConfigurationPirSens =  {
    OFF: 0,
    MIN: 1,
    LOW: 2,
    HIGH: 3,
    MAX: 4,
    sensValueToText: (value) => {
        switch (value) {
            case 0: return 'Off';
            case 1: return 'Minimum';
            case 2: return 'Low';
            case 3: return 'High';
            case 4: return 'Maximum';
        }
    }
}

export default ConfigurationPirSens;