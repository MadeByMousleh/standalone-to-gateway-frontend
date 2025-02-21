import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@mui/icons-material'
import { Button, Card, Col, Row, Statistic } from 'antd'
import React from 'react'
import { IoBulbOutline, IoRadioButtonOn } from 'react-icons/io5'

export default function DetectorPcPage() {
    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Card variant="borderless">
                        <Statistic
                            title="DALI Luminaries detected (102 devices)"
                            value={25}
                            precision={0}
                            valueStyle={{
                                color: '#333',
                            }}
                            prefix={<IoBulbOutline />}
                            suffix="units"
                        />
                        <Button style={{marginTop: 20}}>See more</Button>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card variant="borderless">
                        <Statistic style={{fontSize: 20}}
                            title="DALI Input devices detected (103 devices)"
                            value={15}
                            precision={0}
                            valueStyle={{
                                color: '#333',
                            }}
                            prefix={<IoRadioButtonOn /> }
                            suffix="units"
                        />
                        <Button style={{marginTop: 20}}>See more</Button>
                    </Card>
                </Col>
            </Row>


        </div>
    )
}
