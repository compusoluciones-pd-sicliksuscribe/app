const supportData = require('../../../data/support');
const Security = require('../../security');
const help = require('../../../helpers/help');
const email = require('./emails');
const validation = require('./validation');

const createSupport = async (access, Solicitud) => {
  const security = new Security([{ IdTipoAcceso: 2 }, { IdTipoAcceso: 3 }, { IdTipoAcceso: 4 }], 1);
  if (security.isValidAccess(access)) {
    return validation(Solicitud, access.IdUsuario)
      .then(() => supportData.insert(Solicitud, access.IdUsuario))
      .then(async insertData => {
        const destinatario = await supportData.getEmails(Solicitud.IdFabricante);
        for (let i = 0; i < destinatario.length; i++) {
          email.supportRequested(insertData.data.insertId ,destinatario[i].Correo);
        }
        return Promise.resolve(insertData);
      })
      .catch(err => Promise.reject(help.r$(0, 'Error al validar la solicitud de soporte, en el campo ' + err.details[0].message)));
  }
  return Promise.reject(help.r$(0, 'No tienes acceso a esta función', null));
};

module.exports = createSupport;