import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/eventService";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { getImageUrl } from "../utils/imageUtils";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (date = null) => {
    try {
      setLoading(true);
      const params = {};
      
      if (date) {
        // Use the same date for both start_date and end_date to get events on a specific day
        params.start_date = date;
        params.end_date = date;
      }
      
      const response = await getEvents(params);
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const applyFilter = (e) => {
    e.preventDefault();
    fetchEvents(filterDate);
  };

  const resetFilter = () => {
    setFilterDate("");
    fetchEvents();
  };

  const formatEventDate = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Same day event
    if (start.toDateString() === end.toDateString()) {
      return {
        date: format(start, "MMMM d, yyyy"),
        time: `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`,
      };
    }

    // Multi-day event
    return {
      date: `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`,
      time: `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`,
    };
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">School Events</h1>

      {/* Simplified Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Filter Events by Date
        </h2>
        <form onSubmit={applyFilter} className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label
              htmlFor="filterDate"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Select Date
            </label>
            <input
              type="date"
              id="filterDate"
              name="filterDate"
              value={filterDate}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Apply Filter
            </button>
            {filterDate && (
              <button
                type="button"
                onClick={resetFilter}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : events.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No events found
          </h3>
          <p className="text-gray-600 mt-2">
            {filterDate ? `No events on ${format(new Date(filterDate), "MMMM d, yyyy")}` : "Check back later for upcoming events."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const { date, time } = formatEventDate(
              event.start_time,
              event.end_time
            );
            return (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                {event.image_path ? (
                  <img
                    src={getImageUrl(event.image_path)}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="bg-orange-100 h-48"></div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {event.title}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <span>{time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-gray-200 mt-4">
                    <Link
                      to={`/events/${event.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}