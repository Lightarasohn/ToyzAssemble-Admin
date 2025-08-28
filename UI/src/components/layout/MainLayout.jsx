import { useState, useEffect } from "react";
import {
  TeamOutlined,
  UserOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
  SwitcherOutlined,
  AppstoreOutlined,
  AppstoreFilled,
  AppstoreAddOutlined,
  UserSwitchOutlined,
  DeleteTwoTone,
  DeleteOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Card, Layout, Menu, theme, Button } from "antd";
import ToyzAssembleLogo from "../../assets/logo/ToyzAssembleLogo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { breadcrumbNameMap } from "../../services/BreadcrumbNameMap";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = ({ selectedTheme, setSelectedTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Responsive breakpoint kontrolü
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    { key: "1", icon: <TeamOutlined />, label: "Toys", url: "/toys" },
    { key: "2", icon: <SwitcherOutlined />, label: "Packages", url: "/packages" },
    { key: "3", icon: <AppstoreOutlined />, label: "Rarity Types", url: "/rarity-types"},
    { key: "4", icon: <AppstoreFilled />, label: "Toy Types", url: "/toy-types"},
    { key: "5", icon: <AppstoreAddOutlined />, label: "Packages-Rarities", url: "/packages-rarities"},
    { key: "6", icon: <UserSwitchOutlined />, label: "Random Toy", url: "/random-toy"},
    { key: "10", icon: <DeleteOutlined />, label: "Deleted", url: "/deleted"},
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

  useEffect(() => {
  // Önce tam eşleşme kontrolü yap
  let currentItem = items.find((item) => location.pathname === item.url);
  // Tam eşleşme bulunamazsa, startsWith kontrolü yap
  if (!currentItem) {
    currentItem = items.find((item) =>
      location.pathname.startsWith(item.url)
    );
  }
  setSelectedMenuKey(currentItem ? [currentItem.key] : []);
}, [location.pathname]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        trigger={isMobile ? null : undefined} // Mobilde trigger'ı gizle
        style={{
          // Mobil için fixed, masaüstü için relative
          position: isMobile ? "fixed" : "sticky",
          zIndex: isMobile ? 1000 : "auto",
          // Mobil için 100vh, masaüstü için sticky pozisyon
          height: isMobile ? "100vh" : "100vh",
          top: isMobile ? 0 : 0,
          left: isMobile ? 0 : "auto",
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1) 0s",
          boxShadow:
            isMobile && !collapsed ? "2px 0 8px rgba(0,0,0,0.15)" : "none",
          // Masaüstünde scroll davranışını iyileştir
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: collapsed ? "16px 8px" : "16px",
            minHeight: "64px",
            transition: "all 0.3s ease",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            flexShrink: 0, // Logo'nun küçülmesini önle
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src={ToyzAssembleLogo}
              alt="Toyz Assemble Logo"
              style={{
                width: collapsed ? "32px" : "48px",
                height: collapsed ? "32px" : "48px",
                transition: "all 0.3s ease",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Link>
        </div>

        {/* Menu Container */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            items={items.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.url}>{item.label}</Link>,
            }))}
            style={{
              border: "none",
              background: "transparent",
              flex: 1,
            }}
            selectedKeys={selectedMenuKey} // artık array
            onSelect={(item) => setSelectedMenuKey([item.key])}
          />
        </div>
      </Sider>

      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 999,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Main Content Area */}
      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: isMobile ? 0 : 0,
          minHeight: "100vh",
          // Mobilde sider'ın altında görünmesini sağla
          position: "relative",
        }}
      >
        {/* Header */}
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            background: colorBgContainer,
            height: "64px",
            flexShrink: 0,
            borderBottom: "1px solid",
            // Mobilde header'ın sider'ın üstünde olmasını sağla
            //zIndex: isMobile ? 1001 : "auto",
            position: "relative",
          }}
        >
          {/* Mobil Hamburger Menu Butonu */}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(false)}
              style={{
                marginRight: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
              }}
            />
          )}

          <Card
            size="small"
            className="main-header-card"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: borderRadiusLG,
              display: "flex",
              justifyContent: "flex-start",
              justifySelf: "flex-start",
              alignItems: "center",
              border: "none",
            }}
            bodyStyle={{
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Breadcrumb
              className="main-header-breadcrumb"
              style={{
                minWidth: "200px",
                margin: 0,
                fontSize: "14px",
              }}
            >
              {breadcrumbItems}
            </Breadcrumb>
          </Card>
          <Button
            type="default"
            className="main-header-btn"
            style={{
              display: "flex",
              justifySelf: "flex-end",
            }}
            onClick={() => setSelectedTheme(!selectedTheme)}
            icon={selectedTheme ? <SunOutlined /> : <MoonOutlined />}
          ></Button>
        </Header>

        {/* Content Area */}
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "16px",
            overflow: "hidden", // Ana overflow'u kaldır
          }}
        >
          <Card
            style={{
              flex: 1,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              display: "flex",
              flexDirection: "column",
              minHeight: 0, // Flex shrinking için gerekli
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "auto", // Sadece içerik alanında scroll
                minHeight: 0, // Flex shrinking için gerekli
              }}
            >
              <Outlet />
            </div>
          </Card>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: "center",
            flexShrink: 0,
            padding: "16px",
            borderTop: "1px solid",
            fontSize: "14px",
          }}
        >
          Toyz Assemble ©{new Date().getFullYear()}
        </Footer>
      </Layout>
      <style>
        {`
          @media (max-width: 600px) {
            .main-header-btn {
              min-width: 32px !important;
              width: 32px !important;
              height: 32px !important;
              font-size: 16px !important;
              padding: 0 !important;
            }
            .main-header-breadcrumb {
              font-size: 12px !important;
              max-width: 70vw !important;
              overflow-x: auto !important;
              white-space: nowrap !important;
            }
            .main-header-card {
              padding: 0 4px !important;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default MainLayout;
