import React from 'react';
import Banner from '../Banner';
import '../../assets/css/viewer.css';
function JsonPre() {
    return (
        <>
            <Banner message="Prepare Json File for Region Level, Spot Level and Cell Level Image Display">
                <h4 className="text-white"><i className="fa fa-book"></i> &nbsp;&nbsp;Prepare Json File</h4>
            </Banner>
            <div className="section features-6">
                <div className="container">
                <div className="row align-items-center">
                   <div className="nav-wrapper">
                       <ul className="nav nav-pills nav-fill flex-column flex-md-row" id="tabs-text" role="tablist">
                           <li className="nav-item">
                               <a className="nav-link mb-sm-3 mb-md-0 active" id="tabs-text-1-tab" data-toggle="tab" href="#tabs-text-1" role="tab" aria-controls="tabs-text-1" aria-selected="true">Single Image</a>
                           </li>
                           <li className="nav-item">
                               <a className="nav-link mb-sm-3 mb-md-0" id="tabs-text-2-tab" data-toggle="tab" href="#tabs-text-2" role="tab" aria-controls="tabs-text-2" aria-selected="false">Multiple Images</a>
                           </li>
                       </ul>
                   </div>
                   <div className="card shadow">
                       <div className="card-body">
                           <div className="tab-content" id="myTabContent">
                               <div className="tab-pane fade show active" id="tabs-text-1" role="tabpanel" aria-labelledby="tabs-text-1-tab">
                               <p className="description">If you are not familiar with JSON format, please go to home page to download single and multiple Image
                               JSON file examples, and replace values. You can also go to JSON Editor to validate your json file</p>
                               <p className="description">If you only have one wholeslide to view, you need provide below keys and values in a JSON file: </p>
                               <pre>  
                               <p className="description">&#91; <br/>
                               &nbsp; &nbsp;/** original whole slide information, <span className="highlight">"required key"</span> are highlighted **/<br/>
                               &nbsp; &#123; <span className="highlight">"image_id":</span> unique int<br/>  
                               &nbsp; &nbsp; <span className="highlight">"image_name":</span> string type <br/>
                               &nbsp; &nbsp; "pathology_histology": string type<br/>
                               &nbsp; &nbsp; <span className="highlight">"width":</span> int type (original wholeslide width) <br/>
                               &nbsp; &nbsp; <span className="highlight">"height":</span> int type (original wholeslide height) <br/>
                               &nbsp; &nbsp; <span className="highlight">"format":</span> string type (png/jpg/jpeg)<br/>
                               &nbsp; &nbsp; <span className="highlight">"tile_size":</span> int type<br/> 
                               &nbsp; &nbsp; <span className="highlight">"tile_folder_url":</span> original wholeslide http path<br/>
                               &nbsp; &nbsp; "mask_url": wholeslide with mask overlay (will display on right viewer)<br/>
                               &nbsp; &nbsp; /** smp data is optional **/<br/>
                               &nbsp; &nbsp; "smp_layer": smp data http path<br/>
                               &nbsp; &nbsp; /** overlay images are optional, but if JSON contains "tree_layout" key, <span className="highlight">"require key"</span> are highlighted **/<br/>
                               &nbsp; &nbsp; "tree_layout": &#91;<b/> 
                               &nbsp;&#123;<br/> 
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="highlight">"value":</span> unique string <br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="highlight">"label":</span> string type (display in the checkbox tree)<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /** if overlay images contains hierarchical relationships, children is needed. <span className="highlight">"require key"</span> are highlighted **/<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /** We recommand you have at lease one parent, use label key to describe what overlay images are. **/<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /** eg. Tissue Region, Cell Level Mask **/<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "children": &#91;<b/>
                               &nbsp;&#123;<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"value":</span> unique string <br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"label":</span> display name <br/> 
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"path":</span> overlay image http path<br/> 
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"overlay":</span> integer type <br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"format":</span> recommand png<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"tilesize":</span> overlay image tilesize<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"width":</span> overlay image width <br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"height":</span> overlay image height<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ...<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#93;<br/> 
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125; <br/>&#93;</p>
                                </pre>
                            </div>
                            <div className="tab-pane fade" id="tabs-text-2" role="tabpanel" aria-labelledby="tabs-text-2-tab">
                               <p className="description">If you are not familiar with JSON format, please go to home page to download single and multiple Image
                               JSON file examples, and replace values. You can also go to JSON Editor to validate your json file. If you have more than one wholeslide to view, your JSON array contains more than one item object. You will view
                               a image table first. Select one image you want to view from the table</p>
                               <p className="description">Below JSON contains 2 images:</p>
                               <pre>  
                               <p className="description">&#91; <br/>
                               &nbsp; &nbsp;/** original whole slide information, <span className="highlight">"required key"</span> are highlighted **/<br/>
                               &nbsp; &#123; <span className="highlight">"image_id":</span> 1 <br/>  
                               &nbsp; &nbsp; <span className="highlight">"image_name":</span> "Brease Cancer 20220715" <br/>
                               &nbsp; &nbsp; "pathology_histology": ""<br/>
                               &nbsp; &nbsp; <span className="highlight">"width":</span> 35542 <br/>
                               &nbsp; &nbsp; <span className="highlight">"height":</span> 45232 <br/>
                               &nbsp; &nbsp; <span className="highlight">"format":</span> "jpg"<br/>
                               &nbsp; &nbsp; <span className="highlight">"tile_size":</span> 256<br/> 
                               &nbsp; &nbsp; <span className="highlight">"tile_folder_url":</span> "http://hostname/original_ws_dzi"<br/>
                               &nbsp; &nbsp; "mask_url":"http://hostname/mask_dzi"<br/>
                               &nbsp;  &#125;, <br/>
                               &nbsp; &#123; <span className="highlight">"image_id":</span> 2 <br/>  
                               &nbsp; &nbsp; <span className="highlight">"image_name":</span> "Brease Cancer 20220716" <br/>
                               &nbsp; &nbsp; "pathology_histology": ""<br/>
                               &nbsp; &nbsp; <span className="highlight">"width":</span> 35542 <br/>
                               &nbsp; &nbsp; <span className="highlight">"height":</span> 45232 <br/>
                               &nbsp; &nbsp; <span className="highlight">"format":</span> "jpg"<br/>
                               &nbsp; &nbsp; <span className="highlight">"tile_size":</span> 256<br/> 
                               &nbsp; &nbsp; <span className="highlight">"tile_folder_url":</span> "http://hostname/original_ws2_dzi"<br/>
                               &nbsp; &nbsp; "mask_url": "http://hostname/mask2_dzi"<br/>
                               &nbsp; &nbsp; "smp_layer": "http://hostname/smp_data.db"<br/>
                               &nbsp; &nbsp; "tree_layout": &#91;<b/> 
                               &nbsp;&#123;<br/> 
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="highlight">"value":</span> tissue_region <br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="highlight">"label":</span> Tissue Region<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "children": &#91;<b/>
                               &nbsp;&#123;<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"value":</span> fat_region <br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"label":</span> Fat <br/> 
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"path":</span> "http://hostname/fat_dzi"<br/> 
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"overlay":</span> 1<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"format":</span> "png"<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"tilesize":</span> 256<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"width":</span> 800 <br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="highlight">"height":</span> 735<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ...<br/>
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#93;<br/> 
                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125; <br/>&#93;</p>
                                </pre>
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

export default JsonPre;