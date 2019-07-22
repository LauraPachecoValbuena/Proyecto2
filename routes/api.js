var express = require("express");
var router = express.Router();

var apiAuthRouter = require("./apiAuth");
var apiUsersRouter = require("./apiUsers");
var apiPetsRouter = require("./apiPets");

router.use("/auth", apiAuthRouter);
router.use("/users", apiUsersRouter);
router.use("/pets", apiPetsRouter);

module.exports = router;
