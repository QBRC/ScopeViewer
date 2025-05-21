import { Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';

function UploadJson() {
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(null);
  const jsonSchema = {
    $id: "https://example.com/main",
    type: "array",
    minItems: 1,
    items: {
      type: "object",
      additionalProperties: false,
      properties: {
        image_name: {
          type: "string"
        },
        pathology_histology: {
          type: "string"
        },
        tile_folder_url: {
          type: "string"
        },
        mask_url: {
          type: "string"
        },
        smp_layer: {
          type: "string",
        },
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
          items: { $ref: "tree", }
        }
      },
      required: [
        "image_name",
        "tile_folder_url"
      ]
    }
  }
  const jsonDef = {
    $id: "https://example.com/tree",
    type: 'object',
    additionalProperties: false,
    properties: {
      value: {
        type: "string"
      },
      label: {
        type: "string"
      },
      path: {
        type: 'string'
      },
      children: {
        type: "array",
        minItems: 1,
        items: { $ref: "#" }

      }
    },
    oneOf: [
      {
        required: [
          "value", "label", "path"
        ]
      },
      {
        required: [
          "children"
        ]

      }

    ],
    required: ["value", "label"]
  }

  const handleChange = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      setFiles(JSON.parse(e.target.result));
    }
  }

  //run after every rerender if data has changed since last render
  useEffect(() => {
    let Ajv = require('ajv');
    const ajv = new Ajv();
    const validate = ajv.addSchema(jsonDef).compile(jsonSchema)
    const valid = validate(files)

    //validate value in tree structure is unique
    if (files.length > 1 & valid) {
      setRedirect("imagetable");
    } else if (files.length === 1 & valid) {
      setRedirect("imageviewer");
    } else if ((files.length >= 1 || (!Array.isArray(files) & !!(files))) & !valid) {
      setRedirect("validateJson");
    }
    else {
      setRedirect("");
    }

  }, [files])

  if (redirect === "imagetable") {
    return (
      <Redirect to={{ pathname: `/imagetable`, state: { jsonfile: files } }} />
    );
  } else if (redirect === "imageviewer") {
    return (
      <Redirect to={{ pathname: "/imageviewer", state: { selectedimg: files[0] } }} />
    );
  } else if (redirect === "validateJson") {
    return (
      <Redirect to={{ pathname: "/validateJson", state: { selectedimg: files } }} />
    )
  }
  else {
    return (<input type="file" accept="application/JSON" onChange={handleChange} />);
  }
}
export default UploadJson;
