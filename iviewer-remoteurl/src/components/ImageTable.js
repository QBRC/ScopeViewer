import $ from 'jquery';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEye } from "react-icons/ai";
import Banner from '../views/Banner';
import multiImGJSON from "../assets/json/multipleimgs.json";
import liverImGJSON from "../assets/json/liverimgs.json";

class ImageTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        const data = this.getDataFromProps();
        this.setState({ data }, () => this.initDataTable());
    }
    componentDidUpdate(prevProps) {
        // If the incoming location.pathname, location.state.jsonfile or route example param changed, reload data
        const prevPath = prevProps.location && prevProps.location.pathname;
        const currPath = this.props.location && this.props.location.pathname;

        const prevJson = prevProps.location && prevProps.location.state && prevProps.location.state.jsonfile;
        const currJson = this.props.location && this.props.location.state && this.props.location.state.jsonfile;
        const prevJsonStr = prevJson ? JSON.stringify(prevJson) : null;
        const currJsonStr = currJson ? JSON.stringify(currJson) : null;

        const prevExample = prevProps.match && prevProps.match.params && prevProps.match.params.example;
        const currExample = this.props.match && this.props.match.params && this.props.match.params.example;

        if (prevPath !== currPath || prevJsonStr !== currJsonStr || prevExample !== currExample) {
            const data = this.getDataFromProps();
            // Rebuild table: destroy existing DataTable, update state (re-render tbody), then init DataTable
            this.destroyDataTable();
            this.setState({ data }, () => this.initDataTable());
        }
    }

    componentWillUnmount() {
        this.destroyDataTable();
    }

    getDataFromProps() {
        // Priority: location.state.jsonfile (Link/Redirect), then URL param 'example', then default multiImGJSON
        if (this.props.location && this.props.location.state && this.props.location.state.jsonfile) {
            return this.props.location.state.jsonfile;
        }
        const exampleParam = this.props.match && this.props.match.params && this.props.match.params.example;
        if (exampleParam && exampleParam.toLowerCase() === 'liver') {
            return liverImGJSON;
        }
        return multiImGJSON;
    }

    initDataTable() {
        // Ensure any existing instance is removed before creating a new one
        if ($.fn.DataTable && $.fn.DataTable.isDataTable && $.fn.DataTable.isDataTable('#img_table')) {
            try { $('#img_table').DataTable().destroy(); } catch (e) { /* ignore */ }
        }
        // Small timeout to ensure DOM updated by React
        setTimeout(() => {
            try { $('#img_table').DataTable(); } catch (e) { /* ignore */ }
        }, 0);
    }

    destroyDataTable() {
        if ($.fn.DataTable && $.fn.DataTable.isDataTable && $.fn.DataTable.isDataTable('#img_table')) {
            try { $('#img_table').DataTable().destroy(); } catch (e) { /* ignore */ }
        }
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