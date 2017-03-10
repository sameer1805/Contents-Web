angular.module('MetronicApp').controller('ContactsController', function ($rootScope, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $scope.message = "this is company page";
    //set language
    $translatePartialLoader.addPart('Contact');
    $translate.refresh();

   
   
   
   

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.Contacts = [
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' },
        { Name: 'Demo', Designation: 'demo', Branch: 'demo', EmailId: 'demo', PhoneNo: 'demo' }

    ]
   
    //setting steps for contacts

    $scope.displaycontactlist = true;
    $scope.displayuploadcontacts = false;
    $scope.displaynewcontacts = false;

    $scope.NewContact = NewContact;
    function NewContact(e)
    {
       
        $scope.displaycontactlist = false;
        $scope.displayuploadcontacts = false;
        $scope.displaynewcontacts = true;
    }

    $scope.UploadContact = UploadContact;
    function UploadContact(e) {
       
        $scope.displaycontactlist = false;
        $scope.displayuploadcontacts = true;
        $scope.displaynewcontacts =false;
    }
    $scope.UploadBack = UploadBack;
    function UploadBack(e) {
        $scope.displaycontactlist = true;
        $scope.displayuploadcontacts = false;
        $scope.displaynewcontacts = false;
    }

    $scope.NewContactBack = NewContactBack;
    function NewContactBack(e) {
        $scope.displaycontactlist = true;
        $scope.displayuploadcontacts = false;
        $scope.displaynewcontacts = false;
    }

    // show boxes

    $scope.AddRolePopup = AddRolePopup;
    function AddRolePopup() {
        bootbox.alert({
            size: "",
            title: "New Role", closeButton: false,
            message: "New role added successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
    }

    $scope.NewContactPopup = NewContactPopup;
    function NewContactPopup() {
        bootbox.alert({
            size: "",
            title: "New Contact", closeButton: false,
            message: "New contact added successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
    }

    $scope.UploadContactPopup = UploadContactPopup;
    function UploadContactPopup() {
        bootbox.alert({
            size: "",
            title: "New Contact", closeButton: false,
            message: "Contact file uploaded successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
    }
});