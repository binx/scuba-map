import { useRef, useEffect, useState } from "react";
import locations from "./locations.json";
import moment from "moment";
import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { axisBottom } from "d3-axis";
import { select } from "d3-selection";

function Timeline({ categoryColors }) {
  const width = 800;
  const xAxisG = useRef();

  const [bars, setBars] = useState([]);
  const [height, setHeight] = useState(0);

  const barHeight = 32;

  useEffect(() => {
    const idealTimes = locations
      .filter((l) => l["season start"] && l["season end"])
      .map((l) => {
        const startTime = moment(l["season start"], "MMM");
        let endTime = moment(l["season end"], "MMM");

        if (startTime > endTime) endTime.add(1, "year");

        return {
          location: l.location,
          type: l.tags.split(", ")[0],
          start: startTime,
          end: endTime,
        };
      })
      .sort((a, b) => a.start - b.start);

    setHeight(idealTimes.length * barHeight);

    const endDate = max(idealTimes, (d) => d.end);

    const dateRange = scaleLinear()
      .domain([moment().startOf("month"), endDate])
      .range([0, width]);

    const xAxis = axisBottom(dateRange).tickFormat((d) =>
      moment(d).format("MMM")
    );
    select(xAxisG.current).call(xAxis);

    const newBars = idealTimes.map((l, i) => {
      return {
        location: l.location,
        xStart: dateRange(l.start),
        xEnd: dateRange(l.end),
        color: categoryColors[l.type],
        y: ((height - 40) / idealTimes.length) * i,
      };
    });
    setBars(newBars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryColors]);

  return (
    <svg width={width} height={height}>
      <g>
        {bars.map((bar) => (
          <g
            key={`bar-${bar.location}`}
            transform={`translate(${bar.xStart}, ${bar.y})`}
          >
            <rect
              width={bar.xEnd - bar.xStart}
              fill={bar.color}
              height="7"
              y="15"
            />
            <text y="12" style={{ fontSize: "12px" }} fill="#333">
              {bar.location}
            </text>
          </g>
        ))}
      </g>
      <g
        className="x-axis"
        transform={`translate(0,${height - 40})`}
        ref={xAxisG}
      />
    </svg>
  );
}

export default Timeline;
