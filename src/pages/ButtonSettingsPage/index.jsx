import { Button, Checkbox, Radio, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import WiredPushButton from '../../telegrams/v1/wiredPushButton/WiredPushButtonList/bytes/wiredPushButton';
import FunctionOne from '../../telegrams/v1/wiredPushButton/WiredPushButtonList/bytes/wiredPushButton/functionOne';
import ConfigType from '../../telegrams/v1/wiredPushButton/WiredPushButtonList/bytes/wiredPushButton/configType';
import WiredPushButtonList from '../../telegrams/v1/wiredPushButton/WiredPushButtonList';

export default function ButtonSettingsPage() {
    const params = useParams();
    const { mac, productNumber, buttonId } = params;
    const [searchParams, setSearchParams] = useSearchParams();
    const buttonValue = searchParams.get('buttonValue');
    const [button, setButton] = useState(null);
    const [funcOne, setFuncOne] = useState();
    const [configType, setConfigType] = useState();
    const functionOne = new FunctionOne();
    const location = useLocation();

    const cfgType = new ConfigType()


    const updateUrl = useCallback((btnValue, listValue) => {

        const url = new URL(location.pathname);
        if (btnValue) {
            url.searchParams.set("buttonValue", btnValue);
        }

        if (listValue) {
            url.searchParams.set("list", listValue);
        }

        window.history.pushState({}, "", url);

    }, [location])

    useEffect(() => {
        let btn = new WiredPushButton(buttonValue);
        setFuncOne(btn.functionOne.value);
        setConfigType(btn.configType.value);
        setButton(btn);
    }, [])

    let buttonType = searchParams.get('buttonType');


    const onFunctionOneChange = useCallback((event) => {
        setButton(prevState => {
            prevState.functionOne.value = event.target.value;
            return prevState;
        });
        setFuncOne(event.target.value);
    }, []);

    useEffect(() => {
        console.log(button);
    })

    const onConfigTypeChange = () => {

    }

    const onUpdateSettings = useCallback(() => {

        let list = new WiredPushButtonList(searchParams.get('list'));
        let newButtonValue = button.getRawData();
        list.wiredPushButtonOne.value = Number(`0x${newButtonValue}`);
        const rawListData = list.getRawData();

        fetch(`http://localhost:8888/detector/${productNumber}/${mac}/wired-push-button-list`, {
            method: 'PUT',
            body: JSON.stringify({
                payload: rawListData.slice((list.headerSize * 2), (list.byteSizeInHex * list.amountOfBytes)),
            }),
            headers: { 'Content-type': 'application/json' }

        })
            .then(res => res.json())
            .then(data => {
                let value = data.value;
                let byte = value.split("").reverse().splice(0, 2).join("");
                if (byte === '00') {
                    updateUrl(newButtonValue, rawListData)
                }
            })
    }, [button, mac, productNumber, searchParams, updateUrl]);

    return (
        <div style={{ width: '90%', margin: '0 auto' }}>

            {button &&

                <div >
                    <p style={{ fontWeight: 700, fontSize: '18px', }}>{decodeURI(buttonType)} T{buttonId}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', }}>
                        <div>
                            <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0, fontSize: '14px' }}>Controls</p>
                                <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>Specify what the push button should control</p>
                            </div>

                            <Checkbox onChange={onConfigTypeChange} checked={configType === cfgType.Values.ZONE_ONE_CH_ONE}>Zone / Channel 1</Checkbox>

                        </div>

                        <div>

                            <div style={{ margin: '10px auto', display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
                                <p style={{ fontWeight: 'bold', padding: 0, margin: 0, fontSize: '14px' }}>Push button behaviour</p>
                                <p style={{ fontSize: '12px', padding: 0, margin: 0 }}>Specify what should happen when the button is pressed</p>
                            </div>

                            <Radio.Group onChange={onFunctionOneChange} value={funcOne}>

                                <Space direction="vertical">
                                    <Radio value={functionOne.functions.ONLY_ON}> Only switch ON</Radio>
                                    <Radio value={functionOne.functions.ON_OFF}> Switch ON/OFF</Radio>
                                </Space>

                            </Radio.Group>
                        </div>
                        <Button onClick={() => onUpdateSettings()}>Update setting  </Button>
                    </div>

                </div>
            }
        </div>
    )
}
