/* Setup blank page controller */
angular.module('MetronicApp').controller('AdjusterLineItemDetailsController', function ($rootScope, $scope, settings, $uibModal, $location, $translate, $translatePartialLoader, AssignLineItemService, AdjusterLineItemDetailsService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    //set language
    $translatePartialLoader.addPart('AdjusterLineItemDetails');
    $translate.refresh();

    $scope.CommonObj = {
        itemNote:""
    };
    $scope.Compairableslist;
    $scope.Notes = "";
    $scope.CategoryList = "";
    $scope.Category = "";
    $scope.SubCategoryList = "";
    $scope.SubCategory = "";
    $scope.ErrorMessage = "";
    function init()
    {
        //get item notes API #127      
        var param = {
            "itemId":526
         // "itemId": sessionStorage.getItem("AdjusetrPostLostItemId")
        };
        var getpromise = AdjusterLineItemDetailsService.getItemNotes(param);
        getpromise.then(function (success) {
        
            $scope.Notes = success.data.data;

        }, function (error) {          
            $scope.ErrorMessage = error.data.errorMessage;
        });

        //--------------------------------------------------------------------------------------------------------------
        //get category list #29
        var getpromise = AdjusterLineItemDetailsService.getCategory();
        getpromise.then(function (success) {
       
            $scope.CategoryList = success.data.data;
            //$scope.Category = success.data.data[0].categoryId;

        }, function (error) {
           
            $scope.ErrorMessage = error.data.errorMessage;
        });

        //--------------------------------------------------------------------------------------------------------------
        //bind subcategory
        var param = {

            "categoryId":14

        };
        var getpromise = AdjusterLineItemDetailsService.getSubCategory(param);
        getpromise.then(function (success) {

            $scope.SubCategoryList = success.data.data;


        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
        //List of comparables
        var CompairableParam = {
            "item": "iphone 5s",
            "ids": [1, 2, 3]
        };
        
        var getCompairables = AdjusterLineItemDetailsService.GetComparableList(CompairableParam);
        getCompairables.then(function (success) {
          
            $scope.Compairableslist = success.data.data;
        }, function (error) {
         
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    init();
    //go back function
    $scope.goBack = goBack;
    function goBack(e) {
      
        $location.url('AdjusterPropertyClaimDetails')
    }

    //open model comparables list
    $scope.openmodel = openmodel;
    function openmodel(e) {

        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var out = $uibModal.open(
             {
                 animation: $scope.animationsEnabled,
                 templateUrl: "/views/Adjuster/AdjusterComparablesList.html",
                 controller: "AdjusterComparablesListController",

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

    //open model adjustor  list
    $scope.AssignClaimToAdjuster = AssignClaimToAdjuster;
    function AssignClaimToAdjuster(ev) {
        var obj = {
            "claimId": 1,
            "claimStatusId": 1
        };
         $scope.AdjusterList =null;
       
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            size: "lg",
            templateUrl: "/views/Adjuster/AssignLineItem.html",
            controller: "AssignLineItemController",
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
      
    }

    //open model item value

    $scope.openValueModel = openValueModel;
    function openValueModel() {
     
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

    //open model item payout
    $scope.openItemPayoutModel = openItemPayoutModel;
    function openItemPayoutModel() {

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

    //alert boxes
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
            message: "Item details updated successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }
    $scope.DeletItem = DeletItem;
    function DeletItem(ev) {
        bootbox.confirm({
            size: "",
            closeButton: false,
            title: "Delet Lost/Damaged Item ",
            message: "Are you sure you want to delete this item?  <b>Please Confirm!",
            className: "modalcustom", buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                //if (result)  call delet function
                if(result)
                {
                    var param = [{
                        "itemId": sessionStorage.getItem("AdjusterPostLostItemId")

                    }]
                    var deleteitem = AdjusterLineItemDetailsService.deleteLineItem(param);
                    deleteitem.then(function (success) {
                        debugger;
                        $scope.Status = success.data.status;
                        if($scope.Status==200)
                        {
                            debugger;
                            bootbox.alert({
                                size: "",
                                title: "Status",
                                closeButton: false,
                                message: success.data.message,
                                className: "modalcustom",
                                callback: function () { /* your callback code */ }
                            });
                        }
                    }, function (error) {
                      
                        $scope.ErrorMessage = error.data.errorMessage;
                    });
                    
                }
            }
        });
    }

    $scope.AddToComparables = AddToComparables;
    function AddToComparables(e) {
        bootbox.alert({
            size: "",
            closeButton: false,
            title: "Add To Comparables",
            message: "Item successfully added to comparables..!!!",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }
  
    //Add notes against item
    $scope.AddNote = function (e) {


        //Add item notes API #20

        var param = {
       
                 "itemId" :526,
                 "incidentNote": $scope.CommonObj.itemNote
        
        };
        var getpromise = AdjusterLineItemDetailsService.addItemNote(param);
        getpromise.then(function (success) {
            
            $scope.Status = success.data.status;
            if($scope.Status==200)
            {
              
                $scope.CommonObj.itemNote = "";
            }

        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });


        //bootbox.alert({
        //    size: "",
        //    closeButton: false,
        //    title: "Line Item Notes",
        //    message: "Notes Added Successfully..!!!",
        //    className: "modalcustom",
        //    callback: function () { /* your callback code */ }
        //});
    }


    //Get subcategory

    $scope.bindSubCat = function (e) {

  //      var param = {

  //"categoryId":$scope.Category
       
  //      };
  //      var getpromise = AdjusterLineItemDetailsService.getSubCategory(param);
  //      getpromise.then(function (success) {
          
  //       $scope.SubCategoryList = success.data.data;
           

  //      }, function (error) {
  //          $scope.ErrorMessage = error.data.errorMessage;
  //      });

    }
});