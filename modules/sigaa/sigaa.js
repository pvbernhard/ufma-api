const rp = require('request-promise-native');
const sigaaGetData = require('./getData');

exports.connect = async query => {
  const options = {
    method: 'POST',
    uri: 'https://sigaa.ufma.br/sigaa/logar.do',
    followAllRedirects: true,
    jar: true,
    headers: {
      'User-Agent': 'request',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      dispatch: 'logOn',
      'user.login': query.login,
      'user.senha': query.senha
    },
    transform(body, response) {
      return response;
    }
  };

  return rp(options);
};

exports.parse = async document => {
  const output = {
    estudante: null
  };
  output.estudante = {
    matricula: sigaaGetData.getRegistration(document),
    nome: sigaaGetData.getName(document),
    curso: sigaaGetData.getProgram(document),
    nivel: sigaaGetData.getLevel(document),
    status: sigaaGetData.getStatus(document),
    email: sigaaGetData.getEmail(document),
    // TODO: alterar a forma como o email é pego - através dos dados pessoais
    entrada: sigaaGetData.getEntreeYear(document),
    indices_academicos: {
      CR: sigaaGetData.getPerformance(document)
    },
    integralizacoes: {
      CH_obrigatoria_pendente: sigaaGetData.getPendingCompulsoryWorkload(
        document
      ),
      CH_optativa_curriculo: sigaaGetData.getPendingOptionalWorkload(document),
      CH_total_curriculo: sigaaGetData.getTotalCurriculum(document),
      integralizado: sigaaGetData.getPercentageCurriculum(document)
    },
    cadeiras: sigaaGetData.getClasses(document)
  };
  return output;
};
