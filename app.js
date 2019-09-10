const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const { loginSuccessful } = require('./utils/sigaa/loginSuccessful');
const Student = require('./utils/sigaa/student');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/sigaa', (req, res) => {
  if (
    typeof req.query.login === 'undefined' ||
    typeof req.query.senha === 'undefined'
  ) {
    res.send(
      'É necessário um login e senha para acessar o SIGAA. <br /> <br /> (sigaa?login=seu_login&senha=sua_senha)'
    );
  } else {
    const options = {
      method: 'POST',
      url: 'https://sigaa.ufma.br/sigaa/logar.do',
      followAllRedirects: true,
      jar: true,
      headers: {
        'User-Agent': 'request',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        dispatch: 'logOn',
        'user.login': req.query.login,
        'user.senha': req.query.senha
      }
    };

    const output = {
      estudante: null
    };

    request(options, (err, response) => {
      if (err) {
        console.log('err', err);
      } else {
        const { document } = new JSDOM(response.body).window;
        if (!loginSuccessful(document)) {
          res.send('Usuário ou senha inválidos.');
        } else {
          // res.send(getClasses(document));
          // res.send(response.body);

          output.estudante = {
            matricula: Student.getRegistration(document),
            nome: Student.getName(document),
            curso: Student.getProgram(document),
            nivel: Student.getLevel(document),
            status: Student.getStatus(document),
            email: Student.getEmail(document),
            // TODO: alterar a forma como o email é pego - através dos dados pessoais
            entrada: Student.getEntreeYear(document),
            indices_academicos: {
              CR: Student.getPerformance(document)
            },
            integralizacoes: {
              CH_obrigatoria_pendente: Student.getPendingCompulsoryWorkload(
                document
              ),
              CH_optativa_curriculo: Student.getPendingOptionalWorkload(
                document
              ),
              CH_total_curriculo: Student.getTotalCurriculum(document),
              integralizado: Student.getPercentageCurriculum(document)
            },
            cadeiras: Student.getClasses(document)
          };

          res.send(output);
        }
      }
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000 ...');
});
