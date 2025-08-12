import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout';
import ToyMainPage from './components/toys/ToyMainPage';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="toys" element={<ToyMainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
