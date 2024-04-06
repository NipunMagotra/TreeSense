import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('satellite-v9');
  const [screenshot, setScreenshot] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const intervalRef = useRef(null);
  const mapContainerRef = useRef(null); // Ref for map container
  const mapStyles = [
    { label: 'Streets', value: 'streets-v12' },
    { label: 'Outdoors', value: 'outdoors-v12' },
    { label: 'Light', value: 'light-v11' },
    { label: 'Dark', value: 'dark-v11' },
    { label: 'Satellite', value: 'satellite-v9' },
    { label: 'Satellite Streets', value: 'satellite-streets-v12' },
    { label: 'Navigation Day', value: 'navigation-day-v1' },
    { label: 'Navigation Night', value: 'navigation-night-v1' }
  ];

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FoaWx4IiwiYSI6ImNsdGVoNXhhczBnaXoya212dXk2YW1va2gifQ.LXViy6AEBNtSxyFXUPAG4Q';
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: `mapbox://styles/mapbox/${selectedStyle}`,
      center: [80, 20],
      zoom: 2,
      projection: 'globe',
    });

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });
    });

    setMap(map);

    const rotateMap = () => {
      const bearing = map.getBearing() + 2;
      map.easeTo({ bearing: bearing });
    };

    intervalRef.current = setInterval(rotateMap, 50);

    const stopRotationOnClick = () => {
      clearInterval(intervalRef.current);
      map.off('click', stopRotationOnClick);
    };

    map.on('click', stopRotationOnClick);

    return () => {
      clearInterval(intervalRef.current);
      map.off('click', stopRotationOnClick);
    };
  }, [selectedStyle]);

 
  const handleChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleSearch = async (query) => {
    if (map && query) {
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=pk.eyJ1Ijoic2FoaWx4IiwiYSI6ImNsdGVoNXhhczBnaXoya212dXk2YW1va2gifQ.LXViy6AEBNtSxyFXUPAG4Q`);
        const data = await response.json();

        if (data.features.length > 0) {
          setSearchResults(data.features);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result) => {
    const [longitude, latitude] = result.center;
    map.flyTo({ center: [longitude, latitude], zoom: 16 });
    clearInterval(intervalRef.current);
    
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleStyleChange = (style) => {
    setSelectedStyle(style);
    if (map) {
      map.setStyle(`mapbox://styles/mapbox/${style}`);
    }
  };

  const captureMapScreenshot = async () => {
    try {
      const { latitude, longitude, zoom, width, height } = getMapParameters();
      const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/${selectedStyle}/static/${longitude},${latitude},${zoom}/${width}x${height}?access_token=pk.eyJ1Ijoic2FoaWx4IiwiYSI6ImNsdGVoNXhhczBnaXoya212dXk2YW1va2gifQ.LXViy6AEBNtSxyFXUPAG4Q`);
      if (!response.ok) {
        throw new Error('Failed to fetch static map image');
      }
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setScreenshot(imageUrl);
      setShowPreview(true);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  const getMapParameters = () => {
    const center = map.getCenter();
    console.log('Center:', center);
    const zoom = map.getZoom();
    console.log('Zoom:', zoom);
    const width = mapContainerRef.current.offsetWidth;
    console.log('Width:', width);
    const height = mapContainerRef.current.offsetHeight;
    console.log('Height:', height);
    const latitude = center.lat;
    console.log('Latitude:', latitude);
    const longitude = center.lng;
    console.log('Longitude:', longitude);
    return { latitude, longitude, zoom, width, height };
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setScreenshot(null); // Reset screenshot
  };
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !showPreview) { // Set cropping state to true
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showPreview]);
  
  return (
    <div>
      <div className="relative w-full h-screen">
        <div ref={mapContainerRef} id="map" className="absolute top-0 left-0 w-full h-full"></div>
        <div className="absolute top-4 left-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Search location..."
            className="p-2 h-8 rounded opacity-70"
          />
          <button onClick={captureMapScreenshot} className="mt-2">Take Screenshot</button> {/* Button to capture screenshot */}

          <div className="mt-2 opacity-80">
            {searchResults.map((result, index) => (
              <div key={index} onClick={() => handleResultClick(result)} className="cursor-pointer hover:bg-gray-200 px-3 py-2 border-b bg-white border-gray-300">{result.place_name}</div>
            ))}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          {mapStyles.map((style, index) => (
            <div key={index} className="mb-2">
              <input
                type="radio"
                id={style.value}
                value={style.value}
                checked={selectedStyle === style.value}
                onChange={() => handleStyleChange(style.value)}
              />
              <label htmlFor={style.value}>{style.label}</label>
            </div>
          ))}
        </div>
      </div>
      {showPreview && screenshot && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75">
         <div className="relative bg-white p-4 rounded shadow-lg">
  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={handleClosePreview}>Close</button> {/* Close button */}
  <img
    src={screenshot}
    alt="Screenshot"
    style={{ maxWidth: 'calc(100% - 32px)', maxHeight: 'calc(100% - 32px)' }}
  />
</div>

        </div>
      )}
    </div>
  );
};

export default Map;
