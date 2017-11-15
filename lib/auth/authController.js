const restify = require('restify');
var router = restify.Router();
var bodyParser = require('body-parser');
var database = require('../database.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', function(req, res) {
    database.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
      //var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (req.body.password != user.password) return res.status(401).send({ auth: false, token: null });
      //Criar o token com ID e acesso, para verificar se o acesso e maior que 1
      var token = jwt.sign({ id: user._id, acesso: user.acesso }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    });
});

module.exports = router;