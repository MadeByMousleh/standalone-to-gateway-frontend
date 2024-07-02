import React, { useEffect, useState } from 'react'
import WiredPushButton from '../../../../telegrams/v1/wiredPushButton/WiredPushButtonList/bytes/wiredPushButton'
import { Avatar, Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import ConfigType from '../../../../telegrams/v1/wiredPushButton/WiredPushButtonList/bytes/wiredPushButton/configType';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';


export default function WiredButtonCard({ wiredPushButton, number, typeOfDetector, buttonsList }) {

  const [button, setButton] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let btn = new WiredPushButton(wiredPushButton.value.toString(16));
    setButton(btn);
  }, [])

  const onSettingsClicked = () => {
    navigate(`buttons/${number}?buttonType=${`${button.getButtonType() === 0 ? 'Push button' : 'Switch'}&buttonValue=${wiredPushButton.value.toString(16)}&list=${buttonsList.hexString}`}`)
  }

  return (
    <>
      {button && button.configType.value !== 0 &&
        <Card
          style={{
            width: '100%',
            margin: '20px auto',
          }}
          actions={[
            <SettingOutlined onClick={() => onSettingsClicked()} key="setting" />,
          ]}
        >

          <h4 style={{ margin: 0 }}>{` ${button.getButtonType() === 0 ? 'Push button' : 'Switch'} T${number}`}</h4>

          <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>
            <p style={{ margin: ' 0', fontSize: '12px' }}> {button.getFunctionOne().description}</p>
          </div>

          <div style={{ display: 'flex', margin: '0px 0px', flexDirection: 'column' }}>

            {!button.isNotUsed()
              ?
              <>
                <div style={{ display: 'flex', columnGap: '5px', fontSize: '12px' }}>
                  <span>Controls</span>
                  {button.getActiveZones().map((zoneNr) => (
                    <p style={{ margin: ' 0', }}>{typeOfDetector === '230V' ? 'channel' : 'zone:'} {zoneNr} </p>
                  ))}
                </div>
              </>
              : 'Not used'
            }

          </div>

        </Card>
      }
    </>
  )
}
