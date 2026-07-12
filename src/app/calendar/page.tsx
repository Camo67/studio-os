'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', time: '09:00', type: 'meeting' });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const getEventsForDate = (date: string) => events.filter(e => e.date === date);

  const eventTypeColors: Record<string, string> = {
    meeting: 'bg-primary',
    shoot: 'bg-green-500',
    deadline: 'bg-danger',
    gear: 'bg-accent',
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const handleAddEvent = () => {
    if (!selectedDate) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...form,
      date: selectedDate,
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
    setForm({ title: '', time: '09:00', type: 'meeting' });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <button onClick={() => { setSelectedDate(new Date().toISOString().split('T')[0]); setShowModal(true); }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">+ Add Event</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-700 rounded-lg text-white">←</button>
            <h2 className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-700 rounded-lg text-white">→</button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDay }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square p-2" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = getEventsForDate(dateStr);
              const isToday = new Date().getDate() === day && 
                              new Date().getMonth() === currentDate.getMonth() &&
                              new Date().getFullYear() === currentDate.getFullYear();
              
              return (
                <div 
                  key={day}
                  className={`aspect-square p-2 rounded-lg border cursor-pointer transition-colors ${
                    isToday ? 'border-primary bg-primary/10' : 'border-gray-700 hover:bg-gray-700'
                  } ${selectedDate === dateStr ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-white'}`}>{day}</div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div key={event.id} className={`text-xs text-white px-1 py-0.5 rounded truncate ${eventTypeColors[event.type]}`}>{event.title}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow p-6">
          <h3 className="font-bold text-white mb-4">Upcoming Events</h3>
          {events.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {events.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10).map(event => (
                <div key={event.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-800">
                  <div className={`w-3 h-3 rounded-full mt-1 ${eventTypeColors[event.type]}`} />
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.date} at {event.time}</p>
                  </div>
                  <button onClick={() => handleDeleteEvent(event.id)} className="text-gray-500 hover:text-danger text-sm">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Add Event on ${selectedDate || 'selected date'}`}>
        <FormField label="Event Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Client Meeting" required />
        <FormField label="Time" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} required />
        <FormField label="Type" value={form.type} onChange={e => setForm({...form, type: e.target.value})} as="select" options={[
          { value: 'meeting', label: 'Meeting' },
          { value: 'shoot', label: 'Shoot' },
          { value: 'deadline', label: 'Deadline' },
          { value: 'gear', label: 'Gear' },
        ]} />
        <ButtonGroup onCancel={() => setShowModal(false)} onSubmit={handleAddEvent} />
      </Modal>
    </div>
  );
}