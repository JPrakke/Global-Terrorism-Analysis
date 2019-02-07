const makeMap = weapon => {

    const lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        minZoom: 1.25,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    const satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    const outdoorMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });
    const baseMap = {
        "Gray Map": lightMap,
        "Satelite Map": satMap,
        "Street Map": outdoorMap
    };

    const overlay = {
        "Firearms": weapon
    }

    const map = L.map("map", {
        center: [0, 0],
        zoom: 1.3,
        layers: [lightMap, weapon]
    });

    L.control.layers(baseMap, overlay, {
        collapsed: false
    }).addTo(map)
};

const makeAssets = (year, weaponType) => {
    d3.json(`/api/v1.0/global_terror/${year}/${weaponType}`, function (data) {
        createMarkers(data)
    });

};

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
