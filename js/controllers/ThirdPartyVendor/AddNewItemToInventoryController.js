angular.module('MetronicApp').controller('AddNewItemToInventoryController', function ($translate, $translatePartialLoader, $rootScope, $scope, settings, $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;


    $translatePartialLoader.addPart('AddNewItemToInventory');
    $translate.refresh();
    $scope.ErrorMessage = "";

    $scope.GotoInventoryItem = GotoInventoryItem;
    function GotoInventoryItem()
    {
        $location.url('Inventory');
    }
});