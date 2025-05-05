import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEvent } from "../services/eventService";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "../utils/imageUtils";
import EventCommentSection from "../components/EventCommentSection";
import ImageModal from "../components/ImageModal"; // Import the new component

export default function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  
  // State for the image modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  
  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await getEvent(id);
      setEvent(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load event details. Please try again later.");
      setLoading(false);
    }
  };

  // Function to open the modal with the image
  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(true);
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

  if (loading) {
    return (
      <div className="flex-grow container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bebc]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          Event not found.
        </div>
      </div>
    );
  }

  const { date, time } = formatEventDate(event.start_time, event.end_time);

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Event Image - now clickable */}
        {event.image_path && (
          <div className="w-full bg-gray-50 flex items-center justify-center py-4">
            <img
              src={getImageUrl(event.image_path)}
              alt={event.title}
              className="max-w-full max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openImageModal(getImageUrl(event.image_path))}
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{event.title}</h1>

          <div className="space-y-3 bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center text-gray-700">
              <CalendarIcon className="h-5 w-5 mr-2 text-[#18bebc]" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <ClockIcon className="h-5 w-5 mr-2 text-[#18bebc]" />
              <span>{time}</span>
            </div>
            {event.location && (
              <div className="flex items-center text-gray-700">
                <MapPinIcon className="h-5 w-5 mr-2 text-[#18bebc]" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="prose prose-teal max-w-none mb-8">
              {event.description.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}

          {/* Comment Section */}
          <EventCommentSection eventId={event.id} />

          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link to="/events" className="text-[#18bebc] hover:underline">
              ← Back to all events
            </Link>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={modalOpen}
        imageUrl={modalImage}
        imageAlt={event.title}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}