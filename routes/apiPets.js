var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
// var md5 = require("md5");
const mongodb = require("mongodb");

/*si el token es el correcto que me devuelva los pets de la base de datos*/
router.get("/", function(req, res) {
  const queryForAdmin = global.dbMongo.collection("pets").find({});

  const queryForUsers = global.dbMongo.collection("pets").find(
    {},
    {
      projection: {
        "owner.bankaccount": 0,
        "owner.dni": 0
      }
    }
  );

  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.
  try {
    let vtoken = jwt.verify(token, "mysecret");
    if (vtoken.isAdmin) {
      queryForAdmin.toArray().then(result => {
        res.send(result);
      });
    } else {
      queryForUsers.toArray().then(result => {
        res.send(result);
      });
    }
  } catch (_err) {
    //esto es el caso en el que token no sea válido
    res.status(401).send("Sorry, You don't have permission");
  }
});

//estamso buscando un pet por su ID.
router.get("/:id", function(req, res) {
  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.

  try {
    let vtoken = jwt.verify(token, "mysecret");
    if (vtoken.isAdmin) {
      //esto está comentado porque es la condición que muestre los usuarios sólo si es Admin.

      global.dbMongo
        .collection("pets")
        .find(
          {
            _id: mongodb.ObjectID(req.params.id)
          },
          {
            projection: {}
          }
        )
        .toArray()
        .then(result => {
          res.send(result[0]);
        });
    } else {
      global.dbMongo
        .collection("pets")
        .find(
          {
            _id: mongodb.ObjectID(req.params.id)
          },
          {
            projection: {
              owner_dni: 0,
              owner_bankaccount: 0,
              isActive: 0
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

//estamos añadiendo un pet nuevo:
router.post("/", function(req, res) {
  try {
    const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.

    let vtoken = jwt.verify(token, "mysecret");

    global.dbMongo.collection("pets").insertOne(
      {
        ...(typeof req.body.name === "string" && { name: req.body.name }),
        ...(typeof req.body.type === "string" && { type: req.body.type }),
        ...(typeof req.body.breed === "string" && { breed: req.body.breed }),
        ...(typeof req.body.owner_name === "string" && {
          owner_name: req.body.owner_name
        }),
        ...(typeof req.body.owner_surname === "string" && {
          owner_surname: req.body.owner_surname
        }),
        ...(vtoken.isAdmin &&
          typeof req.body.owner_dni === "string" && {
            owner_dni: req.body.owner_dni
          }),
        ...(typeof req.body.owner_telephone === "string" && {
          owner_telephone: req.body.owner_telephone
        }),
        ...(typeof req.body.owner_email === "string" && {
          owner_email: req.body.owner_email
        }),
        ...(vtoken.isAdmin &&
          typeof req.body.owner_bankaccount === "string" && {
            owner_bankaccount: req.body.owner_bankaccount
          }),
        ...(typeof req.body.vaccines_rabies === "boolean" && {
          vaccines_rabies: req.body.vaccines_rabies
        }),
        ...(typeof req.body.vaccines_distemper === "boolean" && {
          vaccines_distemper: req.body.vaccines_distemper
        }),
        ...(typeof req.body.vaccines_leishmaniasis === "boolean" && {
          vaccines_leishmaniasis: req.body.vaccines_leishmaniasis
        }),
        ...(typeof req.body.comments === "string" && {
          comments: req.body.comments
        }),
        ...(vtoken.isAdmin &&
          typeof req.body.isActive === "boolean" && {
            isActive: req.body.isActive
          })
      },
      (_error, result) => {
        //cuando hacemos un insert, dsp de meter los datos a insertar hay que hacerle una callback
        res.send(result.ops[0]); //con el ops le estamos diciendo que nos devuelva todas las opciones que hemos metido. En este caso [0](puesto que sólo hemos metido uno)
      }
    );
  } catch (_err) {
    //esto es el caso en el que token no sea válido
    console.log(_err);
    res.status(401).send("Sorry, You don't have permission");
  }
});

//estamos editando un pet por su id
router.put("/:id", function(req, res) {
  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.

  try {
    let vtoken = jwt.verify(token, "mysecret");

    global.dbMongo.collection("pets").updateOne(
      {
        _id: mongodb.ObjectID(req.params.id)
      },
      {
        $set: {
          ...(typeof req.body.name === "string" && { name: req.body.name }),
          ...(typeof req.body.type === "string" && {
            type: req.body.type
          }),
          ...(typeof req.body.breed === "string" && { breed: req.body.breed }),
          ...(typeof req.body.owner_name === "string" && {
            owner_name: req.body.owner_name
          }),
          ...(typeof req.body.owner_surname === "string" && {
            owner_surname: req.body.owner_surname
          }),
          ...(vtoken.isAdmin &&
            typeof req.body.owner_dni === "string" && {
              owner_dni: req.body.owner_dni
            }),
          ...(typeof req.body.owner_telephone === "string" && {
            owner_telephone: req.body.owner_telephone
          }),
          ...(typeof req.body.owner_email === "string" && {
            owner_email: req.body.owner_email
          }),
          ...(vtoken.isAdmin &&
            typeof req.body.owner_bankaccount === "string" && {
              owner_bankaccount: req.body.owner_bankaccount
            }),
          ...(typeof req.body.vaccines_rabies === "boolean" && {
            vaccines_rabies: req.body.vaccines_rabies
          }),
          ...(typeof req.body.vaccines_distemper === "boolean" && {
            vaccines_distemper: req.body.vaccines_distemper
          }),
          ...(typeof req.body.vaccines_leishmaniasis === "boolean" && {
            vaccines_leishmaniasis: req.body.vaccines_leishmaniasis
          }),
          ...(typeof req.body.comments === "string" && {
            comments: req.body.comments
          }),
          ...(vtoken.isAdmin &&
            typeof req.body.isActive === "boolean" && {
              isActive: req.body.isActive
            })
        }
      },
      () => {
        //en esta call back le metemos la query del find(:id)para que me muestre los datos que ha cambiado. que los pinte.Si no metemos esta call back. No nos pinta los datos de vuelta.
        global.dbMongo
          .collection("pets")
          .find(
            {
              _id: mongodb.ObjectID(req.params.id)
            },
            vtoken.isAdmin
              ? null
              : {
                  projection: {
                    "owner.bankaccount": 0,
                    "owner.dni": 0
                  }
                }
          )
          .toArray()
          .then(result => {
            res.send(result[0]);
          });
      }
    );
  } catch (_err) {
    console.log(_err);
    //esto es el caso en el que token no sea válido
    res.status(401).send("Sorry, You don't have permission");
  }
});

//estamos eliminando un pet a traves de su id. Solo si es Admin.

router.delete("/:id", function(req, res) {
  const token = req.headers.authorization.replace("Bearer ", ""); //me devuelve el token que le estoy metiendo por Postman.

  try {
    let vtoken = jwt.verify(token, "mysecret");
    if (vtoken.isAdmin) {
      //esto está comentado porque es la condición que muestre los usuarios sólo si es Admin.
      global.dbMongo.collection("pets").deleteOne(
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
