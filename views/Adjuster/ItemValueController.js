angular.module('MetronicApp').controller('ItemValueController', function ($rootScope, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader) {

    //$scope.$on('$viewContentLoaded', function () {
    //    // initialize core components
    //    App.initAjax();
    //});

    //set language
    $translatePartialLoader.addPart('ItemValue');
    $translate.refresh();

    $scope.ACVSection = true;
    $scope.RCVSection = false;

    $scope.displayACV = function ()
    {
        $scope.ACVSection = true;
        $scope.RCVSection = false;
    }
    $scope.displayRCV = function () {
        $scope.ACVSection = false;
        $scope.RCVSection = true;
    }

    $scope.ok = function () {
        //Success Call Back is the value to be pass after opertion deone
        $scope.$close();
    };
    $scope.cancel = function () {

        $scope.$close();
    };
});