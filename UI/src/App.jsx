import './App.css';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, theme } from 'antd';
import LayoutContent from './components/Layout/LayoutContent';
import toyzAssembleLogo from './assets/ToyzAssembleLogo.png';
import LayoutHeader from './components/Layout/LayoutHeader';
import LayoutSider from './components/Layout/LayoutSider';
import LayoutBreadcrumb from './components/Layout/LayoutBreadcrumb';
import { useEffect, useState, useCallback } from 'react';

function App() {
  const [selectedHeader, setSelectedHeader] = useState("Toy");
  const [selectedSider, setSelectedSider] = useState("API");
  const [itemsHeader, setItemsHeader] = useState([]);
  const [content, setContent] = useState("welcome");

  const itemsSider = [
    { key: 'API', label: 'API', icon: <UserOutlined /> },
    { key: 'RandomGuy', label: 'Random Guy', icon: <LaptopOutlined /> },
    { key: 'History', label: 'History', icon: <NotificationOutlined /> },
  ];

  const SetHeaderItems = useCallback(() => {
    switch (selectedSider) {
      case "API":
        setItemsHeader([
          { label: 'Toy', key: 'Toy', icon: <UserOutlined /> },
          { label: 'Package', key: 'Package', icon: <LaptopOutlined /> },
          { label: 'Toy Type', key: 'Toy Type', icon: <LaptopOutlined /> }
        ]);
        break;
      default:
        setItemsHeader([]);
        break;
    }
  }, [selectedSider]);

  const SetMainContent = () => {
    if(selectedSider == "API"){
      switch(selectedHeader){
        case "Toy":
          
          break;
        case "Package":
          break;
        case "Toy Type":
          break;
        default:
          break;
      }
    }
    /*else if(selectedSider == "RandomGuy"){
      
    }
    else{

    }*/
  }

  useEffect(() => {
    console.log(selectedHeader);
  }, [selectedHeader]);

  useEffect(() => {
    console.log(selectedSider);
  }, [selectedSider]);

  useEffect(() => {
    SetHeaderItems();
  }, [SetHeaderItems]);

  const colorBgContainer = theme.useToken().token.colorBgContainer;
  const borderRadiusLG = theme.useToken().token.borderRadiusLG;

  return (
    <Layout style={{
      minHeight: '100vh',
      minWidth: '100vw',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <LayoutHeader 
      itemsHeader={itemsHeader} 
      toyzAssembleLogo={toyzAssembleLogo} 
      setselectedHeader={setSelectedHeader}
      setContent={setContent} />
      <Layout style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <LayoutSider
          itemsSider={itemsSider}
          colorBgContainer={colorBgContainer}
          setSelectedSider={setSelectedSider}
        />
        <Layout style={{ padding: '0 24px 24px' }}>
          <LayoutBreadcrumb />
          <LayoutContent
            colorBgContainer={colorBgContainer}
            borderRadiusLG={borderRadiusLG}
          />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;