import React from 'react';
import { Link } from 'react-router-dom';
function LandingMain({children}) {
    return (
        <>
            <div className="section features-6">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6" style={{marginLeft:"-40px"}}>
                            <div className="info info-horizontal info-hover-primary">
                                <div className="description pl-4">
                                    <h5 className="title"><small><i className="fa fa-database"></i></small> Prepare Data</h5>
                                    <p>Scope viewer supports the DZI format. Any large high resolution images need to be converted to DZI format first.</p>
                                    <Link to="/prepareData" className="text-info">Learn more</Link>
                                </div>
                            </div>
                            <div className="info info-horizontal info-hover-primary mt-5">
                                <div className="description pl-4">
                                    <h5 className="title"><small><i className="fa fa-file"></i></small> Prepare a JSON File</h5>
                                    <p>A JSON file contains all information about images and other data which can be used to overlay. </p>
                                    <Link to="/prepareJson" className="text-info">Learn more</Link>
                                </div>
                            </div>
                            <div className="info info-horizontal info-hover-primary mt-5">
                                <div className="description pl-4">
                                    <h5 className="title"><small><i className="fa fa-upload"></i></small> Upload a JSON File</h5>
                                    <p>We provide an online JSON editor that can help you validate your uploaded file. Please follow the instruction to edit your JSON file.</p>
                                    {children}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-10 mx-md-auto">
                            <img src={require("../assets/img/docs/steps.png")} width="115%" alt="scopeviewer_design" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default LandingMain;