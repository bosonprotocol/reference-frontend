import React, { useState, useRef } from "react";
import "./WalletConnect.scss";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const inputFile = useRef(null);

  const handleFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;

      let parts = filename.split(".");
      const fileType = parts[parts.length - 1];
      console.log("fileType", fileType); //ex: zip, rar, jpg, svg etc.

      if (fileType === "csv") {
        console.log("success");
        console.log(files);
        setFile(files[0]);
      }
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <div>
      <input
        style={{ display: "none" }}
        accept=".csv"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      <div style={{ marginTop: "10%", width: "50%" }} onClick={onButtonClick}>
        Upload
      </div>
    </div>
  );
};

export default FileUpload;
