import React from 'react';
import Banner from '../Banner';
import JsonEditor from '../JsonEditor';
import { useLocation } from 'react-router-dom'

function JsonValidate() {

    const location = useLocation();
    let model={};
    if(location.state){
        const { selectedimg } = location.state;
        model= selectedimg ;
    }
    return (
        <>
            <Banner message="Upload Json File to display your local data">
                <h4 className="text-white"><i className="fa fa-upload"></i> &nbsp;&nbsp;Validate Json File</h4>
            </Banner>
            <div className="section features-6">
                <div className="container align-items-center">
             
                   
                <JsonEditor model={model}/>


             
                   
                </div>
            </div>
        </>
    );
}

export default JsonValidate;