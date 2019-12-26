const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        mongoose        = require("mongoose"),
        expSanitizer    = require("express-sanitizer")

const   Walk            = require("./models/walk"),
        Booking         = require('./models/booking'),
        MeetingPoint    = require('./models/meetingPoint')
        
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
    try {
        booking = await Booking.find({}).populate('walk');
        console.log(booking)
        //_id is good
        console.log(`This booking is for ${booking[0].walk[0].name}`)
    } catch (err) {
        console.log(err)
        res.send('Error')
    }
    res.send('Index Render')
    // res.render("walks/index", {booking,})
})

//walks new
app.get("/walks/new",(req,res)=>{
    res.render("walks/new")
})

//walks create POST
//WORKING MUST CLEAN WITH MODEL MIDDLEWARE
app.post("/walks",async(req,res)=>{
    req.body.walk.description = req.sanitize(req.body.walk.description)
    //Boolean removed
    // if(req.body.walk.visible === "true"){
    //     req.body.walk.visible = true
    // }
    // else{
    //     req.body.walk.visible = false
    // }
    //See if T00... can be taken from the time input
    isoDate = `${req.body.booking.date}T${req.body.booking.startTime}:00`
    req.body.booking.date = new Date(isoDate)
    let [walk,booking,meetingPoint] = await Promise.all([
        Walk.create(req.body.walk),
        Booking.create(req.body.booking),
        MeetingPoint.create(req.body.meetingPoint)
    ]) 
    walk.save()
    meetingPoint.save()
    //added name to model change header to refer to bookings instead of walk themselves
    booking.walk.push(walk)
    booking.meetingPoint.push(meetingPoint)
    booking.save()
    console.log(`WALK DATA: ${walk}`)
    console.log(`MEETINGPOINT DATA: ${meetingPoint}`)
    console.log(`BOOKING DATA: ${booking}`)
    console.log(booking)
    res.send('Walk Show')
    // res.redirect(`/walks/${walk._id}`)
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