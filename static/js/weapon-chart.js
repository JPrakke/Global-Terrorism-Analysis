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
