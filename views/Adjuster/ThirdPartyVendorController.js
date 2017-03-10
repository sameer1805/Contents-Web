angular.module('MetronicApp').controller('ThirdPartyVendorController', function ($rootScope, $scope, settings, $translate, $translatePartialLoader, $location,
   ThirdPartyVendorService, $uibModal) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
   
   
   
   

    //set language
    $translatePartialLoader.addPart('AdjusterThirdPartyVendor');
    $translate.refresh();


    //Variables
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.Vendors = [];
    $scope.ErrorMessage = "";

    $scope.Vendors = [{ vendorNumber: 'demo', lastName: 'demo', contactPerson: 'demo', workPhoneNumber: 'demo', statusHistory: 'Active' },
    { vendorNumber: 'demo', lastName: 'demo', contactPerson: 'demo', workPhoneNumber: 'demo', statusHistory: 'Active' }]
    function init() {
        debugger;
        //var param = {
        //    "companyId": sessionStorage.getItem("CompanyId")
        //}
        //var getVendorList = ThirdPartyVendorService.getVendorList(param);

        //getVendorList.then(function (success) {
        //    debugger;
        //    $scope.Vendors = success.data.data;
        //},
        //function (error) {

        //   // $scope.ErrorMessage = error.data.errorMessage;
        //});
       
    };
    init();

    //Add new vendor
    $scope.GoToNewVendor=function()
    {
        $location.url('NewThirdPartyVendor');
    }

    //Edit Vednor
    $scope.EditVendor=function()
    {
        $location.url('AdjusterEditVendor');
    }

    //Delete Vendor

    $scope.openConfirmDialog=function()
    {
        bootbox.confirm({
            size: "",
            title: $translate.instant('DeleteConfirmBox.Title'),
            message: $translate.instant('DeleteConfirmBox.Message'), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('DeleteConfirmBox.BtnYes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('DeleteConfirmBox.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if(result)
                {

                }
            }
        });
    }
});