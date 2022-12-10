    // Temperature Gauge Configurations
    let temperatureData = [{
    	domain: {
    		x: [0, 1],
    		y: [0, 1]
    	},
    	value: 0,
    	title: {
    		text: "Temperature"
    	},
    	type: "indicator",
    	mode: "gauge+number+delta",
    	delta: {
    		reference: 30
    	},
    	gauge: {
    		axis: {
    			range: [0, 50]
    		},
    		steps: [{
    				range: [0, 25],
    				color: "lightgray"
    			},
    			{
    				range: [25, 40],
    				color: "gray"
    			}
    		],
    		threshold: {
    			line: {
    				color: "red",
    				width: 4
    			},
    			thickness: 0.75,
    			value: 40
    		}
    	}
    }];

    // Line Chart Configurations
    let tempLineChartData = [{
    	x: [],
    	y: [],
    	type: 'scatter',
    	name: "Temperature"
    }];

    // Attach event listener when DOM content is loaded
    document.addEventListener("DOMContentLoaded", function() {


    	// Layout object that set's the size of our Gauge
    	var gaugeLayout = {
    		width: 600,
    		height: 450,
    		margin: {
    			t: 0,
    			b: 0
    		}
    	};
    	var lineLayout = {
    		width: 600,
    		height: 450,
    		margin: {
    			t: 0,
    			b: 0
    		}
    	};

    	// Create our two Graph passing in the different configurations
    	Plotly.newPlot('temperatureGaugeDiv', temperatureData, gaugeLayout);
    	Plotly.newPlot('temperatureLineDiv', tempLineChartData, lineLayout);

    });

    // Will hold the arrays we receive from our DS18B20 sensor
    let newXArray = []
    let newYArray = []
    // The maximum number of data points displayed on our scatter/line graph
    let MAX_GRAPH_POINTS = 12

    // Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
    function updatePlot() {
    	fetch(`/updateValues`)
    		.then((response) => response.json())
    		.then(data => {
    			console.log(data)
    			var newReading = data.reading
    			var temp_update = {
    				value: newReading
    			};

    			if (newXArray.length > MAX_GRAPH_POINTS) {
    				newXArray.shift()
    			}

    			if (newYArray.length > MAX_GRAPH_POINTS) {
    				newYArray.shift()
    			}


    			newXArray.push(new Date().toLocaleTimeString());
    			newYArray.push(newReading);

    			var data_update = {
    				'x': [newXArray],
    				'y': [newYArray]
    			};

    			console.log(data_update)
    			Plotly.update('temperatureGaugeDiv', temp_update);
    			Plotly.update('temperatureLineDiv', data_update);

    		})
    }

    // Continuos loop that runs evry 3 seconds to update our web page with the latest sensor readings
    (function loop() {
    	setTimeout(() => {
    		updatePlot()
    		loop();
    	}, 3000);
    })();