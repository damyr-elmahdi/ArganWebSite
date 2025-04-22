import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { getEvent } from "../services/eventService";
import { getImageUrl } from "../utils/imageUtils";
import EventCommentSection from "../components/EventCommentSection";
import { useAuth } from "../contexts/AuthContext";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const data = await getEvent(id);
        setEvent(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const formatEventDate = (startTime, endTime) => {
    if (!startTime || !endTime)
      return { date: "Date not available", time: "Time not available" };

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

  if (loading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || "Event not found"}
        </div>
        <div className="mt-4">
          <Link
            to="/events"
            className="text-orange-600 hover:underline flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const { date, time } = formatEventDate(event.start_time, event.end_time);

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          to="/events"
          className="text-orange-600 hover:underline flex items-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Events
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {event.image_path ? (
          <div className="w-full h-64 md:h-96 overflow-hidden relative">
            <img
              src={getImageUrl(event.image_path)}
              alt={event.title}
              className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-orange-100 via-orange-200 to-orange-100 h-48 flex items-center justify-center">
            <CalendarIcon className="h-16 w-16 text-orange-500" />
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {event.title}
          </h1>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-2 text-orange-600" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-5 w-5 mr-2 text-orange-600" />
              <span>{time}</span>
            </div>
            {event.location && (
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2 text-orange-600" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                About this event
              </h2>
              <p className="text-gray-700">{event.description}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 flex flex-wrap gap-4">
            <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors">
              Add to calendar
            </button>
            {isAuthenticated && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Register for this event
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Event Comments Section */}
      <div className="mt-8">
        <EventCommentSection eventId={event.id} />
      </div>
    </main>
  );
}
