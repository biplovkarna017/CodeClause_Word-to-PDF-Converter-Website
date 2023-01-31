const router = require("express").Router();
const pdfCtrl = require("../controllers/pdf");

router.get("/", async( req, res) => {
res.json({message: 'Hello!'});
})

router.get("/getpdf", async(req, res)=>{
    try{
        pdfCtrl.generatePDF(req,res);
    }catch(error){
        console.log(error);
    }
})
module.exports = router;