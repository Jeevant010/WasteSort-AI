import { useState, useEffect } from 'react';
import { ecoApiService } from '../../services/eco-api.service';

function Events() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await ecoApiService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-stone-800 mb-8">Community Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="h-32 bg-emerald-900 flex items-center justify-center text-emerald-400 text-3xl font-bold">{event.day}</div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-stone-900">{event.title}</h3>
              <p className="text-stone-500 mb-4">📍 {event.location}</p>
              <button className="w-full py-2 border border-stone-200 rounded-lg font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Register</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
