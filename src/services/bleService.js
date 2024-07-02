import { EventSourcePolyfill } from "event-source-polyfill";

export default class BLEService {
    //#region private properties

    #isTimedOut;
    #expiresIn;
    #retryConnection = 0;
    #retryWrite = 0;
    #header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
        Connection: "keep-alive",
    };
    //#endregion

    //#region constructor

    /**
     * @param {string} gatewayMac is the MAC address of the Cassia gateway which is to be connected to.
     * **/
    constructor(gatewayMac) {
        this.gatewayMac = gatewayMac;
    }

    //#endregion

    //#region Private methods


    #buildUrl = (params, url) => {

        const baseUrl = process.env.REACT_APP_BASE_URL;
        const obj = new URL(`${baseUrl}${url}`);
        obj.search = new URLSearchParams(params);
        return obj;
    }

    #getHeader = () => {
        this.header = {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "*/*",
            Connection: "keep-alive",
        };
    };

    /**
     * @param {obj} bodyObj in a object which contains keys and values of the body and converts it to a x-www-form-urlencoded body type.
     * @returns {string} Returns a string of the body
     **/
    #getFormBody = (bodyObj) => {
        return Object.keys(bodyObj)
            .map((key) => {
                return encodeURIComponent(key) + "=" + encodeURIComponent(bodyObj[key]);
            })
            .join("&");
    };

    /**
     * @returns {string} Returns an base64 encoded string of the developer key and secret. Uses Basic authentication.
     **/
    #getBasicAuthHeader = () => {
        const base64Encoded = btoa(
            `${process.env.REACT_APP_DEVELOPER_KEY}:${process.env.REACT_APP_DEVELOPER_SECRET}`
        );
        return `Basic ${base64Encoded}`;
    };

    /**
     *
     * @param {string} bleDeviceMac The devices mac address you want to login to
     * @param {number} handle The handle number of the Write characteristic
     * @param {string} value The login value should be equal or grater then 285 and divisible by 57
     * @param {number} noResponse (Optional): 0 or 1, 1 allows writing to the handle without a response. Default value is 0.
     * @returns true if the telegram is sent to the ble device
     */
    #writeLoginTelegram = async (
        bleDeviceMac,
        handle = 19,
        value = "0110000900FB951D01",
        noResponse = 1,
    ) => {

        try {

            if (!bleDeviceMac) throw Error(`Param 'bleDeviceMac is required`);

            const url = this.#buildUrl({ mac: this.gatewayMac, noresponse: noResponse },
                `/gatt/nodes/${bleDeviceMac}/handle/${handle}/value/${value}`
            )

            const response =  await fetch(url, {
                method: "GET",
                headers: this.#header,
            });

            const status = response.status;

            console.log(status, 'logged in status')

            if(status === 200) return true;

            return false;

             
        } catch (e) {
            throw e;
        }
    };

 


    //#endregion

    //#region Public methods

    /**
     * Authorizes a user to be able to make requests for the CASSIA server.
     * Bearer token is set in local storage
     * Expires every 3600 seconds
     * Uses Basic authentication
     * Uses x-www-form-urlencoded body
     **/    
    authorize = async () => {
        const url = `${process.env.REACT_APP_BASE_URL}/oauth2/token`;
        const body = this.#getFormBody({ grant_type: "client_credentials" });

        const headers = {
            Authorization: this.#getBasicAuthHeader(),
            Accept: "*/*",
            Connection: "keep-alive",
            "Content-type": "application/x-www-form-urlencoded",
        };

        const result = await fetch(url, {
            method: "POST",
            headers,
            body,
        });

        const data = await result.json();


        localStorage.setItem("token", `Bearer ${data.access_token}`);
    };

    /**
     * Scans for nearby BLE devices
     *  @param {number} 	(Optional): "0 or 1, 0 indicates passive scanning and 1 active scanning. If you don't specify, by default the Cassia gateways will perform passive scanning.
     * @param {number} (Optional): 0 or 1, 0 to turn off and 1 to turn on; filters duplicated records. Default is 0. >1000 (ms) timer to restart duplicate filter.
     * @param {number} (Optional): 0 or 1， default is 0， 1 adds a timestamp in the scan data, for example: data: {"name":"CASSIA-BEACON-335","timestamp":"2021-03-08 10:07:17.723 CST","evtType":0,"rssi":-69,"adData":"02010612094341535349412D424541434F4E2D333335","bdaddrs":[{"bdaddr":"CC:DD:EE:03:00:23","bdaddrType":"random"}]}
     * @param {obj} (Optional) Append filter to end of url - see description of scan filter {@link  https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#scan-bluetooth-devices}
     * **/
    scanForBLEdevices = (
        active = 1,
        filterDuplicates = 0,
        timestamp = 0,
        filter = { filter_mac: "10:B9:F7*" }
    ) => {

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "*/*",
            Connection: "keep-alive",
        };

        return new EventSourcePolyfill('http://localhost:8888/scan');
    };

   /**
     * Connect to any BLE device - requires authorization
     * @param {string} bleDeviceMac (Required): Mac address of the BLE device you want to connect to
     * @param {string} type (Optional): the BLE device’s address type, either public or random. Default is public if not specified.
     * @param {number} timeout (Optional): in ms, the connection request will timeout if it can’t be finished within this time. The default timeout is 5,000ms. The range of value is 200 ms - 20000 ms.
     * @param {number} auto 	(Optional): 0 or 1, indicates whether or not the BLE device will be automatically reconnected after it is disconnected unexpectedly. Return value: 200 for success, 500 for error. The default value is 0 (don't reconnect). (After the BLE connection is reconnected, the user application needs to reconnect the up-layer connections. For example, resubscribe the BLE notifications.) This parameter is disabled for firmware v1.4.3 and above!
     * @param {number} discovergatt
     * @returns {boolean} Return true if connected properly
     */
   connectToBleDevice = async (
    bleDeviceMac,
    type = "public",
    timeout = 0,
    auto = 0,
    discovergatt = 0,
) => {

    
    if (!bleDeviceMac) throw Error(`Param 'bleDeviceMac is required`);

    const body = JSON.stringify({
        mac: bleDeviceMac
    })

    const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
        Connection: "keep-alive",
    };

        const result = await fetch('http://localhost:8888/connect',{
            headers,
            method: 'POST',
            body,
        })

        if(result.status === 200) return bleDeviceMac;

        return null;
};

    /**
     * Tries to disconnect from a BLE device.
     * @param {string} bleDeviceMac The devices mac address you want to disconnect from
     * @returns true if properly disconnected from detector
     */
    disconnectFromDetector = async (bleDeviceMac) => {

            const body = JSON.stringify({
                mac: bleDeviceMac
            })


            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
                Connection: "keep-alive",
            };

            const result = await fetch('http://localhost:8888/disconnect', {
                method: "POST",
                headers,
                body,
            });

            if(result.status === 200) return bleDeviceMac;

            return null;
    };


    checkConnectionStateSSE = () => {

        const url = new URL(`http://192.168.0.29/management/nodes/connection-state`);

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "*/*",
        };

        return new EventSourcePolyfill(url, { headers });

    }



    connectToManyBleDevices = async (bleDevices) => {
        const devicesConnected = [];
        console.log(devicesConnected, 'DD')

        bleDevices.forEach((device) => {
             this.connectToBleDevice(device).then(res => {
                devicesConnected.push(res);
            })
        });
        console.log(devicesConnected, 'DD')
        return devicesConnected
    };

    disconnectFromManyDetectors = (
        bleDevices,
    ) => {
        bleDevices.forEach((device) => this.disconnectFromDetector(device));
    };

    batchConnect = async (
        bleDevices = [],

    ) => {
        const token = localStorage.getItem("token");

        const list = { list: bleDevices.map(mac => { return { addr: mac } }) };

        if (!token) {
            this.authorize();
            return this.connectToDetector();
        }

        const headers = {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
            Accept: "*/*",
            Connection: "keep-alive",
        };

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/gap/batch-connect?mac=${this.gatewayMac}`, {
            method: "POST",
            headers,
            body: JSON.stringify(list),
        });

        const status = response.status;

        if (status === 200) {
            bleDevices.forEach((device) => {
                this.#writeLoginTelegram(device);
            })
        }

        if (status === 403) {
            this.authorize();
            this.batchConnect();
        }

    };


    batchDisconnect = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            this.authorize();
            return this.connectToDetector();
        }



        // const url = new URL(
        //   `${process.env.REACT_APP_BASE_URL}/gap/nodes/${bleDeviceMac}/connection`
        // );

        // url.search = new URLSearchParams(params);

        const headers = {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
            Accept: "*/*",
            Connection: "keep-alive",
        };

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/gap/batch-connect?mac=${this.gatewayMac}`, {
            method: "DELETE",
            headers,
        });

        const status = response.status;

        if (status === 200) {
            return true;
        }

        if (status === 403) {
            this.authorize();
            this.batchConnect();
        }
    }



    getConnectionList = async () => {

        // GET http://{your AC domain}/api</gap/nodes?connection_state=connected&mac=<gateway-mac>>

        try {
    
            // const token = localStorage.getItem("token");
    
            // if (!token) {
            //     this.authorize();
            //     return this.getConnectionList();
            // }
    

    
            // const url = new URL(
            //     `${process.env.REACT_APP_BASE_URL}/gap/nodes?connection_state=connected&mac=${this.gatewayMac}`
            // );
    
    
            const headers = {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "*/*",
                Connection: "keep-alive",
            };
    
            const jsonList = await fetch('192.168.0.29/gap/nodes?connection_state=connected', {
                method: "GET",
                headers,
            });
            



            const list = await jsonList.json();

            console.log(list);

            return list;
    
    
        } catch (e) {
            throw e;
        }
    }



    updateFirmware = async (mac) => {

        try {
        
            const url = new URL(`http://localhost:8888/upgrade`);
    
            const result = await fetch(
                url, {
                    method: "POST", 
             
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({mac})
                });

            const status = result.status;

            console.log(result, status);

            if(status === 200)
            {

            }

            return status;
    
        } catch (e) {
            throw e;
        }

    }

    jumpToBoot = async (mac) => {

        try {
        
            const url = new URL(`http://localhost:8888/jump-to-boot`);
    
            const result = await fetch(
                url, {
                    method: "POST", 
             
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({mac})
                });

            const status = result.status;

            if(status === 200)
            {
               return 200;
            }
    
        } catch (e) {
            throw e;
        }

    }


    


    listenForProgress = () => {
        return  new EventSourcePolyfill("http://localhost:8888/events");

    }
    

    //#endregion
}
