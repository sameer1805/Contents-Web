angular.module('MetronicApp').controller('ClaimCenterMangerDashboardController', function ($translatePartialLoader, $translate, $rootScope, $uibModal, $scope, $location, $filter,
    ClaimCenterDashboardService, AssignClaimForManagerService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('ClaimCenterManagerDashboard');
    $translate.refresh();
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.FnolList; $scope.FilteredFnolList; $scope.ClaimFilter = "ALL";
    $scope.ErrorMessage = "";
    $scope.Globalsearch = "";
    $scope.GetSearchResult = GetSearchResult;
    function GetSearchResult()
    {
        if ($scope.Globalsearch !=="")
        {
            //call method to get search result
        }
    }
    function init() {
        //Get fnol list for data table - API # 15 
        var paramFNOLList = {
            "branchId":sessionStorage.getItem("CompanyId")
        };      
        var promisePost = ClaimCenterDashboardService.getFNOLSubmissionList(paramFNOLList);
        promisePost.then(function (success) {         
            $scope.FilteredFnolList = success.data.data;
            $scope.FnolList = success.data.data;
        }, function (error) {
            //Error Message
            $scope.FilteredFnolList = null;
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
    init();
    $scope.FilterList = FilterList;
    function FilterList() {       
        if (($scope.ClaimFilter === "ALL")||(angular.isUndefined($scope.ClaimFilter) || $scope.ClaimFilter === null))
            $scope.FilteredFnolList = $scope.FnolList;
        else 
        $scope.FilteredFnolList = $filter('filter')($scope.FnolList, { claimType: $scope.ClaimFilter });
    }
    //datatable Functionality
    //Sorting on columns of table
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
        
    //Open popup to assign claim to adjuster
    $scope.AssignClaim = AssignClaim;
    function AssignClaim(obj) {
        $scope.animationsEnabled = true;
        var paramCompanyId = {
            "companyId": sessionStorage.getItem("CompanyId")
        };

        var promiseGetAdjuster = AssignClaimForManagerService.GetAdjusterList(paramCompanyId);
        promiseGetAdjuster.then(function (success) {           
            $scope.AdjusterList = success.data.data;
            var out = $uibModal.open(
           {
               animation: $scope.animationsEnabled,

               templateUrl: "/views/ClaimCenterManager/AssignClaimForManager.html",
               controller: "AssignClaimForManagerController",
               resolve:
               {
                   items: function () {
                       objClaim = obj;
                       return objClaim;
                   },
                   AdjusterList: function () {
                       return $scope.AdjusterList;
                   }
               }

           });
            out.result.then(function (value) {
                //Call Back Function success
            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };
        }, function (errorPl) {
            //Error Message           
            $scope.ErrorMessage = errorPl.data.errorMessage;
        }); 
    }

    //Edit Claim Details And New Fnol
    $scope.GotoFnolRequest = GotoFnolRequest;
    function GotoFnolRequest(ev) {
        $location.url('PropertyFNOLRequest');
    }
    $scope.GotoClaimDetails = GotoClaimDetails;
    function GotoClaimDetails(ev,item) {
        sessionStorage.setItem("ManagerScreenClaimId", item.claimId);
        sessionStorage.setItem("ManagerScreenpolicyNo", item.policyNumber);
        sessionStorage.setItem("ManagerScreenClaimNo", item.claimNumber);
        $location.url('ClaimCenter-ClaimDetails');
    }

    $scope.RejectClaim = RejectClaim;
    function RejectClaim(item) {
        $scope.animationsEnabled = true;
        var paramClaimId = {
            "claimNumber": item,
            "isApproved": false,
            "IsApprove": false,
            "IsReject":true
        }
        var out = $uibModal.open(        {
            animation: $scope.animationsEnabled,
            templateUrl: "/views/ClaimCenterManager/RejectorApproveClaimPopUp.html",
            controller: "RejectOrApproveClaimController",
            resolve:
            {  
                ClaimDetails: function () {
                    return paramClaimId;
                }
            }
        });
        out.result.then(function (value) {            
            //Call Back remove item
           // if (angular.isDefined(value))
             //   $scope.RoleOfUser = list;
        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
       
    }
});