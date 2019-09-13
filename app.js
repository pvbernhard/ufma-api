const express = require('express');
const bodyParser = require('body-parser');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const sigaa = require('./modules/sigaa/sigaa');
const { loginSuccessful } = require('./modules/sigaa/getData');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/sigaa', (req, res) => {
  if (req.query.login == null || req.query.senha == null) {
    res.send(
      'É necessário um login e senha para acessar o SIGAA. <br /> <br /> (sigaa?login=seu_login&senha=sua_senha)'
    );
  } else {
    // const output = {
    //   estudante: null
    // };
    sigaa
      .connect(req.query)
      .then(response => {
        const { document } = new JSDOM(response.body).window;
        return document;
      })
      .then(document => {
        if (!loginSuccessful(document)) {
          res.send('Usuário ou senha inválidos.');
        } else {
          sigaa.parse(document).then(output => {
            // res.send(response.body);
            res.send(output);
          });
        }
      })
      .catch(err => console.error(err));
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000 ...');
});
