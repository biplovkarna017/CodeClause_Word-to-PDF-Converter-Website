const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const Util = require("util");
const ReadFile = Util.promisify(fs.readFile);
const mammoth = require("mammoth");
async function html(){
    try{
        const htmlPath = path.join(__dirname,"../output.html");
        const content = await ReadFile(htmlPath,"utf8");
        return content;
    }catch(error){
        console.log("Cannot read file");
    }
}

async function generatePDF(req, res){
    html().then(async(data)=>{
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
        })
        const convertpage = await browser.newPage();
        await convertpage.setContent(data);
        const pdfbuffer = await convertpage.pdf({
            format:'A4',
            printBackground: true
        })
        res.set('Content-Type','application/pdf');
        res.status(201).send(Buffer.from(pdfbuffer,'binary'));
    })
}

module.exports.generatePDF = generatePDF;