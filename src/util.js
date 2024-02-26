import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function getLocationAsPoint(places) {
  return places.map((d) => {
    const coords = d.latlng.split(",");
    return {
      type: "Feature",
      properties: {
        location: d.location,
        tags: d.tags.split(", "),
        provider: d.provider,
      },
      geometry: {
        type: "Point",
        coordinates: [coords[1], coords[0]],
      },
    };
  });
}

export function loadMap(map, mapContainer, categoryColors, locations) {
  const USBounding = [
    [-125.0, 54],
    [-66.93457, 14],
  ];

  map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: "mapbox://styles/binx/cleyiayif000101r4z2u9y49q",
  }).fitBounds(USBounding);

  map.current.on("load", () => {
    const points = getLocationAsPoint(locations);

    points.forEach((p) => {
      // Create a DOM element for the marker
      const markerElement = document.createElement("div");
      // markerElement.innerHTML = markerHtml;
      markerElement.className = "marker";
      markerElement.style.background =
        p.properties.tags.length === 1
          ? categoryColors[p.properties.tags[0]]
          : `linear-gradient(to right, ${
              categoryColors[p.properties.tags[0]]
            } 50%, ${categoryColors[p.properties.tags[1]]} 50%)`;

      const popup = new mapboxgl.Popup().setHTML(
        `
          <h3>${p.properties.location}</h3>
          <div>
            ${p.properties.tags
              .map((tag) => `<div class="tag">${tag}</div>`)
              .join(" ")}
          </div>
        `
      );

      new mapboxgl.Marker({
        // scale: 0.7,
        // color: categoryColors[p.properties.tags[0]],
        element: markerElement,
      })
        .setLngLat(p.geometry.coordinates)
        .setPopup(popup)
        .addTo(map.current);

      // marker.getElement().addEventListener("click", (e) => {
      //   // const popup = new mapboxgl.Popup();
      //   // popup
      //   //   .setLngLat(p.geometry.coordinates)
      //   //   .setHTML(`<h3>${p.properties.location}</h3>`)
      //   //   .addTo(map.current);
      //   // console.log(popup);

      //   const coordinates = p.geometry.coordinates.slice();
      //   const description = p.properties.location;

      //   console.log(coordinates, description);

      //   new mapboxgl.Popup()
      //     .setLngLat(coordinates)
      //     .setHTML(description)
      //     .addTo(map.current);
      // });
    });

    // if (!map.current.getSource("dive-spots")) {
    //   map.current.addSource("dive-spots", {
    //     type: "geojson",
    //     data: {
    //       type: "FeatureCollection",
    //       features: points,
    //     },
    //   });
    // }

    // if (!map.current.getLayer("dive-spots")) {
    //   map.current.addLayer({
    //     id: "dive-spots",
    //     type: "circle",
    //     source: "dive-spots",
    //     paint: {
    //       "circle-radius": 8,
    //       "circle-color": [
    //         "match",
    //         ["at", 0, ["get", "tags"]],
    //         ...Object.keys(categoryColors).flatMap((category) => {
    //           return [category, categoryColors[category]];
    //         }),
    //         "#FFA500",
    //       ],
    //     },
    // });
    // }
  });
}
