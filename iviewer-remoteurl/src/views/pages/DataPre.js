import React from 'react';
import Banner from '../Banner';
import { Link } from 'react-router-dom';
import '../../assets/css/viewer.css';

function DataPre() {
    var smp_layer = "http://hostname/sqlite_data.db";
    return (
        <>
            <Banner message="Prepare Data for Region Level, Spot Level and Cell Level Image Display">
                <h4 className="text-white"><i className="fa fa-book"></i> &nbsp;&nbsp;Prepare Data</h4>
            </Banner>
            <div className="section features-6" style={{ paddingTop: "2rem" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="nav-wrapper">
                            <ul className="nav nav-pills nav-fill flex-column flex-md-row" id="tabs-text" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link mb-sm-3 mb-md-0 active" id="tabs-text-5-tab" data-toggle="tab" href="#tabs-text-5" role="tab" aria-controls="tabs-text-5" aria-selected="true">Format Support</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link mb-sm-3 mb-md-0" id="tabs-text-1-tab" data-toggle="tab" href="#tabs-text-1" role="tab" aria-controls="tabs-text-1" aria-selected="true">DZI Format</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link mb-sm-3 mb-md-0" id="tabs-text-2-tab" data-toggle="tab" href="#tabs-text-2" role="tab" aria-controls="tabs-text-2" aria-selected="false">Tree Layout</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link mb-sm-3 mb-md-0" id="tabs-text-3-tab" data-toggle="tab" href="#tabs-text-3" role="tab" aria-controls="tabs-text-3" aria-selected="false">SMP Layer</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link mb-sm-3 mb-md-0" id="tabs-text-4-tab" data-toggle="tab" href="#tabs-text-4" role="tab" aria-controls="tabs-text-4" aria-selected="false">Cell Level</a>
                                </li>
                            </ul>
                        </div>
                        <div className="card shadow">
                            <div className="card-body">
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane fade show active" id="tabs-text-5" role="tabpanel" aria-labelledby="tabs-text-5-tab">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h5>Supported Formats</h5>
                                                <p className="description">
                                                    Our viewer supports both <strong>Deep Zoom Image (.dzi)</strong> format and <strong>native SVS/TIFF slides</strong>,
                                                    offering flexibility for your digital pathology workflow.
                                                </p>
                                                <ul>
                                                    <li>.dzi (Deep Zoom Image format)</li>
                                                    <li>.svs / .tiff (whole-slide image formats, directly supported)</li>
                                                </ul>

                                                <h5>Using SVS/TIFF Without Converting to DZI</h5>
                                                <p className="description">
                                                    You can use SVS/TIFF files <strong>directly</strong>, without needing to convert them to <code>.dzi</code>, by integrating
                                                    with <strong>our API</strong> and providing a few necessary parameters.
                                                </p>

                                                <h5>Requirements</h5>
                                                <ol>
                                                    <li>Use our API structure to load the slide data.</li>
                                                    <li>
                                                    In your JSON configuration, the field <code>tile_folder_url</code> <strong>must point to a public HTTP(S) URL</strong> that is
                                                    accessible by the viewer and points to the SVS/TIFF file.
                                                    </li>
                                                    <li>
                                                    The system will <strong>automatically detect</strong> the file extension (<code>.dzi</code>, <code>.svs</code>, <code>.tiff</code>) and render the slide accordingly.
                                                    </li>
                                                </ol>

                                                <h5>Example JSON</h5>
                                                <pre>
                                                    <code>
                                                {`{"image_id": "example-slide", "tile_folder_url": "https://your-server.com/path/to/slide.svs" }`}
                                                    </code>
                                                </pre>

                                                <p className="description">
                                                    <strong>💡 Note:</strong> Ensure the <code>tile_folder_url</code> is publicly accessible via <strong>HTTP or HTTPS</strong>.
                                                    The viewer will not be able to fetch files behind authentication walls or file systems without web access.
                                                </p>

                                                <p className="description">
                                                    There’s <strong>no need to manually configure anything else</strong> — the viewer will intelligently detect the file type and adjust its rendering engine accordingly.
                                                </p>

                                                <h5>Additional Notes</h5>
                                                <ol>
                                                    <li >Currently, only <code>.svs</code> and <code>.tiff</code> files are supported directly. Other formats should be converted to <code>.dzi</code>. Please check the second tab to see how to prepare dzi format.</li>
                                                    <li>
                                                    For local or private deployments, ensure your server environment can expose slide paths via HTTP(S) URLs.
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade show" id="tabs-text-1" role="tabpanel" aria-labelledby="tabs-text-1-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <img className="img-fluid" src={require("../../assets/img/docs/dzi.png")} alt="dzi"></img>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="description">Our whole slide viewer supports the DZI (Deep Zoom Image) format. Any large high resolution images need to be converted to
                                                the format first. Images in Deep Zoom are represented by a tiled image pyramid. This allows the rendering engine to grab only that bit of data that is
                                                necessary for a particular view of an image. </p>
                                                <p className="description">The figure shows what the image pyramid looks like conceptually. An image is stored as a tiled image pyramid. Each resolution
                                                of the pyramid is called a level. Each level is stored in a separate folder. All levels are stores in a folder with the same name as the DZI file with the
                                                extension removed and "_files" appended to it.The tiles are named as column_row.format, where row is the row number of the tile (starting from 0 at top)
                                                and column is the column number of the tile (starting from 0 at left). format is the appropriate extension for the image format used – either JPEG or PNG.</p>
                                                <p className="description"> If you have a large image you'd like to zoom, you'll need to convert it first. There are a number of conversion options
                                                we recommand:</p>
                                            </div>
                                        </div>
                                        <table className="table table-striped">
                                            <tbody>
                                                <tr>
                                                    <td>deepzoom.py</td>
                                                    <td>python</td>
                                                    <td><a href="https://github.com/openzoom/deepzoom.py" target="_blank" rel="noreferrer"><i className="fa fa-external-link"></i></a></td>
                                                </tr>
                                                <tr>
                                                    <td>VIPS</td>
                                                    <td>libvips is a demand-driven, horizontally threaded image processing library</td>
                                                    <td><a href="https://www.libvips.org/" target="_blank" rel="noreferrer"><i className="fa fa-external-link"></i></a></td>
                                                </tr>
                                                <tr>
                                                    <td>DeepZoom</td>
                                                    <td>PHP</td>
                                                    <td><a href="https://github.com/jeremytubbs/deepzoom" target="_blank" rel="noreferrer"><i className="fa fa-external-link"></i></a></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                    <div className="tab-pane fade show" id="tabs-text-2" role="tabpanel" aria-labelledby="tabs-text-2-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <img className="img-fluid" src={require("../../assets/img/docs/region.PNG")}  alt="region level" style={{ marginBottom: 1.8 + "rem" }}></img>
                                             </div>
                                            <div className="col-md-6">
                                                <p className="description">Our viewer support overlays mechanism for displaying additional information on a zoomable image. Users can prepare multiple
                                                images (dzi format) and provide us the image urls in a JSON file.</p>
                                                <p className="description">Let's use the viewer demo on the website as an example. We want to overlay "Fat", "Fibrous", "Immune", "Invasive" and "Necrosis" tissues on original whole slide.
                                                First, we need to prepare DZI image files by using one of the tools we recommand. In order to overlay, we need transparent background for overlay images. PNG file can save the alpha channel.
                                                The size of overlay images might be different from the background image. Make sure its width-to-height aspect ratio the same as the background slide to align.
                                                After conversion, we get different DZI folders for each region:</p>
                                                    <img className="img-fluid" src={require("../../assets/img/docs/tissuefolders.PNG")} alt="overlay data folder" style={{ height: 100 + "px" }}></img>

                                                    <p className="description">
                                                Second, we want to display each tissue type in a checkbox tree. We need tell scopeviewer the structure of the tree by preparing a structural JSON file.
                                                Please use "tree_layout" as a key. If your data contains hierarchicha relationships, on parent level you need to provide unique value, label
                                                and children. On children level, "value", "label", "path" to get your prepared DZI data, "format", "overlay", "tilesize", "width"
                                                and "height" are required fields.</p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <img className="img-fluid" src={require("../../assets/img/docs/treelayout.png")} alt="tree layout" style={{ height: 300 + "px" }}></img>
                                           
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="tabs-text-3" role="tabpanel" aria-labelledby="tabs-text-3-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <img className="img-fluid" src={require("../../assets/img/docs/spot.PNG")} alt="region level"></img>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="description">If you can provide spatial molecular profilling data for your image, our viewer provide smp layer
                                                to overlay spot data. </p>
                                                <p className="description">To overlay smp data, first you need to prepare 3 essential files:
                                                </p>
                                                <p className="description">
                                                        1. a csv contains a list of gene name    <Link to="human_breast_cancer_ffpe.gene_name.csv"  target="_blank" download>(example)</Link> <br/>
                                                        2. a location csv contains x and y coordinate information <Link to="human_breast_cancer_ffpe.loc.csv" target="_blank" download>(example)</Link><br/>
                                                        3. a count csv contains each genes expression information for each (x,y) spot
                                                        <Link to="human_breast_cancer_ffpe.count.csv" target="_blank" download> (example)</Link>
                                                </p>

                                                <p className="description">Second you can use the <Link to="database.py" target="_blank" download> python script</Link> we provide to convert all three files into 
                                                three tables "gene_list_sql", "smp_loc_sql" and "smp_count_sql" in a SQlite database file. Please use the same database structure and table/column names
                                                </p>

                                                <p className="description">Last step is to provide your db file path with "smp_layer" key in a json file</p>
                                                <pre>{JSON.stringify({ smp_layer }, null, 2)}</pre>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="tabs-text-4" role="tabpanel" aria-labelledby="tabs-text-4-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <img className="img-fluid" src={require("../../assets/img/docs/cell.PNG")} alt="region level"></img>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="description">There are two ways you can view cell level information
                                                in the viewer. The first is that you can save those cell level mask on the original wholeslides. Then follow our instruction to convert 
                                                wholeslides into DZI format. If you provide original and mask wholeslides in the JSON file, they will be displayed in left and right viewers respectively.
                                                Else, both viewers will display original wholeslides.</p>
                                                <p className="description">Another way is using "tree_layout" to overlay a cell level masks with transparent background on it's original wholeslide.
                                                First step is to save original wholeslide and cell level mask seperately and convert them into two DZI folders. Then put below contents in your
                                                JSON file:
                                                </p>
                                                <pre>&#123;<br/> 
                                                &nbsp;&nbsp; required keys for original whole slide...<br/> 
                                                &nbsp;&nbsp; // put cell level mask information in tree layout<br/> 
                                                &nbsp;&nbsp; "tree_layout":&#91;<br/>
                                                &nbsp;&nbsp; &nbsp;&nbsp; "value": "cell mask", <br/>
                                                &nbsp;&nbsp; &nbsp;&nbsp; "label": "Cell Level Mask",<br/>
                                                &nbsp;&nbsp; &nbsp;&nbsp; "path": "http://hostname/cellmask_dzi",<br/>
                                                &nbsp;&nbsp; &nbsp;&nbsp; "format": "png",<br/>
                                                &nbsp;&nbsp; &nbsp;&nbsp; "overlap": 1,<br/>
                                                &nbsp;&nbsp; &nbsp;&nbsp; "tilesize": 254,<br/>
                                                &nbsp;&nbsp; &nbsp;&nbsp; "width": 31872, <br/>
                                                &nbsp;&nbsp; &nbsp;&nbsp; "height": 13347<br/>
                                                &#93; &#125;</pre>
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

export default DataPre;