var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var md5 = require("md5");

/*endpoint para comprobar usuario y password*/
router.post("/", function(req, res) {
  //aqui NO ponemos el auth puesto que en el documento app.js le hemos indicado la ruta: app.use('/auth', authRouter);

  const query = global.dbMongo.collection("users").find({
    username: req.body.user,
    password: md5(req.body.password)
  });

  query.toArray().then(documents => {
    if (documents.length > 0) {
      var token = jwt.sign(
        {
          id: documents[0]._id,
          username: documents[0].username,
          isAdmin: documents[0].isAdmin ? true : false
        },
        "mysecret",
        {
          expiresIn: 3600
        }
      );
      res.send(token);
    } else {
      res.status(400).send("Sorry, Invalid credentials"); //este es el error que se enviará si la contraseña o usuario NO son válidos.
    }
  });
});

module.exports = router;