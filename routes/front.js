/* eslint-disable quotes */
const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render("login"); // aqui le digo que me renderice al index.ejs y que cambie dónde pone titulo en la plantilla lo cambie x EXpress.
});

/* GET users listing. */
router.get('/pets', (req, res) => {
  res.render("pets");
});

router.get('/pets/add', (req, res) => {
  res.render("addPet");
});

router.get('/pets/:id', (req, res) => {
  res.render("editPet");
});

/* GET users listing. */
router.get('/users', (req, res) => {
  res.render("users");
});

router.get('/users/add', (req, res) => {
  res.render("add");
});

router.get('/users/:id', (req, res) => {
  res.render("edit");
});

module.exports = router;
