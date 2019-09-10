exports.loginSuccessful = document => {
  const logoff = document.querySelector('#info-sistema > span > a');
  if (logoff == null) {
    return false;
  }
  if (logoff.textContent !== 'SAIR') {
    return false;
  }
  return true;
};
