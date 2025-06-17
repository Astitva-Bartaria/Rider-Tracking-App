import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import pikachu from "./assets/PikachuSVGFile.svg";
import L from "leaflet";
import AutocompleteInput from "./components/AutocompleteInput";
import AnimatedRider from "./components/AnimatedRider";
import { toast } from "react-toastify";

const pikachuIcon = new L.Icon({
  iconUrl: pikachu,
  iconSize: [40, 40],
});

const ClickHandler = ({ onSelectLocation }) => {
  useMapEvents({
    click(e) {
      const lat = e?.latlng?.lat;
      const lng = e?.latlng?.lng;
      if (lat && lng) {
        onSelectLocation?.([lat, lng]);
      }
    },
  });
  return null;
};

const MapWithRoute = () => {
  const [start, setStart] = useState("28.618771,77.027957");
  const [end, setEnd] = useState("28.672911,77.104996");
  const [startText, setStartText] = useState("Pikachu");
  const [endText, setEndText] = useState("Michu");

  const [route, setRoute] = useState([]);
  const [clickMode, setClickMode] = useState("start");

  const getRoute = async () => {
    const [startLat, startLng] = start?.split(",")?.map(Number) || [];
    const [endLat, endLng] = end?.split(",")?.map(Number) || [];

    try {
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      );

      const coordinates = res?.data?.routes?.[0]?.geometry?.coordinates?.map(
        ([lng, lat]) => [lat, lng]
      );

      if (coordinates?.length) {
        setRoute(coordinates);
      } else {
        toast.warning("No route found.");
      }
      setClickMode("start");
    } catch (error) {
      toast.error("Failed to fetch route.");
    }
  };

  const handleMapClick = ([lat, lng]) => {
    const coordStr = `${lat?.toFixed(6)},${lng?.toFixed(6)}`;

    if (clickMode === "start") {
      setStart(coordStr);
      setStartText(coordStr);
      setClickMode("end");
    } else {
      setEnd(coordStr);
      setEndText(coordStr);
      setClickMode("start");
    }
  };

  const handleReset = () => {
    setStart("28.618771,77.027957");
    setEnd("28.672911,77.104996");
    setStartText("Pikachu");
    setEndText("Michu");
    setRoute([]);
    setClickMode("start");
  };

  const parseLatLng = (str) => str?.split(",")?.map(Number);

  return (
    <div className="p-3">
      {/* Map */}
      <div className="w-100" style={{ height: "60vh" }}>
        <MapContainer center={[28.65, 77.15]} zoom={12} className="w-100 h-100">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onSelectLocation={handleMapClick} />
          <Marker position={parseLatLng(start)} icon={pikachuIcon} />
          <Marker position={parseLatLng(end)} icon={pikachuIcon} />
          {route?.length > 0 && (
            <AnimatedRider fullPath={route} onFinish={() => setRoute([])} />
          )}
        </MapContainer>
      </div>

      {/* Controls */}
      <div className="d-flex flex-column gap-2 mt-3">
        <div>
          Click mode:{" "}
          <strong>
            {clickMode === "start"
              ? "Set Starting Location"
              : "Set Destination"}
          </strong>
        </div>
        <AutocompleteInput
          label="Start Location"
          value={start}
          setValue={setStart}
          text={startText}
          setText={setStartText}
        />
        <AutocompleteInput
          label="End Location"
          value={end}
          setValue={setEnd}
          text={endText}
          setText={setEndText}
        />
        <div className="d-flex flex-row gap-2 mt-3">
          <button
            className="btn btn-danger fw-bold w-100"
            onClick={handleReset}
          >
            Reset
          </button>
          <button className="btn btn-primary fw-bold w-100" onClick={getRoute}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapWithRoute;
