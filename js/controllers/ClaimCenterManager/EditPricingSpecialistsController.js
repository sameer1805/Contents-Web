angular.module('MetronicApp').controller('EditPricingSpecialistsController', function ($rootScope, $translate, $translatePartialLoader, $scope, settings, $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('EditPricingSpecialists');
    $translate.refresh();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.error = "";
    $scope.ClaimSpecialistsId;
    $scope.init = function () {
        //If session null then new specialists if has value then edit go and get the values
        $scope.ClaimSpecialistsId = sessionStorage.getItem("ClaimSpecialistsId");
        if ($scope.ClaimSpecialistsId !== null) {

        }
    };
    $scope.init();

    //Sort New ClaimSpecialists  Grid wiith radiobutton
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});