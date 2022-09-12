const express = require("express")
const hbs = require("hbs")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const path = require("path")
const dotenv = require("dotenv")
const app = express()
dotenv.config()


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.MAILSENDER,
        pass: process.env.PASSWORD
    }
})

app.use(express.static("./views"))  //used to use css,images etc i.e public files
// app.set("views","./views")       //used to set views folder path
app.set("view engine", "hbs")        //used to set template engine
hbs.registerPartials(path.join(__dirname, "./views/partials")) //used to register partials

const encoder = bodyParser.urlencoded()

app.get("/", (req, res) => {
    // console.log(process.env.MAILSENDER, typeof (process.env.MAILSENDER));
    res.render("index")
})
app.get("/about", (req, res) => {
    res.render("about")
})
app.get("/service", (req, res) => {
    res.render("service")
})
app.get("/gallary", (req, res) => {
    res.render("gallary")
})
app.get("/contact", (req, res) => {
    res.render("contact", { show: false })
})
app.post("/contact", encoder, (req, res) => {

    let mailOption = {
        from: process.env.MAILSENDER,
        to: req.body.email,
        subject: "your query received | team furniture hub !!!",
        text: "thanks to contact with us !!! \n our team will get touch with you soon\n"
    }
    transporter.sendMail(mailOption, (error, data) => {
        if (error)
            console.log(error);
    })


    mailOption = {
        from: process.env.MAILSENDER,
        to: process.env.MAILSENDER,
        subject: "one query received !!!",
        text: `
                one new query received
                name    :  ${req.body.name}
                email   :  ${req.body.email}
                phone   :  ${req.body.phone}
                subject :  ${req.body.subject}
                message :  ${req.body.message}

             `
    }
    transporter.sendMail(mailOption, (error, data) => {
        if (error)
            console.log(error);
    })

    res.render("contact", { show: true })
})

var PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server is Running at Port ${PORT}`))