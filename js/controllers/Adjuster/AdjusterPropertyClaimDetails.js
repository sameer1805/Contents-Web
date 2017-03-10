angular.module('MetronicApp').controller('AdjusterPropertyClaimController', function ($rootScope, AdjusterPropertyClaimDetailsService,$uibModal, $scope, settings, $filter, $http, $timeout, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    //set language
    $translatePartialLoader.addPart('AdjusterPropertyClaimDetails');
    $translate.refresh();


    //Sorting of datatbale
    $scope.sortpostlostitem = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.sortVendor = function (keyname) {
        $scope.sortVendorKey = keyname;   //set the sortKey to the param passed
        $scope.reverseVendor = !$scope.reverseVendor; //if true make it false and vice versa
    }
   

    //Varaibles
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.ClaimNumber = sessionStorage.getItem("AdjusterClaimNo");
    $scope.ClaimStatusDetails=[];
    $scope.ErrorMessage = "";
    $scope.LostOrDamagedContent = [];
    $scope.LostDamagedContentByCategory = [];//for stoaring lost damaged item list to preform category wise selection
  
    $scope.DdlSourceCategoryList =[];
    $scope.Categories = "ALL";
    $scope.VendorsAgainstClaim = [];
    $scope.ClaimNotes=[];
    
    $scope.CommonObj =
        {
            claimNote:""
        };
   function init()      
    {
       if (sessionStorage.getItem("AdjusterClaimId") != null || sessionStorage.getItem("AdjusterClaimNo") != null) {


           //get claim status details API #140

           var param = {
               "claimId": sessionStorage.getItem("AdjusterClaimId")
           };
           var getpromise = AdjusterPropertyClaimDetailsService.getClaimsStatusDetails(param);
           getpromise.then(function (success) {

               $scope.ClaimStatusDetails = success.data.data;

           }, function (error) {
               //$scope.ErrorMessage =error.data.errorMessage;
           });

           //--------------------------------------------------------------------------------------------------------------

           //Get lost or damaged content  API #78
           var param = {
               "claimId": sessionStorage.getItem("AdjusterClaimId")
                //"claimId":482
           }
     
           var getpromise = AdjusterPropertyClaimDetailsService.getLostOrDamagedContent(param);
           getpromise.then(function (success) {
        
               $scope.LostOrDamagedContent = success.data.data;
               $scope.LostDamagedContentByCategory = success.data.data;; //stoaring value in another object to perform category wise selection

           }, function (error) {
               // $scope.ErrorMessage = error.data.errorMessage;
           });

           //--------------------------------------------------------------------------------------------------------------

           //Get Category List API #161

           var getpromise = AdjusterPropertyClaimDetailsService.getCategories();
           getpromise.then(function (success) {
               $scope.DdlSourceCategoryList = success.data.data;

           }, function (error) {
               //$scope.ErrorMessage = error.data.errorMessage;
           });


           //--------------------------------------------------------------------------------------------------------------

           // get active vendors against claim API New #113
           var param =
              {
                  "claimNumber": sessionStorage.getItem("AdjusterClaimNo").toString()
              }
        
           var getpromise = AdjusterPropertyClaimDetailsService.getVendorsAgainstClaim(param);
           getpromise.then(function (success) {

               $scope.VendorsAgainstClaim = success.data.data;

           }, function (error) {

               //$scope.ErrorMessage = error.data.errorMessage;
           });


           //--------------------------------------------------------------------------------------------------------------

           // get claim notes API New-#126
           var param =
              {
                  "claimId": sessionStorage.getItem("AdjusterClaimId").toString()
              }

           var getpromise = AdjusterPropertyClaimDetailsService.getClaimNotes(param);
           getpromise.then(function (success) {

               $scope.ClaimNotes = success.data.data;
           }, function (error) {

               // $scope.ErrorMessage = error.data.errorMessage;
           });
       }
      
       else {
           $location.url('AdjusterDashboard'); //if session data is lost then redirect to previous page
       }
    }
   
   init();
    
   $scope.ModalAssignAdjustor= function ()
   {
       $scope.animationsEnabled = true;
       $scope.items = "Testing Pas Value";
       var vm = this;
       var out = $uibModal.open(
           {
               animation: $scope.animationsEnabled,
               templateUrl: "/views/Adjuster/AdjusterList.html",
               controller: "AdjustorListController",

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

   $scope.AssignPostLostItem = function () {

       $location.url('AssignPostLostItem')
       //$scope.animationsEnabled = true;
       //$scope.items = "Testing Pas Value";
      
       //var out = $uibModal.open(
       //    {size:"lg",
       //        animation: $scope.animationsEnabled,
       //        templateUrl: "/views/Adjuster/AssignPostLostItem.html",
       //        controller: "AssignPostLostItemController",

       //        resolve:
       //        {
       //            /**
       //             * @return {?}
       //             */

       //            items: function () {
       //                $rootScope.items = "Root";
       //                return "Testing Pas Value";
       //            }
       //        }

       //    });
       //out.result.then(function (value) {

       //    //Call Back Function success
       //}, function () {

       //});
       //return {
       //    open: open
       //};
   }

    //Get items by category
   $scope.GetItemsByCategory=function(e)
   {
       debugger;
       if (($scope.Categories === "ALL") || (angular.isUndefined($scope.Categories) || $scope.Categories === null))
       {
           $scope.LostOrDamagedContent = $scope.LostDamagedContentByCategory;
       }
       else {
           debugger;
           $scope.LostOrDamagedContent = $filter('filter')($scope.LostDamagedContentByCategory, { categoryId: $scope.Categories });
         
       }

       
   }
  


   //Delete Items Form Damage Lost
   $scope.LostOrDamagedContent;
   $scope.DeleteListLostDamageItem=[];

   $scope.DeleteAllItems = DeleteAllItems;
   function DeleteAllItems() {       
       $scope.DeleteListLostDamageItem = [];
       if ($scope.DeleteAll) {
           angular.forEach($scope.LostOrDamagedContent, function (item) {
               $scope.DeleteListLostDamageItem.push(item.itemId)
           });
       }
   }

   $scope.exists = exists;

   function exists(item, list) {
       return list.indexOf(item) > -1;
   };

   $scope.AddToDeleteList = function (item) {     
       var idx = $scope.DeleteListLostDamageItem.indexOf(item);
       if (idx > -1) {
           $scope.DeleteAll = false;
           $scope.DeleteListLostDamageItem.splice(idx, 1);
       }
       else {
           $scope.DeleteListLostDamageItem.push(item);
       }
   }

   $scope.DeletItem = DeletItem;
   function DeletItem(ev) {
       bootbox.confirm({
           size: "",
           title: $translate.instant('ClaimDetails_Delete.Title'),
           message: $translate.instant('ClaimDetails_Delete.Message'), closeButton: false,
           className: "modalcustom", buttons: {
               confirm: {
                   label: $translate.instant('ClaimDetails_Delete.BtnYes'),
                   className: 'btn-success'
               },
               cancel: {
                   label: $translate.instant('ClaimDetails_Delete.BtnNo'),
                   className: 'btn-danger'
               }
           },
           callback: function (result) {
               if (result) {                   
                   var paramIdList=[];
                   angular.forEach($scope.DeleteListLostDamageItem, function (item) {                      
                      paramIdList.push({ "itemId": item })
                   });                  
                   var response = AdjusterPropertyClaimDetailsService.removePostLostItem(paramIdList);
                   response.then(function (success) { //Filter list and remove item     
                       $scope.DeleteListLostDamageItem = [];
                       var paramLostDamageList = {
                           "claimId": sessionStorage.getItem("AdjusetrClaimId")
                       }; 
                       var response = AdjusterPropertyClaimDetailsService.getLostOrDamagedContent(paramLostDamageList);
                       response.then(function (success) { $scope.LostOrDamagedContent = success.data.data; }, function (error) { });
                   }, function (error) {  });
               }
           }
       });
   }
    //End Post loss
   $scope.back = back;
    function back() {
        $location.url('AdjusterDashboard');
    }

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

    //Redirect to line item details
    $scope.openLineItemdetails = openLineItemdetails;
    function openLineItemdetails(item) {

        sessionStorage.setItem("AdjusterPostLostItemId", item.itemId)
        $location.url('AdjusterLineItemDetails');
    }

    

    $scope.ApproveClaim = ApproveClaim;
    function ApproveClaim(e) {
       
        bootbox.alert({
            size: "",
            title: "Approve Claim",
            closeButton: false,
            message: "The claim details approved successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }

    $scope.SaveClaimDetails = SaveClaimDetails;  
    function SaveClaimDetails(e) {      
        bootbox.alert({
            size: "",
            closeButton: false,
            title: "Claim Details",
            message: "Claim details updated successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }

   
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

    $scope.showAddNoteBox = false; //hide addd note textbox

    $scope.ShowAddNoteArea = function (e) {
        $scope.showAddNoteBox = true;
    }


    //Add note against claim API #66
    $scope.AddNote = function (e) {
        var param =
           {
           
               "claimId": sessionStorage.getItem("AdjusterClaimId"),
               "incidentNote" : $scope.CommonObj.claimNote
              
           }

        var getpromise = AdjusterPropertyClaimDetailsService.addClaimNote(param);
        getpromise.then(function (success) {
            debugger;
            $scope.Status = success.data.status;
            if($scope.Status==200)
            {
                $scope.CommonObj.claimNote = "";
                $scope.showAddNoteBox = false;
            }
        }, function (error) {
          
            $scope.ErrorMessage = error.data.errorMessage;
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


    $scope.HideAddNoteArea = function (e) {
        $scope.CommonObj.claimNote = "";
        $scope.showAddNoteBox = false;
       
    }

    //Open Add New Vendor PopUp
    $scope.OpenAddNewVendorModel=function(e)
    {
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size:"lg",
                templateUrl: "/views/Adjuster/AddNewVendor.html",
                controller: "AddNewVendorController",
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



    //open model item payout
    $scope.openItemPayoutModel = function openItemPayoutModel() {

        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size: "lg",
                templateUrl: "/views/Adjuster/ItemPayout.html",
                controller: "ItemPayoutController",

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

    //open model item value
    $scope.openValueModel =  function openValueModel() {

        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "/views/Adjuster/ItemValue.html",
                controller: "ItemValueController",

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

    //Go to Item settled page
    $scope.GotoItemStteled = GotoItemStteled;
    function GotoItemStteled() {
       
        $location.url('ItemsSetteled');
     
    }
    $scope.GotoItemToBeStteled = GotoItemToBeStteled;
    function GotoItemToBeStteled() {
      
        $location.url('ItemsToBeSetteled');

    }
    
    $scope.HoldoverDetails=function()
    {
        $location.url('ItemsHoldover');
    }
    $scope.GotoVendorInvoices=function()
    {
        $location.url('VendorInvoices');
    }
});