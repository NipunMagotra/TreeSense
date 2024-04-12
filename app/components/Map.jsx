'use client'
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapStyleSelector from './StyleSelector';
import street from '../../public/street.png';

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
    { label: 'Satellite', value: 'satellite-v9',  image:'/sat.png' },
    { label: 'Streets', value: 'streets-v12',  image:'/street.png' },
    { label: 'Dark', value: 'dark-v11',  image:'/dark.png' },
    { label: 'Light', value: 'light-v11',  image:'/light.png' },
    { label: 'Satellite Streets', value: 'satellite-streets-v12',  image:'/sat2.png' },
    { label: 'Navigation Day', value: 'navigation-day-v1',  image:'/day.png' },
    { label: 'Navigation Night', value: 'navigation-night-v1',  image:'/night.png' }
  ];

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FoaWx4IiwiYSI6ImNsdW56eWg1czFqaTkybW4ycGZka2ZkYTUifQ.GTewW_1jNHqC4C_0cb0zNg';
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
      console.log('true')
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=pk.eyJ1Ijoic2FoaWx4IiwiYSI6ImNsdW56eWg1czFqaTkybW4ycGZka2ZkYTUifQ.GTewW_1jNHqC4C_0cb0zNg`);
      console.log('searched')
        
        const data = await response.json();
      console.log('data',data)

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
      const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/${selectedStyle}/static/${longitude},${latitude},${zoom}/${width}x${height}?access_token=pk.eyJ1Ijoic2FoaWx4IiwiYSI6ImNsdW56eWg1czFqaTkybW4ycGZka2ZkYTUifQ.GTewW_1jNHqC4C_0cb0zNg`);
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
    const width = Math.min(mapContainerRef.current.offsetWidth, 1280);
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
    <div className='h-screen w-screen '>
      <div className="relative w-full h-screen">
        <div ref={mapContainerRef} id="map" className="absolute top-0 left-0 w-full h-full"></div>
        <div className="absolute top-4 left-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Search location..."
            className="p-2 h-8 rounded opacity-70 text-black"
          />
          <button onClick={captureMapScreenshot} className="mt-2">Take Screenshot</button> {/* Button to capture screenshot */}

          <div className="mt-2 opacity-80 text-black">
            {searchResults.map((result, index) => (
              <div key={index} onClick={() => handleResultClick(result)} className="cursor-pointer hover:bg-gray-200 px-3 py-2 border-b bg-white border-gray-300">{result.place_name}</div>
            ))}
          </div>
        </div>
        <div className='absolute right-0 top-0' >
<MapStyleSelector mapStyles={mapStyles} selectedStyle={selectedStyle} handleStyleChange={handleStyleChange}/>
        </div>
        {/* <div className="absolute top-4 right-4 text-black">
  <select value={selectedStyle} onChange={(e) => handleStyleChange(e.target.value)}>
    {mapStyles.map((style, index) => (
      <option key={index} value={style.value}>
        {style.label}
      </option>
    ))}
  </select>
</div> */}
      </div>
      {showPreview && screenshot && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75 z-20">
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
