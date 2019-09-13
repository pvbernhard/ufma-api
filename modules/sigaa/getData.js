const {
  toTitleCase,
  removeExtraWhitespace,
  getWords
} = require('../../util/string');

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

exports.getName = document => {
  const nameTag = document.querySelector('#info-usuario > p.usuario > span');

  if (nameTag == null) {
    return null;
  }
  return toTitleCase(nameTag.textContent);
};

exports.getAllInstitutionalDataRows = document => {
  const dataRows = document.querySelectorAll(
    '#agenda-docente > table:last-child tr'
  );

  if (dataRows.length > 0) {
    return dataRows;
  }
  return null;
};

exports.getAllAcademicIndexesDataRows = document => {
  const dataRows = document.querySelectorAll(
    '#agenda-docente > table:last-child table > tbody > tr'
  );

  if (dataRows.length > 0) {
    return dataRows;
  }
  return null;
};

exports.getDataFromDataRows = (dataRows, string) => {
  let data = null;
  if (dataRows == null) {
    return null;
  }
  for (let i = 0; i < dataRows.length; i += 1) {
    if (dataRows[i].textContent.includes(string)) {
      data = dataRows[i].querySelector('td:last-child');
      if (data != null) {
        data = removeExtraWhitespace(data.textContent);
        if (data.length < 1) {
          data = null;
        }
      } else {
        data = null;
      }
      break;
    }
  }
  return data;
};

exports.getRegistration = document => {
  const dataRows = this.getAllInstitutionalDataRows(document);
  return this.getDataFromDataRows(dataRows, 'Matrícula:');
};

exports.getProgram = document => {
  const dataRows = this.getAllInstitutionalDataRows(document);
  const programTag = this.getDataFromDataRows(dataRows, 'Curso:');
  let program = programTag;
  if (program != null) {
    program = getWords(programTag);
    program = toTitleCase(program);
  }
  return program;
};

exports.getLevel = document => {
  const dataRows = this.getAllInstitutionalDataRows(document);
  return this.getDataFromDataRows(dataRows, 'Nível:');
};

exports.getStatus = document => {
  const dataRows = this.getAllInstitutionalDataRows(document);
  return this.getDataFromDataRows(dataRows, 'Status:');
};

exports.getEmail = document => {
  // TODO: Pegar o email correto.
  const dataRows = this.getAllInstitutionalDataRows(document);
  return this.getDataFromDataRows(dataRows, 'E-Mail:');
};

exports.getEntreeYear = document => {
  const dataRows = this.getAllInstitutionalDataRows(document);
  return this.getDataFromDataRows(dataRows, 'Entrada:');
};

// Performance = CR
exports.getPerformance = document => {
  const dataRows = this.getAllAcademicIndexesDataRows(document);
  return this.getDataFromDataRows(dataRows, 'CR:');
};

exports.getPendingCompulsoryWorkload = document => {
  const dataRows = this.getAllAcademicIndexesDataRows(document);
  const data = this.getDataFromDataRows(dataRows, 'CH. Obrigatória Pendente');

  if (parseFloat(data) <= 0) {
    // verifica se mais de 1 ano já foi cumprido já que
    // a pendencia não pode ser zero sem pelo menos 1 ano
    const currentYear = new Date().getFullYear();
    if (currentYear - parseInt(this.getEntreeYear(document), 10) <= 1) {
      return null;
    }
    return '0';
  }
  return data;
};

exports.getPendingOptionalWorkload = document => {
  const dataRows = this.getAllAcademicIndexesDataRows(document);
  const data = this.getDataFromDataRows(dataRows, 'CH. Optativa Pendente');

  if (parseFloat(data) <= 0) {
    // verifica se mais de 1 ano já foi cumprido já que
    // a pendencia não pode ser zero sem pelo menos 1 ano
    const currentYear = new Date().getFullYear();
    if (currentYear - parseInt(this.getEntreeYear(document), 10) <= 1) {
      return null;
    }
    return '0';
  }
  return data;
};

exports.getTotalCurriculum = document => {
  const dataRows = this.getAllAcademicIndexesDataRows(document);
  return this.getDataFromDataRows(dataRows, 'CH. Total Currículo');
};

exports.getPercentageCurriculum = document => {
  const dataRows = this.getAllAcademicIndexesDataRows(document);
  const percentTag = this.getDataFromDataRows(dataRows, 'Integralizado');
  let percent = null;
  if (percentTag != null) {
    percent = percentTag.split(' '); // ... '00%' 'Integralizado'
    if (percent.length >= 2) {
      percent = percent[percent.length - 2]; // ... '00%' ...
    } else {
      percent = null;
    }
  }
  if (percent != null && parseFloat(percent) >= 100) {
    // verifica se mais de 1 ano já foi cumprido já que
    // não se pode ter integralizado tudo sem pelo menos 1 ano
    const currentYear = new Date().getFullYear();
    if (currentYear - parseInt(this.getEntreeYear(document), 10) <= 1) {
      return null;
    }
    return percent;
  }
  return percent;
};

exports.getClasses = document => {
  const classes = {};
  const listOfTableData = document.querySelectorAll(
    'form[id^="form_acessarTurmaVirtual"]'
  );
  listOfTableData.forEach(form => {
    const id = form.querySelector('input[name="idTurma"]').value;
    const name = form.querySelector('a').textContent;
    classes[id] = {
      nome_sigaa: name,
      nome: toTitleCase(name)
    };
  });
  return classes;
};
