import { Component } from 'react';
import React from 'react';
import * as d3 from "d3";
import OpenSeadragon from "openseadragon";
import "../assets/js/openseardragon-svg-overlay";
import { createDbWorker } from "sql.js-httpvfs";
import Select from 'react-select';
import MenuList from './MenuList';

class SpotLevel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            genelist: [],
            lExp: [],
            rExp: [],
            locinfo: []
        }
        this.coordinateIndex = 1;
        this.lOverlay = this.props.spots.leftViewer.svgOverlay();
        this.rOverlay = this.props.spots.rightViewer.svgOverlay();
        this.leftViewer = this.props.spots.leftViewer;
        this.rightViewer = this.props.spots.rightViewer;
        this.svgSpot = null;
        this.lVis = true;
        this.rVis = true;
        this.dburl = this.props.spots.jsoninfo.smp_layer;
        if (this.dburl ) {
            const isRemote = this.dburl .startsWith("http://") || this.dburl .startsWith("https://");
            this.dburl = isRemote ? this.dburl : `${process.env.PUBLIC_URL}/${this.dburl}`;
        }

        this.workerUrl = new URL(
            "sql.js-httpvfs/dist/sqlite.worker.js",
            import.meta.url,
        );
        this.wasmUrl = new URL(
            "sql.js-httpvfs/dist/sql-wasm.wasm",
            import.meta.url,
        );
        this.config = {
            from: "inline",
            config: {
                serverMode: "full",
                requestChunkSize: 4096,
                url: this.dburl
            }
        };
    }

    HandleLeftGeneDropDown = (value) => {
        let i = value.value + 1;
        let selection = `SELECT data FROM smp_count_sql WHERE label = 'V${i}'`;
        this.getLeftExpression(selection);
    }

    HandleRightGeneDropDown = (value) => {
        let i = value.value + 1;
        let selection = `SELECT data FROM smp_count_sql WHERE label = 'V${i}'`;
        this.getRightExpression(selection);
    }

    getDropDownGeneList = async (query) => {
        const worker = await createDbWorker(
            [this.config],
            this.workerUrl.toString(),
            this.wasmUrl.toString()
        );
        const data = await worker.db.exec(query);
        let array_result = [];
        data[0].values.map((gene) => (
            array_result.push({"value": gene[0], "label":gene[1]})
        ));
        this.setState({ genelist: array_result });
        worker.db.close();
    }

    getGeneLocation = async (query) => {
        const worker = await createDbWorker(
            [this.config],
            this.workerUrl.toString(),
            this.wasmUrl.toString()
        );

        const data = await worker.db.exec(query);
        let array_result = data[0].values;
        this.setState({ locinfo: array_result });
        worker.db.close();
    }

    getLeftExpression = async (query) => {
        const worker = await createDbWorker(
            [this.config],
            this.workerUrl.toString(),
            this.wasmUrl.toString()
        );

        const data = await worker.db.exec(query);
        let array_result = data[0].values[0][0].split(",");
        this.setState({ lExp: array_result });
        worker.db.close();
    }

    getRightExpression = async (query) => {
        const worker = await createDbWorker(
            [this.config],
            this.workerUrl.toString(),
            this.wasmUrl.toString()
        );

        const data = await worker.db.exec(query);
        let array_result = data[0].values[0][0].split(",");
        this.setState({ rExp: array_result });
        worker.db.close();
    }

    continuous = ( selector_id, colorscale) => {
        var legendheight = 18,
            legendwidth = 200,
            margin = {top: 10, right: 2, bottom: 10, left: 2};
      
        var canvas = d3.select(selector_id)
          .style("height", legendheight + "px")
          .style("width", legendwidth + "px")
          .style("position", "relative")
          .append("canvas")
          .attr("height", 1)
          .attr("width", legendwidth- margin.left - margin.right)
          .style("height", (legendheight) + "px")
          .style("width", (legendwidth - margin.left - margin.right) + "px")
          .style("border", "1px solid #000")
          .style("position", "absolute")
          .style("top", (margin.top) + "px")
          .style("left", (margin.left) + "px")
          .node();

        var context = canvas.getContext("2d"),
        canvasWidth = canvas.width;

        var image = context.createImageData(canvasWidth, 1);

        var legendscale = d3.scaleLinear()
            .range([1, legendwidth- margin.left - margin.right])
            .domain(colorscale.domain())

        for (var i = 0, k = 0; i < canvasWidth; ++i, k += 4) {
            var c = d3.rgb(colorscale(legendscale.invert(i)));
            image.data[k] = c.r;
            image.data[k + 1] = c.g;
            image.data[k + 2] = c.b;
            image.data[k + 3] = 255;
        }

        context.putImageData(image, 0, 0);
        var legendaxis = d3.axisBottom()
        .scale(legendscale)
        .tickSize(6)
        .ticks(8);
    
      var svg = d3.select(selector_id)
        .append("svg")
        .attr("height", (50) + "px")
        .attr("width", (300) + "px")
        .style("position", "absolute")
        .style("left", "1px")
        .style("top", "20px")
    
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (0) + "," + (10) + ")")
        .call(legendaxis);

    }

    onPointerMove = (evt, side, el) => {
        // If this side’s overlay is hidden, bail out immediately
        const isVisible = side === 'left' ? this.lVis : this.rVis;
        if (!isVisible) {
            el.style.display = 'none';
            return;
        }
        const viewer = side === 'left' ? this.props.spots.leftViewer : this.props.spots.rightViewer;
      
        //Canvas → viewport → image
        const vp = viewer.viewport.pointFromPixel(
          new OpenSeadragon.Point(evt.position.x, evt.position.y)
        );
        const img = viewer.viewport.viewportToImageCoordinates(vp);
        const mx = img.x, my = img.y;
      
        //Hit‐test in the correct quadtree
        const R = 90;  // your hit radius in px
        const tree = side === 'left' ? this.leftQuadtree : this.rightQuadtree;
        if (!tree) {
            console.warn('Quadtree not ready yet.');
            return;
          }
        const hit   = tree.find(mx, my, R);
      
        //Show/hide 
        if (hit) {
          el.style.display = 'block';
          el.textContent =  `x: ${hit.cx.toFixed(1)}, y: ${hit.cy.toFixed(1)}, value: ${hit.color}`;
        //   console.log(`x: ${hit.cx.toFixed(1)}\ny: ${hit.cy.toFixed(1)}\nvalue: ${hit.color}`);
        } else {
          el.style.display = 'none';
        }
      }
      
    componentDidMount() {
        if (this.props.spots.status === 1 && this.props.spots.jsoninfo.smp_layer) { 
            //one time load
            this.getDropDownGeneList("SELECT value, label FROM gene_list_sql");
            //retrieve location data
            this.getGeneLocation("SELECT x, y FROM smp_loc_sql");
            let initialGeneQuery = "SELECT data FROM smp_count_sql WHERE label = 'V1'"
            this.getLeftExpression(initialGeneQuery)
            this.getRightExpression(initialGeneQuery)

            const track1 = document.createElement('div');
            track1.className = 'mouse-track';
            this.leftViewer.container.appendChild(track1);
            
            const track2 = document.createElement('div');
            track2.className = 'mouse-track';
            this.rightViewer.container.appendChild(track2);
            // Left tracker
            this.leftTracker = new OpenSeadragon.MouseTracker({
                element: this.leftViewer.container,
                moveHandler: evt => this.onPointerMove(evt, 'left', track1)
            }).setTracking(true);

            // Right tracker
            this.rightTracker = new OpenSeadragon.MouseTracker({
                element: this.rightViewer.container,
                moveHandler: evt => this.onPointerMove(evt, 'right', track2)
            }).setTracking(true);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.lExp.length > 0 && this.state.locinfo.length> 0) {
            this.coordinateIndex=1/this.props.spots.leftViewer.world.getItemAt(0).getContentSize().x
            d3.select(this.lOverlay.node()).html("");
            //prepare spot data
            let spots = [];
            let min = Math.min(...this.state.lExp);
            let max = Math.max(...this.state.lExp);
            let squentialColors = d3.scaleSequential().domain([min, max]).interpolator(d3.interpolateHslLong("blue", "red"));
            d3.select("#left-legend").html("");
            this.continuous("#left-legend",squentialColors);
            for (let i = 0; i < this.state.locinfo.length; i++) {
                // let spot = { 'cx': this.state.locinfo[i].Y, 'cy': this.state.locinfo[i].X, "color": this.state.lExp[i] }
                let spot = { 'cx': this.state.locinfo[i][0], 'cy': this.state.locinfo[i][1], "color": this.state.lExp[i] }
                spots.push(spot);
            }
            this.leftQuadtree = d3.quadtree()
            .x(d => d.cx)  
            .y(d => d.cy)  
            .addAll(spots);
            // this.leftQuadtree.visit((node, x0, y0, x1, y1) => {
            //     if (!node.length) {
            //       // node.data is a leaf node containing a spot
            //       console.log(`Spot at (${node.data.cx}, ${node.data.cy}) with value: ${node.data.color}`);
            //     }
            //   });
            this.drawSpot(spots, squentialColors, this.lOverlay.node());
        }
       
        if (this.state.rExp.length > 0 && this.state.locinfo.length> 0) {
            d3.select(this.rOverlay.node()).html("");
            //prepare spot data
            let rspots = [];
            let min = Math.min(...this.state.rExp);
            let max = Math.max(...this.state.rExp);
            let squentialColors = d3.scaleSequential().domain([min, max]).interpolator(d3.interpolateHslLong("blue", "red"));
            d3.select("#right-legend").html("");
            this.continuous("#right-legend", squentialColors);
            for (let i = 0; i < this.state.locinfo.length; i++) {
                let spot = { 'cx': this.state.locinfo[i][0], 'cy': this.state.locinfo[i][1],  "color": this.state.rExp[i] }
                rspots.push(spot);
            }
            this.rightQuadtree = d3.quadtree()
            .x(d => d.cx)
            .y(d => d.cy)
            .addAll(rspots);
            this.drawSpot(rspots, squentialColors, this.rOverlay.node())
        }
    }

    drawSpot = (spots, squentialColors, node) => {
        var r = 100 * this.coordinateIndex;
        node.parentNode.classList.add("d3layer");
        d3.select(node).selectAll('circle').remove();
        // this.svgSpot.exit().remove();

        const circles = d3.select(node).selectAll("circle")
            .data(spots)
            .enter()
            .append("circle")
            .style("fill", function (d, i) {
                return squentialColors(d.color)
            })
            .style("opacity", 0.4)
            .attr("cx", (d, i) => {
                // return Number.parseFloat(d.cx * this.coordinateIndex).toFixed(3);
                return d.cx* this.coordinateIndex;
            })
            .attr("cy", (d, i) => {
                // return Number.parseFloat(d.cy * this.coordinateIndex).toFixed(3);
                return d.cy* this.coordinateIndex;
            })
            .attr("r", r);
            // .style('pointer-events', 'all');  // allow events on the circle;
    }

    HandleHideAndShow = (viewer, vis) => {
        if (viewer === "left") {
            d3.select(this.lOverlay.node()).style("visibility", function () {
                return vis ? "hidden" : "visible";
            });
            this.lVis = this.lVis ? false : true;
        } else {
            d3.select(this.rOverlay.node()).style("visibility", function () {
                return vis ? "hidden" : "visible";
            });
            this.rVis = this.rVis ? false : true;
        }
    }

    render() {
        if (this.props.spots.status === 1 && this.props.spots.jsoninfo.smp_layer && this.state.genelist.length>0) { 
            return (
                <div style={{ marginLeft: 0.2 + 'em', marginTop: 0.8 + 'em', padding: 0.5 + 'em' }} className="border border-light">
                    <h6 className='text-white'>SMP Data: </h6>
                    <div style={{ marginLeft: 0.8 + 'em', marginTop: 0.8 + 'em' }}>
                        <h6 className='text-white'>Select a gene for left viewer</h6>
                        <div style={{ width: 85 + '%', color: "black" }}>
                            <Select
                                options={this.state.genelist}
                                value={this.state.value}
                                onChange={value => this.HandleLeftGeneDropDown(value)}
                                defaultValue={this.state.genelist[0]}
                                components={{ MenuList }}
                            />
                        </div>
                        <div style={{ paddingTop: .5 + 'em', paddingBottom: .5 + 'em' }}>
                            <button className="btn btn-icon btn-primary" onClick={() => this.HandleHideAndShow("left", this.lVis)}>Hide/Show Left</button>
                        </div>
                        <h6 className='text-white'>Select a gene for right viewer</h6>
                        <div style={{ width: 85 + '%', color: "black" }}>
                            <Select
                                options={this.state.genelist}
                                value={this.state.value}
                                onChange={value => this.HandleRightGeneDropDown(value)}
                                defaultValue={this.state.genelist[0]}
                                components={{ MenuList }}
                            />
                        </div>
                        <div style={{ paddingTop: .5 + 'em', paddingBottom: .5 + 'em'}}>
                            <button className="btn btn-icon btn-primary" onClick={() =>this.HandleHideAndShow("right", this.rVis) }>Hide/Show Right</button>
                        </div>
                    </div>
                </div>
            )
        } else {
            return <div></div>
        }
    }
}

export default SpotLevel;