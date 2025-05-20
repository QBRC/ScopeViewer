import { Component } from 'react';
import bs from '../assets/css/bootstrap.module.css';
import Modal from './Modal';

import $ from 'jquery';
import LZstring from "lz-string";

class BookmarkButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            icon: "",
            bkstatus: "Click the button to copy current url"
        }
        this.bkmessage=""

    }

    modalOpen = (e) => {
        e.preventDefault();
        this.setState({ showModal: true })

    }

    handleBookmark = () => {
        //   const objString = '?' + new URLSearchParams(props.bookmarkobj).toString();
        const json = JSON.stringify(this.props.bookmarkobj);
        const size = new TextEncoder().encode(json).length
        const kiloBytes = size / 1024;


        if (kiloBytes <= 10) {
            const compressed = LZstring.compressToEncodedURIComponent(json)
            const objString = window.location.protocol + "//" + window.location.host + "" + window.location.pathname + '?mark=' + compressed
            // navigator.clipboard.writeText(objString);
            if (navigator.clipboard) { // If normal copy method available, use it
                navigator.clipboard.writeText(objString);
                this.setState({ icon: "success", bkstatus: "URL copied!" })
              } else { // Otherwise fallback to the above function
                this.setState({ icon: "bkfail"})
              }
            // window.open(objString, "_blank");
            
        }
        else {
            this.setState({ icon: "toolarge", bkstatus: "JSON file is too large (more than 10KB)" })
        }



    }

    modalClose = () => {
        this.setState({ showModal: false })
        $('.modal-backdrop').remove();
    }

    render() {
        if(this.state.icon==="success"){
            this.bkmessage=<p id="copystatus" style={{ marginTop: "1rem", marginBottom: "0" }}><i className="fa fa-check-circle" style={{color:"green"}}></i> {this.state.bkstatus}</p>
        }else if(this.state.icon===""){
            this.bkmessage=<p id="copystatus" style={{ marginTop: "1rem", marginBottom: "0" }}>{this.state.bkstatus}</p>
        }else if(this.state.icon==="bkfail"){
            this.bkmessage=<p id="copystatus" style={{ marginTop: "1rem", marginBottom: "0" }}><i className="fa fa-times-circle" style={{color:"red"}}></i> Sorry, bookmark is unavailable for the current insecure protocol. 
            Please use our <a href="https://cdc.biohpc.swmed.edu/scopeviewer" target="_blank" >website</a> for this feature or deploy this website using a secure protocol (https)</p>
        }else{
            this.bkmessage=<p id="copystatus" style={{ marginTop: "1rem", marginBottom: "0" }}><i className="fa fa-times-circle" style={{color:"red"}}></i> {this.state.bkstatus}</p>
        }

        return (
            <>
                <a href="" data-toggle="modal" data-target="#bookmark-modal" className={`${bs.btn} ${bs[`btn-outline-primary`]} ${bs[`btn-sm`]} ${bs[`d-inline-block`]}`} onClick={(e) => this.modalOpen(e)} style={{ marginRight: 0.8 + 'em' }}>
                    <i className="fa fa-bookmark"></i> Bookmark
            </a>

                <Modal show={this.state.showModal} whichmodal="bookmark">

                    <div className="modal-dialog" role="document">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title" id="bookmarkModalLabel">Bookmark</h5>
                                <button className="close" type="button" data-dismiss="bookmark-modal" aria-label="Close" onClick={() => this.modalClose()}>
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <div className="mt-3 text-center">
                                <button className="btn btn-primary save-annotation" onClick={() => this.handleBookmark()}>Copy Url</button>
                                {this.bkmessage}

                            </div>

                            <div className="modal-body">

                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary mr-3" type="button" data-dismiss="bookmark-modal" onClick={() => this.modalClose()}>Cancel</button>
                            </div>
                        </div>
                    </div>

                </Modal>

            </>
        );

    }
}

export default BookmarkButton;