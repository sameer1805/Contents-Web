angular.module('MetronicApp').controller('AddNewItemToInventoryController', function ($translate, $translatePartialLoader, $rootScope, $scope, settings, $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
   
   
   


    $translatePartialLoader.addPart('AddNewItemToInventory');
    $translate.refresh();
    $scope.ErrorMessage = "";

    $scope.GotoInventoryItem = GotoInventoryItem;
    function GotoInventoryItem()
    {
        $location.url('Inventory');
    }
});