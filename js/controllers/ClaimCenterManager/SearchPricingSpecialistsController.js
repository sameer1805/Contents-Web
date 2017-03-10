//
angular.module('MetronicApp').controller('SearchPricingSpecialistsController', function ($rootScope, $translate, $translatePartialLoader, $scope, settings, $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('SearchPricingSpecialists');
    $translate.refresh();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.error = "";
    $scope.ShowSearchResult = false;
    $scope.init = function () {
    };
    $scope.init();

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.GetEmployeeList = GetEmployeeList;
    function GetEmployeeList()
    {
        $scope.ShowSearchResult = true;
        $scope.EmployeeList = null;// [{ "Name": "Dummy", "Id": "1" }, { "Name": "Dummy 1", "Id": "2" }, { "Name": "Dummy 3", "Id": "3" }];
    }

    $scope.NewPricingSpecialist = NewPricingSpecialist;
    function NewPricingSpecialist() {
        //Add specialistId in session and access it on new specilists if null the new        
        $location.url('NewPricingSpecialist');
    }
    $scope.EditPricingSpecialists = EditPricingSpecialists;
    function EditPricingSpecialists( item) {
        //Add specialistId in session and access it on new specilists if null the new 
       // sessionStorage.setItem("ClaimSpecialistsId", item);
        $location.url('EditClaimSpecialists');
    }
});