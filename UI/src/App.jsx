import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ToyMainPage from "./components/toys/ToyMainPage";
import { NotificationProvider } from "./services/NotificationService";
import ThemeService from "./services/ThemeService";
import { useState } from "react";

function App() {
  const [selectedTheme, setSelectedTheme] = useState(true)
  return (
    <ThemeService selectedTheme={selectedTheme}>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
            />}>
              <Route path="toys" element={<ToyMainPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeService>
  );
}

export default App;
