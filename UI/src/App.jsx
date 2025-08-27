import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ToyMainPage from "./components/toys/ToyMainPage";
import { NotificationProvider } from "./services/NotificationService";
import ThemeService from "./services/ThemeService";
import { useState } from "react";
import PackageMainPage from "./components/packages/PackageMainPage";
import RarityMainPage from "./components/rarities/RarityMainPage";
import ToyTypeMainPage from "./components/toyTypes/ToyTypeMainPage";
import PackagesRaritiesMainPage from "./components/packages-rarities/PackagesRaritiesMainPage";
import RandomToyMainPage from "./components/random-toy/RandomToyMainPage";

function App() {
  const [selectedTheme, setSelectedTheme] = useState(false)
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
              <Route path="packages" element={<PackageMainPage />}/>
              <Route path="rarity-types" element={<RarityMainPage />}/>
              <Route path="toy-types" element={<ToyTypeMainPage />}/>
              <Route path="packages-rarities" element={<PackagesRaritiesMainPage />}/>
              <Route path="random-toy" element={<RandomToyMainPage />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeService>
  );
}

export default App;
