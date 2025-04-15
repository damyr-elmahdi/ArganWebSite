import Hero from '../components/Hero';
import NewsSection from '../components/NewsSection';
import EventsSection from '../components/EventsSection';
import ResourcesSection from '../components/ResourcesSection';
import RegistrationCTA from '../components/RegistrationCTA';

export default function Home({ schoolInfo }) {
  return (
    <main className="flex-grow">
      <Hero schoolName={schoolInfo.name} foundedYear={schoolInfo.foundedYear} />
      <NewsSection />
      <EventsSection />
      <ResourcesSection />
      <RegistrationCTA schoolName={schoolInfo.name} />
    </main>
  );
}