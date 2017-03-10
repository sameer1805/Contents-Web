angular.module('MetronicApp').controller('AddNewClaimAssociateController', function ($rootScope, $translate, AddNewClaimAssociateService, $translatePartialLoader, $scope, settings,
    $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('AddNewClaimAssociate');
    $translate.refresh();
   
   
   
   
    $scope.ErrorMessage = "";
    $scope.AssociatesDetails = {};
    init();
    function init() {
        var param = {};
        var AssociateList = AddNewClaimAssociateService.GetAssociateDetails(param);
        AssociateList.then(function (success) { $scope.AssociatesDetails = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
  
});