import React from 'react';

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TwitterShareButton } from "react-share";
//import { FacebookShareButton, TwitterShareButton } from "react-share";
import singleImgJSON from "../assets/json/oneimg.json";
import multiImGJSON from "../assets/json/multipleimgs.json";

function NavigationBar() {
    const [multiimg, setMultiImg] = useState();
    const [singleimg, setSingleImg] = useState();

    useEffect(() => {
        setSingleImg(singleImgJSON[0]);
        setMultiImg(multiImGJSON);
    }, [])

    return (
        <>
            <nav id="navbar-main" className="navbar navbar-main navbar-expand-lg bg-white navbar-light position-sticky top-0 shadow py-2">
                <div className="container">
                    <Link className="navbar-brand mr-lg-5" to="/">
                        <img src={require("../assets/img/brand/colorlogo.png")} style={{ height: 38 + "px" }} alt="colorlogo"/>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse" id="navbar_global">
                        <div className="navbar-collapse-header">
                            <div className="row">
                                <div className="col-6 collapse-brand">
                                    <Link to="/">
                                        <img src={require("../assets/img/brand/colorlogo.png")} alt="colorlogo"/>
                                    </Link>
                                </div>
                                <div className="col-6 collapse-close">
                                    <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar_global" aria-controls="navbar_global" aria-expanded="false" aria-label="Toggle navigation">
                                        <span></span>
                                        <span></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ul className="navbar-nav navbar-nav-hover align-items-lg-center">
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link" data-toggle="dropdown" role="button">
                                    <i className="ni ni-ui-04 d-lg-none"></i>
                                    <span className="nav-link-inner--text">Steps</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-xl">
                                    <div className="dropdown-menu-inner">
                                        <Link to="/prepareData" className="media d-flex align-items-center">
                                            <div className="media-body ml-3">
                                                <h6 className="heading text-primary mb-md-1">Prepare Data</h6>
                                                <p className="description d-none d-md-inline-block mb-0">How to prepare data, and configure server.</p>
                                            </div>
                                        </Link>
                                        <Link to="/prepareJson" className="media d-flex align-items-center">
                                            <div className="media-body ml-3">
                                                <h6 className="heading text-primary mb-md-1">Prepare JSON</h6>
                                                <p className="description d-none d-md-inline-block mb-0">Use our JSON example to prepare yours.</p>
                                            </div>
                                        </Link>
                                        <Link to="/validateJson" className="media d-flex align-items-center">
                                            <div className="media-body ml-3">
                                                <h6 className="heading text-primary mb-md-1">Validate JSON</h6>
                                                <p className="description d-none d-md-inline-block mb-0">Validate Your JSON file</p>
                                            </div>
                                        </Link>
                                        {/* <a href="https://demos.creative-tim.com/argon-design-system/docs/components/alerts.html" className="media d-flex align-items-center">
                                            <div className="media-body ml-3">
                                                <h5 className="heading text-warning mb-md-1">Upload Json</h5>
                                                <p className="description d-none d-md-inline-block mb-0">Test data url and upload</p>
                                            </div>
                                        </a> */}
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link" data-toggle="dropdown" role="button">
                                    <i className="ni ni-collection d-lg-none"></i>
                                    <span className="nav-link-inner--text">Examples</span>
                                </a>
                                <div className="dropdown-menu">

                                    <Link to={{ pathname:`/imagetable`, state: { jsonfile: multiimg } }} className="dropdown-item">Image Table</Link>
                                    <Link to={{ pathname: "/imageviewer", state: { selectedimg: singleimg } }} className="dropdown-item">Image Viewer</Link>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link"  to={{ pathname:`/contact`}}>
                                    <i className="ni ni-collection d-lg-none"></i>
                                    <span className="nav-link-inner--text">Contact</span>
                                </Link>
                            </li>

                        </ul>
                        <ul className="navbar-nav align-items-lg-center ml-lg-auto">
                            {/* <li className="nav-item">
                                <a className="nav-link nav-link-icon" href="https://www.facebook.com/CreativeTim/" target="_blank" data-toggle="tooltip" title="Like us on Facebook">
                                    <i className="fa fa-facebook-square"></i>
                                    <span className="nav-link-inner--text d-lg-none">Facebook</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-link-icon" href="https://www.instagram.com/creativetimofficial" target="_blank" data-toggle="tooltip" title="Follow us on Instagram">
                                    <i className="fa fa-instagram"></i>
                                    <span className="nav-link-inner--text d-lg-none">Instagram</span>
                                </a>
                            </li> */}
                            <li className="nav-item">
                                {/* <a className="nav-link nav-link-icon" href="https://twitter.com/creativetim" target="_blank" data-toggle="tooltip" title="Follow us on Twitter">
                                    <i className="fa fa-twitter-square"></i>
                                    <span className="nav-link-inner--text d-lg-none">Twitter</span>
                                </a> */}
                                <TwitterShareButton
                                    title={"Scope Viewer"}
                                    url={"https://datacommons.swmed.edu/scopeviewer/"}
                                    hashtags={["QBRCSoftware"]}
                                >
                                    <i className="fa fa-twitter-square"></i>
                                </TwitterShareButton>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-link-icon" href="https://github.com/QBRC/ScopeViewer" target="_blank" data-toggle="tooltip" title="Star us on Github">
                                    <i className="fa fa-github"></i>
                                    <span className="nav-link-inner--text d-lg-none">Github</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <Link to={{ pathname: "/imageviewer", state: { selectedimg: singleimg } }} className="btn btn-outline-primary" >
                                    <span className="nav-link-inner--text">Viewer Demo</span>
                                </Link>
                            </li>
                            <li className="nav-item d-none d-lg-block">
                                <Link to={{ pathname: "/validateJson"}}  className="btn btn-primary btn-icon">
                                    {/* <span className="btn-inner--icon">
                                        <i className="fa fa-shopping-cart"></i>
                                    </span> */}
                                    <span className="nav-link-inner--text">JSON Editor</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavigationBar;