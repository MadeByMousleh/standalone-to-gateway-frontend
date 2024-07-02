import SettingsTab from "./SettingsTab";
import { Button, Radio, Space, notification, Tabs } from 'antd'
import ButtonsTab from "./ButtonsTab";
import FineTuningPage from "./FineTuningPage";
import FunctionsPage from "./FunctionsPage";
import ToolsPage from "./ToolsPage";


const DetectorPage = () => {
    const [api, contextHolder] = notification.useNotification();

  const items = [
    {
      key: '1',
      label: 'Settings',
      children: <SettingsTab />,
    },
    {
      key: '2',
      label: 'Buttons',
      children: <ButtonsTab />,
    },
    {
      key: '3',
      label: 'Fine-tuning',
      children: <FineTuningPage />,
    },

    {
        key: '4',
        label: 'Functions',
        children: <FunctionsPage />,
      },

      {
        key: '5',
        label: 'Tools',
        children: <ToolsPage />,
      },
  ];

  return (
    <div >
            {contextHolder}
      <Tabs
        defaultActiveKey="1"
        items={items}
        indicatorSize={(origin) => origin - 16}
        centered
      />

    </div>
  );


}


export default DetectorPage;