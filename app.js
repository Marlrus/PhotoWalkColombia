const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        mongoose        = require("mongoose")
    
require("dotenv").config()
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() =>{
    console.log(`Mongoose Connected to: ${mongoose.connection.name}`)
}).catch(err =>{
    console.log(`ERROR: ${err.message}`)
})

app.get("/",(req,res)=>{
    res.render("landing")
})

app.get("/about",(req,res)=>{
    res.render("about")
})

//walks routes CRUD
//Index
app.get("/walks",(req,res)=>{
    res.render("walks/index")
})

//walks new
app.get("/walks/new",(req,res)=>{
    res.render("walks/new")
})

//walks create POST
app.post("/walks",(req,res)=>{
    let walk = req.body.walk
    console.log(walk)
    res.redirect("/walks")
})


//walks show


app.get("/faq",(req,res)=>{
    res.render("faq")
})
app.get("/contact",(req,res)=>{
    res.render("contact")
})

const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`PWC server started in: ${port}`))