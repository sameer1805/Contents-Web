angular.module('MetronicApp').controller('ThirdPartyDashboardController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyDashboard');
    $translate.refresh();
  
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.pagesize = $rootScope.settings.pagesize;


    //Sorting of datatbale
    $scope.sortNewClaim = function (keyname) {
        $scope.sortNewClaimKey = keyname;   //set the sortKey to the param passed
        $scope.reverseNewClaim = !$scope.reverseNewClaim; //if true make it false and vice versa
    }

    $scope.sortInprogressClaim = function (keyname) {
        $scope.sortInProgress = keyname;   //set the sortKey to the param passed
        $scope.reverseInProgress = !$scope.reverseInProgress; //if true make it false and vice versa
    }

    $scope.sortWaitingClaim = function (keyname) {
        $scope.sortWaitingClaimKey = keyname;   //set the sortKey to the param passed
        $scope.reverseWaiting = !$scope.reverseWaiting; //if true make it false and vice versa
    }

    $scope.sortOrderClaim = function (keyname) {
        $scope.sortOrderClaimKey = keyname;   //set the sortKey to the param passed
        $scope.reverseOrderClaim = !$scope.reverseOrderClaim; //if true make it false and vice versa
    }

    $scope.ok = function () {
     
        $scope.$close("Success Call Back test");
    };
    $scope.cancel = function () {
        $scope.$close("Close call back");
    };

    $scope.RedirectToClaimDetails = function () {

        $location.url('ThirdPartyVendor');
    };

    $scope.MyClaims = [{ Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
        { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
    { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
        { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
    { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }, { Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
        { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
    { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }, { Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
        { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
    { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }
    ];

    $scope.MyClaims1 = [{ Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
       { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
   { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }
    ];


    $scope.MyClaims2 = [{ Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
       { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
   { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }
    ];


    $scope.MyClaims3 = [{ Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
        { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
    { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
        { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
    { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }, { Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
        { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
    { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }, { Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
        { Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
    { Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
{ Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }
    ];
});