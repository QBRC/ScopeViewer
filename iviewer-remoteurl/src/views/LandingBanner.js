import React from 'react';
import { Link } from 'react-router-dom';
import {Carousel} from 'react-bootstrap';
import { useState } from 'react';
import '../assets/css/slidebanner.css';


function LandingBanner() {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    return (
        <>
       
                {/* <div className="section section-hero section-shaped">
                    <div className="shape shape-style-1 shape-primary">
                        <span className="span-150"></span>
                        <span className="span-50"></span>
                        <span className="span-50"></span>
                        <span className="span-75"></span>
                        <span className="span-100"></span>
                        <span className="span-75"></span>
                        <span className="span-50"></span>
                        <span className="span-100"></span>
                        <span className="span-50"></span>
                        <span className="span-100"></span>
                    </div>
                    <div className="page-header">
                        <div className="container shape-container d-flex align-items-center py-lg">
                            <div className="col px-0">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-lg-6 text-center">
                                        <img src={require("../assets/img/brand/whitelogo.png")} style={{width: "200px"}} className="img-fluid" alt="whitelogo"/>
                                            <p className="lead text-white">A convenient web-based Image Viewer for high-resolution wholeslides. Put data anywhere safe and view it on our website.</p>
                                            <div className="btn-wrapper mt-5">
                                                <Link to="oneimg.json" target="_blank" className="btn btn-lg btn-white btn-icon mb-3 mb-sm-0" download>
                                                    <span className="btn-inner--icon"><i className="fa fa-download"></i></span>
                                                    <span className="btn-inner--text">Single Entity/JSON</span>
                                                </Link>
                                                <Link to="multipleimgs.json" target="_blank" className="btn btn-lg btn-github btn-icon mb-3 mb-sm-0" download>
                                                    <span className="btn-inner--icon"><i className="fa fa-download"></i></span>
                                                    <span className="btn-inner--text"><span className="text-warning">Multiple</span> Entity/JSON</span>
                                                </Link>
                                            </div>
                                              <div className="mt-5">
                                                <small className="font-weight-bold mb-0 mr-2 text-white">*proudly coded by</small>
                                                <img src={require("../assets/img/brand/creativetim-white-slim.png")} style={{height: "28px"}} />
                                            </div>  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="separator separator-bottom separator-skew zindex-100">
                        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
                        </svg>
                    </div>
                </div> */}

<Carousel>
        {/* Slide 1 */}
        <Carousel.Item interval={5000}>
            <div className="section section-hero section-shaped">
                <div className="shape shape-style-1 shape-primary">
                            <span className="span-150"></span>
                            <span className="span-50"></span>
                            <span className="span-50"></span>
                            <span className="span-75"></span>
                            <span className="span-100"></span>
                            <span className="span-75"></span>
                            <span className="span-50"></span>
                            <span className="span-100"></span>
                            <span className="span-50"></span>
                            <span className="span-100"></span>
                </div>
                <div className="page-header">
                    <div className="container shape-container d-flex align-items-center padding-top-4">
                        <div className="col px-0 banner-content-height">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-lg-6 text-center">
                                    <img src={require("../assets/img/brand/whitelogo.png")} style={{width: "200px"}} className="img-fluid" alt="whitelogo"/>
                                        <p className="lead text-white">A convenient web-based Image Viewer for high-resolution wholeslides. Put data anywhere safe and view it on our website.</p>
                                            <div className="btn-wrapper mt-5">
                                                <Link to="oneimg.json" target="_blank" className="btn btn-lg btn-white btn-icon mb-3 mb-sm-0" download>
                                                    <span className="btn-inner--icon"><i className="fa fa-download"></i></span>
                                                    <span className="btn-inner--text">Single Entity/JSON</span>
                                                </Link>
                                                <Link to="multipleimgs.json" target="_blank" className="btn btn-lg btn-github btn-icon mb-3 mb-sm-0" download>
                                                    <span className="btn-inner--icon"><i className="fa fa-download"></i></span>
                                                    <span className="btn-inner--text"><span className="text-warning">Multiple</span> Entity/JSON</span>
                                                </Link>
                                            </div>          
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Carousel.Item>

        {/* Slide 2 */}
        <Carousel.Item interval={5000}>
        <div className="section section-hero section-shaped">
                    <div className="shape shape-style-1 shape-primary">
                        <span className="span-150"></span>
                        <span className="span-50"></span>
                        <span className="span-50"></span>
                        <span className="span-75"></span>
                        <span className="span-100"></span>
                        <span className="span-75"></span>
                        <span className="span-50"></span>
                        <span className="span-100"></span>
                        <span className="span-50"></span>
                        <span className="span-100"></span>
                    </div>
                    <div className="page-header">
            <div className="container shape-container d-flex align-items-center padding-top-4">
              <div className="col px-0 banner-content-height">
                <div className="row align-items-center justify-content-center">
          
                  <div className="col-xs-12 col-md-12 col-lg-6">
                    <img
                      src={require("../assets/img/docs/synchroview.png")}
                      alt="Demo Image 2"
                      className="img-fluid"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
        
                  <div className="col-xs-12 col-md-12 col-lg-6">
                    <div className="caption">
                      <h4 className="text-white">Dual Viewer</h4>
                      <p className="lead text-white">Synchronized views for H&E pathology image and AI facilitated cell segmentation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </Carousel.Item>

        {/* Slide 3 */}
        <Carousel.Item interval={5000}>
        <div className="section section-hero section-shaped">
                    <div className="shape shape-style-1 shape-primary">
                        <span className="span-150"></span>
                        <span className="span-50"></span>
                        <span className="span-50"></span>
                        <span className="span-75"></span>
                        <span className="span-100"></span>
                        <span className="span-75"></span>
                        <span className="span-50"></span>
                        <span className="span-100"></span>
                        <span className="span-50"></span>
                        <span className="span-100"></span>
                    </div>
                    <div className="page-header">
            <div className="container shape-container d-flex align-items-center padding-top-4">
              <div className="col px-0 banner-content-height">
                <div className="row align-items-center justify-content-center">
          
                  <div className="col-xs-12 col-md-12 col-lg-6">
                    <img
                      src={require("../assets/img/docs/overlaysmp.png")}
                      alt="Demo Image 2"
                      className="img-fluid"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
        
                  <div className="col-xs-12 col-md-12 col-lg-6">
                    <div className="caption">
                      <h4 className="text-white">Overlay Layer</h4>
                      <p className="lead text-white">Efficiently overlaying spatial transcriptomics features</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </Carousel.Item>

        {/* Slide 4 */}
        <Carousel.Item interval={5000}>
        <div className="section section-hero section-shaped">
                    <div className="shape shape-style-1 shape-primary">
                        <span className="span-150"></span>
                        <span className="span-50"></span>
                        <span className="span-50"></span>
                        <span className="span-75"></span>
                        <span className="span-100"></span>
                        <span className="span-75"></span>
                        <span className="span-50"></span>
                        <span className="span-100"></span>
                        <span className="span-50"></span>
                        <span className="span-100"></span>
                    </div>
                    <div className="page-header">
            <div className="container shape-container d-flex align-items-center padding-top-4">
              <div className="col px-0 banner-content-height">
                <div className="row align-items-center justify-content-center">
          
                  <div className="col-xs-12 col-md-12 col-lg-6">
                    <img
                      src={require("../assets/img/docs/systemdesign.png")}
                      alt="Demo Image 2"
                      className="img-fluid"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
        
                  <div className="col-xs-12 col-md-12 col-lg-6">
                    <div className="caption">
                      <h4 className="text-white">System Design  </h4>
                      <p className="lead text-white">Visualization will not leak genomic data to the ScopeViewer webserver</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </Carousel.Item>
      </Carousel>
            
        </>
    );
}

export default LandingBanner;