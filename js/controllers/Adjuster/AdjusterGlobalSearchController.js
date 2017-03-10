//
angular.module('MetronicApp').controller('AdjusterGlobalSearchController', function ($rootScope, AdjusterDashboardService, $scope, settings,  $location, $translate, $translatePartialLoader) {
    //set language
    $translatePartialLoader.addPart('AdjusterDashboard');
    $translate.refresh();
    // set sidebar closed and body solid layout mode 
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    //End side bar
    $scope.ClaimList = [];
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.ClaimStatus;
    $scope.ddlClaimStatusList;
    
    $scope.ErrorMessage = "";

    function init() {
        //Get Claims list for my claims API #72
        var param = {
            "assignedUserId": 252
        };
        var promisePost = AdjusterDashboardService.getClaimsInProgress(param);
        promisePost.then(function (success) {

            $scope.MyClaims = success.data.data;

        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
        //Get ClaimStatus List API # 124            
        var GetClaimStatusList = AdjusterDashboardService.getClaimStatusList();
        GetClaimStatusList.then(function (success) {
            $scope.ddlClaimStatusList = success.data.data;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
    init();

    //Sorting of datatbale
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.GotoClaimDetails = GotoClaimDetails;
    function GotoClaimDetails(claim) {
        sessionStorage.setItem("AdjusetrClaimId", claim.claimId);
        sessionStorage.setItem("AdjusetrClaimNo", claim.claimNumber);
        $location.url('\AdjusterPropertyClaimDetails')
    }  
    
});