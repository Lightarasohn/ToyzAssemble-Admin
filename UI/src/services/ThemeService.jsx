import { ConfigProvider, theme } from "antd";

const ThemeService = ({ selectedTheme, children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: selectedTheme ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeService;
