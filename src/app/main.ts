import {select} from 'd3-selection';
import {LinearChart, IDataElement} from './linear-chart';
import * as util from './util';


function generate(fileSize: number, intervalRange: Array<number>, callback: (size: number) => any) {

    var timeout, totalSizeEmit = 0, run = true;

    var rec = function () {

        timeout = util.rand(intervalRange[0], intervalRange[1]);

        var randomSize = util.rand(4, 7);

        if (totalSizeEmit + randomSize > fileSize) {
            randomSize = fileSize - totalSizeEmit;
            run = false;
        }

        totalSizeEmit += randomSize;

        callback(randomSize);

        if (run) {
            setTimeout(rec, timeout);
        }
    };

    rec();
}


class DataElement implements IDataElement {

    constructor(private x: number, private y: number){}

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }
}


function main() {

    const fileSize = 500;
    const width = 600;
    const height = 400;
    const paddingRight = 50;
    const paddingBottom = 50;

    let svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    document.body.appendChild(svgEl);

    let svg = select(svgEl)
        .attr('width', width)
        .attr('height', height)
        ;

    let cont = svg.append('g').attr('transform', 'translate(30,10)');

    const chart = new LinearChart<DataElement>(cont, {
        width: width - paddingRight,
        height: height - paddingBottom,
        maxX: fileSize
    });

    chart.init();
    
    var totalSizeEmit = 0;
    var lastUpdated = new Date().getTime();

    generate(fileSize, [50, 100], (size) => {

        totalSizeEmit += size;

        let now = new Date().getTime();
        let timeDiff = now - lastUpdated;

        if (timeDiff < 20) {
            return;
        }

        let speed = size / timeDiff;

        lastUpdated = now;

        chart.addData(new DataElement(totalSizeEmit, speed));

        chart.update();

    });
}


main();