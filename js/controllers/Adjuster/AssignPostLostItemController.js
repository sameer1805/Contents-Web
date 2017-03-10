angular.module('MetronicApp').controller('AssignPostLostItemController', function ($rootScope, $scope, settings, $translate, $translatePartialLoader,$location,
    AdjusterListService, AdjusterPropertyClaimDetailsService, $uibModal) {
    
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    //set language
    $translatePartialLoader.addPart('AssignPostLostItem');
    $translate.refresh();

    $scope.PageSize = $rootScope.pagesize;

    $scope.ErrorMessage = '';
    $scope.AdjusterList = '';
    $scope.ServiceList = [1, 2, 3, 4, 5, 6, 7]
    $scope.DdlSourceCategoryList = "";
    $scope.Categories = "ALL";

    $scope.ClaimNumber = sessionStorage.getItem("AdjusterClaimNo").toString()
    function init() {
        //get adjuster list API #94
        var param = {
            "companyId": 265
        };
        var getpromise = AdjusterListService.getAdjusterList(param);
        getpromise.then(function (success) {
         
            $scope.AdjusterList = success.data.data;

        }, function (error) {
            //$scope.ErrorMessage = error.data.errorMessage;
        });

        //Get category
        var getpromise = AdjusterPropertyClaimDetailsService.getCategories();
        getpromise.then(function (success) {
            $scope.DdlSourceCategoryList = success.data.data;

        }, function (error) {
           // $scope.ErrorMessage = error.data.errorMessage;
        });

    //----------------------------------------------------------------------------------------
        //Get lost or damaged content  API #78
        var param = {
            "claimId": sessionStorage.getItem("AdjusterClaimId")
        }

        var getpromise = AdjusterPropertyClaimDetailsService.getLostOrDamagedContent(param);
        getpromise.then(function (success) {
            $scope.LostOrDamagedContent = success.data.data;

        }, function (error) {
           // $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    init();

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    //Assign claim to adjuster/pricing specialist/vendor API #83
    $scope.AssignClaim = function () {

   
        var param = {
            "itemId": 530,
            "assignedUserId": 252,
            "itemStatusId": 2
        }

            var getpromise = AdjusterListService.assignClaim(param);
            getpromise.then(function (success) {
                debugger;
                $scope.status = success.data.status;

                if ($scope.status == 200) {
                   

                    bootbox.alert({
                        size: "",
                        title: "Assign Claim",
                        closeButton: false,
                        message: success.data.message,
                        className: "modalcustom",
                        callback: function () { /* your callback code */ }
                    });
                }
                else {
                  
                }

            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
        
    };

    $scope.cancel = function () {

     $location.url('AdjusterPropertyClaimDetails')
    };

    $scope.AddnewItemPopup = AddnewItemPopup;
    function AddnewItemPopup() {
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "/views/Adjuster/AddNewLostDamageItem.html",
                controller: "AddNewLostDamageItemController",
                resolve:
                {
                    items: function () {
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

    $scope.GoBack=function(e)
    {
        $location.url('AdjusterPropertyClaimDetails')
    }
   
});