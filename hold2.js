console.log("Scripit Initializing..");

const APIUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

const magColor = d=>{
    return d>5 ? "#FF0000"
         : d>4 ? "#FF9900"
         : d>3 ? "#FFBB00"
         : d>2 ? "#BBFF00"
         : d>1 ? "#99FF00"
         :"#00FF00";
};

const makeMap = earthquake=>{
    
    const satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

    const streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    });
    
    const outdoorMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
    });
    
    const baseMap = {
        "Satelite Map": satMap,
        "Street Map": streetMap,
        "Outdoor Map": outdoorMap
    };


    const overlay = {
        "Earthquakes":earthquake,
    };

    const map = L.map("map",{
        center:[0,0],
        zoom: 2,
        layers: [satMap,earthquake]
    });
    
    L.control.layers(baseMap,overlay,{
        collapsed: false
    }).addTo(map);
};

const makeAssets = eqData=>{
    const makeMarker = (feature, loc)=>{
        let radius = feature.properties.mag;
        const circleAttributes = {
            fillOpacity: 0.5,
            weight: 0.5,
            stroke: true,
            radius: radius*2.5,
            color: magColor(radius),
            fillColor: magColor(radius)
        };
        return L.circleMarker(loc,circleAttributes); 
    };
    const toolTip = (feature, layer)=>{
        let mag = feature.properties.mag;
        let loc = feature.properties.place;
        layer.bindPopup(`<h2>${loc}</h2><hr><h3>Magnitude: ${mag}</h3>`)
    }
    const earthquakes = L.geoJSON(eqData,{
        pointToLayer: makeMarker,
        onEachFeature: toolTip
    });

    makeMap(earthquakes)
};

d3.json(APIUrl, makeAssets);

console.log("Script Complete");