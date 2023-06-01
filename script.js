let URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();

let data
let values = []

let heightScales
let xScale
let xAxisScales
let yAxisScales

let width = 800;
let height = 600;

let padding = 40;

let svg = d3.select('svg')

const drawCanvas =()=>{
    svg.attr('width', width)
    svg.attr('height', height)
}

const generateScales =()=>{
    heightScales = d3.scaleLinear()
                     .domain([0 , d3.max(values, (item)=>{
                        return item[1]
                     })])
                     .range([0, height - (2*padding)])
                    
    xScale = d3.scaleLinear()
                     .domain([0, values.length - 1])
                     .range([padding, width - padding])

    let datesArray = values.map((item)=>{
        return new Date(item[0])
    })
    
    xAxisScales = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding]);
    
    
    yAxisScales = d3.scaleLinear()
                    .domain([0, d3.max(values, (items)=>{
                        return items[1]
                    })])   
                    .range([height - padding, padding])             

    
}

const drawBars =()=>{
    let tooltip_2 = d3.select('.container')
                        .append('div')
                        .attr('class', 'tooltip_2')
                        tooltip_2.append('p')
                        .attr('class', 'description-bar-2')
                        tooltip_2.append('p')
                        .attr('class', 'description-bar-2')
        document.querySelectorAll('.description-bar-2')[0].innerHTML = `Money`
        document.querySelectorAll('.description-bar-2')[1].innerHTML = `Date`

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    
                    .style('height', 'auto')
                    .style('bottom','150px')
                    tooltip.append('p')
                    .attr('class', 'description-bar')
                    tooltip.append('p')
                    .attr('class', 'description-bar')
    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2*padding)) / values.length)
        .attr('data-date', (item)=>{
            return item[0]
        })
        .attr('data-gdp', (item)=>{
            return item[1]
        })
        .attr('height', (item) =>{
            return heightScales(item[1])
        })
        .attr('x',(item, index)=>{
            return xScale(index)
        })
        .attr('y',(item, index)=>{
            return (height - padding) - heightScales(item[1])
        })
        .on('mouseover', (mousePosition,item)=>{
            document.querySelectorAll('.description-bar')[0].innerHTML = ` $${item[1]} Billions `
            document.querySelectorAll('.description-bar')[1].innerHTML = ` Date: ${item[0]}` 
            document.querySelectorAll('.description-bar-2')[0].innerHTML = ` $${item[1]} Billions `
            document.querySelectorAll('.description-bar-2')[1].innerHTML = ` Date: ${item[0]}` 
            document.querySelector('#tooltip').setAttribute('data-date',item[0])
            
            let mouseX = mousePosition.pageX + 60;
    

            tooltip.transition()
                    .style('left', mouseX  + 'px')
                    .style('visibility', 'visible')
                    
            
            
        })
        .on('mouseout',(mousePosition,item)=>{
            tooltip.transition()
            .style('visibility', 'hidden')
        })
    }

const generateAxes =()=>{
    let yAxis = d3.axisLeft(yAxisScales)
    let xAxis = d3.axisBottom(xAxisScales)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform' , `translate(0,   ${(height - padding)})`)
    
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform' , `translate(${(padding)},0)`)
}

req.open('GET',URL, true)
req.onload = ()=>{
    data = JSON.parse(req.responseText)
    values = data.data

    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}

req.send()