import { useState, useRef, useEffect } from "react";
import myLocation from "../assets/mylocation.svg";
import "./MapSurface.css";

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

function MapSurface({ style, items }) {
  let defaultPosition = { lat: -1.3187258, lng: 36.8086999 };
  const [userPosition, setUserPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultPosition);

  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          console.log(position);
          // update the value of userlocation variable
          setMapCenter({ lat: latitude, lng: longitude });
          setUserPosition({ lat: latitude, lng: longitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div
      style={{
        // border: "2px solid black",
        width: "100%",
        height: "100vh",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
          <Map
            style={{ width: "100%", height: "90vh" }}
            defaultCenter={mapCenter}
            center={mapCenter}
            defaultZoom={17}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            mapId={import.meta.env.VITE_MAPS_ID}
            onDragstart={(e) => {
              if (mapCenter) setMapCenter(null);
            }}
            onZoomChanged={(e) => {
              //   console.log(e.detail);
              setMapCenter(null);
            }}
          >
            <MapMarker
              key="1"
              obj={{ position: defaultPosition, text: "Dr. Juma" }}
            />
            <MapMarker
              key="2"
              obj={{ position: userPosition, text: "Your Location" }}
            />
            {items.map((item, i) => (
              <MapMarker key={i} obj={item} />
            ))}
          </Map>
          <div
            style={{ backgroundColor: "white", width: "100%", height: "10vh", display: "flex", justifyContent: "flex-end", alignItems: "center" }}
          >
            <button className="button-17" role="button" onClick={getUserLocation}>
              <img src={myLocation} width="20px" height="20px" />
              <p style={{marginLeft: "10px"}}>My Location</p>
            </button>
          </div>
        </APIProvider>
      </div>
    </div>
  );
}

const MapMarker = ({ obj }) => {
  const { position, text } = obj;
  if (!position) return <></>;
  return (
    <AdvancedMarker
      position={position}

      // style={{ border: "1px solid black" }}
    >
      <div
        className="marker_container"
        style={{
          backgroundColor: "white",
          padding: "10px 5px",
          borderRadius: "5px",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <p style={{ fontSize: "18px" }}>{text}</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // border: "1px solid black",
        }}
      >
        <Triangle width={25} height={15} color="white" style={{}} />
      </div>
    </AdvancedMarker>
  );
};

const Triangle = ({
  width = 250,
  height = 250,
  color = "white",
  style = {},
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set the fill color
      ctx.fillStyle = color;

      // Draw the downward-facing triangle
      ctx.beginPath();
      ctx.moveTo(width / 2, height); // Bottom vertex (center bottom)
      ctx.lineTo(0, 0); // Top-left vertex (top-left corner)
      ctx.lineTo(width, 0); // Top-right vertex (top-right corner)
      ctx.closePath();
      ctx.fill();
    }
  }, [width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ padding: 0, margin: 0, ...style }}
    />
  );
};

export default MapSurface;
