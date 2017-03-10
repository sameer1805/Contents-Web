angular.module('MetronicApp').controller('ItemsSetteledController', function ($scope, $rootScope, $translatePartialLoader, $translate, $location) {
    $translatePartialLoader.addPart('ItemsSetteled');
    $translate.refresh();
   
   
   
   

    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.search;
    $scope.Category="1";
    $scope.ItemList = null;
    init();
    function init()
    {
        $scope.ClaimNo = sessionStorage.getItem("AdjusterClaimNo").toString();
    }
    $scope.GoBack = GoBack;
    function GoBack()
    {
        $location.url('AdjusterPropertyClaimDetails');
    }
});