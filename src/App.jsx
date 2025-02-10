import './App.css';
import ScanPage from './pages/ScanPage';
import DetectorPage from './pages/DetectorPage';
import React, { useCallback, useState } from 'react';

import { StrictMode } from 'react';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SettingsTab from './pages/DetectorPage/SettingsTab';
import ButtonsTab from './pages/DetectorPage/ButtonsTab';
import ButtonSettingsPage from './pages/DetectorPage/ButtonsTab/ButtonSettingsPage';
import SensitivityPage from './pages/DetectorPage/FineTuningPage/SensitivityPage';
import AllSectorsPage from './pages/DetectorPage/FineTuningPage/SensitivityPage/AllSectorsPage';
import DifferentSectorsPage from './pages/DetectorPage/FineTuningPage/SensitivityPage/DifferentSectorsPage';
import SectorPage from './pages/DetectorPage/FineTuningPage/SensitivityPage/SectorPage';
import FunctionsPage from './pages/DetectorPage/FunctionsPage';
import MasterSecondaryFunction from './pages/DetectorPage/FunctionsPage/MasterSecondaryFunction';
import { MobileScanPage } from './pages/MobileScanPage';
import SecondaryList from './pages/DetectorPage/FunctionsPage/MasterSecondaryFunction/SecondaryList';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Space } from 'antd';
import {ScanPageTable} from './pages/ScanPageTable';
import ToolsPage from './pages/DetectorPage/ToolsPage';
import FirmwareUpgrade from './pages/DetectorPage/ToolsPage/FirmwareUpgradePage';
import PirDetection from './pages/DetectorPage/ToolsPage/PirDetection';
import MonitorPage from './pages/MonitorPage';
import ChartPages from './pages/ChartsPages/index';
import LuminariesPage from './pages/LuminariesPage';

const router = createBrowserRouter([
  {
    
      path: "/",
      element: <ScanPageTable />
    },
  
    {
    
      path: "/charts",
      element: <ChartPages />
    },
  

  {
    path: '/detector/:mac/:productNumber/functions/master-secondary',
    element: <MasterSecondaryFunction />,
  },

  {
    path: '/detector/:mac/:productNumber/functions/master-secondary/secondary-list',
    element: <SecondaryList />,
  },


  {
    path: '/detector/:mac/:productNumber/functions',
    element: <FunctionsPage />,
  },

  {
    path: "/detector/:mac/:productNumber/tools/firmware-upgrade",
    element: <FirmwareUpgrade />
  },

  {
    path: "/detector/:mac/:productNumber/tools/pir-detection",
    element: <PirDetection />
  },


  {
    path: "/detector/:mac/:productNumber/tools",
    element: <ToolsPage />
  },

 
  {
    path: '/detector/:mac/:productNumber/fine-tuning/sensitivity',
    element: <SensitivityPage />,

  },

  {
    path: '/detector/:mac/:productNumber/fine-tuning/sensitivity/all-sectors',
    element: <AllSectorsPage />,

  },

  {
    path: '/detector/:mac/:productNumber/fine-tuning/sensitivity/different-sectors',
    element: <DifferentSectorsPage />,

  },

  {
    path: '/detector/:mac/:productNumber/fine-tuning/sensitivity/different-sectors/sector/:sector',
    element: <SectorPage />,
  },


  {
    path: '/detector/:mac/:productNumber/settings',
    element: <SettingsTab />,
  },

  {
    path: '/detector/:mac/:productNumber/buttons/:buttonId',
    element: <ButtonSettingsPage />,
  },

  {
    path: '/detector/:mac/:productNumber/buttons/',
    element: <ButtonsTab />,
  },

  
  {
    path: '/detector/:mac/:productNumber/luminaries/',
    element: <LuminariesPage />,
  },


  {
    path: '/detector/monitor/:mac/:productNumber',
    element: <MonitorPage />,
  },


  {
    path: '/detector/:mac/:productNumber',
    element: <DetectorPage />,
  },


]);

const items = [
  {
    label: (<a href="/"> Scan </a>),
    key: 'Scan',
    icon: <MailOutlined />,
  },
  {
    label: (<a href="/tools"> Tools </a>),
    key: 'Tools',
    icon: <AppstoreOutlined />,
  },
];

function App() {
  const [current, setCurrent] = useState('mail');

  const onClick = useCallback((e) => {
    console.log('click ', e);
    setCurrent(e.key);
  }, []);

  return (
    <>
      <div>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      </div>
      <div style={{
        backgroundColor: '#f5f5f5',
        height: '90%',
        margin: '40px auto 20px auto',
        width: '80%'
      }}>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
