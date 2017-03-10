angular.module('MetronicApp').controller('InventoryController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyInventory');
    $translate.refresh();
   
   
   

    $scope.pagesize = $rootScope.pagesize;
   
    $scope.items = [{ ItemId: "demo", ItemName: "demo", Model: "demo", ItemType: "demo", Description: "demo", Supplier: "demo", AddedOn: "demo", LastUpdated: "demo" },
{ ItemId: "demo", ItemName: "demo", Model: "demo", ItemType: "demo", Description: "demo", Supplier: "demo", AddedOn: "demo", LastUpdated: "demo" },
{ ItemId: "demo", ItemName: "demo", Model: "demo", ItemType: "demo", Description: "demo", Supplier: "demo", AddedOn: "demo", LastUpdated: "demo" },
{ ItemId: "demo", ItemName: "demo", Model: "demo", ItemType: "demo", Description: "demo", Supplier: "demo", AddedOn: "demo", LastUpdated: "demo" }
    ]
    $scope.EditItem = EditItem;
    function EditItem()
    {
        $location.url('ThirdPartyAddItemToInventory');
    }
});