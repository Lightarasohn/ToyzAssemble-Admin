import { Header } from "antd/es/layout/layout";
import "./LayoutHeader.css";
import { Menu } from "antd";

const LayoutHeader = ({ itemsHeader, toyzAssembleLogo, setselectedHeader, setContent }) => {
   return (
        <Header
            style={{
                display: 'flex',
                justifyContent: "space-between",
                alignItems: 'center',
                height: 100, // Header yüksekliğini resme göre ayarlayın
                lineHeight: '100px', // Menü dikey ortalama için
            }}
        >
            <div className="demo-logo" >
                <img 
                src={toyzAssembleLogo}
                alt="Toyz Assemble Logo"
                onClick={() => setContent("welcome")} />
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['Toy']}
                items={itemsHeader}
                style={{flex: 1, marginLeft: "70px"}}
                onSelect={(selected) => setselectedHeader(selected.key)}
            />
        </Header>
    );
}

export default LayoutHeader;