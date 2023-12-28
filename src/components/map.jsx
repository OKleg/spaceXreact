import * as d3 from "d3";
import * as Geo from "../geo.json";
import { features } from "process";
import {useRef, useEffect} from "react";

function Map(props){
    const width = 1000;
    const height = 600;
    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 100
    };
    const containerRef = useRef(null);
    useEffect(()=> { let svg = d3.select(containerRef.current).select("svg");
        if (svg.empty())
            svg = d3.select(containerRef.current).append("svg");
        svg.selectAll("*").remove();
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom )
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([width/2 - margin.left, height/2 - margin.top]);
        const gMap = svg.append("g")
            .attr("name", "map");
        const gLaunchPads = svg.append("g")
            .attr("name", "launchPads");

        gMap.selectAll("path")
            .data(Geo.features)
            .enter()
            .append("path")
            .attr("class", "topo")
            .attr("d", d3.geoPath().projection(projection))
            .style("opacity", 1);
        gLaunchPads.selectAll('.launchPads')
            .data(props.launchPads.features)
            .enter()
            .append('path')
            .attr('id', function(lp){
                return lp.properties.id;
            })
            .attr('d', d3.geoPath()
                .projection(projection)
                .pointRadius(5))
            .attr('class', 'launchPads');
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', function(event) {
                gMap.selectAll('path')
                .attr('transform', event.transform);
                gLaunchPads.selectAll('path')
                    .attr('transform', event.transform);
            });

            svg.call(zoom); }, [props.launchPads]);



    return(
        <div className="mapContainer map" id="map" ref={containerRef}>
        </div>
    )
}

function changeColor(launchId, mainRef){
    const launchPads = d3.select(mainRef.current)
        .select("#map")
        .select("svg")
        .select("g[name='launchPads']");
    const selectedPadCoords = launchPads.select(`path[id='${launchId}']`).data()[0].geometry.coordinates;
    launchPads.selectAll("path")
        .attr("class", function(lp) {
            if (lp.properties.id == launchId)
                return "selectedLaunchPad";
            const sqrDistance = (lp.geometry.coordinates[0] - selectedPadCoords[0]) * (lp.geometry.coordinates[0] - selectedPadCoords[0])
             + (lp.geometry.coordinates[1] - selectedPadCoords[1]) * (lp.geometry.coordinates[1] - selectedPadCoords[1]);
            if (sqrDistance < 0.1)
                return "transparentLaunchPads";
            return "launchPads";
        });
}

export {Map, changeColor}