const { toTitleCase, removeExtraWhitespace, getWords } = require('../string');

exports.getName = document => {
  const nameTag = document.querySelector('#info-usuario > p.usuario > span');

  if (nameTag == null) {
    return null;
  } else {
    return toTitleCase(nameTag.textContent);
  }
};

exports.getAllInstitutionalDataRows = document => {
  const dataRows = document.querySelectorAll(
    '#agenda-docente > table:last-child tr'
  );

  if (dataRows.length > 0) {
    return dataRows;
  } else {
    return null;
  }
};

exports.getAllAcademicIndexesDataRows = document => {
  const dataRows = document.querySelectorAll(
    '#agenda-docente > table:last-child table > tbody > tr'
  );

  if (dataRows.length > 0) {
    return dataRows;
  } else {
    return null;
  }
};

exports.getDataFromDataRows = (dataRows, string) => {
  let data = null;
  if (dataRows == null) {
    return null;
  } else {
    for (let i = 0; i < dataRows.length; i++) {
      if (dataRows[i].textContent.includes(string)) {
        data = dataRows[i].querySelector('td:last-child');
        if (data != null) {
          data = removeExtraWhitespace(data.textContent);
        } else {
          data = null;
        }
        break;
      }
    }
    return data;
  }
};

exports.getRegistration = document => {
  const dataRows = this.getAllInstitutionalDataRows(document);
  return this.getDataFromDataRows(dataRows, 'Matrícula:');
};

exports.getProgram = document => {
  const dataRows = this.getAllInstitutionalDataRows(document);
  let programTag = this.getDataFromDataRows(dataRows, 'Curso:');
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
  return this.getDataFromDataRows(dataRows, 'CH. Obrigatória Pendente');
};

exports.getPendingOptionalWorkload = document => {
  const dataRows = this.getAllAcademicIndexesDataRows(document);
  return this.getDataFromDataRows(dataRows, 'CH. Optativa Pendente');
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
