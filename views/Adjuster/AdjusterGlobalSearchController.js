//
angular.module('MetronicApp').controller('AdjusterGlobalSearchController', function ($rootScope, AdjusterDashboardService, $scope, settings, $filter, $location, $translate, $translatePartialLoader) {
    //set language
    $translatePartialLoader.addPart('AdjusterGlobalSearch');
    $translate.refresh();

    //End side bar
    $scope.MyClaims = [];
    $scope.ClaimHolder = [];
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.ClaimStatus = "ALL";
    $scope.ddlClaimStatusList;
    $scope.GlobalSearchText = sessionStorage.getItem("GlobalSearchtext");
    $scope.DisplayRecordForText = sessionStorage.getItem("GlobalSearchtext");
    $scope.totalitemcount = "";
    $scope.ErrorMessage = "";

    function init() {

        getSearchResult(); //call to get search result

        //Get ClaimStatus List API # 124            
        var GetClaimStatusList = AdjusterDashboardService.getClaimStatusList();
        GetClaimStatusList.then(function (success) {
            $scope.ddlClaimStatusList = success.data.data;
        }, function (error) {
            // $scope.ErrorMessage = error.data.errorMessage;
        });
    }
    init();

    function getSearchResult() {
        //Get Claims list for my claims API #148
        var param =
           {
               "searchString": sessionStorage.getItem("GlobalSearchtext"),
               "companyId": sessionStorage.getItem("CompanyId")

           };
        var GetSearchRecord = AdjusterDashboardService.getSearchClaims(param);
        GetSearchRecord.then(function (success) {
            $scope.MyClaims = success.data.data;
            $scope.ClaimHolder = success.data.data;
            setPageSize();
        }, function (error) {
            // $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    function setPageSize()
    {
        if ($scope.MyClaims ===null) {
            $scope.pagesize = 0;
            $scope.totalitemcount = 0;
        }
        else
        {
            $scope.totalitemcount = $scope.MyClaims.length;
            if ($scope.totalitemcount < 10) {
                $scope.pagesize = $scope.totalitemcount;
            }
            else {
                $scope.pagesize = $rootScope.settings.pagesize;
            }
        }
    }
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.GotoClaimDetails = GotoClaimDetails;
    function GotoClaimDetails(claim) {
        sessionStorage.setItem("AdjusterClaimId", claim.claimId);
        sessionStorage.setItem("AdjusterClaimNo", claim.claimNumber);
        $location.url('\AdjusterPropertyClaimDetails')
    }

    $scope.GoBack = function () {
        $location.url('AdjusterDashboard');
    }

    $scope.GetClaimOnStatus = function () {

        $scope.ClaimStatus;
        if (($scope.ClaimStatus === "ALL") || (angular.isUndefined($scope.ClaimStatus) || $scope.ClaimStatus === null)) {

            $scope.MyClaims = $scope.ClaimHolder;
            setPageSize();

        }
        else {
            $scope.data = [];
            angular.forEach($scope.ClaimHolder, function (obj, key) {
                if (obj.status.status == $scope.ClaimStatus) {
                    $scope.data.push(obj);
                }

            });
            $scope.MyClaims = $scope.data;
            setPageSize();
        }
    }

    $scope.Search = function () {
        $scope.DisplayRecordForText = $scope.GlobalSearchText;
        sessionStorage.setItem("GlobalSearchtext", $scope.GlobalSearchText)
        getSearchResult();
    }


});