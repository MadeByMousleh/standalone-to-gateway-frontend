export default class Timer {

    durations =
        {
            15: "15 seconds",
            30: "30 seconds",
            120: "2 minutes",
            300: "5 minutes",
            600: "10 minutes",
            900: "15 minutes",
            1200: "20 minutes",
            1500: "25 minutes",
            1800: "30 minutes",
            2100: "35 minutes",
            2400: "40 minutes",
            2700: "45 minutes",
            3000: "50 minutes",
            3300: "55 minutes",
            3600: "60 minutes",
            65533: "Pulse: 1s on, 20s off",
            65534: "Pulse: 1s on, 60s off",
            65535: "Disable Timer",
        }

    byte = 30;

    constructor(hexValue) {
        this.byte = hexValue;
    }
}