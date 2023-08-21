import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker } from 'react-leaflet';

interface MarkerProps {
    center: any;
    allowDrag: boolean;
};

export const DraggableMarker = (props: MarkerProps) => {
  const [position, setPosition] = useState(props.center);
  const markerRef = useRef<any>(null);
  const myAPIKey = 'b6618ad7359b4f779daeae7e35233c67';

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker !== null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );

  useEffect(() => {
    const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${position.lat}&lon=${position.lng}&apiKey=${myAPIKey}`;
    fetch(reverseGeocodingUrl).then(result => result.json())
      .then(featureCollection => {
        const address = featureCollection.features[0].properties;
        localStorage.setItem('latAddress', address.lat);
        localStorage.setItem('lngAddress', address.lng);
      });
  }, [position]);

  return (
    <>
      <Marker
        draggable={props.allowDrag}
        position={position}
        eventHandlers={eventHandlers}
        ref={markerRef}>
      </Marker>
    </>
  );
};
