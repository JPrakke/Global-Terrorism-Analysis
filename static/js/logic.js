
function createMap(attack) {

    // Create the tile layer that will be the background of the map
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the streetmap layer
    var baseMaps = {
        "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "Attack": attack
    };

    // Create the map object with options
    var map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [streetmap, attack]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response) {

    function createCircles(feature, location) {
        var kills = feature.nkill;
        // set features of points
        var markerFeatures = {
            fillOpacity: 0.75,
            color: magColor(kills),
            stroke: true,
            weight: .5,
            fillColor: magColor(kills),
            radius: kills * 3
        }
        return L.circleMarker(location, markerFeatures);


    };

    function toolTip(feature, layer) {
        var casualty = feature.nkill
        var place = feature.country_txt
        layer.bindPopup("<h2>" + place + "</h2> <hr> <h3>Casualty: " + casualty + "</h3>")
    };




    var attacks = L.geoJSON(response, {
        pointToLayer: createCircles,
        onEachFeature: toolTip
    });


    createMap(attacks);
}

// magnitude color
function magColor(d) {
    return d > 5 ? '#F06B6B' :
        d > 4 ? '#F0A76B' :
            d > 3 ? '#F3BA4D' :
                d > 2 ? '#F3DB4D' :
                    d > 1 ? '#E1F34D' :
                        "#B7F34D";
};

// Perform an API call to the USGS API to get features information. 

function buildMarkers(year, weaponType) {
    d3.json(`/api/v1.0/global_terror/${year}/${weaponType}`, function (data) {

        var PANEL = d3.select("#year-metadata");
        console.log(data);
        PANEL.html("");

        var location = Object.entries(data).forEach(([key, value]) => {
            let lat = value["latitude"]
            let long = value["longitude"]
            return location[lat, long]
        });
        console.log(data.features);
        createMarkers(data.features);
    });
}
