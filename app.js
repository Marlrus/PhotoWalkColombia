const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        mongoose        = require("mongoose"),
        expSanitizer    = require("express-sanitizer"),
        flash           = require("connect-flash")


//ROUTE REQUIRING
const   indexRoutes     = require('./routes/index'),
        walkRoutes      = require('./routes/walks'),
        bookRoutes      = require('./routes/book'),
        adminRoutes     = require('./routes/admin')
                


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
    let date = new Date()
    let endDate = new Date().setMonth(date.getMonth()+1)
    const bookingDropdown = await Booking.find({
        date: {
            $gte: date,
            $lte: endDate
        }
    }).sort({date: 'asc'}).populate('walk')
    // Being Called Twice
    // console.log(bookingDropdown)
    res.locals.bookingDropdown = bookingDropdown
    // res.locals.error = req.flash('error')
    // res.locals.error = req.flash('success')
    next()
})


app.use("/", indexRoutes)
app.use("/walks", walkRoutes)
app.use("/walks/:_id/book", bookRoutes)
app.use("/admin", adminRoutes)

const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`PWC server started in: ${port}`))