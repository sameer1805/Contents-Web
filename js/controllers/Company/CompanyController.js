angular.module('MetronicApp').controller('CompanyController', function ($rootScope, $scope, settings, $http,$uibModal, $timeout, $location, $translate, $translatePartialLoader) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });   
    //set language
    $translatePartialLoader.addPart('Company');
    $translate.refresh();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;


    $scope.ShowTabCompany = false;
    $scope.ShowTabHome = true;
    $scope.ShowTabAdministrator = false;
    $scope.ShowTabCoverage = false;
    $scope.showTabCategories = false;
    $scope.showTabContacts = false;

    $scope.ShowHome = ShowHome;
    function ShowHome() {
        $scope.ShowTabHome = true;
        $scope.ShowTabCompany = false;
        $scope.ShowTabAdministrator = false;
        $scope.ShowTabCoverage = false;
        $scope.showTabCategories = false;
        $scope.showTabContacts = false; 
    }

    $scope.ShowCompany = ShowCompany;
    function ShowCompany() {
        $scope.ShowTabHome = false;
        $scope.ShowTabCompany = true;
        $scope.ShowTabAdministrator = false;
        $scope.ShowTabCoverage = false;
        $scope.showTabCategories = false;
        $scope.showTabContacts = false;

        $scope.ShowComanyDetails = true;
        $scope.shownextbtn = true;
        $scope.showbackbtn = false;
        $scope.showRegisterbtn = false;
        $scope.showPersonalDetails = false;
    }

    $scope.ShowContacts = ShowContacts;
    function ShowContacts() {
        $scope.ShowTabHome = false;
        $scope.ShowTabCompany = false;
        $scope.ShowTabAdministrator = false;
        $scope.ShowTabCoverage = false;
        $scope.showTabCategories = false;
        $scope.showTabContacts = true; 
    }
    $scope.ShowCategories = ShowCategories;
    function ShowCategories() {
        $scope.ShowTabHome = false;
        $scope.ShowTabCompany = false;
        $scope.ShowTabAdministrator = false;
        $scope.ShowTabCoverage = false;
        $scope.showTabCategories = true;
        $scope.showTabContacts = false; 
    }

    $scope.ShowCoverage = ShowCoverage;
    function ShowCoverage() {
        $scope.ShowTabHome = false;
        $scope.ShowTabCompany = false;
        $scope.ShowTabAdministrator = false;
        $scope.ShowTabCoverage = true;
        $scope.showTabCategories = false;
        $scope.showTabContacts = false; 
    }
    $scope.ShowAdministrator = ShowAdministrator;
    function ShowAdministrator() {
        $scope.ShowTabAdministrator = true;        
        $scope.ShowTabHome = false;
        $scope.ShowTabCompany = false;        
        $scope.ShowTabCoverage = false;
        $scope.showTabCategories = false;
        $scope.showTabContacts = false;
    }
    //hide show contents
   
        $scope.showbackbtn = false;
        $scope.showRegisterbtn = false;
        $scope.shownextbtn = false;
        $scope.ShowComanyDetails = false;
        $scope.showPersonalDetails = false;
       
   //Next Step
    $scope.NextStep = NextStep;
    function NextStep(e) {
        $scope.showbackbtn = true;
        $scope.showRegisterbtn = true;
        $scope.shownextbtn = false;
        $scope.ShowComanyDetails = false;
        $scope.showPersonalDetails = true;
    }

    //Previous Step
    $scope.PrevStep = PrevStep;
    function PrevStep(e) {
        $scope.showbackbtn = false;
        $scope.showRegisterbtn = false;
        $scope.shownextbtn = true;
        $scope.ShowComanyDetails = true;
        $scope.showPersonalDetails = false;
    }
    //Register
    $scope.Register = Register;
    function Register(e) {
        bootbox.alert({
            size: "",
            title: "Registration Status", closeButton: false,
            message: "You are successfully done with your registration.!!",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }

    //open model popup
    $scope.openRoleModel = openRoleModel;
    function openRoleModel() {
        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "/views/Company/Role.html",
                controller: "RoleController",

                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {
                        $rootScope.items = "Root";
                        return "Testing Pas Value";
                    }
                }

            });
        out.result.then(function (value) {

            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    }
  
});