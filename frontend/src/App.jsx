import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import EventsSection from './components/EventsSection';
import ResourcesSection from './components/ResourcesSection';
import RegistrationCTA from './components/RegistrationCTA';
import Footer from './components/Footer';

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header schoolName={schoolInfo.name} ministry={schoolInfo.ministry} tagline={schoolInfo.tagline} />
      <Hero schoolName={schoolInfo.name} foundedYear={schoolInfo.foundedYear} />
      <main className="flex-grow">
        <NewsSection />
        <EventsSection />
        <ResourcesSection />
        <RegistrationCTA schoolName={schoolInfo.name} />
      </main>
      <Footer schoolInfo={schoolInfo} />
    </div>
  );
}