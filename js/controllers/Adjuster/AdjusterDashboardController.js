angular.module('MetronicApp').controller('AdjusterDashboardController', function ($rootScope,AdjusterDashboardService, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader) {
    //set language
    $translatePartialLoader.addPart('AdjusterDashboard');
    $translate.refresh();
    // set sidebar closed and body solid layout mode 
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.search;
    $scope.ClaimStatus="ALL"
    $scope.ClaimList = [];
    $scope.MyClaims = [];
    $scope.pagesize = $rootScope.settings.pagesize;   
    $scope.ddlClaimStatusList;
    $scope.Notifications = "";
    $scope.ErrorMessage = "";

    function init() {
        //Get Claims list for my claims API #72
  
        var param = {                      
            "assignedUserId": sessionStorage.getItem("UserId")
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

        //Get Notification API #103
            var promisePost = AdjusterDashboardService.getNotification();
            promisePost.then(function (success) {
                $scope.Notifications = success.data.data.notificationMessages;
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
   
    //Get Claim with respective claim status
    $scope.GetClaimOnStatus = GetClaimOnStatus;
    function GetClaimOnStatus(ev)
    {
        var param;
        if ($scope.ClaimStatus === "ALL")
        {
            param ={ 
                "assignedUserId": sessionStorage.getItem("UserId")
            };
        }
        else{
            param = {
                "assignedUserId": sessionStorage.getItem("UserId"),
                "claimStatus": $scope.ClaimStatus
            };
        }
        var promisePost = AdjusterDashboardService.getClaimsInProgress(param);
        promisePost.then(function (success) {         
            if (success.data.data !== null)
                $scope.MyClaims = success.data.data;
            else
                $scope.MyClaims = [];
        }, function (error) {
            $scope.MyClaims = [];
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.GotoClaimDetails = GotoClaimDetails;
    function GotoClaimDetails(claim) {
        if (claim.claimId != null && claim.claimNumber != null)
        {
            sessionStorage.setItem("AdjusterClaimId", claim.claimId);
            sessionStorage.setItem("AdjusterClaimNo", claim.claimNumber);
        }
     
        $location.url('\AdjusterPropertyClaimDetails')
    }
    $scope.GotoGlobalSearch = GotoGlobalSearch;
    function GotoGlobalSearch()
    {
        $location.url('\AdjusterGlobalSearch')
    }


    //$scope.dummy1 = [{ Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //    { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //]

    //$scope.dummy2 = [{ Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //    { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //    { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //    { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //    { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //    { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //    { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //    { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 }, { Name: "demo", Age: 20 },
    //]
});