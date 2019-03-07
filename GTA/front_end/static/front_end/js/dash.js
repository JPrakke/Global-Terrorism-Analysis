/*
* Leaflet Heatmap Overlay
*
* Copyright (c) 2008-2016, Patrick Wied (https://www.patrick-wied.at)
* Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
*/
;(function (name, context, factory) {
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

const buildGauge = year =>{
  d3.json(`/api/v1.0/happiness/${year}`).then(d=>{
    let ts2 = Object.values(d);
    let level = parseFloat(ts2) * 20;

    let degrees = 180 - level;
    let radius = 0.5;
    let radians = (degrees * Math.PI) / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    let mainPath = "M -.0 -0.05 L .0 0.05 L ";
    let pathX = String(x);
    let space = " ";
    let pathY = String(y);
    let pathEnd = " Z";
    let path = mainPath.concat(pathX, space, pathY, pathEnd);

    let data = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 12, color: "85000000" },
        showlegend: false,
        name: "Happiness",
        text: Number.parseFloat(ts2).toFixed(2),
        hoverinfo: "text+name"
      },
      {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [
            "rgba(0, 105, 11, .5)",
            "rgba(10, 120, 22, .5)",
            "rgba(14, 127, 0, .5)",
            "rgba(110, 154, 22, .5)",
            "rgba(170, 202, 42, .5)",
            "rgba(202, 209, 95, .5)",
            "rgba(210, 206, 145, .5)",
            "rgba(232, 226, 202, .5)",
            "rgba(240, 230, 215, .5)",
            "rgba(255, 255, 255, 0)"
          ]
        },
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }
    ];

    let layout = {
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)",
      margin: {
        l: 1,
        r: 1,
        b: 0,
        t: 75,
        pad: 1
      },
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "850000",
          line: {
            color: "850000"
          }
        }
      ],
      title: "<b>Average Global Happiness</b>",
      height: 250,
      width: 350,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };

    let GAUGE = document.getElementById("gauge");
    Plotly.newPlot(GAUGE, data, layout);
  });
};

const makePie = year => {
	d3.json(`/api/v1.0/global_terror/metadata/${year}`).then((data)=>{
		let test = Object.values(data)
		let values =test[5]
		console.log(values[1]["weaptype1_txt"])
		let content = []
		color = ["#333333",
				 "#444444",
				 "#555555",
				 "#777777",
				 "#888888",
				 "#999999",
				 "#cb2121",
				 "#830909",
				 "#111111",
				 "#646464"
				]
		for (i=0;i<test.length;i++){
			dict = {
				"label":values[i]["weaptype1_txt"],
				"value":values[i]["fatalities"]+1,
				"color":color[i]
			}
			content.push(dict)
		}
		console.log(Object.entries(content))

		let pie = new d3pie("pieChart", {
			"header": {
				"title": {
					"text": "Weapons Used",
					"fontSize": 34,
					"font": "courier"
				},
				"titleSubtitlePadding": 10
			},
			"size": {
				"canvasWidth": 350,
				"canvasHeight":350,
				"pieInnerRadius": "90%",
				"pieOuterRadius": "75%"
			},
			"data": {
				"sortOrder": "random",
				"content": content
			},
			"labels": {
				"outer": {
					"format": "label",
					"pieDistance": 10
				},
				"inner": {
					"format": "none"
				},
				"mainLabel": {
					"color":"#ffffff",
					"fontSize": 11
				},
				"percentage": {
					"color": "#999999",
					"fontSize": 11,
					"decimalPlaces": 0
				},
				"value": {
					"color": "#cccc43",
					"fontSize": 11
				},
				"lines": {
					"enabled": true,
					"color": "#777777"
				},
				"truncation": {
					"enabled": true
				}
			},
			"misc": {
				"colors": {
					"segmentStroke": "#000000"
				}
			}
		});
	});
}

const makeAssets = year=>{
  d3.json(`/api/v1.0/global_terror/${year}`).then(data =>{
      let ts1 = Object.values(data)
      // console.log(ts1)
      let markCoords = []
      for(i=0; i<ts1.length; i++){
          dict = {
              "lat":ts1[i]["latitude"],
              "long":ts1[i]["longitude"]
          }
          markCoords.push(dict)
      }
      console.log(markCoords)
      var testData ={
          max: markCoords.length,
          data: markCoords
      };
      const baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
          minZoom: 1.25,
          id: "mapbox.light",
          accessToken: API_KEY
      });
      var cfg={
          // radius should be small ONLY if scaleRadius is true (or small radius is intended)
          // if scaleRadius is false it will be the constant radius used in pixels
          "radius": 2,
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
          zoom: 2.0,
          layers: [baseLayer, heatmaplayer]
      });
      heatmaplayer.setData(testData)  
  });  
};

// need to look into loop implementation
const buildMetadata = year => {
  d3.json(`/api/v1.0/global_terror/metadata/${year}`).then((data) => {
    const PANEL = d3.select("#year-metadata");
    PANEL.html("");
    
    let ts2 = Object.values(data)
    let tReports= (ts2[0]["Total Reports"])
    let atkType= (ts2[0]["attacktype1_txt"])
    let tKReports = (ts2[1]["Total Reports"])
    let weapType = (ts2[1]["weaptype1_txt"])
    let totAttacks = (ts2[2]["Attacks"])
    let totFatal = (ts2[3]["Kills"])
    let totWound = (ts2[4]["Wounded"])


    PANEL.append("h6").html(`Top Attack Type:<br>${atkType} Reported ${tReports} times <hr class="table">`)
    PANEL.append("h6").html(`Top Weapon Type:<br>${weapType} Reported ${tKReports} times <hr class="table">`)
    PANEL.append("h6").html(`Total Attacks: ${totAttacks}`)
    PANEL.append("h6").html(`Total Fatalities: ${totFatal}`)
    PANEL.append("h6").html(`Total Wounded: ${totWound}`)
  })
}; 

function init() {
  const selector = d3.select("#selDataset");

  d3.json("/years").then((data) => {
   
    data.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    let firstYear = data[0];
    setTimeout(buildMetadata,1000,firstYear);
    setTimeout(makePie,2000,firstYear);
    setTimeout(buildGauge, 3000, firstYear);
    setTimeout(makeAssets, 4000,firstYear);
  });
}
function optionChanged(newYear) {
    setTimeout(makeAssets, 500,newYear);
    d3.select("#map").html("");
    map.remove()
    d3.select("#mapbox").append("div")
      .attr("id", "map");
    d3.select("#pieChart").html("");
    if(newYear>2004){
      d3.select("#gauge").html("");
      setTimeout(buildGauge, 1, newYear);
    }
    setTimeout(makeAssets, 3000, newYear)
    setTimeout(buildMetadata,1000,newYear);
    setTimeout(makePie,2000,newYear);
    
};

init()