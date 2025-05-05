import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/eventService";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "../utils/imageUtils";

export default function EventsSection() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        // Get events from today onwards, limited to 3
        const today = new Date().toISOString().split("T")[0];
        setLoading(true);

        const response = await getEvents({
          start_date: today,
          per_page: 3,
        });

        setUpcomingEvents(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError("Failed to load events");
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Fallback data if API call fails or returns no events
  const fallbackEvents = [
    {
      id: 1,
      title: "Parent-Teacher Conferences",
      start_time: "2025-04-20T15:00:00",
      end_time: "2025-04-20T19:00:00",
      location: "Main Hall",
      image_path: null,
    },
    {
      id: 2,
      title: "Science Fair",
      start_time: "2025-04-25T10:00:00",
      end_time: "2025-04-25T14:00:00",
      location: "Gymnasium",
      image_path: null,
    },
    {
      id: 3,
      title: "Higher Education Workshop",
      start_time: "2025-05-10T13:00:00",
      end_time: "2025-05-10T16:00:00",
      location: "Auditorium",
      image_path: null,
    },
  ];

  // Use fallback data if needed
  const eventsToDisplay =
    upcomingEvents.length > 0 ? upcomingEvents : error ? fallbackEvents : [];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <Link to="/events" className="text-[#18bebc] hover:underline">
            View All Events
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18bebc]"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {eventsToDisplay.map((event) => {
              const startDate = new Date(event.start_time);
              const eventTime = `${format(
                new Date(event.start_time),
                "h:mm a"
              )} - ${format(new Date(event.end_time), "h:mm a")}`;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md p-4"
                >
                  <div className="flex items-start mb-3">
                    {event.image_path ? (
                      <div className="h-16 w-16 flex-shrink-0 mr-4 bg-white rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={getImageUrl(event.image_path)}
                          alt={event.title}
                          className="max-h-16 max-w-16 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="bg-[#18bebc] text-white rounded p-2 mr-4 text-center min-w-[60px]">
                        <div className="text-sm font-bold">
                          {format(startDate, "MMM")}
                        </div>
                        <div className="text-xl font-bold">
                          {format(startDate, "d")}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {eventTime}
                      </p>
                      {event.location && (
                        <p className="text-gray-600 text-sm flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="text-[#18bebc] hover:underline text-sm"
                  >
                    View details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
