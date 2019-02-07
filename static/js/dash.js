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
  });
}
function optionChanged(newYear) {
   
    d3.select("#pieChart").html("");
    if(newYear>2004){
      d3.select("#gauge").html("");
      setTimeout(buildGauge, 1, newYear);
    }
    setTimeout(buildMetadata,1000,newYear);
    setTimeout(makePie,2000,newYear);
    
};

init()