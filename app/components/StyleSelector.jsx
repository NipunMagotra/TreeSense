import React, { useState } from 'react';
import Image from 'next/image'


function MapStyleSelector({ mapStyles, selectedStyle, handleStyleChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="absolute right-32 text-slate-700 h-20 w-40 ">
      {/* Button to show the selected style */}
      
      <button
        className="flex right-20 items-center h-20 w-40 m-2 p-2 rounded-2xl text-[12px] bg-white hover:bg-gray-200 cursor-pointer z-20 "
        onClick={toggleDropdown}
      >
        {selectedStyle ? (
          <img
            src={mapStyles.find(style => style.value === selectedStyle).image}
            alt={mapStyles}
            className="w-12 h-12 m-2" // Adjust size as needed
          />
        ) : 'Select Style'}
        <h1 className='text-slate-700'>{mapStyles.find(style => style.value === selectedStyle).label}</h1>
      </button>

      {/* Dropdown menu */}
    
        <div className={`relative ${isDropdownOpen ?'block ':'hidden   '}  top-1 right-0 mt-2 shadow-lg z-0`}>
          {mapStyles.map((style, index) => (
            <div
              key={index}
              className={`flex items-center   h-20 w-40 m-2 p-2 rounded-2xl text-[12px] bg-white hover:bg-gray-200 cursor-pointer `}
              onClick={() => {
                handleStyleChange(style.value);
                setIsDropdownOpen(false);
              }}
            >
              <Image
                width={20}
                height={20}
                src={style.image}
                alt={style.label}
                className="w-14 h-14 mr-2 -4 rounded-xl" // Adjust size as needed
              />
              <span>{style.label}</span>
            </div>
          ))}
        </div>
      
    </div>
  );
}

export default MapStyleSelector;
