angular.module('MetronicApp').controller('ThirdPartyVendorController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location, $uibModal) {
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;


    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyVendor');
    $translate.refresh();

    $scope.showAddNoteBox = false;

    $scope.ShowAddNoteArea=function()
    {
    
        $scope.showAddNoteBox = true;
    }
    $scope.HideAddNoteArea = function (e) {
        $scope.showAddNoteBox = false;
    }

    $scope.AddNote = function (e) {
        $scope.showAddNoteBox = false;
        bootbox.alert({
            size: "", closeButton: false,
            title: "Claim Details Notes",
            message: "Notes Added Successfully successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
    }
    $scope.back = back;
    function back() {
        $location.url('ThirdPartyVendorDashboard');
    }
    //Notes
    $scope.Notes = [
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
{ Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' }
    ]

    //damaged contents
    $scope.DamagedContents = [
        { Name: 'DemoName', Brand: 'DemoBrand', Model: 'DemoModel', Price: 'Demo', Category: 'Category', SubCategory: 'SubCategory', Age: '5', Status: 'Assignned', ReplacedValue: 'Demo', RCV: 'Demo', ACV: 'Demo', PayoutCheck: 'PayoutCheck', Holdover: 'Demo' },
        { Name: 'DemoName', Brand: 'DemoBrand', Model: 'DemoModel', Price: 'Demo', Category: 'Category', SubCategory: 'SubCategory', Age: '5', Status: 'Assignned', ReplacedValue: 'Demo', RCV: 'Demo', ACV: 'Demo', PayoutCheck: 'PayoutCheck', Holdover: 'Demo' },
        { Name: 'DemoName', Brand: 'DemoBrand', Model: 'DemoModel', Price: 'Demo', Category: 'Category', SubCategory: 'SubCategory', Age: '5', Status: 'Assignned', ReplacedValue: 'Demo', RCV: 'Demo', ACV: 'Demo', PayoutCheck: 'PayoutCheck', Holdover: 'Demo' },
        { Name: 'DemoName', Brand: 'DemoBrand', Model: 'DemoModel', Price: 'Demo', Category: 'Category', SubCategory: 'SubCategory', Age: '5', Status: 'Assignned', ReplacedValue: 'Demo', RCV: 'Demo', ACV: 'Demo', PayoutCheck: 'PayoutCheck', Holdover: 'Demo' },
        { Name: 'DemoName', Brand: 'DemoBrand', Model: 'DemoModel', Price: 'Demo', Category: 'Category', SubCategory: 'SubCategory', Age: '5', Status: 'Assignned', ReplacedValue: 'Demo', RCV: 'Demo', ACV: 'Demo', PayoutCheck: 'PayoutCheck', Holdover: 'Demo' },
        { Name: 'DemoName', Brand: 'DemoBrand', Model: 'DemoModel', Price: 'Demo', Category: 'Category', SubCategory: 'SubCategory', Age: '5', Status: 'Assignned', ReplacedValue: 'Demo', RCV: 'Demo', ACV: 'Demo', PayoutCheck: 'PayoutCheck', Holdover: 'Demo' },
        { Name: 'DemoName', Brand: 'DemoBrand', Model: 'DemoModel', Price: 'Demo', Category: 'Category', SubCategory: 'SubCategory', Age: '5', Status: 'Assignned', ReplacedValue: 'Demo', RCV: 'Demo', ACV: 'Demo', PayoutCheck: 'PayoutCheck', Holdover: 'Demo' },
        { Name: 'DemoName', Brand: 'DemoBrand', Model: 'DemoModel', Price: 'Demo', Category: 'Category', SubCategory: 'SubCategory', Age: '5', Status: 'Assignned', ReplacedValue: 'Demo', RCV: 'Demo', ACV: 'Demo', PayoutCheck: 'PayoutCheck', Holdover: 'Demo' }
    ]
    //Redirecting
    $scope.openLineItemdetails = openLineItemdetails;
    function openLineItemdetails(e) {
        $location.url('AdjusterLineItemDetails');
    }

    //Open model
    $scope.AddInvoices = AddInvoices;
    function AddInvoices(e) {
        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "/views/ThirdPartyVendor/AddInvoices.html",
                controller: "AddInvoicesController",
                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {
                        $rootScope.items = "Root";
                        return "Testing Pas Value";
                    }
                }

            });
        out.result.then(function (value) {

            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    }

   
});