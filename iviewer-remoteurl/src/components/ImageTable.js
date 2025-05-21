import $ from 'jquery';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEye } from "react-icons/ai";
import Banner from '../views/Banner';
import multiImGJSON from "../assets/json/multipleimgs.json";

class ImageTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            this.setState({ data: this.props.location.state.jsonfile })
        } else {
            this.setState({ data: multiImGJSON })
        }
    }
    componentDidUpdate() {
        $('#img_table').DataTable();
    }

    render() {
        return (
            <>
                <Banner message="Select a image from your image list to display">
                    <h4 className="text-white"><i className="fa fa-table"></i> &nbsp;&nbsp;Pathology Image Table</h4>
                </Banner>
                <div className="image-table" style={{ margin: "3rem", textAlign: "center" }}>
                    <h4>Pathology Image</h4>
                    <table id="img_table" className="display">
                        <thead>
                            <tr>
                                <th>Image Name</th>
                                <th>Pathology/Histology</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((result) => {
                                return (
                                    <tr key={result.image_id}>
                                        <td>{result.image_name}</td>
                                        {(typeof result.pathology_histology !== 'undefined') && <td>{result.pathology_histology}</td>}
                                        {(typeof result.pathology_histology === 'undefined') && <td></td>}
                                        {/* <td><Link to={{pathname: "/imageviewer", state: this.state.data[index]}}><AiFillEye/></Link></td> */}
                                        <td><Link to={{ pathname: "/imageviewer", state: { selectedimg: result } }}><AiFillEye /></Link></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

export default ImageTable;