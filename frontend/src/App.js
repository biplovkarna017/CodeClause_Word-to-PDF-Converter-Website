import React, { useState } from "react";
import {
  Navbar,
  Label,
  FileInput,
  Button,
  Spinner,
  Card,
} from "flowbite-react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, showLoading] = useState(false);
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async (e) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      try {
        showLoading(true);
        const res = await axios.post("http://localhost:8080/upload", formData);
        console.log(res);
        setIsUploaded(true);
      } catch (ex) {
        console.log(ex);
      }
    }
  };

  const downloadFile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/download/${fileName}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const newFile = fileName.replace(/\.\w+$/, ".pdf");
      link.setAttribute("download", newFile);
      document.body.appendChild(link);
      link.click();
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <div className="App">
      <Navbar fluid={true} className="nav">
        <Navbar.Brand>
          <span className="self-center whitespace-nowrap p-8 text-2xl font-semibold text-white">
            Word to PDF Converter
          </span>
        </Navbar.Brand>
      </Navbar>
      <Card id="fileUpload" className="p-8 m-2">
        <div className="mb-2 block">
          <Label htmlFor="file" value="Upload file" />
        </div>
        <FileInput id="file" onChange={saveFile} />
        <br />
        <div className="flex">
          <button
            type="button"
            onClick={uploadFile}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Upload
          </button>

          {isUploaded ? (
            <button
              type="button"
              onClick={downloadFile}
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Download
            </button>
          ) : (
            loading && (
              <Button color="gray">
                <Spinner aria-label="Alternate spinner button example" />
                <span className="pl-3">Converting...</span>
              </Button>
            )
          )}
        </div>
      </Card>
      <footer>
        <p>
          © Biplov Karna
          <br />
          <a href="karnabipu@gmail.com">karnabipu@gmail.com</a>
        </p>
      </footer>
    </div>
  );
}
