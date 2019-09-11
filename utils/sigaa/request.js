const rp = require('request-promise-native');

exports.connectToSigaa = async query => {
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
