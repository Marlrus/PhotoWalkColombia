const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        mongoose        = require("mongoose"),
        expSanitizer    = require("express-sanitizer")

const   Walk            = require("./models/walk")
        
app.use(bodyParser.urlencoded({extended:true}))    

require("dotenv").config()
app.set("view engine","ejs")
app.use(express.static(`${__dirname}/public`))
app.use(methodOverride("_method"))
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
//Get Walk names

//Locals
app.use(async (req,res,next)=>{
    //finds visible walks and only gets name ;D
    const walkName = await Walk.find({'visible' : true},{name: 1})
    res.locals.walkName = walkName
    next()
})

//===================================
//Index Routes
//===================================

app.get("/",(req,res)=>{
    res.render("landing")
})

app.get("/about",(req,res)=>{
    res.render("about")
})


app.get("/faq",(req,res)=>{
    res.render("faq")
})
app.get("/contact",(req,res)=>{
    res.render("contact")
})

//============================
//walks routes CRUD
//============================

//Index
app.get("/walks",async(req,res)=>{
    walks= await Walk.find({'visible': true})
    res.render("walks/index", {walks,})
})

//walks new
app.get("/walks/new",(req,res)=>{
    res.render("walks/new")
})

//walks create POST
//WORKING MUST CLEAN WITH MODEL MIDDLEWARE
app.post("/walks",async(req,res)=>{
    req.body.walk.description = req.sanitize(req.body.walk.description)
    if(req.body.walk.visible === "true"){
        req.body.walk.visible = true
    }
    else{
        req.body.walk.visible = false
    }
    //See if T00... can be taken from the time input
    isoDate = `${req.body.walk.nextDate}T00:00:00`
    req.body.walk.nextDate = new Date(isoDate)
    walk = await Walk.create(req.body.walk)
    walk.meetingPoint.name = req.body.meetingPoint.name
    walk.meetingPoint.description = req.body.meetingPoint.description
    walk.save()
    console.log(walk)
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

//=======================
//Booking VIths
//=======================

//walks bookingcode view
app.get("/walks/:_id/book",async (req,res)=>{
    walk = await Walk.findById(req.params._id)
    res.render("walks/book",{walk,})
})

//book post
app.post("/walks/:_id",(req,res)=>{
    console.log(req.body.user)
    res.redirect("/walks")
})



const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`PWC server started in: ${port}`))