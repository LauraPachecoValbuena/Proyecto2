var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var md5 = require("md5");
const mongodb = require("mongodb");

/*si el token es el correcto que me devuelva los usuariso de la base de datos*/
router.get("/", function(req, res) {
  const queryAll = global.dbMongo.collection("users").find(
    {},
    {
      projection: {
        username: 1,
        email: 1, 
        isAdmin: 1
      }
    }
  );
  const queryUserName = global.dbMongo.collection("users").find(
    {},
    {
      projection: {
        username: 1
      }
    }
  );

  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.
  try {
    let vtoken = jwt.verify(token, "mysecret");
    if (vtoken.isAdmin) {
      //esto está comentado porque es la condición que muestre los usuarios sólo si es Admin.

      queryAll.toArray().then(result => {
        res.send(result);
      });
    } else {
      queryUserName.toArray().then(result => {
        res.send(result);
      });
    }
  } catch (_err) {
    //esto es el caso en el que token no sea válido
    res.status(401).send("Sorry, You don't have permission");
  }
});

//estamso buscando un usuario por su ID.
router.get("/:id", function(req, res) {
  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.

  try {
    let vtoken = jwt.verify(token, "mysecret");
    if (vtoken.isAdmin) {
      //esto está comentado porque es la condición que muestre los usuarios sólo si es Admin.

      global.dbMongo
        .collection("users")
        .find(
          {
            _id: mongodb.ObjectID(req.params.id)
          },
          {
            projection: {
              _id: 0,
              password: 0
            }
          }
        )
        .toArray()
        .then(result => {
          res.send(result[0]);
        });
    } else {
      global.dbMongo
        .collection("users")
        .find(
          {
            _id: mongodb.ObjectID(req.params.id)
          },
          {
            projection: {
              username: 1,
              email: vtoken.id === req.params.id
            }
          }
        )
        .toArray()
        .then(result => {
          res.send(result[0]);
        });
    }
  } catch (_err) {
    //esto es el caso en el que token no sea válido
    res.status(401).send("Sorry, You don't have permission");
  }
});

//estamos añadiendo un usuario nuevo.
router.post("/", function(req, res) {
  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.

  try {
    let vtoken = jwt.verify(token, "mysecret");
    if (vtoken.isAdmin) {
      //esto está comentado porque es la condición que muestre los usuarios sólo si es Admin.
      global.dbMongo.collection("users").insertOne(
        {
          username: req.body.username,
          password: md5(req.body.password),
          isAdmin: req.body.isAdmin,
          email: req.body.email
        },
        (_error, result) => {
          //cuando hacemos un insert, dsp de meter los datos a insertar hay que hacerle una callback
          res.send(result.ops[0]); //con el ops le estamos diciendo que nos devuelva todas las opciones que hemos metido. En este caso [0](puesto que sólo hemos metido uno)
        }
      );
    } else {
      res
        .status(401)
        .send("Sorry, You don't have permission because you are not the admin");
    }
  } catch (_err) {
    //esto es el caso en el que token no sea válido
    console.log(_err);
    res.status(401).send("Sorry, You don't have permission");
  }
});

//aqui estamos editando un usuario por la id.
router.put("/:id", function(req, res) {
  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.

  try {
    let vtoken = jwt.verify(token, "mysecret");
    if (vtoken.isAdmin || vtoken.id === req.params.id) {
      const setObject = {};
      if (req.body.username !== "") {
        setObject["username"] = req.body.username;
      }
      if (req.body.password !== "") {
        setObject["password"] = md5(req.body.password);
      }
      if (vtoken.isAdmin && req.body.isAdmin !== null) {
        setObject["isAdmin"] = req.body.isAdmin;
      }
      if (req.body.email !== "") {
        setObject["email"] = req.body.email;
      }
      //esto está comentado porque es la condición que muestre los usuarios sólo si es Admin.
      global.dbMongo.collection("users").updateOne(
        {
          _id: mongodb.ObjectID(req.params.id)
        },
        {
          $set: setObject
        },
        () => {
          //en esta call back le metemos la query del find(:id)para que me muestre los datos que ha cambiado. que los pinte.Si no metemos esta call back. No nos pinta los datos de vuelta.
          global.dbMongo
            .collection("users")
            .find(
              {
                _id: mongodb.ObjectID(req.params.id)
              },
              {
                projection: {
                  // _id: 0,
                  password: 0
                }
              }
            )
            .toArray()
            .then(result => {
              res.send(result[0]);
            });
        }
      );
    } else {
      res
        .status(401)
        .send("Sorry, You don't have permission. You are not an Admin");
    }
  } catch (_err) {
    //esto es el caso en el que token no sea válido
    res.status(401).send("Sorry, You don't have permission");
  }
});

//estamso eliminando un usario a través de su Id. pero sólo lo puede hacer el admin.
router.delete("/:id", function(req, res) {
  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.

  try {
    let vtoken = jwt.verify(token, "mysecret");
    if (vtoken.isAdmin) {
      //esto está comentado porque es la condición que muestre los usuarios sólo si es Admin.
      global.dbMongo.collection("users").deleteOne(
        {
          _id: mongodb.ObjectID(req.params.id)
        },
        () => {
          //en esta call back le metemos la query del find(:id)para que me muestre los datos que ha cambiado. que los pinte.Si no metemos esta call back. No nos pinta los datos de vuelta.
          res.send();
        }
      );
    } else {
      res
        .status(401)
        .send("Sorry, You don't have permission. You are not an Admin");
    }
  } catch (_err) {
    //esto es el caso en el que token no sea válido
    res.status(401).send("Sorry, You don't have permission");
  }
});

module.exports = router;
