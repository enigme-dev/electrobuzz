import React, { ReactNode, useCallback, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

interface MapProps {
  marker?: ReactNode;
  isLoaded: any;
  locLatLng: { lat: number; lng: number };
}

const MyMapComponent = ({ marker, isLoaded, locLatLng }: MapProps) => {
  const [map, setMap] = useState(null);
  const center = {
    lat: locLatLng.lat,
    lng: locLatLng.lng,
  };
  const onLoad = useCallback((map: any) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: any) => {
    setMap(map);
  }, []);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerClassName="w-full h-[400px]"
        center={center}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onBoundsChanged={() => locLatLng}
      >
        {marker}
      </GoogleMap>
    </div>
  ) : (
    <div></div>
  );
};

export default MyMapComponent;
