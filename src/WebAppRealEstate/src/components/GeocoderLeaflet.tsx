import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Geocoder } from 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

export const GeocoderLeaflet = () => {
  const map = useMap();

  useEffect(() => {
    const GeocoderControl = new Geocoder();
    GeocoderControl.addTo(map);
    GeocoderControl.on('markgeocode', function (e) {
      const lat_lang = e.geocode.center;
      const lat = e.geocode.center.lat;
      const lng = e.geocode.center.lng;
      const house_number = e.geocode.name.split(', ')[0];
      const road = e.geocode.name.split(', ')[1];
      const postcode = e.geocode.name.split(', ')[8];
      const state = e.geocode.name.split(', ')[9];
      const city = e.geocode.name.split(', ')[4];
      new L.Marker(lat_lang).addTo(map);
      localStorage.setItem('latlng', JSON.stringify(lat_lang));
      localStorage.setItem('lat', JSON.stringify(lat));
      localStorage.setItem('lng', JSON.stringify(lng));
      const address = {house_number, road, city, postcode, state, lat, lng};
      localStorage.setItem('address', JSON.stringify(address));
    });
  }, []);

  return null;
};
