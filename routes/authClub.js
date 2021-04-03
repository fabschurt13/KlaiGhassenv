require("dotenv").config();
const express = require("express");
const clubDb = require("../models/club");
const router = express.Router();
var nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
var val;
//get one email

router.post("/reset", (req, res) => {
  val = Math.floor(1000 + Math.random() * 9000);
  console.log(val);

  try {
    let email = req.body.email;
    clubDb.find({ email: email }).then((user) => {
      compte = user[0];
      if (compte) {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "pimmpim40@gmail.com",
            pass: "123456789azer@@",
          },
        });
        var mailOptions = {
          from: "pimmpim40@gmail.com",
          to: compte.email,
          subject: "Reset passward",
          text: "your code is :" + val,
        };
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        res.json({
          isemail: true,
        });
      } else {
        res.json({
          isemail: false,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});


router.post("/verfy", (req, res) => {
    val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);
  
    try {
      let email = req.body.email;
      clubDb.find({ email: email }).then((user) => {
        compte = user[0];
        if (compte) {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "pimmpim40@gmail.com",
              pass: "123456789azer@@",
            },
          });
          var mailOptions = {
            from: "pimmpim40@gmail.com",
            to: compte.email,
            subject: "Reset passward",
            text: "your verfication code is :" + val,
          };
          transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
  
          res.json({
            isemail: true,
          });
        } else {
          res.json({
            isemail: false,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  });


  router.patch("/verfy", getClubByEmail, async (req, res) => {
     if (req.body.code == val) {
      res.club.verified = true
    }
      try {
        res.club.save().then((updateduser) => {
          res.json(
            updateduser
          );
        });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    
  });

router.post("/socauth", (req, res) => {
  try {
    let newUser = new clubDb({
      nom: req.body.nom,
      email: req.body.email,
      prenom: req.body.prenom,
      image: req.body.image,
      social: true,
      verified: true,
    });
    clubDb.find({ email: newUser.email }).then((club) => {
      ss = club[0];
      console.log(ss);
      if (ss) {
        let payload = {
          id: ss.id,
          role: ss.clubOwner,
        };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        res.json({
          token: token,
          user: ss,
        });
      } else {
        newUser.save().then((user) => {
          console.log("hello", user);
          compte = user;
          if (compte) {
            let payload = {
              id: compte.id,
              role: compte.clubOwner,
            };
            console.log(payload);
            const token = jwt.sign(payload, process.env.TOKEN_SECRET);
            console.log("hello", compte);

            res.json({
              token: token,
              user: compte,
            });
          } else {
            res.status(401);
            res.json({
              error: "UNAUTHORIZED",
            });
          }
        });
      }
    });
  } catch (err) {
    console.log(err.code);
    if (err.code === 11000) {
      res.json({ created: true });
    }
  }
});
router.post("/", (req, res) => {
  try {
    console.log(req.body);
    let email = req.body.email;
    let passward = req.body.passward;
    console.log(email, passward);
    clubDb.find({ email: email, passward: passward }).then((Club) => {
      compte = Club[0];
      if (compte) {
        let payload = {
          id: compte.id,
          role: compte.clubOwner,
        };
        console.log(payload);
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        let clubLogin = {
          token: token,
          clubName: compte.clubName,
          clubOwner: compte.clubOwner,
          passward: compte.passward,
          clubLogo: compte.clubLogo,
          verifed: compte.verifed,
          login: compte.login,
        };
        res.json(clubLogin);
      } else {
        res.status(401);
        res.json({
          error: "UNAUTHORIZED",
        });
      }
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
});

router.patch("/reset", getClubByEmail, async (req, res) => {
  if (req.body.passward != null) {
   if (req.body.code == val) {
    res.club.passward = req.body.passward;
  }
    try {
      res.club.save().then((updateduser) => {
        res.json(
          updateduser
        );
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
   } else {
     res.json({ code: false });
   }
});

async function getClubByEmail(req, res, next) {
  try {
    club = await clubDb.find({ email : req.body.email });
    if (club == null) {
      return res.status(404).json({ message: "cannot find user" });
    }
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
  res.club = club[0];
  next();
}

module.exports = router;
