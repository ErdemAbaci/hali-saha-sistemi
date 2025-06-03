import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';

const HaliSahaCard = ({ id, name, location, rating, reviewCount, price, image, fields, isAvailable = true, bookingUrl }) => {
  const handleCardClick = (e) => {
    if (bookingUrl) {
      e.preventDefault();
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const cardContent = (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${bookingUrl ? 'cursor-pointer' : ''}`}
      onClick={bookingUrl ? handleCardClick : undefined}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Şu An Dolu
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex items-center bg-green-600 text-white text-sm font-medium px-2 py-1 rounded">
            {price} ₺
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 text-gray-500" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-4 h-4 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>24 Saat Açık</span>
          </div>
          <div className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
            Detaylar <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );

  return bookingUrl ? (
    <div className="h-full">
      {cardContent}
    </div>
  ) : (
    <Link to={`/saha/${id}`} className="block h-full">
      {cardContent}
    </Link>
  );
};

export default HaliSahaCard;
