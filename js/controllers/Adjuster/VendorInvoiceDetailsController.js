angular.module('MetronicApp').controller('VendorInvoiceDetailsController', function ($rootScope, $uibModal, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    //set language
    $translatePartialLoader.addPart('VendorInvoiceDetails');
    $translate.refresh();
    $scope.ClaimNumber = sessionStorage.getItem("AdjusetrClaimNo")

    $scope.GoBack=function()
    {
        $location.url('VendorInvoices')
    }

    
});