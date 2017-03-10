angular.module('MetronicApp').controller('LineItemDetailsController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyLineItemDetails');
    $translate.refresh();
   
   
   

    $scope.pagesize = $rootScope.pagesize;

});