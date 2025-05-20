import React from 'react';
import '../assets/css/viewer.css';

function Banner({message, children}) {

    return (
        <>
       
                {/* <section className="section section-shaped section-lg">
                    <div className="shape shape-style-1 bg-gradient-default">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    </div>
                    <div className="page-header">
                        <div className="container shape-container d-flex align-items-center py-lg">
                            <div className="col px-0">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-lg-6 text-center">
                                        <img src={require("../assets/img/brand/white.png")} style={{width: "200px"}} className="img-fluid" />
                                            <p className="lead text-white">A convenient web-based Image Viewer for wholeslides. Put data anywhere and view it on our website.</p>
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
                </section> */}

        <section className="section section-shaped">
            <div className="shape shape-style-1 bg-gradient-default">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="page-header">
                        <div className="container shape-container d-flex align-items-center">
                            <div className="col px-0">
                                <div className="row align-items-center banner">
                                    <div className="col-lg-8">
                                        {/* <img src={require("../assets/img/brand/white.png")} style={{width: "200px"}} className="img-fluid" /> */}
                                            {children}
                                            <p className="lead text-white margin-top-0 banner-text">{message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>
      </section>
            
        </>
    );
}

export default Banner;