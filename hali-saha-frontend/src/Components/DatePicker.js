// src/components/DatePickerComponent.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker'ın kendi CSS'i

function DatePicker({ selectedDate, handleDateChange }) {
  return (
    <div className="date-selection">
      <h4>Select a date:</h4>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        minDate={new Date()} // Geçmiş tarihleri seçimi engeller
        inline // Takvimi her zaman gösterir
        // highlightDates={[new Date(), new Date().setDate(new Date().getDate() + 1)]} // İstersen belirli tarihleri vurgula
      />
    </div>
  );
}

export default DatePicker;