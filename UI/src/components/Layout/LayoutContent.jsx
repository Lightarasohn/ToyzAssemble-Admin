import { Content } from "antd/es/layout/layout";
import "./LayoutContent.css";
import { List } from "antd";

const LayoutContent = ({colorBgContainer, borderRadiusLG, content}) => {
    

  const toys = [
    {
      id: 12,
      name: "Classic Guy",
      price: 23.12
    },
    {
      id: 11,
      name: "Spider Guy",
      price: 40.54
    }
  ]

  const setMainContent = () => {
    switch(content){
      case "API/Toy":
        return(
          <List
          dataSource={toys}></List>
        )
    }
  }

    return (
        <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {() => (setMainContent())}
          </Content>
    );
}

export default LayoutContent;
