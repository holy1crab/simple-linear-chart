import {Selection} from 'd3-selection';
import {scaleLinear, Linear} from 'd3-scale';
import {line,curveCatmullRom, Line} from 'd3-shape';
import {axisBottom, axisLeft} from 'd3-axis';


interface SpeedChartOptions {
    width: number;
    height: number;
    maxX: number;
    maxY?: number;
}

export interface IDataElement {
    getX();
    getY();
}

export class LinearChart<T extends IDataElement> {

    private container: Selection;
    private options: SpeedChartOptions;

    private background: Selection;
    private horizontalLine: Selection;
    private gridContainer: Selection;
    private path: Selection;

    private chartLine: Line<IDataElement>;

    private xScale: Linear<any>;
    private yScale: Linear<any>;

    private data: Array<T> = [];

    private maxY: number;

    private xAxisContainer: Selection;
    private yAxisContainer: Selection;

    constructor(container: Selection, options: SpeedChartOptions){

        this.container = container;
        this.options = options;

        this.maxY = options.maxY || 0;

        this.xScale = scaleLinear().domain([0, options.maxX]).range([0, this.options.width]);
        this.yScale = scaleLinear().domain([0, this.maxY]).range([this.options.height, 0]);

        this.chartLine = line()
                .x((d: IDataElement) => this.xScale(d.getX()))
                .y((d: IDataElement) => this.yScale(d.getY()))
                .curve(curveCatmullRom.alpha(0.1))
            ;
    }

    drawGrid(){

        let w = this.options.width;
        let h = this.options.height;

        var step = 25, vc = Math.round(h / step), hc = Math.round(w / step), i;

        for(i = 0; i < vc; i++){
            this.gridContainer.append('path').attr('d', 'M0 ' + (h - i * step)  + ' H' + w);
        }

        for(i = 0; i < hc; i++){
            this.gridContainer.append('path').attr('d', 'M' + (i * step) + ' 0 V' + h);
        }
    }

    init(){

        var xAxis = axisBottom(this.xScale);
        var yAxis = axisLeft(this.yScale);

        this.xAxisContainer = this.container.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + this.options.height + ')')
            .call(xAxis)
        ;

        this.xAxisContainer.selectAll('text')
            .attr('x', 22)
            .attr('y', 0)
            .attr('transform', 'rotate(45) translate(-5, 8)')
        ;

        this.yAxisContainer = this.container.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(0,0)')
            .call(yAxis)
        ;

        this.background = this.container.append('rect')
            .attr('class', 'chart-background')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .style('fill', '#BBFF66')
            .style('opacity', '0.3')
        ;

        this.gridContainer = this.container.append('g')
            .attr('class', 'chart-grid');

        this.drawGrid();

        this.path = this.container.append('path')
                .attr('class', 'speed-line')
                .attr('fill', 'transparent')
                .style('stroke', 'black')
                .style('fill', '#7dd1ff')
                .datum(this.data)
                .style('opacity', '0.6')
            ;

        this.horizontalLine = this.container.append('path')
            .attr('stroke', 'black')
            .attr('d', 'M0 0 H' + this.options.width);
    }

    private getLast(): T {
        return this.data[this.data.length - 1];
    }

    update(){

        if(!this.data.length){
            return;
        }

        this.path.attr('d', d => this.chartLine(d) + ' V ' + this.options.height + ' H0 Z');

        let y = this.yScale(this.getLast().getY());

        this.horizontalLine.attr('transform', 'translate(0, ' + y + ')');
    }

    addData(value: T){

        this.data.push(value);

        if(!this.options.maxY && value.getY() > this.maxY){

            this.maxY = value.getY();

            this.yScale.domain([0, this.maxY * 1.1]);

            this.yAxisContainer.call(axisLeft(this.yScale));
        }
    }
}
