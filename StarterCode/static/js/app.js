let data = d3.json("samples.json");


// function the populates the metadata
function demoInfo(sample)
{
    d3.json("samples.json").then((data) => {
        // grab all of the metadata
        let metaData = data.metadata;

        // filter based on the value of the sample
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        let resultData = result[0];

        // clear the metadata
        d3.select("#sample-metadata").html("");

        // use Object.entries to get the value key pairs
        Object.entries(resultData).forEach(([key, value]) =>{
            // add to the sample data / demo section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}

// function that builds the bar chart
function buildBarChart(sample)
{
    d3.json("samples.json").then((data) => {
        // pull and build the data
        let sampleData = data.samples;

        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        let resultData = result[0];
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // build the chart
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);

        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text:textLabels.reverse(),
            type: "bar",
            orientation: "h",
            marker: {
                color: 'darkgreen'
            }
        };

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);


    });
}

// function that builds the bubble chart
function buildBubbleChart(sample)
{
    d3.json("samples.json").then((data) => {
        // pull and build the data
        let sampleData = data.samples;

        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        let resultData = result[0];
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // build the chart
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Bacteria Culture Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);


    });
}

// function that builds the gauge
function buildGaugeChart(sample) {
    d3.json ("samples.json").then((data) => {
        let metaData = data.metadata;

        // filter based on the value of the sample
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        // console.log(result[0]["wfreq"])

        var washFreq= [{
            title: { text: "Belly Button Washing Frequency"},
            type: "indicator",
            mode: "gauge",
            value: result[0]["wfreq"],
            gauge: {
                axis: {range: [0,9],
                    tickmode: "array",
                    tickvals: [0,1,2,3,4,5,6,7,8,9,9]},
                bar: { color: "darkgreen"},
                steps: [
                    { range: [0, 1], color: 'rgba(14, 127, 0, .5)'},
                    { range: [1, 2], color: 'rgba(110, 154, 28, .5)'},
                    { range: [2, 3], color: 'rgba(170, 202, 56, .5)'},
                    { range: [3, 4], color: 'rgba(202, 209, 84, .5)'},
                    { range: [4, 5], color: 'rgba(210, 206, 112, .5)'},
                    { range: [5, 6], color: 'rgba(232, 226, 140, .5)'},
                    { range: [6, 7], color: 'rgba(232, 226, 168, .5)'},
                    { range: [7, 8], color: 'rgba(232, 226, 196, .5)'},
                    { range: [8, 9], color: 'rgba(255, 255, 215, .5)'},
                    { range: [9, 10], color: 'rgba(255, 255, 255, 0)'}
                ]
            },
            domain: { row:0, column:0}
            
        }];
        var layout = {
            autosize: true,            
        }

        Plotly.newPlot('gauge', washFreq)
    });
};

// function that initializes the dashboard
function initialize()
{
    

    //access the dropdwon selector 
    var select = d3.select("#selDataset");

    //use d3.json to get the data
    //Load the data from the json
    let data = d3.json("samples.json").then((data) => {
        let sampleNames = data.names;
        
        // sue a foreach in order to create options for each sample
        //selector
        sampleNames.forEach((sample) =>{
            select.append("option")
                .text(sample)
                .property("value", sample);
        });
       
        // when initiialized, pass in the information for the first sample
        let sample1 = sampleNames[0];
        //call the function to build the metadata
        demoInfo(sample1);
        //call the function to build the bar chart
        buildBarChart(sample1);
        // call the function to build the bubble chart
        buildBubbleChart(sample1);
        // call the function to build the gauge
        buildGaugeChart(sample1);
    });

    

}

// function that updates the dashboard
function optionChanged(item)
{
    demoInfo(item);
    buildBarChart(item);
    buildBubbleChart(item);
    buildGaugeChart(item);

}
// call the initialize function
initialize()