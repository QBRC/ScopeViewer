import { Component } from 'react';
import OpenSeadragon from "openseadragon";
import Annotations from './Annotations';
import SideBarMenu from './SideBarMenu';
import Banner from '../views/Banner';
import '../assets/css/viewer.css';
import LZstring from "lz-string";
import singleImgJSON from "../assets/json/oneimg.json";

class ImageViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 0,
            leftViewer: null,
            rightViewer: null
        }
        this.legend = null;
        this.smpexist = null;
    }

    getTileSource(url, apiserver, apiproxy,imageId) {
        if (!url) return null;
      
        const isRemote = url.startsWith("http://") || url.startsWith("https://");
        const isDzi    = url.toLowerCase().endsWith(".dzi");

        const apiBase = apiserver.replace(/\/+$/, ""); 
        const proxyBase = apiproxy ? `/${apiproxy.replace(/^\/+|\/+$/g, "")}` : "";
      
        const fileParam = encodeURIComponent(url);
        const proxyUrl = `${apiBase}${proxyBase}/dummy.dzi?image_id=${imageId}&file=${fileParam}&registry=slide`;

        // Remote DZI: just point OpenSeadragon at it
        if (isRemote && isDzi) {
          console.log("Remote DZI:", url);
          return url;
        }
      
        // Remote slide (svs/tif/etc) → proxy to dummy.dzi
        if (isRemote && !isDzi) {
          console.log("Remote slide via proxy:", url);
          return proxyUrl;
        }
      
        // Local DZI: serve from your static mount (e.g. /slides or /dzislides)
        if (!isRemote && isDzi) {
          console.log("Local DZI:", url);
          const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
          return `${apiBase}${normalizedUrl}`;
        }
      
        //  Local slide (svs/tif/etc) → proxy to dummy.dzi
        //    (FastAPI will read slides/foo.svs from disk)
        console.log("Local slide via proxy:", url);
        return proxyUrl;
      }
      

    componentDidMount() {
        const searchParams = new URLSearchParams(document.location.search)
        let tileurl;
        let maskurl, selectedimg=null;

        if(searchParams.get('mark')){//existing bookmark
            selectedimg=JSON.parse(LZstring.decompressFromEncodedURIComponent(searchParams.get('mark')));
        }
        else if (this.props.location.state){//
             selectedimg= this.props.location.state.selectedimg;
        }
        else{ //no data still can display viewer
            selectedimg = singleImgJSON[0];
        }
        const apiserver = process.env.REACT_APP_API_SERVER;
        const apiproxy = process.env.REACT_APP_API_PROXY_PATH;
        const { image_id, tile_folder_url, mask_url } = selectedimg;
        tileurl = this.getTileSource(tile_folder_url, apiserver, apiproxy, image_id);
        maskurl = this.getTileSource(mask_url, apiserver, apiproxy, image_id) || tileurl;
        maskurl = maskurl || tileurl;
        this.legend = selectedimg.legend;
        this.smpexist = Boolean(selectedimg?.smp_layer);

        // var originalTileImg = {
        //     Image: {
        //         xmlns: "http://schemas.microsoft.com/deepzoom/2008",
        //         Url: tileurl,
        //         Format: format,
        //         Overlap: "1",
        //         TileSize: tilesize,
        //         Size: {
        //             Width: width,
        //             Height: height
        //         }
        //     }
        // };

        // var maskTileImg = {
        //     Image: {
        //         xmlns: "http://schemas.microsoft.com/deepzoom/2008",
        //         Url: maskurl,
        //         Format: format,
        //         Overlap: "1",
        //         TileSize: tilesize,
        //         Size: {
        //             Width: width,
        //             Height: height
        //         }
        //     }
        // };
    
        const setupDualViewers = (leftImg, rightImg) => {
            //initiate a viewer
            const leftViewer = OpenSeadragon({
                id: "leftViewer",
                prefixUrl: "/scopeviewer/openseadragon-images/",
                preserveViewport: true,
                tileSources: leftImg,
                navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
            });

            const rightViewer = OpenSeadragon({
                id: "rightViewer",
                prefixUrl: "/scopeviewer/openseadragon-images/",
                preserveViewport: true,
                tileSources: rightImg,
                navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
            });

            return [leftViewer, rightViewer]
        }

        const synchronizeDualViewer = (leftViewer, rightViewer) => {
            var leftViewerLeading = false;
            var rightViewerLeading = false;

            var leftViewerHandler = function () {
                if (rightViewerLeading) {
                    return;
                }
                leftViewerLeading = true;
                rightViewer.viewport.zoomTo(leftViewer.viewport.getZoom()); //listened by handler
                rightViewer.viewport.panTo(leftViewer.viewport.getCenter());
                leftViewerLeading = false;
            };

            var rightViewerHandler = function () {
                if (leftViewerLeading) {
                    return;
                }
                rightViewerLeading = true;
                leftViewer.viewport.zoomTo(rightViewer.viewport.getZoom());
                leftViewer.viewport.panTo(rightViewer.viewport.getCenter());
                rightViewerLeading = false;
            };

            leftViewer.addHandler('zoom', leftViewerHandler);
            rightViewer.addHandler('zoom', rightViewerHandler);
            leftViewer.addHandler('pan', leftViewerHandler);
            rightViewer.addHandler('pan', rightViewerHandler);
        }

        //initiate a viewer
        // var [leftviewer, rightviewer] = setupDualViewers(originalTileImg, maskTileImg);
        var [leftviewer, rightviewer] = setupDualViewers(tileurl, maskurl);
        synchronizeDualViewer(leftviewer, rightviewer); // synchronize zoom/pan
        this.setState({
            status: 1,
            leftViewer: leftviewer,
            rightViewer: rightviewer,
            jsoninfo: selectedimg
        })
    }

    isSafari() {
        const ua = navigator.userAgent;
        return /Safari/.test(ua) && !/Chrome|Chromium/.test(ua);
      }
    render() {
        const safariWarning = this.isSafari() && this.smpexist && (
            <div className="safari-warning">
              <strong>Notice for Safari users: </strong>  
              Safari’s SVG rendering at extreme zoom levels can clip or flicker spots.  
              For the best experience viewing SMP data, consider using Chrome or Firefox.  
            </div>
          );
        return (
            <>
                <div className="wrapper">
                    <Banner message="Provide online annotation and overlay multiple layers' infomation">
                        <h4 className="text-white"><i className="fa fa-picture-o"></i> &nbsp;&nbsp;Pathology Image Viewer</h4>
                    </Banner>
                    <SideBarMenu key={this.state.status} viewerinfo={this.state}/>
                    {safariWarning}
                    <div id="content"  style={{ height: "0vh" }}>
                        <Annotations key={this.state.status} viewers={this.state} />
                        <div className="mt-2 h6" id="color-legend">
                            {this.legend && Object.entries(this.legend).map(([label, color]) => (
                                <div key={label} style={{ display: "inline-block", marginRight: "3px" }}>
                                <div className="legend-box" style={{ backgroundColor: color }}></div>
                                <span className="legend-text">{label}</span>
                                </div>
                            ))}
                        </div>
                        <div id="viewer" className="w-100" style={{ height: "55vh" }}>
                            <div id="leftViewer" className="border border-secondary d-inline-block float-left m-0 w-50 h-100 border-blk"></div>
                            <div id="rightViewer" className="border border-secondary d-inline-block float-right m-0 w-50 h-100 border-blk"></div>
                        </div>

                        <div className="row" style={{marginLeft: 0+"px"}}>
                            <div className="col-md-6" id="left-legend"/>
                            <div className="col-md-6" id="right-legend"/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default ImageViewer;