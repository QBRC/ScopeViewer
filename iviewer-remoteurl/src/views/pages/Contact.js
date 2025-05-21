import React from 'react';
import Banner from '../Banner';
import '../../assets/css/viewer.css';

function Contact() {
    return (
        <>
            <Banner message="">
                <h4 className="text-white"><i className="fa fa-envelope"></i> &nbsp;&nbsp;Contact us</h4>
            </Banner>
            <div className="section features-6" style={{ paddingTop: "2rem" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="card shadow">
                            <div className="card-body">
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane fade show active" id="tabs-text-0" role="tabpanel" aria-labelledby="tabs-text-0-tab">
                                        <div className="row">
                                            <div className="card testimonial-card col-md-4">
                                                <div className="card-up indigo"></div>
                                                <div className="avatar"><img className="rounded-circle" src={require("../../assets/img/andy.jpg")} alt="Andy"/></div>
                                                <div className="card-body text-center">
                                                    <h5 className="card-title">Guanghua (Andy) Xiao</h5>
                                                    <small>
                                                        Professor of Data Sciences<br />Mary Dees McDermott Hicks Chair in Medical Science
                                                    </small>
                                                    <hr />
                                                    <div className="contactlist">
                                                        
                                                           
                                                                214-648-4110<br/>
                                                            
                                                                <p>guanghua.xiao@utsouthwestern.edu</p><br/>
                                                            
                                                                {/* Danciger Research Building, 5323 Harry Hines Blvd. Ste. H9.124, Dallas, TX 75390-8821 */}
                                                            
                                                        
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card testimonial-card col-md-4">
                                                <div className="card-up blue-gradient"></div>
                                                <div className="avatar"><img className="rounded-circle" src={require("../../assets/img/xiaowei.jpg")} alt="Xiaowei"/></div>
                                                <div className="card-body text-center">
                                                    <h5 className="card-title">Xiaowei Zhan</h5>
                                                    <small>
                                                    Associate Professor of Data Sciences <br /><br /><br />
                                                    </small>
                                                    <hr />
                                                    <div className="contactlist">
                                                            {/* <span className="badge badge-success"><i className="fa fa-phone" aria-hidden="true"></i></span>&nbsp; */}
                                                            214-648-5194<br/>
                                                            

                                                            {/* <span className="badge badge-primary"><i className="fa fa-envelope" aria-hidden="true"></i></span>&nbsp; */}
                                                            <p>xiaowei.zhan@utsouthwestern.edu</p><br/>
                                                            

                                                            {/* <span className="badge badge-danger text-center"><i className="fa fa-map-pin" aria-hidden="true"></i></span>&nbsp; */}
                                                            {/* Danciger Research Building, 5323 Harry Hines Blvd. Ste. H9.124, Dallas, TX 75390-8821 */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card testimonial-card col-md-4">
                                                <div className="card-up purple-ingradient"></div>
                                                <div className="avatar"><img className="rounded-circle" src={require("../../assets/img/danni.jpg")} alt="Danni"/></div>
                                                <div className="card-body text-center">

                                                    <h5 className="card-title">Danni Luo</h5>
                                                    <small>
                                                        Scientific Programmer<br /><br /><br />
                                                    </small>
                                                    <hr />
                                                    <div className="contactlist">
                                                            

                                                            {/* <span className="badge badge-primary"><i className="fa fa-envelope" aria-hidden="true"></i></span>&nbsp; */}
                                                            <p>danni.luo@utsouthwestern.edu</p><br/>
                                                            

                                                            {/* <span className="badge badge-danger text-center"><i className="fa fa-map-pin" aria-hidden="true"></i></span>&nbsp; */}
                                                            {/* Danciger Research Building, 5323 Harry Hines Blvd. Ste. H9.124, Dallas, TX 75390-8821 */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;