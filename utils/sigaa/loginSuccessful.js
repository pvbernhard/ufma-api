exports.loginSuccessful = document => {
  const logoff = document.querySelector('#info-sistema > span > a');
  if (logoff === null) {
    return false;
  } else {
    if (logoff.textContent !== 'SAIR') {
      return false;
    } else {
      return true;
    }
  }
};
