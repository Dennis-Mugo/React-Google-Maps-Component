import React, { useEffect, useState } from "react";
import MapSurface from "./components/MapSurface";
import { use } from "react";

const App = () => {
  const [mapItems, setMapItems] = useState([
    // {position: {lat: -1.3089548, lng: 36.8094744}, text: "Dr. Unjani"},
    // {position: {lat: -1.3120325, lng: 36.8139636}, text: "Dr. Melbar"},
  ]);

  const [userType, setUserType] = useState(0);

  const start = 1736935218419;

  const [counter, setCounter] = useState(0);
  const BASE_URL = "http://127.0.0.1:8000";

  const n_seconds = 10;

  useEffect(() => {
    let userType_ = prompt("Enter 1 for physiotherapist, 2 for patient");
    console.log(userType_);
    setUserType(userType_);
  }, []);

  useEffect(() => {
    console.log("User type: ", userType);
    if (userType == 0) return;

    if (userType == 1) {
      getLocationsAsPhysio();
      const interval = setInterval(getLocationsAsPhysio, n_seconds * 1000);
    } else {
      getLocationsAsPatient();
      const interval = setInterval(getLocationsAsPatient, n_seconds * 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [userType]);

  const getLocationsAsPatient = async () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log(position);
          let { latitude, longitude } = position.coords;

          await savePatientLocation(position);

          let myLocation = {
            position: { lat: latitude, lng: longitude },
            text: "Your Location",
          };
          let physios = await getPhysioLocations();
          let lst = [myLocation, ...physios];

          setMapItems(lst);
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

  const getPhysioLocations = async () => {
    let res = await fetch(`${BASE_URL}/patient/get_physio_locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (res.ok) {
      res = await res.json();

      console.log("Locations fetched successfully");
      console.log(res);

      let locationItems = res.data.map((item) => ({
        text: `Dr. ${item.physio.first_name}`,
        position: { lat: item.latitude, lng: item.longitude },
      }));

      return locationItems;
    } else {
      res = await res.json();
      console.log("Error fetching locations: " + res.errors[0]);
      return [];
    }
  };

  const getPatientLocations = async () => {
    let res = await fetch(`${BASE_URL}/app_physio/get_patient_locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (res.ok) {
      res = await res.json();
      console.log("Locations fetched successfully");
      console.log(res);

      let locationItems = res.data.map((item) => ({
        text: `Patient: ${item.patient.first_name}`,
        position: { lat: item.latitude, lng: item.longitude },
      }));

      return locationItems;
    } else {
      res = await res.json();
      console.log("Error fetching locations: " + res.errors[0]);
      return [];
    }
  };

  const dummyGetUserLocation = async () => {
    let factor = 0.0000001;
    let counter = Date.now() - start;
    console.log(counter / 1000);
    let position = {
      coords: {
        latitude: -1.2824549114200183 + counter * factor,
        longitude: 36.75962814968869 - counter * factor,
      },
    };

    let { latitude, longitude } = position.coords;

    let lst = [];

    lst.push({
      position: { lat: latitude, lng: longitude },
      text: "Your Location",
    });

    setMapItems(lst);
    await saveMyLocation(position);
  };

  const getLocationsAsPhysio = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log(position);
          let { latitude, longitude } = position.coords;

          let lst = [];

          let myLocation = {
            position: { lat: latitude, lng: longitude },
            text: "Your Location",
          };

          await savePhysioLocation(position);

          let locations = await getPatientLocations();
          lst = [...locations, myLocation];

          setMapItems(lst);
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

  const savePhysioLocation = async (position) => {
    let { latitude, longitude } = position.coords;
    let obj = { latitude, longitude, physioId: 49 };

    let res = await fetch(`${BASE_URL}/app_physio/save_physio_location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (res.ok) {
      res = await res.json();
      console.log("Physio Location saved successfully");
      console.log(res);
    } else {
      res = await res.json();
      console.log(res.errors);
      console.log("An error occured: " + res.errors[0]);
    }
  };

  const savePatientLocation = async (position) => {
    let { latitude, longitude } = position.coords;
    let obj = { latitude, longitude, patientId: 45 };

    let res = await fetch(`${BASE_URL}/patient/save_patient_location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (res.ok) {
      res = await res.json();
      console.log("Patient Location saved successfully");
      console.log(res);
    } else {
      res = await res.json();
      console.log(res.errors);
      alert("An error ocurred: " + res.errors[0]);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <MapSurface items={mapItems} style={{ width: "65%" }} defaultZoom={10} />
    </div>
  );
};

export default App;
