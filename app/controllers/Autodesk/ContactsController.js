(function () {
  var ContactsController = function ($scope, UsuariosFactory, MonitorContratosFactory, ContactsFactory) {
    const NUMBER_OF_FIELDS_NECESSARY_TO_INSERTION = 5;
    const NUMBER_OF_FIELDS_NECESSARY_TO_EDIT = 6;
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
        .then(result => {
          $scope.contacts = result.data;
        }
      );

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
      delete contact.finalUser;
      if (!contact || Object.keys(contact).length < NUMBER_OF_FIELDS_NECESSARY_TO_INSERTION) $scope.ShowToast('Llena todos los campos del formulario.', 'info'); 
      else {
        ContactsFactory.insertContact(contact)
        .then(result => {
          $('#modalInsert').modal('hide');
          $scope.contactObject = {};
          $scope.getContacts().then(() => $scope.ShowToast(result.data.message, 'success'));
        })
        .catch(() => $scope.ShowToast('No se pudo agregar el contacto.', 'danger'));
      }
    };

    $scope.editContact = contact => {
      contact.finalUserCsn = contact.finalUser.csn;
      contact.finalUserId = contact.finalUser.IdEmpresa;
      delete contact.finalUser;
      if (!contact || Object.keys(contact).length < NUMBER_OF_FIELDS_NECESSARY_TO_EDIT) $scope.ShowToast('Llena todos los campos del formulario.', 'info'); 
      else {
        ContactsFactory.editContact(contact)
        .then(result => {
          $('#modalEdit').modal('hide');
          $scope.contactObjectEdit = {};
          $scope.getContacts().then(() => $scope.ShowToast(result.data.message, 'success'));
        })
        .catch(() => $scope.ShowToast('No se pudo editar el contacto.', 'danger'));
      }
    };

    $scope.deleteContact = () => {
      if (Object.keys($scope.contactObjectDelete).length > 0) {
        ContactsFactory.deleteContact($scope.contactObjectDelete.contactId)
        .then(result => {
          $('#modalDelete').modal('hide');
          $scope.contactObjectDelete = {};
          $scope.getContacts().then(() => $scope.ShowToast(result.data.message, 'success'));
        })
        .catch(() => $scope.ShowToast('No se pudo eliminar la información del contacto.', 'danger'));
      }
    };

    $scope.init();
  };

  ContactsController.$inject = ['$scope', 'UsuariosFactory', 'MonitorContratosFactory', 'ContactsFactory'];

  angular.module('marketplace').controller('ContactsController', ContactsController);
}());
