import { Link } from 'react-router-dom';

export default function EventsSection() {
  // Sample upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Conferences",
      date: "April 20, 2025",
      time: "3:00 PM - 7:00 PM",
      location: "Main Hall"
    },
    {
      id: 2,
      title: "Science Fair",
      date: "April 25, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Gymnasium"
    },
    {
      id: 3,
      title: "Higher Education Workshop",
      date: "May 10, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Auditorium"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <Link to="/events" className="text-orange-600 hover:underline">View All Events</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md p-4">
              <div className="flex items-start mb-3">
                <div className="bg-orange-600 text-white rounded p-2 mr-4">
                  <div className="text-sm font-bold">
                    {event.date.split(' ')[1]}
                  </div>
                  <div className="text-xl font-bold">
                    {event.date.split(' ')[0]}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{event.time}</p>
                  <p className="text-gray-600 text-sm">{event.location}</p>
                </div>
              </div>
              <a href="#" className="text-orange-600 hover:underline text-sm">Add to calendar</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}