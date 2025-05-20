import React from 'react';


function Footer() {


    var footerStyle={

        position: "fixed",
        width: "100%",
        bottom: 0,
        padding:"0.8rem"

    }
    return (
        <>
            <footer className="footer" style={footerStyle}>
                <div className="container">


                    <div className="row align-items-center justify-content-md-between">
                        <div className="col-md-12">
                            <div className="copyright text-center">
                                © 2022 <a href="https://qbrc.swmed.edu/" target="_blank" rel="noreferrer">Quantitative Biomedical Research Center</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    );
}

export default Footer;