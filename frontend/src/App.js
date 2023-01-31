import React, {useState} from 'react'
import axios from 'axios';
import MyNavbar from './MyNavbar';

export default function App() {
 
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    try {
      const res = await axios.post(
        "http://localhost:8080/upload",
        formData
      );
      console.log(res);
      setIsUploaded(true);
    } catch (ex) {
      console.log(ex);
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
      const newFile = fileName.replace(/\.\w+$/, '.pdf');
      link.setAttribute("download", newFile);
      document.body.appendChild(link);
      link.click();
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className="App">
      <MyNavbar />
      <div className="p-8">
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="file_input"
          type="file"
          onChange={saveFile}
        >
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          onChange={saveFile}
        />
        <br></br>

        <button
          type="button"
          onClick={uploadFile}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Upload
        </button>

        {isUploaded && (
          <button
            type="button"
            onClick={downloadFile}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Download
          </button>
        )}
      </div>
    </div>
  );
}
