import { Component } from 'react';
import Draggable from "react-draggable";
import $ from 'jquery';
import '../assets/css/bootstrap.module.css';
import RegionLevel from './RegionLevel';
import SpotLevel from './SpotLevel';

class SideBarMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {tissueRegions: null}
    }

    toggleFloatWindow = () => {
        $('#float-window').toggleClass('d-none d-block');
    }

    render() {
        if (this.props.viewerinfo.status === 1) {
            return (
                <>
                    {/* <nav id="sidebar">
                        <div className="sidebar-header">
                            <h3>Layer Information</h3>
                        </div>
                        <RegionLevel tissues={this.props.viewerinfo} />
                        <SpotLevel spots={this.props.viewerinfo} />
                        <CellLevel cellmask={this.props.viewerinfo} />
                    </nav> */}

                    <Draggable>
                        <div id="float-window" className="window card z-depth-3 d-block">
                            <div id="window-header">
                                <h6 className='text-white'>Layers
                                    <button type="button" className="close" aria-label="Close" onClick={this.toggleFloatWindow}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </h6><hr/>
                            </div>
                            <RegionLevel  tissues={this.props.viewerinfo} />
                            <SpotLevel  spots={this.props.viewerinfo} />
                            {/* <CellLevel  cellmask={this.props.viewerinfo} /> */} 
                        </div>
                    </Draggable>
                </>
            );
        }else{
            return null;
        }
    }
}
export default SideBarMenu;