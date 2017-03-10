angular.module('MetronicApp').controller('ThirdPartyDashboardController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location, ThirdPartyVendorService) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyDashboard');
    $translate.refresh();

   
   
   

    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.NewClaims = [];
    $scope.InProgress = [];
    $scope.WaitingForApproval = [];
    $scope.Orders = [];
    $scope.ErrorMessage = "";
    function init() {
        //Get New Claims
        var param = {
            "assignedUserId": sessionStorage.getItem("UserId"),
            //"claimStatus":"OPENED"
            "claimStatus": "ASSIGNED"
        };
        var getNewClaims = ThirdPartyVendorService.getNewClaims(param);
        getNewClaims.then(function (success) {
            debugger;
            $scope.NewClaims = success.data.data;
        }, function (error) {

            //$scope.ErrorMessage = error.data.errorMessage;
        });


        //Get In Progress Claims
        var param = {
            "assignedUserId": sessionStorage.getItem("UserId"),
            "claimStatus": "UNDER REVIEW"
        };
        var getNewClaims = ThirdPartyVendorService.getNewClaims(param);
        getNewClaims.then(function (success) {
            debugger;
            $scope.InProgress = success.data.data;
        }, function (error) {

            //$scope.ErrorMessage = error.data.errorMessage;
        });


        //Get Claims Waiting For Approval
        var param = {
            "assignedUserId": sessionStorage.getItem("UserId"),
            "claimStatus": "INSPECTION"
        };
        var getNewClaims = ThirdPartyVendorService.getNewClaims(param);
        getNewClaims.then(function (success) {
            debugger;
            $scope.WaitingForApproval = success.data.data;
        }, function (error) {

            //$scope.ErrorMessage = error.data.errorMessage;
        });


    }
    init();


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

    $scope.GoToClaimDetails = function (claim) {

        debugger;
        if (claim.ClaimId == "Demo") {
            sessionStorage.setItem("AdjusterClaimNo", "C11EWL44");
            sessionStorage.setItem("AdjusterClaimId", 533);
            $location.url('ThirdPartyVendor');
        }
        else if (claim.claimId != null && claim.claimNumber != null) {
            debugger;
            sessionStorage.setItem("AdjusterClaimNo", claim.claimNumber);
            sessionStorage.setItem("AdjusterClaimId", claim.claimId);
            $location.url('ThirdPartyVendor');
        }

    };

    $scope.MyClaims3 = [
            { ClaimId: "Demo", Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
            { ClaimId: "Demo", Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
            { ClaimId: "Demo", Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
            { ClaimId: "Demo", Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
            { ClaimId: "Demo", Claim: "Demo1", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
            { ClaimId: "Demo", Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
           { ClaimId: "Demo", Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
           { ClaimId: "Demo", Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
           { ClaimId: "Demo", Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
           { ClaimId: "Demo", Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
           { ClaimId: "Demo", Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
           { ClaimId: "Demo", Claim: "Demo2", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
           { ClaimId: "Demo", Claim: "2Demo3", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" },
           { ClaimId: "Demo", Claim: "4Demo", InsuredsName: "demo", InsuredsPhone: "demo", ReportDate: "Demo", ServiceRequested: "Demo", Status: "Demo" }
    ];
});