const   express     = require('express'),
        router      = express.Router()

//===================================
//Index Routes
//===================================

router.get("/",(req,res)=>{
    res.render("landing")
})

router.get("/about",(req,res)=>{
    res.render("about")
})


router.get("/faq",(req,res)=>{
    res.render("faq")
})
router.get("/contact",(req,res)=>{
    res.render("contact")
})

module.exports = router