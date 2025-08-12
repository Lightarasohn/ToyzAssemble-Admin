import { useState } from "react";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Layout, Menu, theme } from "antd";
import ToyzAssembleLogo from "../../assets/logo/ToyzAssembleLogo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { breadcrumbNameMap } from "../../services/BreadcrumbNameMap";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    { key: 1, icon: <TeamOutlined />, label: "Toys", url: "/toys" },
    { key: 2, icon: <UserOutlined />, label: "Users", url: "/users" },
  ];

  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return (
        <Breadcrumb.Item key={url}>
          {index < pathSnippets.length - 1 ? (
            <Link to={url}>{breadcrumbNameMap[url]}</Link>
          ) : (
            breadcrumbNameMap[url]
          )}
        </Breadcrumb.Item>
      );
    }),
  ];

  return (
    <Layout style={{ height: "100%" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            padding: collapsed ? "16px 0" : "16px",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
        >
          <Link to="/">
            <img
              src={ToyzAssembleLogo}
              alt="Toyz Assemble Logo"
              style={{
                maxWidth: collapsed ? "40px" : "60%",
                transition: "all 0.3s ease",
              }}
            />
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={items.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: !collapsed ? (
              <Link to={item.url}>{item.label}</Link>
            ) : (
              <Link to={item.url}></Link>
            ),
          }))}
          style={{ transition: "all 0.3s ease" }}
        />
      </Sider>

      <Layout style={{ gap: "16px" }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            maxHeight: "64px",
            overflow: "hidden",
          }}
        >
          <Card
            size="small"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: borderRadiusLG,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Breadcrumb
              style={{
                padding: "0 16px",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {breadcrumbItems}
            </Breadcrumb>
          </Card>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Card
            style={{
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Card>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Toyz Assemble ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
