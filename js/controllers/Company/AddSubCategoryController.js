angular.module('MetronicApp').controller('AddSubCategoryController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location, SubCategoryObject) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('AddSubCategory');
    $translate.refresh();
    $scope.SubCategoryObject = SubCategoryObject;
    $scope.ok = function () {
        //Success Call Back is the value to be pass after opertion deone
        $scope.$close("Success Call Back test");
    };
    $scope.cancel = function () {
        $scope.$close("Close call back");
    };
});