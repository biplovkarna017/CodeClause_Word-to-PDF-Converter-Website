const cors = require("cors");
const whiteList = new Set(["http://localhost:3000"])
const corsOptions = {
    optionsSuccessStatus: 200,
    origin: function(origin, callback){
        if(whiteList.has(origin)){
            callback(null,true)
        }else{
            callback(new Error("Blocked by CORS"))
        }
    },
    credentials: true
}
module.exports = cors(corsOptions);