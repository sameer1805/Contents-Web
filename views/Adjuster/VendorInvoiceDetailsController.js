angular.module('MetronicApp').controller('VendorInvoiceDetailsController', function ($rootScope, $uibModal, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
   
   
   
   

    //set language
    $translatePartialLoader.addPart('VendorInvoiceDetails');
    $translate.refresh();
    $scope.ClaimNumber = sessionStorage.getItem("AdjusetrClaimNo")

    $scope.GoBack=function()
    {
        $location.url('VendorInvoices')
    }

    
});