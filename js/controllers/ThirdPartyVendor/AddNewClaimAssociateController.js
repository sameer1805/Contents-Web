angular.module('MetronicApp').controller('AddNewClaimAssociateController', function ($rootScope, $translate, AddNewClaimAssociateService, $translatePartialLoader, $scope, settings,
    $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('AddNewClaimAssociate');
    $translate.refresh();
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.ErrorMessage = "";
    $scope.AssociatesDetails = {};
    init();
    function init() {
        var param = {};
        var AssociateList = AddNewClaimAssociateService.GetAssociateDetails(param);
        AssociateList.then(function (success) { $scope.AssociatesDetails = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
  
});