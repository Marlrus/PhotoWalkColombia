const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        mongoose        = require("mongoose"),
        expSanitizer    = require("express-sanitizer"),
        flash           = require("connect-flash")

const   Walk            = require("./models/walk"),
        Booking         = require('./models/booking'),
        MeetingPoint    = require('./models/meetingPoint')
        
app.use(bodyParser.urlencoded({extended:true}))    

require("dotenv").config()
app.set("view engine","ejs")
app.use(express.static(`${__dirname}/public`))
app.use(methodOverride("_method"))
app.use(expSanitizer())
app.use(flash())

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
    const walkName = await Booking.find({'visible' : true},{name: 1})
    res.locals.walkName = walkName
    // res.locals.error = req.flash('error')
    // res.locals.error = req.flash('success')
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
        let date = new Date()
        let endDate = new Date().setMonth(date.getMonth()+1)
        // console.log(date)
        // console.log(new Date(endDate))
        bookings = await Booking.find({
            date: {
                $gte: date,
                $lte: endDate
            }
        }).sort({date: 'asc'}).populate('walk')
        // console.log(bookings)
        //_id is good
    } catch (err) {
        console.log(err)
        res.send('Error')
    }
    // res.send('Index Render')
    res.render("walks/index", {bookings,})
})

//walks new
app.get("/walks/new",(req,res)=>{
    res.render("walks/new")
})

//walks create POST
//WORKING MUST CLEAN WITH MODEL MIDDLEWARE
app.post("/walks",async(req,res)=>{
    //ONLY 1 WALK PER NAME! 
    // if(Walk.find({name:req.body.walk.name})){
    //     // req.flash('error', `Error: A walk for ${req.body.walk.name} already exists.`)
    //     res.redirect('back')
    // }
    console.log(req.body.booking.pickup)
    if(req.body.booking.pickup==='true'){
        req.body.booking.pickup = true
    }else{
        req.body.booking.pickup = false
    }
    req.body.walk.currentVersion = true
    req.body.walk.description = req.sanitize(req.body.walk.description)
    isoDate = `${req.body.booking.date}T${req.body.booking.startTime}:00`
    req.body.booking.date = new Date(isoDate)
    let [walk,booking,meetingPoint] = await Promise.all([
        Walk.create(req.body.walk),
        Booking.create(req.body.booking),
        MeetingPoint.create(req.body.meetingPoint)
    ]) 
    // walk.currentVersion = true
    // walk.save()
    meetingPoint.save()
    //added name to model change header to refer to bookings instead of walk themselves
    booking.walk.push(walk._id)
    booking.meetingPoint.push(meetingPoint._id)
    booking.save()
    console.log(booking)
    // res.send('Walk Show')
    res.redirect(`/walks/${booking._id}`)
})

//walks show
app.get("/walks/:_id", async(req,res)=>{
    try {
        booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
        res.render("walks/show", {booking,})
    } catch (err) {
        console.log(err || !booking)
        res.redirect("/walks")
    }
})

//=======================
//Booking VIths
//=======================

//walks bookingcode view
app.get("/walks/:_id/book",async (req,res)=>{
    booking = await Booking.findById(req.params._id).populate('walk').populate('meetingPoint')
    res.render("walks/book",{booking,})
})

//book post
app.post("/walks/:_id",(req,res)=>{
    console.log(req.body.user)
    res.redirect("/walks")
})



const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`PWC server started in: ${port}`))