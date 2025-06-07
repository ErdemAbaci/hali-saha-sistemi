import React, { useState } from 'react';
import { Star } from 'lucide-react'; // Assuming you use lucide-react for icons

const ReviewForm = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingClick = (rate) => {
    setRating(rate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Lütfen bir puan seçin.'); // Or use a toast notification
      return;
    }
    if (!comment.trim()) {
      alert('Lütfen yorumunuzu yazın.'); // Or use a toast notification
      return;
    }
    onSubmit({ rating, comment });
    // Optionally reset form after submission if parent doesn't unmount/hide it
    // setRating(0);
    // setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Puanınız:</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-7 h-7 cursor-pointer transition-colors duration-150 
                          ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Yorumunuz:</label>
        <textarea
          id="comment"
          name="comment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Halı saha hakkındaki düşüncelerinizi paylaşın..."
        />
      </div>
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isLoading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
