const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override")
    
require("dotenv").config()
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render("landing")
})

const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`PWC server started in: ${port}`))