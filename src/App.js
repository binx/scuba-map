import { useRef, useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import locations from "./locations.json";
import { loadMap } from "./util";
import Timeline from "./Timeline";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [categoryColors, setCategoryColors] = useState({});

  useEffect(() => {
    const categories = locations.map((l) => l.tags.split(", "));
    const cats = [...new Set(categories.flat())].sort();

    const newColors = {};
    for (let i = 0; i < cats.length; i++) {
      newColors[cats[i]] = `hsl(${120 + (220 / cats.length) * i}, 60%, 60%)`;
    }
    setCategoryColors(newColors);

    loadMap(map, mapContainer, newColors, locations);
  }, []);

  return (
    <>
      <div className="top-flex">
        <Timeline categoryColors={categoryColors} />
        <div className="legend">
          {Object.keys(categoryColors).map((color) => (
            <div key={`legend-${color}`}>
              <div
                style={{ background: categoryColors[color] }}
                className="dot"
              />
              {color}
            </div>
          ))}
        </div>
      </div>

      <div ref={mapContainer} className="map-container" />
    </>
  );
}

export default App;
