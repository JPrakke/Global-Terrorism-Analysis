/*
* Leaflet Heatmap Overlay
*
* Copyright (c) 2008-2016, Patrick Wied (https://www.patrick-wied.at)
* Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
*/
(function (name, context, factory) {
  // Supports UMD. AMD, CommonJS/Node.js and browser context
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(
      require('heatmap.js'),
      require('leaflet')
    );
  } else if (typeof define === "function" && define.amd) {
    define(['heatmap.js', 'leaflet'], factory);
  } else {
    // browser globals
    if (typeof window.h337 === 'undefined') {
      throw new Error('heatmap.js must be loaded before the leaflet heatmap plugin');
    }
    if (typeof window.L === 'undefined') {
      throw new Error('Leaflet must be loaded before the leaflet heatmap plugin');
    }
    context[name] = factory(window.h337, window.L);
  }

})("HeatmapOverlay", this, function (h337, L) {
  'use strict';

  // Leaflet < 0.8 compatibility
  if (typeof L.Layer === 'undefined') {
    L.Layer = L.Class;
  }

  var HeatmapOverlay = L.Layer.extend({

    initialize: function (config) {
      this.cfg = config;
      this._el = L.DomUtil.create('div', 'leaflet-zoom-hide');
      this._data = [];
      this._max = 1;
      this._min = 0;
      this.cfg.container = this._el;
    },

    onAdd: function (map) {
      var size = map.getSize();

      this._map = map;

      this._width = size.x;
      this._height = size.y;

      this._el.style.width = size.x + 'px';
      this._el.style.height = size.y + 'px';
      this._el.style.position = 'absolute';

      this._origin = this._map.layerPointToLatLng(new L.Point(0, 0));

      map.getPanes().overlayPane.appendChild(this._el);

      if (!this._heatmap) {
        this._heatmap = h337.create(this.cfg);
      } 

      // this resets the origin and redraws whenever
      // the zoom changed or the map has been moved
      map.on('moveend', this._reset, this);
      this._draw();
    },

    addTo: function (map) {
      map.addLayer(this);
      return this;
    },

    onRemove: function (map) {
      // remove layer's DOM elements and listeners
      map.getPanes().overlayPane.removeChild(this._el);

      map.off('moveend', this._reset, this);
    },
    _draw: function() {
      if (!this._map) { return; }
      
      var mapPane = this._map.getPanes().mapPane;
      var point = mapPane._leaflet_pos;      

      // reposition the layer
      this._el.style[HeatmapOverlay.CSS_TRANSFORM] = 'translate(' +
        -Math.round(point.x) + 'px,' +
        -Math.round(point.y) + 'px)';

      this._update();
    },
    _update: function() {
      var bounds, zoom, scale;
      var generatedData = { max: this._max, min: this._min, data: [] };

      bounds = this._map.getBounds();
      zoom = this._map.getZoom();
      scale = Math.pow(2, zoom);

      if (this._data.length == 0) {
        if (this._heatmap) {
          this._heatmap.setData(generatedData);
        }
        return;
      }


      var latLngPoints = [];
      var radiusMultiplier = this.cfg.scaleRadius ? scale : 1;
      var localMax = 0;
      var localMin = 0;
      var valueField = this.cfg.valueField;
      var len = this._data.length;
    
      while (len--) {
        var entry = this._data[len];
        var value = entry[valueField];
        var latlng = entry.latlng;


        // we don't wanna render points that are not even on the map ;-)
        if (!bounds.contains(latlng)) {
          continue;
        }
        // local max is the maximum within current bounds
        localMax = Math.max(value, localMax);
        localMin = Math.min(value, localMin);

        var point = this._map.latLngToContainerPoint(latlng);
        var latlngPoint = { x: Math.round(point.x), y: Math.round(point.y) };
        latlngPoint[valueField] = value;

        var radius;

        if (entry.radius) {
          radius = entry.radius * radiusMultiplier;
        } else {
          radius = (this.cfg.radius || 2) * radiusMultiplier;
        }
        latlngPoint.radius = radius;
        latLngPoints.push(latlngPoint);
      }
      if (this.cfg.useLocalExtrema) {
        generatedData.max = localMax;
        generatedData.min = localMin;
      }

      generatedData.data = latLngPoints;

      this._heatmap.setData(generatedData);
    },
    setData: function(data) {
      this._max = data.max || this._max;
      this._min = data.min || this._min;
      var latField = this.cfg.latField || 'lat';
      var lngField = this.cfg.lngField || 'lng';
      var valueField = this.cfg.valueField || 'value';
    
      // transform data to latlngs
      var data = data.data;
      var len = data.length;
      var d = [];
    
      while (len--) {
        var entry = data[len];
        var latlng = new L.LatLng(entry[latField], entry[lngField]);
        var dataObj = { latlng: latlng };
        dataObj[valueField] = entry[valueField];
        if (entry.radius) {
          dataObj.radius = entry.radius;
        }
        d.push(dataObj);
      }
      this._data = d;
    
      this._draw();
    },
    // experimential... not ready.
    addData: function(pointOrArray) {
      if (pointOrArray.length > 0) {
        var len = pointOrArray.length;
        while(len--) {
          this.addData(pointOrArray[len]);
        }
      } else {
        var latField = this.cfg.latField || 'lat';
        var lngField = this.cfg.lngField || 'lng';
        var valueField = this.cfg.valueField || 'value';
        var entry = pointOrArray;
        var latlng = new L.LatLng(entry[latField], entry[lngField]);
        var dataObj = { latlng: latlng };
        
        dataObj[valueField] = entry[valueField];
        this._max = Math.max(this._max, dataObj[valueField]);
        this._min = Math.min(this._min, dataObj[valueField]);

        if (entry.radius) {
          dataObj.radius = entry.radius;
        }
        this._data.push(dataObj);
        this._draw();
      }
    },
    _reset: function () {
      this._origin = this._map.layerPointToLatLng(new L.Point(0, 0));
      
      var size = this._map.getSize();
      if (this._width !== size.x || this._height !== size.y) {
        this._width  = size.x;
        this._height = size.y;

        this._el.style.width = this._width + 'px';
        this._el.style.height = this._height + 'px';

        this._heatmap._renderer.setDimensions(this._width, this._height);
      }
      this._draw();
    } 
  });

  HeatmapOverlay.CSS_TRANSFORM = (function() {
    var div = document.createElement('div');
    var props = [
      'transform',
      'WebkitTransform',
      'MozTransform',
      'OTransform',
      'msTransform'
    ];

    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (div.style[prop] !== undefined) {
        return prop;
      }
    }
    return props[0];
  })();

  return HeatmapOverlay;
});

const makeAssets = (year,group) =>{
  d3.json(`/api/coord/${year}/${group}`).then(data =>{
      let ts1 = Object.values(data)
      let markCoords = []
      const magColor = d=>{
        return d>3 ? "rgb(255,0,0)"
             : d>2 ? "yellow"
             : d>1 ? "rgb(0,255,0)"
             :"rgb(0,0,255)";
    };
      for(i=0; i<ts1.length; i++){
          dict = {
              "lat":ts1[i]["latitude"],
              "long":ts1[i]["longitude"]
          }
          markCoords.push(dict)
      };
      var testData ={
          max: markCoords.length,
          data: markCoords
      };
      const baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
          minZoom:2,
          maxZoom:3,
          id: "mapbox.light",
          accessToken: API_KEY
      });
      var cfg={
          // radius should be small ONLY if scaleRadius is true (or small radius is intended)
          // if scaleRadius is false it will be the constant radius used in pixels
          "radius": 1,
          "maxOpacity": .8, 
          // scales the radius based on map zoom
          "scaleRadius": true, 
          // if set to false the heatmap uses the global maximum for colorization
          // if activated: uses the data maximum within the current map boundaries 
          //   (there will always be a red spot with useLocalExtremas true)
          "useLocalExtrema": true,
          // which field name in your data represents the latitude - default "lat"
          latField: 'lat',
          // which field name in your data represents the longitude - default "lng"
          lngField: 'long',
          // which field name in your data represents the data value - default "value"
          valueField: 'count'
      };
      var heatmaplayer = new HeatmapOverlay(cfg);
      var map = new L.map("map",{
          center: [0,0],
          zoom:2.49,
          layers: [baseLayer, heatmaplayer]
      });
      const legend = L.control({position: "bottomright"});
      legend.onAdd = map => {
          let div = L.DomUtil.create("div", "legend"),
          mag = [0, 1, 2, 3];
          div.innerHTML +=`<p class="legend"><strong>Frequency of Attacks</strong></p>
                           <div class="dropdown-divider"></div>
                           <p class="legend-key-left"><strong>Less</p>
                           <p class="legend-key-right"><strong>More</p>`
          
          for (i=0;i<mag.length;i++){
              div.innerHTML += '<i style="background:' + magColor(mag[i] + 1) + '"></i> ';
          }
  
      return div;
      };
      legend.addTo(map);
      heatmaplayer.setData(testData)  
  });  
};

const buildMetadata = (year, group) => {
  d3.json(`/api/metadata/${year}/${group}`).then((data) => {
    const panel = d3.select("#year-metadata");
    panel.html("");
    Object.entries(data).forEach(([key,value])=>{
      let para = panel.append("p");
      para.text(`${key}: ${value}`);
    });
  })
}; 

function init() {
  let selector = d3.select("#selDataset");
  let gSelector = d3.select("#selGroup")
  d3.json("api/populate").then((data) => {
    for(i=0;i<data['year'].length; i++){
      selector
        .append("option")
        .text(data['year'][i])
        .property("value",data['year'][i]);
    } 
    for(i=0;i<data['group'].length; i++){
      gSelector
        .append("option")
        .text(data['group'][i])
        .property("value1",data['group'][i]);
    } 
    let firstGroup = data['group'][0];
    let firstYear = data['year'][0];
      buildMetadata(firstYear,firstGroup);
      makeAssets(firstYear, firstGroup);
  });
};
function optionChanged(newYear,newGroup) {
    d3.select("#map").html("");
    map.remove()
    d3.select("#mapbox").append("div")
      .attr("id", "map");
    makeAssets(newYear, newGroup);
    buildMetadata(newYear, newGroup);
    
};

init()