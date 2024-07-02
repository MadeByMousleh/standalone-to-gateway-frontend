import styled from 'styled-components';
import { SettingOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';


export const BulbIcon = styled(BulbFilled)`

color: ${({isConnected}) => isConnected && '#27df9b'};

`;