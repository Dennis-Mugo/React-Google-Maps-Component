import React from 'react';
import MapSurface from './components/MapSurface';

const App = () => {
  const dummyItems = [
    
    {position: {lat: -1.3089548, lng: 36.8094744}, text: "Dr. Unjani"},
    {position: {lat: -1.3120325, lng: 36.8139636}, text: "Dr. Melbar"},
  ]
  return (
    <div style={{height: "100vh"}}>
      <MapSurface items={dummyItems} style={{width: "65%"}} />
    </div>
  );
};


export default App;