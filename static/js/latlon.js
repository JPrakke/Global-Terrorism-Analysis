console.log("Script Initializing..");

function latLongs(year)
{
//const APIUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
//const plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
const latLonURL = `/api/v1.0/global_terror/${year}`;

d3.json(`/api/v1.0/global_terror/${year}`).then((data) => {
    createFeatures(data.year);
});

// Define a function we want to run once for each feature in the features array
function createFeatures(gtdYear) {
    // Give each feature a popup describing the place and time of the earthquake
    var terroristAttacks = L.geoJSON(gtdYear, {
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<h3>Latitude:" + gtdYear.latitude + "</h3><h3>Longitude: "+ gtdYear.longitude + "</p>");     
      },    
    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(terroristAttacks);
  
    // Testing with console.log inside createFeatures function
    console.log(`List of terrorist attacks inside createFeatures: ${terroristAttacks}`);
}

function createMap(terroristAttacks){
    
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
        "Terrorist attack locations":terroristAttacks
    };

    const map = L.map("map",{
        center:[0,0],
        zoom: 2,
        layers: [satMap,terroristAttacks]
    });
    
    L.control.layers(baseMap,overlay,{
        collapsed: false
    }).addTo(map);     
};
}

latLongs(2000);
console.log("Script Complete");
