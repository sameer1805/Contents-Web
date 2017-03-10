//
angular.module('MetronicApp').controller('NewPricingSpecialistController', function ($rootScope, $translate, $translatePartialLoader, $scope, settings, $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('NewPricingSpecialist');
    $translate.refresh();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.error = "";
    $scope.ClaimSpecialistsId;
    $scope.init = function () {
      
      
    };
    $scope.init();

    //Sort New ClaimSpecialists  Grid wiith radiobutton
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});