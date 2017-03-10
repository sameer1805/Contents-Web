angular.module('MetronicApp').controller('VendorInvoicesController', function ($rootScope, $uibModal, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
   
   
   
   

    //set language
    $translatePartialLoader.addPart('VendorInvoices');
    $translate.refresh();
    $scope.ClaimNumber = sessionStorage.getItem("AdjusterClaimNo")


    $scope.InvoiceAddressed = [];
   
    $scope.Invoices = [
    {
        Name: "Vendor1", InvoiceDetail: [
          { InvoiceId: "InvoiceId1", VendorNote: "InvoiceId1", Amount: "Demo", InvoiceDate: "Demo", DueDate: "Demo", Status: "demo", Attachment: "demo" },
          { InvoiceId: "InvoiceId1", VendorNote: "InvoiceId2", Amount: "Demo", InvoiceDate: "Demo", DueDate: "Demo", Status: "demo", Attachment: "demo" },
           { InvoiceId: "InvoiceId1", VendorNote: "InvoiceId1", Amount: "Demo", InvoiceDate: "Demo", DueDate: "Demo", Status: "demo", Attachment: "demo" },
          { InvoiceId: "InvoiceId1", VendorNote: "InvoiceId2", Amount: "Demo", InvoiceDate: "Demo", DueDate: "Demo", Status: "demo", Attachment: "demo" },
            { InvoiceId: "InvoiceId1", VendorNote: "InvoiceId2", Amount: "Demo", InvoiceDate: "Demo", DueDate: "Demo", Status: "demo", Attachment: "demo" }
        ]
    },

    { Name: "Vendor2", InvoiceDetail: [{ InvoiceId: "InvoiceId1", VendorNote: "demo", Amount: "Demo", InvoiceDate: "Demo", DueDate: "Demo", Status: "demo", Attachment: "demo" }] },
    { Name: "Vendor3", InvoiceDetail: [{ InvoiceId: "InvoiceId1", VendorNote: "demo", Amount: "Demo", InvoiceDate: "Demo", DueDate: "Demo", Status: "demo", Attachment: "demo" }] }]

    
    $scope.InvoiceModelList = [];

  
        //created custom data object 
        angular.forEach($scope.Invoices, function (mainvalue, key) {

            $scope.Invoicemodel = {};
            $scope.Invoicemodel.InvoiceId = null;
            $scope.Invoicemodel.VendorNote = null;
            $scope.Invoicemodel.Amount = null;
            $scope.Invoicemodel.InvoiceDate = null;
            $scope.Invoicemodel.DueDate = null;
            $scope.Invoicemodel.Status = null;
            $scope.Invoicemodel.Attachment = null;
            $scope.Invoicemodel.Header = 1;
            $scope.Invoicemodel.Name = mainvalue.Name;
            $scope.InvoiceModelList.push($scope.Invoicemodel);


            angular.forEach(mainvalue.InvoiceDetail, function (value, key) {
                $scope.Invoicemodel = {};

                $scope.Invoicemodel.InvoiceId = value.InvoiceId;
                $scope.Invoicemodel.VendorNote = value.VendorNote;
                $scope.Invoicemodel.Amount = value.Amount;
                $scope.Invoicemodel.InvoiceDate = value.InvoiceDate;
                $scope.Invoicemodel.DueDate = value.DueDate;
                $scope.Invoicemodel.Status = value.Status;
                $scope.Invoicemodel.Attachment = value.Attachment;
                $scope.Invoicemodel.Header = 0;
                $scope.Invoicemodel.Name = mainvalue.Name;

                $scope.InvoiceModelList.push($scope.Invoicemodel);
            });
        });
   
   
  
    //$scope.SelectAllInvoices=function(invoiceObject)
    //{
    //    $scope.InvoiceAddressed = [];
     
    //    angular.forEach($scope.InvoiceModelList, function (obj, key) {
    //        $scope.Invoice = {};
    //        debugger;
    //        if (obj.Header == 0 && obj.Name == invoiceObject.Name)
    //        {
    //            debugger;
    //            $scope.Invoice.InvoiceId = obj.InvoiceId;

    //            $scope.InvoiceAddressed.push($scope.Invoice);
    //        }
           
    //    });
    //}
   
     $scope.GotoInvoiceDetails = function () {
        $location.url('VendorInvoiceDetails')
     }

     $scope.GoBack = function () {
         $location.url('AdjusterPropertyClaimDetails')
     }

});