import React from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const center = {
  lat: 38.6780, // Elazığ merkez
  lng: 39.2240
};

const fields = [
  {
    name: "Sporium 23 Halı Saha",
    position: { lat: 38.6639004916114, lng: 39.15850001748057 }
  },
  {
    name: "Futbol Times Halı Saha",
    position: { lat: 38.65290531598098,lng: 39.135801413015436 }
  },
  {
    name: "Fırat Halı Saha", 
    position: { lat: 38.67319553932765, lng: 39.182803353685735 }
  },
  {
    name: "Amsterdam Halı Saha",
    position: { lat: 38.67135681176903, lng: 39.199034651554584 }
  },
  {
    name: "Fair Play Halı Saha",
    position: { lat: 38.650796491548704, lng: 39.20281259601459 }
  }
];

function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const [selected, setSelected] = React.useState(null);

  if (!isLoaded) return <div>Harita yükleniyor...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {fields.map((field, idx) => (
        <Marker
          key={idx}
          position={field.position}
          onClick={() => setSelected(field)}
        />
      ))}
      {selected && (
        <InfoWindow
          position={selected.position}
          onCloseClick={() => setSelected(null)}
        >
          <div>{selected.name}</div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default Map; 