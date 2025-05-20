import { Component } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';


class RegionLevel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: [],
            expanded: [],
            checkedNode: []
        };
        // this.preSelectedlength = 0;
        this.currentNode = null;
        this.displayPanel = props.tissues.leftViewer;
        this.root = null;
        this.nodes = props.tissues.jsoninfo.tree_layout;
        this.flatJSon = this.flattenJSON(this.nodes);
        this.rightViewerCheckedRegions=[];
        this.leftViewerCheckedRegions=[];
    }

    onCheck = (checked, checkedNode) => {
        this.currentNode = checkedNode;
        // this.preSelectedlength = this.state.checked.length;
        // this.preSelectedNode = this.state.checked;
        //check if a box is checked or not
        // this.checkflag = true;
        this.setState({ checked, checkedNode: checkedNode});

    };

    onExpand = expanded => {
        // this.checkflag = false;
        this.setState({ expanded });
    };

    // createImgtemp = (url, format, ol, ts, width, height) => {
    //     return {
    //         Image: {
    //             xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    //             Url: url,
    //             Format: format,
    //             Overlap: ol,
    //             TileSize: ts,
    //             Size: {
    //                 Width: width,
    //                 Height: height
    //             }
    //         }
    //     }
    // }


    flattenJSON = (obj, resall = {}) => {
    
        for(let i in obj){
            if(obj[i]["children"] === undefined){
                resall[obj[i].value] = obj[i];
            }else{
                this.flattenJSON(obj[i].children,resall);
            }
        } 
        return resall;
    };


    addNewCheckedLeaf = (viewer, checkedLeaves, flatJSon) => {
        checkedLeaves.forEach((item) => {
            // let img = this.createImgtemp(flatJSon[item].path, flatJSon[item].format, flatJSon[item].overlap,
            //      flatJSon[item].tilesize, flatJSon[item].width, flatJSon[item].height);
            this.addRegionTile(viewer, flatJSon[item].path);
        });
    }



    removeUnCheckedLeaf = (viewer, uncheckedLeaves, flatJSon) => {
        uncheckedLeaves.forEach((item) => {
            // this.removeRegionTile(viewer, flatJSon[item].path)
            var tilepath=flatJSon[item].path
            this.removeRegionTile(viewer, tilepath.replace(/\.dzi$/, "_files/"))
        });
    }

    // recursivelyremovechildnodes = (viewer, parentnode, flatJSon) => {
       
    //         if (typeof parentnode.children !== 'undefined') {
    //             parentnode.children.forEach(element => {
    //                 // if it is child node
    //                 if (typeof element.children === 'undefined') {
    //                     this.removeRegionTile(viewer, flatJSon[element.value].path.replace(/\.dzi$/, "_files/"))
    //                 } else { //if it contains more children nodes
    //                     this.recursivelyremovechildnodes(viewer, element, flatJSon);
    //                 }
    //             });
    //         } else {
    //             this.removeRegionTile(viewer, flatJSon[parentnode.value].path.replace(/\.dzi$/, "_files/"))
    //         }
    
    // }

    addRegionTile = (viewer, regionalTile) => {
        viewer.addTiledImage({
            tileSource: regionalTile,
            x: 0,
            opacity: 0.5
        });
    }

    removeRegionTile = (viewer, tileName) => {
        var i, tiledImage;
        var count = viewer.world.getItemCount();
        for (i = 0; i < count; i++) {
            tiledImage = viewer.world.getItemAt(i);
            if (tiledImage.source.tilesUrl === tileName) {
                viewer.world.removeItem(tiledImage);
                break;
            }
        }
    }




    HandleChangeViewerPanelForRegion = (event) => {

        //save current checkedvalue to current viewer
        if (event.target.value === 'rviewer') {
            this.displayPanel = this.props.tissues.rightViewer;
            this.leftViewerCheckedRegions = this.state.checked;
            this.setState({checked: this.rightViewerCheckedRegions});
          
        } else {
            this.displayPanel = this.props.tissues.leftViewer;
            this.rightViewerCheckedRegions = this.state.checked;
            this.setState({checked: this.leftViewerCheckedRegions});
        }

    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(prevState.checked.length, this.preSelectedlength);
        let currentSelectedLength = this.state.checked.length;
        if (prevState.checked.length !== currentSelectedLength) {

            //unselect
            // if (prevState.checked.length > currentSelectedLength) {
            //     let newUncheckedLeaves = prevState.checked.filter(x => !this.state.checked.includes(x));
            //     var addedNodes = this.state.checked.filter(node => !prevState.checked.includes(node));
            //     console.log("newuncheckedleaves",newUncheckedLeaves)
            //     console.log("addedNodes",addedNodes)
            //     this.removeUnCheckedLeaf(this.displayPanel, newUncheckedLeaves, this.flatJSon);
            // }
            // //select 
            // else {
            //     //remove all first to avoid adding the same region multiple times
            //     this.nodes.forEach((item) => {
            //         this.recursivelyremovechildnodes(this.displayPanel, item, this.flatJSon);
            //     }) 
            //     this.addNewCheckedLeaf(this.displayPanel, this.state.checked, this.flatJSon)

            // }
            var addedNodes = this.state.checked.filter(node => !prevState.checked.includes(node));
            var removedNodes = prevState.checked.filter(node => !this.state.checked.includes(node));

            this.addNewCheckedLeaf(this.displayPanel, addedNodes, this.flatJSon);
            this.removeUnCheckedLeaf(this.displayPanel, removedNodes, this.flatJSon);



        }
    }


    render() {
        if (this.props.tissues.jsoninfo.tree_layout) {
            return (
                <div style={{ marginLeft: 0.2 + 'em', padding: 0.5 +'em' }} className="border border-light">
                    <h6 className='text-white'>Overlay Image: </h6>
                    <div style={{ marginLeft: 0.8 + 'em' }}>
                        <div onChange={this.HandleChangeViewerPanelForRegion}>
                            <h6 className='text-white'>Select a viewer to display</h6>
                            <div id="viewerpanels" style={{ marginLeft: 2 + 'em' }}>
                                <input type="radio" className="radio" name="viewpanel" value="lviewer" defaultChecked /> Left Viewer<br />
                                <input type="radio" className="radio" name="viewpanel" value="rviewer" /> Right Viewer
                            </div>
                        </div>

                        <div style={{ marginTop: 0.8 + 'em' }}>
                            <h6 className='text-white'>Tree Layout</h6>
                            <CheckboxTree
                                nodes={this.nodes}
                                checked={this.state.checked}
                                expanded={this.state.expanded}
                                onCheck={this.onCheck}
                                // onClick={this.handleCheckBoxClick(checked)}
                                onExpand={this.onExpand}

                                icons={{
                                    check: <span className="fa fa-check-square" />,
                                    uncheck: <span className="rct-icon rct-icon-uncheck" />,
                                    halfCheck: <span className="rct-icon rct-icon-half-check" />,
                                    expandClose: <span className="rct-icon rct-icon-expand-close" />,
                                    expandOpen: <span className="rct-icon rct-icon-expand-open" />,
                                    expandAll: <span className="rct-icon rct-icon-expand-all" />,
                                    collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
                                    parentClose: <span className="rct-icon rct-icon-parent-close" />,
                                    parentOpen: <span className="rct-icon rct-icon-parent-open" />,
                                    leaf: <span className="rct-icon rct-icon-leaf" />,
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div></div>
        }
    }
}

export default RegionLevel;

