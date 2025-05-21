import React from 'react';
import '../assets/css/viewer.css';

function Banner({message, children}) {
    return (
        <>
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