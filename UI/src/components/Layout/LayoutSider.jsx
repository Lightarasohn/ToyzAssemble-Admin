import Sider from "antd/es/layout/Sider";
import "./LayoutSider.css"
import { Menu } from "antd";

const LayoutSider = ({ itemsSider, colorBgContainer, setSelectedSider}) => {
    return (
        <Sider style={{ display: 'flex', background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['API']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0, width: "200px" }}
            items={itemsSider}
            onSelect={(item) => setSelectedSider(item.key)}
          />
        </Sider>
    );
}

export default LayoutSider;