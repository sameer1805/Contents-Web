angular.module('MetronicApp').controller('ClaimCenter-ClaimDetailsController', function ($filter, $translate, ClaimCenterClaimDetailsService, $translatePartialLoader, $rootScope,
   $uibModal, $scope, settings, $location, AssignClaimForManagerService, RejectApproveClaimService, $sce) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('ClaimCenter-ClaimDetails');
    $translate.refresh();
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false; 
    //Stored Claim StatusId And ClaimId   
    $scope.CommonObject = {      
        ClaimId: sessionStorage.getItem("ManagerScreenClaimId") ,
        ClaimNo: sessionStorage.getItem("ManagerScreenClaimNo"),
        ItemCategoryId:""
    };
    $scope.ErrorMessage = "";
    $scope.LostDamagedItemList ;
    $scope.ClaimStatusDetails;
  
    $scope.DdlSourcePolicyType;
    $scope.PolicyDetails ;
    $scope.DeleteListLostDamageItem = [];
    $scope.DdlClaimCategoryWithCovers;
    $scope.ClaimCategoryWithCovers = [];
    $scope.PendingTaskList = [];
    $scope.SateList = [];
   
    function init()
    {
        $scope.CommonObject = {
            ClaimId: sessionStorage.getItem("ManagerScreenClaimId"),
            ClaimNo: sessionStorage.getItem("ManagerScreenClaimNo")
        };
        //get Policy Details      
        var policyNumber = {
            "policyNumber": sessionStorage.getItem("ManagerScreenpolicyNo").toString()
        };
        var response = ClaimCenterClaimDetailsService.getPolicyDetails(policyNumber);
        response.then(function (success) {  $scope.PolicyDetails = success.data.data; $scope.ClaimCategoryWithCovers = success.data.data.categories; }, function (error) { });

        //get Policy Type
        var response = ClaimCenterClaimDetailsService.getPolicyType();
        response.then(function (success) { $scope.DdlSourcePolicyType = success.data.data; }, function (error) { });

        //Get claim status details
        var paramClaimStatusDetails = {
            "claimId": sessionStorage.getItem("ManagerScreenClaimId").toString()
        };
        var response = ClaimCenterClaimDetailsService.GetClaimStatusDetails(paramClaimStatusDetails);
        response.then(function (success) {  $scope.ClaimStatusDetails = success.data.data; }, function (error) { });

        //get Lost Damage items
        var paramLostDamageList = {
            "claimId":sessionStorage.getItem("ManagerScreenClaimId").toString()
        };
        var response = ClaimCenterClaimDetailsService.getLostDamagedItemList(paramLostDamageList);
        response.then(function (success) {  $scope.LostDamagedItemList = success.data.data; }, function (error) { });

        //get Covergae Category
        var promiseGet = ClaimCenterClaimDetailsService.GetCategoriesHomeAppliance();
        promiseGet.then(function (success) { $scope.DdlClaimCategoryWithCovers = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        //get GetPendingTask for claim
        var paramUserTaskListList = {
            "claimId": sessionStorage.getItem("ManagerScreenClaimId").toString()
        };
        var GetPendingTaskPromise = ClaimCenterClaimDetailsService.GetPendingTask(paramUserTaskListList);
        GetPendingTaskPromise.then(function (success) { $scope.PendingTaskList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        //Get state List
        var Getstate = ClaimCenterClaimDetailsService.GetStateList();
        Getstate.then(function (success) { $scope.SateList = success.data.data; }, function () { $scope.SateList = []; $scope.ErrorMessage = error.data.errorMessage; });
    }
    init();

    $scope.GoBack = GoBack;
    function GoBack() {
        $location.url('ClaimCenterAllClaims');
    }

    //Add item in list of category of items
    $scope.CreateItemList = CreateItemList;
    function CreateItemList() {
        var flag = $filter('filter')($scope.ClaimCategoryWithCovers, { categoryId: $scope.CommonObject.ItemCategoryId });
        if (flag.length === 0 && $scope.CommonObject.ItemCategoryId !== null) {
            obj = $filter('filter')($scope.DdlClaimCategoryWithCovers, { categoryId: $scope.CommonObject.ItemCategoryId });
            $scope.ClaimCategoryWithCovers.push(obj[0]);
        }
    }

    //Remove Category from list (From Ui only)
    $scope.DeleteItemCategory = DeleteItemCategory;
    function DeleteItemCategory(item) {
        var index = $scope.ClaimCategoryWithCovers.indexOf(item);
        $scope.ClaimCategoryWithCovers.splice(index, 1);
    }

    $scope.RejectClaim = RejectClaim;
    function RejectClaim(e) {
        $scope.animationsEnabled = true;
        var paramClaimId = {
            "claimNumber": sessionStorage.getItem("ManagerScreenClaimNo").toString,
            "isApproved": false,
            "IsApprove": false,
            "IsReject": true
        }
        var out = $uibModal.open({
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

    $scope.ApproveClaim = ApproveClaim;
    function ApproveClaim(e) {
        var paramClaimId = {
            "claimNumber": sessionStorage.getItem("ManagerScreenClaimNo"),
            "isApproved": true
        };
        var response = RejectApproveClaimService.RejectOrApproveClaim(paramClaimId);
        response.then(function (success) {
            bootbox.alert({
                size: "", closeButton: false,
                title: $translate.instant('ClaimDetails_Approve.Title'),
                message: $translate.instant('ClaimDetails_Approve.Message'),
                className: "modalcustom",
                callback: function () { /* your callback code */ }
            });
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
       
    }

    $scope.SaveClaimDetails = SaveClaimDetails;
    function SaveClaimDetails(e) {       
        bootbox.alert({
            size: "", closeButton: false,
            title: $translate.instant('ClaimDetails_Save.Title'),
            message: $translate.instant('ClaimDetails_Save.Message'),
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }

    $scope.AssignClaimToAdjuster = AssignClaimToAdjuster;
    function AssignClaimToAdjuster(ev) {
        var obj = {
            "claimId": $scope.CommonObject.ClaimId,
            "claimStatusId": 4
        };
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

    // Create task list to cretae pending task
    $scope.dynamicPopover = {
        isOpen: false,
        html:true,
        templateUrl: "myPopoverTemplate.html",
        open: function open() {
            $("[data-toggle=popover]").popover();
        },
        close: function close() {
            debugger;
            // $scope.dynamicPopover.isOpen = false;
            $('[data-toggle=popover]').popover('hide');
        }
    };
    $scope.CreatePendingTasksObjList = [];
    $scope.StoreTaskObject = StoreTaskObject;
    function StoreTaskObject(taskSet)
    {
        $scope.CreatePendingTasksObjList = [];
        $scope.CreatePendingTasksObjList.push({
            "taskId": taskSet.taskId,
            "comment": taskSet.comment                           
        });       
    }
    //Create Pending task against claim
    $scope.CreatePendingtask = CreatePendingtask;
    function CreatePendingtask() {
        var param = {
            "claimId": sessionStorage.getItem("ManagerScreenClaimId").toString(),
            claimPendingTasks: $scope.CreatePendingTasksObjList
        };
       // $scope.dynamicPopover.close();
        var CreateTask = ClaimCenterClaimDetailsService.CreatePendingtask(param);
        CreateTask.then(function (success) { $scope.dynamicPopover.close(); }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
    //End Task 

    //Dropdown Policy type change event assign type to policy and fill dedutables and other field according to policy type
    $scope.AssignPolicyType = AssignPolicyType;
    function AssignPolicyType()
    {
        var policyObject = $filter('filter')($scope.DdlSourcePolicyType, { typeName: $scope.PolicyDetails.policyType });     
        $scope.PolicyDetails.policyCoverage = policyObject[0].coverageDetails.policyCoverage;   
        $scope.PolicyDetails.detuctables = policyObject[0].coverageDetails.deductible;     
        $scope.PolicyDetails.specialLimits = policyObject[0].coverageDetails.specialLimits;
        $scope.PolicyDetails.aggregateCoverage = policyObject[0].coverageDetails.aggregateCoverage;
     
        var b = policyObject[0].id;
       
        var obj = {
            "id": $scope.PolicyDetails.policyNumber,
            "policyTypeId": policyObject[0].id.toString
        };
     
        var promiseSetPolicyType = ClaimCenterClaimDetailsService.AssignPolicyType(obj);
        promiseSetPolicyType.then(function (success) {
          
            if(success.data.status==='200')
                $scope.ErrorMessage = "Policy type assign successfully..";
        }, function (error) {
         
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    //Lost damaged item Region
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.DeleteAllItems = DeleteAllItems;
    function DeleteAllItems() {
        $scope.DeleteListLostDamageItem = [];
        if ($scope.DeleteAll) {
            angular.forEach($scope.LostDamagedItemList, function (item) {               
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
   
    $scope.AddNewItem = AddNewItem;
    function AddNewItem(ev,item) {        
        $scope.animationsEnabled = true;        
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "/views/ClaimCenterManager/NewItemDamageLost.html",
                controller: "NewItemDamageLostController",
                resolve:
                {
                    items: function () {                       
                        return item;
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
   
    //Lost Damage Items 
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
                    var paramIdList = [];
                    angular.forEach($scope.DeleteListLostDamageItem, function (item) {
                        paramIdList.push({ "itemId": item })
                    });
                    var response = ClaimCenterClaimDetailsService.DeleteLostDamageItem(paramIdList);
                    response.then(function (success) { //Filter list and remove item
                        $scope.DeleteListLostDamageItem = [];
                        var paramLostDamageList = {
                            "claimId": sessionStorage.getItem("ManagerScreenClaimId").toString()
                        };
                        var response = ClaimCenterClaimDetailsService.getLostDamagedItemList(paramLostDamageList);
                        response.then(function (success) {$scope.LostDamagedItemList = success.data.data; }, function (error) { });
                    }, function (error) { });
                }
            }
        });
    }
 
});