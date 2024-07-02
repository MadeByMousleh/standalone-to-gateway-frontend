import React, { useState } from 'react'
import { Button, Card, Radio, Space } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function SensitivityPage() {
  const [sameValueForSectors, setSameValueForSectors] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const onContinue = () => {
    if (sameValueForSectors) return navigate('all-sectors' + location.search);
    navigate('different-sectors' + location.search, {replace: true})
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', height: '100%' }}>

      <h3 style={{ padding: 0, margin: 0 }}>Sensitivity</h3>
      <p style={{ padding: 0, margin: 0, fontSize: '14px' }}>Set the detectors sensitivity</p>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>


        <Radio.Group onChange={e => setSameValueForSectors(!!e.target.value)} value={sameValueForSectors}>

          <Space direction="vertical">
            <Radio value={true}> Same sensitivity for all sectors</Radio>
            <Radio value={false}> Different sensitivity for each sector</Radio>
          </Space>

        </Radio.Group>

        <Button onClick={() => onContinue()}>Continue</Button>
      </div>
    </div>
  )
}
