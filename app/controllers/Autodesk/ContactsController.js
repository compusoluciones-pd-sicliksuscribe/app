(function () {
  var ContactsController = function ($scope, UsuariosFactory, MonitorContratosFactory, ContactsFactory) {
    const NUMBER_OF_FIELDS_NECESSARY_TO_INSERTION = 5;
    const NUMBER_OF_FIELDS_NECESSARY_TO_EDIT = 6;
    const DANGER_MSG = 'danger';
    const WARNING_MSG = 'warning';
    const SUCCESS_MSG = 'success';
    $scope.contactObjectEdit = {};
    $scope.contactObjectDelete = {};

    $scope.init = () => MonitorContratosFactory.getEndCustomer()
        .then(Empresas => ($scope.selectEmpresas = Empresas.data));

    $scope.getContacts = () => UsuariosFactory.getUsuariosContacto($scope.empresaSelect)
        .then(result => {
          $scope.paramSearch = null;
          $scope.contacts = result.data.data;
        });

    $scope.getContactSearch = param => UsuariosFactory.getContactSearch(param)
        .then(result => $scope.contacts = result.data);

    $scope.openModalInsert = () => $('#modalInsert').modal('show');

    $scope.openModalEdit = contact => {
      $scope.contactObjectEdit.contactId = contact.contact_id;
      $scope.contactObjectEdit.finalUserCsn = contact.endcustomer_csn;
      $scope.contactObjectEdit.firstName = contact.first_name;
      $scope.contactObjectEdit.lastName = contact.last_name;
      $scope.contactObjectEdit.email = contact.email;
      $('#modalEdit').modal('show');
    };

    $scope.openModalDelete = contact => {
      $scope.contactObjectDelete.contactId = contact.contact_id;
      $scope.contactObjectDelete.name = contact.name;
      $scope.contactObjectDelete.email = contact.email;
      $('#modalDelete').modal('show');
    };

    $scope.insertContact = contact => {
      contact.finalUserCsn = contact.finalUser.csn;
      contact.finalUserId = contact.finalUser.IdEmpresa;
      if (!contact || (Object.keys(contact).length - 1) < NUMBER_OF_FIELDS_NECESSARY_TO_INSERTION) $scope.ShowToast('Llena todos los campos del formulario.', 'info'); 
      else {
        if  (contact.finalUserCsn = '0') contact.finalUserCsn = null;
        ContactsFactory.insertContact(contact)
        .then(result => {
          if (result.data.success) {
            $('#modalInsert').modal('hide');
            delete contact.finalUser;
            $scope.contactObject = {};
            $scope.getContacts().then(() => $scope.ShowToast(result.data.message, SUCCESS_MSG));
          } else {
            const aux = result.data.message.split("'")[1];
            switch(aux.toString()) {
              case 'firstName': $scope.ShowToast('Campo no válido: Nombres', WARNING_MSG);break;
              case 'lastName': $scope.ShowToast('Campo no válido: Apellidos', WARNING_MSG);break;
              case 'email': $scope.ShowToast('Campo no válido: correo electrónico', WARNING_MSG);break;
            }
          }
        })
        .catch(() => $scope.ShowToast('No se pudo agregar el contacto.', DANGER_MSG));
      }
    };

    $scope.editContact = contact => {
      contact.finalUserCsn = contact.finalUser.csn;
      contact.finalUserId = contact.finalUser.IdEmpresa;
      if (!contact || (Object.keys(contact).length - 1) < NUMBER_OF_FIELDS_NECESSARY_TO_EDIT) $scope.ShowToast('Llena todos los campos del formulario.', 'info'); 
      else {
        if  (contact.finalUserCsn = '0') contact.finalUserCsn = null;
        ContactsFactory.editContact(contact)
        .then(result => {
          if (result.data.success) {
            $('#modalEdit').modal('hide');
            delete contact.finalUser;
            $scope.contactObjectEdit = {};
            $scope.getContacts().then(() => $scope.ShowToast(result.data.message, SUCCESS_MSG));
          } else $scope.ShowToast(result.data.message, WARNING_MSG);
        })
        .catch(() => $scope.ShowToast('No se pudo editar el contacto.', DANGER_MSG));
      }
    };

    $scope.deleteContact = () => {
      if (Object.keys($scope.contactObjectDelete).length > 0) {
        ContactsFactory.deleteContact($scope.contactObjectDelete.contactId)
        .then(result => {
          $('#modalDelete').modal('hide');
          $scope.contactObjectDelete = {};
          $scope.getContacts().then(() => $scope.ShowToast(result.data.message, SUCCESS_MSG));
        })
        .catch(() => $scope.ShowToast('No se pudo eliminar la información del contacto.', DANGER_MSG));
      }
    };

    $scope.clearFilter = () => {
      $scope.empresaSelect = null;
      $scope.contacts = null;
    };

    $scope.init();
  };

  ContactsController.$inject = ['$scope', 'UsuariosFactory', 'MonitorContratosFactory', 'ContactsFactory'];

  angular.module('marketplace').controller('ContactsController', ContactsController);
}());
