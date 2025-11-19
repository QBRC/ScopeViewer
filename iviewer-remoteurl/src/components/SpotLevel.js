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
            locinfo: [],
            selectedLeft: null,
            selectedRight: null,
            spotScale:89
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

    /* ---------------------------
       DB / expression utilities
       --------------------------- */

    // Build dropdown options: keep both dbLabel (V#) and geneName
    getDropDownGeneList = async (query) => {
        const worker = await createDbWorker(
            [this.config],
            this.workerUrl.toString(),
            this.wasmUrl.toString()
        );
        try {
            const data = await worker.db.exec(query);
            let array_result = [];
            if (!data || data.length === 0 || !data[0].values) {
                console.warn("No gene_list_sql rows returned.");
                this.setState({ genelist: [] });
                return;
            }
            data[0].values.forEach((gene) => {
                const idx = Number(gene[0]);
                const geneName = gene[1];
                const dbLabel = `V${idx + 1}`;
                array_result.push({
                    value: dbLabel,     // primary db label candidate (string like "V1")
                    index: idx,
                    geneName: geneName,
                    label: geneName    // what react-select shows
                });
            });
            // set first as selected by default
            this.setState({ genelist: array_result }, () => {
                if (this.state.genelist.length > 0) {
                    const firstOpt = this.state.genelist[0];
                    this.setState({ selectedLeft: firstOpt, selectedRight: firstOpt }, async () => {
                        // load initial expressions for both panes using the same gene
                        await this.getLeftExpression(firstOpt);
                        await this.getRightExpression(firstOpt);
                    });
                }
            });
        } catch (e) {
            console.error("Error loading gene list:", e);
            this.setState({ genelist: [] });
        } finally {
            worker.db.close();
        }
    }

    // Retrieve location info (x,y rows)
    getGeneLocation = async (query) => {
        const worker = await createDbWorker(
            [this.config],
            this.workerUrl.toString(),
            this.wasmUrl.toString()
        );
        try {
            const data = await worker.db.exec(query);
            let array_result = [];
            if (data && data.length > 0 && data[0].values) {
                array_result = data[0].values; // each entry is [x,y] or [col,row] depending on DB
            }
            this.setState({ locinfo: array_result });
        } catch (e) {
            console.error("Error loading locations:", e);
            this.setState({ locinfo: [] });
        } finally {
            worker.db.close();
        }
    }

    // Try a list of candidate labels (e.g., ['V1', 'SAMD11']) in order and parse the first non-empty result
    getExpressionByCandidates = async (candidates) => {
        const worker = await createDbWorker(
            [this.config],
            this.workerUrl.toString(),
            this.wasmUrl.toString()
        );
        let raw = null;
        try {
            for (let i = 0; i < candidates.length; ++i) {
                const lbl = candidates[i];
                const q = `SELECT data FROM smp_count_sql WHERE label = '${lbl}' LIMIT 1`;
                try {
                    const data = await worker.db.exec(q);
                    if (data && data.length > 0 && data[0].values && data[0].values.length > 0) {
                        raw = data[0].values[0][0];
                        if (raw !== null && raw !== undefined && String(raw).trim().length > 0) {
                            break; // found valid data
                        }
                    }
                } catch (e) {
                    // continue to next candidate
                    console.warn("Query failed for label", lbl, e);
                }
            }
        } finally {
            worker.db.close();
        }

        if (raw === null || raw === undefined) {
            return [];
        }

        let arr = [];
        if (typeof raw === "string") {
            arr = raw.trim().split(",").map(s => {
                const n = Number(s);
                return Number.isNaN(n) ? s : n;
            });
        } else {
            try {
                const parsed = JSON.parse(raw);
                arr = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                arr = String(raw).split(",").map(s => {
                    const n = Number(s);
                    return Number.isNaN(n) ? s : n;
                });
            }
        }
        return arr;
    }

    // wrappers for left/right expression loading (accept option object or label string)
    getLeftExpression = async (optionOrLabel) => {
        let candidates = [];
        if (typeof optionOrLabel === "string") {
            candidates = [optionOrLabel];
        } else if (optionOrLabel && optionOrLabel.value && optionOrLabel.geneName) {
            candidates = [optionOrLabel.value, optionOrLabel.geneName];
        } else if (optionOrLabel && optionOrLabel.value) {
            candidates = [optionOrLabel.value];
        } else {
            console.warn("Invalid argument to getLeftExpression:", optionOrLabel);
            this.setState({ lExp: [] });
            return;
        }
        const arr = await this.getExpressionByCandidates(candidates);
        this.setState({ lExp: arr });
    }

    getRightExpression = async (optionOrLabel) => {
        let candidates = [];
        if (typeof optionOrLabel === "string") {
            candidates = [optionOrLabel];
        } else if (optionOrLabel && optionOrLabel.value && optionOrLabel.geneName) {
            candidates = [optionOrLabel.value, optionOrLabel.geneName];
        } else if (optionOrLabel && optionOrLabel.value) {
            candidates = [optionOrLabel.value];
        } else {
            console.warn("Invalid argument to getRightExpression:", optionOrLabel);
            this.setState({ rExp: [] });
            return;
        }
        const arr = await this.getExpressionByCandidates(candidates);
        this.setState({ rExp: arr });
    }

    /* ---------------------------
       UI handlers
       --------------------------- */

    HandleLeftGeneDropDown = (option) => {
        this.setState({ selectedLeft: option });
        this.getLeftExpression(option);
    }

    HandleRightGeneDropDown = (option) => {
        this.setState({ selectedRight: option });
        this.getRightExpression(option);
    }


    // new: user changes spot scale (slider / number input)
    handleSpotScaleChange = (evt) => {
        const val = Number(evt.target.value);
        if (!Number.isNaN(val)) {
            this.setState({ spotScale: val });
        }
    }

    /* ---------------------------
       Rendering / plotting utilities
       --------------------------- */

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
        const isVisible = side === 'left' ? this.lVis : this.rVis;
        if (!isVisible) {
            el.style.display = 'none';
            return;
        }
        const viewer = side === 'left' ? this.props.spots.leftViewer : this.props.spots.rightViewer;
        const vp = viewer.viewport.pointFromPixel(
          new OpenSeadragon.Point(evt.position.x, evt.position.y)
        );
        const img = viewer.viewport.viewportToImageCoordinates(vp);
        const mx = img.x, my = img.y;
        const spotScale = (this.state && this.state.spotScale) ? Number(this.state.spotScale) : 100;
        const R = spotScale;
        const tree = side === 'left' ? this.leftQuadtree : this.rightQuadtree;
        if (!tree) {
            console.warn('Quadtree not ready yet.');
            return;
        }
        const hit = tree.find(mx, my, R);
        if (hit) {
          el.style.display = 'block';
          el.textContent =  `X: ${hit.cx.toFixed(1)}, Y: ${hit.cy.toFixed(1)}, Expression: ${hit.color}`;
        } else {
          el.style.display = 'none';
        }
    }
      
    componentDidMount() {
        // only init if spots loaded and DB specified
        if (this.props.spots.status === 1 && this.props.spots.jsoninfo.smp_layer) { 
            // load gene list and locations; initial expression loading handled in getDropDownGeneList callback
            this.getDropDownGeneList("SELECT value, label FROM gene_list_sql");
            this.getGeneLocation("SELECT x, y FROM smp_loc_sql");

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
            // Ensure coordinateIndex is initialized when the viewer's tile source is ready.
            // OpenSeadragon fires an 'open' event when a tile source finishes opening; attach handlers
            // so we can compute coordinateIndex once getContentSize() is available.
            const tryInitCoord = () => {
                try {
                    const item = this.leftViewer && this.leftViewer.world && this.leftViewer.world.getItemAt && this.leftViewer.world.getItemAt(0);
                    if (item && item.getContentSize) {
                        const size = item.getContentSize();
                        if (size && size.x) {
                            this.coordinateIndex = 1 / size.x;
                        }
                    }
                } catch (e) {
                    // ignore; will try again on 'open' or via fallback below
                }
            };

            // try immediately (in case already open)
            tryInitCoord();

            // Register open handlers to set coordinateIndex when the viewers finish opening a tile source
            if (this.leftViewer && this.leftViewer.addHandler) {
                this.leftViewer.addHandler('open', tryInitCoord);
            }
            if (this.rightViewer && this.rightViewer.addHandler) {
                this.rightViewer.addHandler('open', tryInitCoord);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.lExp.length > 0 && this.state.locinfo.length > 0) {
            // Safely compute coordinateIndex; if not ready schedule a retry
            let computed = null;
            try {
                const lv = this.props.spots && this.props.spots.leftViewer;
                const item = lv && lv.world && lv.world.getItemAt && lv.world.getItemAt(0);
                if (item && item.getContentSize) {
                    const size = item.getContentSize();
                    if (size && size.x) computed = 1 / size.x;
                }
            } catch (e) {
                // ignore; computed remains null
            }
            if (computed !== null && Number.isFinite(computed) && computed > 0) {
                this.coordinateIndex = computed;
            } else {
                // viewer not ready — retry shortly
                setTimeout(() => this.forceUpdate(), 100);
                return;
            }

            d3.select(this.lOverlay.node()).html("");
            const spots = [];

            // Validate and build spots to avoid NaN coordinates
            for (let i = 0; i < this.state.locinfo.length; i++) {
                const loc = this.state.locinfo[i];
                if (!loc || loc.length < 2) continue;
                const cx = Number(loc[0]);
                const cy = Number(loc[1]);
                if (!Number.isFinite(cx) || !Number.isFinite(cy)) continue;

                const rawExpr = (i < this.state.lExp.length) ? this.state.lExp[i] : null;
                const exprVal = Number(rawExpr);
                const color = Number.isFinite(exprVal) ? exprVal : 0;

                spots.push({ cx, cy, color });
            }

            if (spots.length === 0) {
                return;
            }

            const values = spots.map(s => s.color);
            let min = Math.min(...values);
            let max = Math.max(...values);
            if (!Number.isFinite(min) || !Number.isFinite(max)) { min = 0; max = 1; }
            if (min === max) { min = min - 1; max = max + 1; }

            const sequentialColors = d3.scaleSequential().domain([min, max]).interpolator(d3.interpolateHslLong("blue", "red"));
            d3.select("#left-legend").html("");
            this.continuous("#left-legend", sequentialColors);

            this.leftQuadtree = d3.quadtree()
                .x(d => d.cx)
                .y(d => d.cy)
                .addAll(spots);
            this.drawSpot(spots, sequentialColors, this.lOverlay.node());
        }

        if (this.state.rExp.length > 0 && this.state.locinfo.length > 0) {
            d3.select(this.rOverlay.node()).html("");
            const rspots = [];

            for (let i = 0; i < this.state.locinfo.length; i++) {
                const loc = this.state.locinfo[i];
                if (!loc || loc.length < 2) continue;
                const cx = Number(loc[0]);
                const cy = Number(loc[1]);
                if (!Number.isFinite(cx) || !Number.isFinite(cy)) continue;

                const rawExpr = (i < this.state.rExp.length) ? this.state.rExp[i] : null;
                const exprVal = Number(rawExpr);
                const color = Number.isFinite(exprVal) ? exprVal : 0;

                rspots.push({ cx, cy, color });
            }

            if (rspots.length === 0) return;

            const values = rspots.map(s => s.color);
            let min = Math.min(...values);
            let max = Math.max(...values);
            if (!Number.isFinite(min) || !Number.isFinite(max)) { min = 0; max = 1; }
            if (min === max) { min = min - 1; max = max + 1; }

            const sequentialColors = d3.scaleSequential().domain([min, max]).interpolator(d3.interpolateHslLong("blue", "red"));
            d3.select("#right-legend").html("");
            this.continuous("#right-legend", sequentialColors);

            this.rightQuadtree = d3.quadtree()
                .x(d => d.cx)
                .y(d => d.cy)
                .addAll(rspots);
            this.drawSpot(rspots, sequentialColors, this.rOverlay.node());
        }
    }

    drawSpot = (spots, squentialColors, node) => {
        var r = (this.state.spotScale || 100) * this.coordinateIndex;
        // var r = 68 * this.coordinateIndex;
        node.parentNode.classList.add("d3layer");
        d3.select(node).selectAll('circle').remove();

        const circles = d3.select(node).selectAll("circle")
            .data(spots)
            .enter()
            .append("circle")
            .style("fill", function (d, i) {
                return squentialColors(d.color)
            })
            .style("opacity", 0.4)
            .attr("cx", (d, i) => {
                return d.cx * this.coordinateIndex;
            })
            .attr("cy", (d, i) => {
                return d.cy * this.coordinateIndex;
            })
            .attr("r", r);
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
                        <div style={{ marginBottom: '0.8em', color: "white" }}>
                            <label style={{ marginRight: '0.6em' }}>Spot size:</label>
                            <input
                                type="range"
                                min="1"
                                max="200"
                                value={this.state.spotScale}
                                onChange={this.handleSpotScaleChange}
                                style={{ verticalAlign: 'middle', marginRight: '0.5em' }}
                            />
                            <input
                                type="number"
                                min="1"
                                max="2000"
                                value={this.state.spotScale}
                                onChange={this.handleSpotScaleChange}
                                style={{ width: '80px' }}
                            />
                        </div>
                        <h6 className='text-white'>Select a gene for left viewer</h6>
                        <div style={{ width: 85 + '%', color: "black" }}>
                            <Select
                                options={this.state.genelist}
                                value={this.state.selectedLeft}
                                onChange={value => this.HandleLeftGeneDropDown(value)}
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
                                value={this.state.selectedRight}
                                onChange={value => this.HandleRightGeneDropDown(value)}
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
