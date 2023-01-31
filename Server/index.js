const express = require("express");
const corsHeaders = require("./middleware/cors");
const fileupload = require("express-fileupload");
const { spawn } = require("child_process");
const path = require("path");
const app = express();
app.options("*", corsHeaders);
app.use(corsHeaders);
app.use(fileupload());

const convertToPdf = (newpath) => {
  return new Promise((resolve, reject) => {
    const process = spawn("soffice", [
      "--headless",
      "--convert-to",
      "pdf",
      newpath,
      "--outdir",
      "public",
    ]);
    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`soffice exited with code ${code}`);
      }
    });
  });
};

app.post("/upload", async (req, res) => {
  const file = req.files.file;
  const filename = file.name;
  const newpath = path.join(__dirname, "public", filename);

  await file.mv(newpath, async (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    convertToPdf(newpath)
      .then(() => {
        res.status(200).send({ message: "File Uploaded", code: 200 });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ message: "File Upload Failed", code: 500 });
      });
  });
});

app.use(express.static("public"));

app.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const newFile = path.parse(fileName).name + ".pdf";
  const filePath = path.join(__dirname, "public", newFile);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file: ", err);
      res.status(500).send("Error downloading file");
    }
  });
});

app.listen(8080, () => console.log("server is running"));
module.export = app;
