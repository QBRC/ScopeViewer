import { Component } from 'react';
import * as Annotorious from '@recogito/annotorious-openseadragon';
import * as SelectorPack from '@recogito/annotorious-selector-pack';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import '../assets/css/annotoolkit.css';
import ViewerButtons from './ViewerButtons';

class Annotations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status:0,
            leftAnno: null,
            rightAnno:null
          }

    }

    componentDidMount() {
        if(this.props.viewers.status===1){
            const leftAnno = Annotorious(this.props.viewers.leftViewer, {
                locale: 'auto',
                allowEmpty: true
            });

            const rightAnno = Annotorious(this.props.viewers.rightViewer, {
                locale: 'auto',
                allowEmpty: true
            });

            SelectorPack(leftAnno);
            SelectorPack(rightAnno);
            const btnsTip = document.querySelectorAll(".a9s-toolbar-btn");
            let activeBtn = null, annoid = null;
            btnsTip.forEach((btnTip) => {
                btnTip.addEventListener("click", (e) => {
                    e.currentTarget.classList.add("active");
                    leftAnno.setDrawingEnabled(true);
                    rightAnno.setDrawingEnabled(true);
                    if ((activeBtn !== null && activeBtn !== e.currentTarget)) {
                        activeBtn.classList.remove("active");
                    }
                    activeBtn = e.currentTarget;
                    annoid = activeBtn.id;
                    switch (annoid) {
                        case 'rect-anno':
                            leftAnno.setDrawingTool('rect');
                            rightAnno.setDrawingTool('rect');
                            break;
                        case 'polygon-anno':
                            leftAnno.setDrawingTool('polygon');
                            rightAnno.setDrawingTool('polygon');
                            break;
                        case 'circle-anno':
                            leftAnno.setDrawingTool('circle');
                            rightAnno.setDrawingTool('circle');
                            break;
                        case 'ellipse-anno':
                            leftAnno.setDrawingTool('ellipse');
                            rightAnno.setDrawingTool('ellipse');
                            break;
                        case 'freehand-anno':
                            leftAnno.setDrawingTool('freehand');
                            rightAnno.setDrawingTool('freehand');
                            break;
                        case 'change-mode':
                            leftAnno.setDrawingEnabled(false);
                            rightAnno.setDrawingEnabled(false);
                            break;
                        // code block
                    }
    
                });
            });

            //reset state
            this.setState({
                status:1,
                leftAnno: leftAnno,
                rightAnno:rightAnno
              })
        }
    }

    render() {
        return (
            <div className="row">
                <div id="toolbar" className="col-sm-4">
                    <div className="a9s-toolbar">
                        <button id="rect-anno" className="a9s-toolbar-btn rect"><span className="a9s-toolbar-btn-inner"><svg
                            viewBox="0 0 70 50">
                            <g>
                                <rect x="12" y="10" width="46" height="30"></rect>
                                <circle cx="12" cy="10" r="5"></circle> 
                                <circle cx="58" cy="10" r="5"></circle>
                                <circle cx="12" cy="40" r="5"></circle>
                                <circle cx="58" cy="40" r="5"></circle>
                            </g>
                        </svg></span></button>
                        <button id="polygon-anno" className="a9s-toolbar-btn polygon"><span className="a9s-toolbar-btn-inner"><svg
                            viewBox="0 0 70 50">
                            <g>
                                <path d="M 5,14 60,5 55,45 18,38 Z"></path>
                                <circle cx="5" cy="14" r="5"></circle>
                                <circle cx="60" cy="5" r="5"></circle>
                                <circle cx="55" cy="45" r="5"></circle>
                                <circle cx="18" cy="38" r="5"></circle>
                            </g>
                        </svg></span></button>
                        <button id="circle-anno" className="a9s-toolbar-btn circle"><span className="a9s-toolbar-btn-inner"><svg
                            viewBox="0 0 70 50">
                            <g>
                                <path d="M 6, 25
      a 30,30 0 1,1 60,0
      a 30,30 0 1,1 -60,0"></path>
                            </g>
                        </svg></span></button>
                        <button id="ellipse-anno" className="a9s-toolbar-btn ellipse"><span className="a9s-toolbar-btn-inner"><svg
                            viewBox="0 0 70 50">
                            <g>
                                <path d="M 35, 3
      a 30,20 0 1,0 1,0"></path>
                            </g>
                        </svg></span></button>
                        <button id="freehand-anno" className="a9s-toolbar-btn freehand"><span className="a9s-toolbar-btn-inner"><svg
                            viewBox="0 0 70 50">
                            <g>
                                <path d="M 3 24 C 12 3, 20 3, 30 24 S 45 45, 59 24"></path>
                            </g>
                        </svg></span></button>
                        <button id="change-mode" className="a9s-toolbar-btn changemode"><span className="a9s-toolbar-btn-inner" style={{paddingLeft:"3px",fontSize: "23px"}}>
                            <i className="fa fa-arrows-alt" aria-hidden="true"></i>
                        </span></button>
                    </div>
                </div>
                <ViewerButtons key={this.state.status} annos={this.state} imginfo={this.props.viewers.jsoninfo}/>
            </div>
        )
    }
}
export default Annotations;