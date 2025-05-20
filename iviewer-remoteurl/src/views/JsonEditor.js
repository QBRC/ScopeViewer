import React, { useState, useEffect, useRef } from 'react';
import Editor, { loader } from "@monaco-editor/react";
import { Link } from 'react-router-dom';

import singleImg from "../assets/json/oneimg.json";
import multiImg from "../assets/json/multipleimgs.json";

loader.init().then((monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
            {
                fileMatch: ["*"],
                schema: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                            image_id: { type: "integer" },
                            image_name: { type: "string" },
                            pathology_histology: { type: "string" },
                            tile_folder_url: { type: "string" },
                            mask_url: { type: "string" },
                            smp_layer: { type: "string" },
                            legend: {
                                type: "object",
                                additionalProperties: {
                                    type: "string",
                                    pattern: "^#([0-9A-Fa-f]{3}){1,2}$|^rgb\\((\\d{1,3}), (\\d{1,3}), (\\d{1,3})\\)$|^rgba\\((\\d{1,3}), (\\d{1,3}), (\\d{1,3}), ([01]|0?\\.\\d+)\\)$"
                                }
                            },
                            tree_layout: {
                                type: "array",
                                minItems: 1,
                                items: { $ref: 'http://myserver/c1.json' }
                            }
                        },
                        required: ["image_name", "tile_folder_url"]
                    }
                }
            },
            {
                uri: 'http://myserver/c1.json',
                schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        value: { type: 'string' },
                        label: { type: 'string' },
                        path: { type: 'string' },
                        children: {
                            type: "array",
                            minItems: 1,
                            items: { $ref: 'http://myserver/c1.json' }
                        }
                    },
                    oneOf: [
                        { required: ["value", "label", "path"] },
                        { required: ["children"] }
                    ],
                    required: ["value", "label"]
                }
            }
        ]
    });
});

function JsonEditor(props) {
    const hiddenFileInput = useRef(null);

    const [examplejson, setExamplejson] = useState([]);
    
    //Track validation state
    const [alertType, setAlertType] = useState("success");
    const [errMessage, setErrMessage] = useState([]);

    //LOCAL mode: true if successfully loaded slides.json
    const [isLocal, setIsLocal] = useState(false);
    const [localSlides, setLocalSlides] = useState([]);

    useEffect(() => {
      async function loadSlides() {
        try {
          const slidesUrl = `${process.env.PUBLIC_URL || ''}/slides.json`;
          const response = await fetch(slidesUrl, { cache: 'no-store' });
          if (!response.ok) throw new Error('no slides.json');

          // Read the raw text once
          const text = await response.text();
          const payload = JSON.parse(text);
  
          // accept if it’s an array of objects
          if (!Array.isArray(payload)) {
            throw new Error('slides.json is not an array');
          }
          setLocalSlides(payload);
          setExamplejson(payload);
          setIsLocal(true);
        } catch (err) {
          console.log('slides.json missing/invalid, falling back to demo', err);
          // fallback to whatever props.model or singleImg
          if (props.model && props.model.length) {
            setExamplejson(props.model);
          } else {
            setExamplejson(singleImg);
          }
          setIsLocal(false);
        }
      }
      loadSlides();
    }, [props.model]);
  
    function handleloadLocal() {
        setExamplejson(localSlides)
        setErrMessage([]);
    }

    function handleSingle() {
        setExamplejson(singleImg);
        setErrMessage([]);
    }

    function handleMultiple() {
        setExamplejson(multiImg);
        setErrMessage([]);
    }

    function handleUploadClick() {
        hiddenFileInput.current.click();
    }

    function handleUpload(e) {
        setErrMessage([]);
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            setExamplejson(JSON.parse(e.target.result));
        }
    }

    function handleEditorOnChange(v, e) {
        try {
            setExamplejson(JSON.parse(v));
        } catch (error) {
            console.error('Invalid JSON syntax');
        }
    }

    function handleEditorValidation(markers) {
        if (markers.length > 0) {
            setAlertType('error');
            setErrMessage(markers.map(marker => marker.message));
        } else {
            setErrMessage([]);
            setAlertType('success');
        }
    }

    return (
        <>
            <div className="validationErr">
                {alertType === 'success' && (
                    <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                        <strong><i className="fa fa-check-circle"></i> Correct Format </strong>
                        <br />
                        {examplejson.length > 1 && (
                            <Link to={{ pathname: "/imagetable", state: { jsonfile: examplejson } }} className="btn btn-primary">
                                Visualize Data
                            </Link>
                        )}
                        {examplejson.length === 1 && (
                            <Link to={{ pathname: "/imageviewer", state: { selectedimg: examplejson[0] } }} className="btn btn-primary">
                                Visualize Data
                            </Link>
                        )}
                    </div>
                )}
                {alertType === 'error' && (
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> You should check the fields below:
                        <ul>
                            {errMessage.map((mes, index) => <li key={index}>{mes}</li>)}
                        </ul>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="row" style={{ marginBottom: "0.25rem" }}>
                {/* If we have local slides.json, offer a one-click reload */}
                {isLocal && (
                    <button className="btn btn-outline-primary mr-2" onClick={handleloadLocal}>
                    Load Local Slides
                    </button>
                )}
                {/* Always offer the built-in examples */}
                <button className="btn btn-outline-primary mr-2" onClick={handleSingle}>
                    Load Single Image Example
                </button>
                <button className="btn btn-outline-primary mr-2" onClick={handleMultiple}>
                    Load Multiple Image Example
                </button>
                {/* And allow uploading any JSON */}
                <button className="btn btn-outline-primary" onClick={handleUploadClick}>
                    Upload Json
                </button>
                <input
                    type="file"
                    accept="application/json"
                    ref={hiddenFileInput}
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                />
            </div>

            <div className="row">
                <Editor
                    value={JSON.stringify(examplejson, null, 1)}
                    language="json"
                    height="80vh"
                    theme="vs-dark"
                    onValidate={handleEditorValidation}
                    onChange={handleEditorOnChange}
                />
            </div>
        </>
    );
}

export default JsonEditor;
