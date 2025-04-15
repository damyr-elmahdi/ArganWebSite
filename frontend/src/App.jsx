import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import News from './pages/News';
import Events from './pages/Events';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  // School information as a central source of truth
  const schoolInfo = {
    name: "Argan High School",
    ministry: "Ministry of Education and Early Childhood Education",
    tagline: "Nurturing Minds, Building Futures",
    address: "123 Education Street, Anytown, ST 12345",
    phone: "(555) 123-4567",
    email: "info@arganhighschool.edu",
    foundedYear: 2010,
    currentYear: new Date().getFullYear()
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header schoolName={schoolInfo.name} ministry={schoolInfo.ministry} tagline={schoolInfo.tagline} />
        <Routes>
          <Route path="/" element={<Home schoolInfo={schoolInfo} />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer schoolInfo={schoolInfo} />
      </div>
    </BrowserRouter>
  );
}