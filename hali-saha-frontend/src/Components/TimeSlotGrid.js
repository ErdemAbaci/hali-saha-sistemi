// src/components/TimeSlotGrid.js
import React from 'react';

function TimeSlotGrid({ availableTimeSlots, selectedTimeSlot, handleTimeSlotSelect, loading, error }) {
  if (loading) {
    return <div className="loading-message">Saatler yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="time-slot-selection">
      <h3>Select a time slot:</h3>
      {availableTimeSlots.length > 0 ? (
        <div className="time-slots-grid">
          {availableTimeSlots.map((slot, index) => (
            <button
              key={index}
              className={`time-slot-button ${slot.booked ? 'booked' : ''} ${selectedTimeSlot === slot.time ? 'selected-slot' : ''}`}
              disabled={slot.booked}
              onClick={() => handleTimeSlotSelect(slot)}
            >
              {slot.time} {slot.booked && '(Booked)'}
            </button>
          ))}
        </div>
      ) : (
        <div className="no-slots-message">Bu tarih ve sahada uygun saat bulunamadı.</div>
      )}
    </div>
  );
}

export default TimeSlotGrid;