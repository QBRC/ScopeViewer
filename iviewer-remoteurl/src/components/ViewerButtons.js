import { Component } from 'react';
import $ from 'jquery';
import bs from '../assets/css/bootstrap.module.css';
import Modal from './Modal';
import Bookmark from "./BookmarkButton"

class ViewerButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal:false,
            fileName:'',
            toggleSingle:true,
        }
        this.fullscreenFlag = false;
    }

    handleToggleSingleDual = () => {
        $("#leftViewer").toggleClass('w-100 w-50');
        $("#rightViewer").toggleClass('d-none d-inline-block');
        $("#right-legend").toggle();
        // $("#rightViewer").toggleClass(bs.d-none, bs.d-inline-block);
        // this.setState({ toggleSingle: !this.state.toggleSingle });
    }

    handleSaveAnnos = () => {
        let savedannos = 
            JSON.stringify(
                {"left": this.props.annos.leftAnno.getAnnotations(),
                "right": this.props.annos.rightAnno.getAnnotations()}
                );
        let blob = new Blob([savedannos]);
        // this.fileDownloadUrl = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.state.fileName+`.json`;
        link.click();
        this.modalClose();
    }

    handleFullScreen = () => {
        if (this.fullscreenFlag) {
            $("#viewer").css("height", "600px");
            this.fullscreenFlag = false;

        } else {
            let setHeight = $(window).height() * 0.75;
            $("#viewer").css("height", setHeight);
            this.fullscreenFlag = true;
        }
    }

    handleChangeFileName = (e, value) => {
        e.preventDefault();
        this.setState({fileName: value})
    } 

    handleToggleSideBar = () => {
        $("#float-window").toggleClass('d-none d-block');
    }

    modalOpen = (e) => {
        e.preventDefault();
        const today = new Date();
        const date1 = today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
        this.setState({showModal:true, fileName: this.props.imginfo.image_name+'_'+date1})
    }

    modalClose = () => {
        this.setState({showModal:false})
        $('.modal-backdrop').remove();
    }

    render() {
        return (
            <div className="col-md-8 text-right col-sm-8 col-8 annotationbtns">
                <span className="save-msg mr-2"></span>
                <Bookmark bookmarkobj={this.props.imginfo}/>
                 <button className={`${bs.btn} ${bs[`btn-outline-primary`]} ${bs[`btn-sm`]} ${bs[`d-inline-block`]} ${bs[`mr-2`]}`} onClick={() => this.handleToggleSingleDual()}>
                    <i className="fa fa-image"></i> Toggle single/dual-view mode
                </button>
                <a href="" data-toggle="modal" data-target="#saveModal" className={`${bs.btn} ${bs[`btn-outline-primary`]} ${bs[`btn-sm`]} ${bs[`d-inline-block`]}`} onClick={(e) => this.modalOpen(e)} style={{ marginRight: 0.8 + 'em' }}>
                    <i className="fa fa-save"></i> Download annotation
                </a>
                <button id="sidebarCollapse" className={`${bs.btn} ${bs[`btn-outline-primary`]} ${bs[`btn-sm`]} ${bs[`d-inline-block`]} ${bs[`mr-2`]}`} onClick={() => this.handleToggleSideBar()}>
                    <i className="fa fa-align-left"></i>Toggle Window
                </button>

                <Modal show={this.state.showModal} whichmodal="saveModal" handleClose={()=> this.modalClose()}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Save current annotation</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close" onClick={() => this.modalClose()}>
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <div className="form-group row mt-3">
                                <label htmlFor="name" className="col-md-4 col-form-label text-md-right">Name</label>
                                    <div className="col-md-6">
                                        <input id="name" type="text" className="form-control" name="name" value={this.state.fileName}
                                            placeholder="Annotation name" required autoComplete="name" autoFocus onChange={(e, value) => this.handleChangeFileName(e, value)}/>
                                        <span className="invalid-feedback" role="alert"></span>
                                    </div>
                            </div>

                            <div className="modal-body"></div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary mr-3" type="button" data-dismiss="modal" onClick={() => this.modalClose()}>Cancel</button>
                                <button className="btn btn-primary save-annotation" onClick={() => this.handleSaveAnnos()}>Save</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>

        )
    }
}

export default ViewerButtons;
