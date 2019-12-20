const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        mongoose        = require("mongoose"),
        expSanitizer    = require("express-sanitizer")

const   Walk            = require("./models/walk")
    
require("dotenv").config()
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(expSanitizer())

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
//WORKING
app.post("/walks",async(req,res)=>{
    req.body.walk.description = req.sanitize(req.body.walk.description)
    if(req.body.walk.visible === "true"){req.body.walk.visible = true}
    else{req.body.walk.visible = false}
    walk = await Walk.create(req.body.walk)
    // console.log(walk)
    res.redirect(`/walks/${walk._id}`)
})

//walks show
app.get("/walks/:_id", async(req,res)=>{
    try {
        walk = await Walk.findById(req.params._id)
        res.render("walks/show", {walk,})
    } catch (err) {
        console.log(err || !walk)
        res.redirect("/walks")
    }
})

//walks bookingcode view
app.get("/walks/:_id/book",async (req,res)=>{
    walk = await Walk.findById(req.params._id)
    res.render("walks/book",{walk,})
})


app.get("/faq",(req,res)=>{
    res.render("faq")
})
app.get("/contact",(req,res)=>{
    res.render("contact")
})

const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`PWC server started in: ${port}`))