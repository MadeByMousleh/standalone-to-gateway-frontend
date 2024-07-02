import React, { useEffect, useState } from 'react';
import { Box, Card, Subtitle, Title, Unit, Value, ValueContainer } from './styled'
import { IoSunny } from 'react-icons/io5'
import { useParams } from 'react-router-dom';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Switch, Button, Radio  } from 'antd';

const { Meta } = Card;

const plainOptions = ['Apple', 'Pear', 'Orange'];



export default function MonitorPage() {

    const [zones, setZones] = useState(null);
    const [OnOff, setOnOff] = useState('OFF');

    const params = useParams();
    const { mac, productNumber } = params;

    const getLightStatus = () => {

        // fetch('http://localhost:8888/query-command', {
        //     method: 'POST',
        //     body: JSON.stringify({ mac }),
        //     headers: {
        //         'Content-type': 'application/json'
        //     }
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         if (data.status === 200) {
        //             setConnectedDevices(prevState => [...filterValues(prevState, [data].map(d => d.value))])
        //         }
        //     })

    }


    useEffect(() => {

        fetch(`http://localhost:8888/dali/get-zone-assignment-count/${mac}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setZones(data.value.zones)
                }
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => console.log(zones), [zones])

    const optionsWithDisabled = [
        {
          label: 'ON',
          value: 'ON',
        },
        {
          label: 'OFF',
          value: 'OFF',
        },
      ];


      const onChange4 = ({ target: { value } }) => {
        setOnOff(value);
      };

    return (
        <>
            <h2>Validation office room</h2>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'noWrap', columnGap: '40px', justifyContent: 'space-between' }}>

                {zones && zones.map((zone) => (

                    <Card>

                        <h3>Zone {zone.zoneNr}</h3>

                        <div style={{ display: 'flex', alignItems: 'center', columnGap: '20px', width: '100%', justifyContent: 'space-between', width: '100%' }}>
                            <p>Light is</p>
                            <Radio.Group
                                options={optionsWithDisabled}
                                onChange={onChange4}
                                value={OnOff}
                                optionType="button"
                                buttonStyle="solid"
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', columnGap: '20px', width: '100%', justifyContent: 'space-between' }}>
                            <p>Amount of lights</p>
                            {zone.count}
                        </div>

                        <br></br>
                        <Button type="primary">Show luminaires</Button>

                    </Card>
                ))}
            </div>
        </>
    )
}
