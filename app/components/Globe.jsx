'use client'
import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const GlobeMap = () => {
  const [map, setMap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!map) { // Check if map is already initialized
      const initMap = () => {
        const mapInstance = L.map('map-container').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        setMap(mapInstance); // Update state with the map instance
      };
      initMap();
    }
  }, [map]); // Only run this effect when map state changes

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const centerMap = async (searchTerm) => {
    if (!searchTerm) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json`);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([lat, lon], 13); // Adjust zoom level as needed
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      alert("Error fetching location data.");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      centerMap(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div id="map-container" style={{ width: '100%', height: '400px' }} />
  );
};

export default GlobeMap;
