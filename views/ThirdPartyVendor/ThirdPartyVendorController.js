angular.module('MetronicApp').controller('ThirdPartyVendorController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location, $uibModal, $filter,ThirdPartyVendorService) {
   
   
   


    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyVendor');
    $translate.refresh();

    //Variables
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.ClaimNumber = sessionStorage.getItem("AdjusterClaimNo");
    $scope.ClaimId = sessionStorage.getItem("AdjusterClaimId");
    $scope.LostOrDamagedContent = [];
    $scope.ClaimStatusDetails = [];
    $scope.LostDamagedContentByCategory = [];
    $scope.DdlSourceCategoryList = [];
    $scope.Categories = "ALL";
    $scope.ClaimNotes = [];
    $scope.ErrorMessage = "";
    $scope.CommonObj =
       {
           claimNote: ""
       };

    $scope.sortpostlostitem = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    function init()
    {

        if (sessionStorage.getItem("AdjusterClaimId") != null || sessionStorage.getItem("AdjusterClaimNo") != null) {


            //get claim status details API #140

            var param = {
                "claimId": sessionStorage.getItem("AdjusterClaimId")
            };
            var getpromise = ThirdPartyVendorService.getClaimsStatusDetails(param);
            getpromise.then(function (success) {

                $scope.ClaimStatusDetails = success.data.data;

            }, function (error) {
                //$scope.ErrorMessage =error.data.errorMessage;
            });

            //--------------------------------------------------------------------------------------------------------------
            //Get lost or damaged content  API #78
            var param = {
                //"claimId": sessionStorage.getItem("AdjusterClaimId")
                "claimId": 482
            }

            var getpromise = ThirdPartyVendorService.getLostOrDamagedContent(param);
            getpromise.then(function (success) {

                $scope.LostOrDamagedContent = success.data.data;
                $scope.LostDamagedContentByCategory = success.data.data;; //stoaring value in another object to perform category wise selection

            }, function (error) {
                // $scope.ErrorMessage = error.data.errorMessage;
            });

            //------------------------------------------------------------------------------------------------------------------------

            //Get Category List API #161

            var getpromise = ThirdPartyVendorService.getCategories();
            getpromise.then(function (success) {
                $scope.DdlSourceCategoryList = success.data.data;

            }, function (error) {
                //$scope.ErrorMessage = error.data.errorMessage;
            });


            //--------------------------------------------------------------------------------------------------------------

            // get claim notes API New-#126
            var param =
               {
                   "claimId": sessionStorage.getItem("AdjusterClaimId").toString()
               }

            var getpromise = ThirdPartyVendorService.getClaimNotes(param);
            getpromise.then(function (success) {

                $scope.ClaimNotes = success.data.data;
            }, function (error) {

                // $scope.ErrorMessage = error.data.errorMessage;
            });
        }

    }
    init();
   
    //Get items by category
    $scope.GetItemsByCategory = function (e) {
        debugger;
        if (($scope.Categories === "ALL") || (angular.isUndefined($scope.Categories) || $scope.Categories === null)) {
            $scope.LostOrDamagedContent = $scope.LostDamagedContentByCategory;
        }
        else {
            debugger;
            $scope.LostOrDamagedContent = $filter('filter')($scope.LostDamagedContentByCategory, { categoryName: $scope.Categories });

        }


    }


    //Add note against claim API #66
    $scope.AddNote = function (e) {
        var param =
           {

               "claimId": sessionStorage.getItem("AdjusterClaimId"),
               "incidentNote": $scope.CommonObj.claimNote

           }

        var getpromise = ThirdPartyVendorService.addClaimNote(param);
        getpromise.then(function (success) {
            debugger;
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                $scope.CommonObj.claimNote = "";
               
            }
        }, function (error) {

            //$scope.ErrorMessage = error.data.errorMessage;
        });

        //$scope.showAddNoteBox = false;
        //bootbox.alert({
        //    size: "",
        //    closeButton: false,
        //    title: "Claim Details Notes",
        //    message: "Notes Added Successfully successfully..",
        //    className: "modalcustom",
        //    callback: function () { /* your callback code */ }
        //});
    }

   
    $scope.back = back;
    function back() {
        $location.url('ThirdPartyVendorDashboard');
    }
  
  
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
    ];


});