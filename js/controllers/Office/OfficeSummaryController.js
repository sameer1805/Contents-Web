angular.module('MetronicApp').controller('OfficeSummaryController', function ($rootScope, $scope, $http, $location, $translatePartialLoader, $translate) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('OfficeSummary');
    $translate.refresh();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    

    $scope.data = [{ FirstName: "Jon", LastName: "Doe", EmailId: "Jon@gmail.com", PhoneNo: "987645673", Role: "Admin" },
   { FirstName: "Jon", LastName: "Doe", EmailId: "Jon@gmail.com", PhoneNo: "987645673", Role: "Admin" },
   { FirstName: "Jon", LastName: "Doe", EmailId: "Jon@gmail.com", PhoneNo: "987645673", Role: "Admin" },
   { FirstName: "Jon", LastName: "Doe", EmailId: "Jon@gmail.com", PhoneNo: "987645673", Role: "Admin" },
   { FirstName: "Jon", LastName: "Doe", EmailId: "Jon@gmail.com", PhoneNo: "987645673", Role: "Admin" },
   { FirstName: "Jon", LastName: "Doe", EmailId: "Jon@gmail.com", PhoneNo: "987645673", Role: "Admin" },
   { FirstName: "Jon", LastName: "Doe", EmailId: "Jon@gmail.com", PhoneNo: "987645673", Role: "Admin" }, ];
    $scope.EditOfficebtn = false;
    $scope.EditOffice = EditOffice;
    function EditOffice() {
        $scope.EditOfficebtn = true;
    }
    $scope.Save = Save;
    function Save() {
        $scope.EditOfficebtn = false;
    }
    $scope.Cancel = Cancel;
    function Cancel() {
        $scope.EditOfficebtn = false;
    }
});