angular.module('MetronicApp').controller('ClaimCenter-ClaimDetailsController', function ($filter, $translate, ClaimCenterClaimDetailsService, $translatePartialLoader, $rootScope,
   $uibModal, $scope, settings, $location, AssignClaimForManagerService, RejectApproveClaimService, $sce) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('ClaimCenter-ClaimDetails');
    $translate.refresh();

    //Stored Claim StatusId And ClaimId   
    $scope.CommonObject = {
        ClaimId: sessionStorage.getItem("ManagerScreenClaimId"),
        ClaimNo: sessionStorage.getItem("ManagerScreenClaimNo"),
        ItemCategoryId: ""
    };
    $scope.ErrorMessage = "";
    $scope.ClaimStatusDetails;
    $scope.DdlSourcePolicyType;
    $scope.PolicyDetails;
    $scope.DeleteListLostDamageItem = [];
    $scope.DdlClaimCategoryWithCovers;
    $scope.ClaimCategoryWithCovers = [];
    $scope.PendingTaskList = [];
    $scope.stateList = [];

    $scope.LostDamagedItemList = [];
    $scope.FiletrLostDamageList = [];

    //Split Mobile number in three parts
    $scope.SplitPhoneNumber = SplitPhoneNumber;
    function SplitPhoneNumber(cell, Evening, Day) {
        if (angular.isDefined(cell)) {
            $scope.CellPhoneFirst = cell.substring(0, 4); $scope.CellPhoneSecond = cell.substring(4, 8); $scope.CellPhoneThird = cell.substring(8, 12);
        }
        if (angular.isDefined(Day)) {
            $scope.DayPhoneFirst = Day.substring(0, 4); $scope.DayPhoneSecond = Day.substring(4, 8); $scope.DayPhoneThird = Day.substring(8, 12);
        }
        if (angular.isDefined(Evening)) {
            $scope.EveningPhoneFirst = Evening.substring(0, 4); $scope.EveningPhoneSecond = Evening.substring(4, 8); $scope.EveningPhoneThird = Evening.substring(8, 12);
        }
    }
    init();
    function init() {
        $scope.selected = {};
        $scope.AddNewItem = false;


        $scope.CommonObject = {
            ClaimId: sessionStorage.getItem("ManagerScreenClaimId"),
            ClaimNo: sessionStorage.getItem("ManagerScreenClaimNo"),
            SearchItemCategory: "ALL"
        };
        //get Policy Details      
        var policyNumber = {
            "policyNumber": sessionStorage.getItem("ManagerScreenpolicyNo").toString()
        };

        var response = ClaimCenterClaimDetailsService.getPolicyDetails(policyNumber);
        response.then(function (success) {
            $scope.PolicyDetails = success.data.data;
            if (success.data.data !== null) {
                if (success.data.data.policyHolder !== null) {
                    if ($scope.PolicyDetails.policyHolder.address === null) {
                        $scope.PolicyDetails.policyHolder.address = { "streetAddressOne": null, "streetAddressTwo": null, "city": null, "state": { id: null }, "zipcode": null };
                    }
                    $scope.ClaimCategoryWithCovers = success.data.data.categories;
                    $scope.SplitPhoneNumber(success.data.data.policyHolder.cellPhone, success.data.data.policyHolder.eveningTimePhone, success.data.data.policyHolder.dayTimePhone);
                }
            }
        }, function (error) { });

        //get Policy Type
        var response = ClaimCenterClaimDetailsService.getPolicyType();
        response.then(function (success) { $scope.DdlSourcePolicyType = success.data.data; }, function (error) { });

        //Get claim status details
        var paramClaimStatusDetails = {
            "claimId": sessionStorage.getItem("ManagerScreenClaimId").toString()
        };
        var response = ClaimCenterClaimDetailsService.GetClaimStatusDetails(paramClaimStatusDetails);
        response.then(function (success) { $scope.ClaimStatusDetails = success.data.data; }, function (error) { });

        //get Lost Damage items
        var paramLostDamageList = {
            "claimId": sessionStorage.getItem("ManagerScreenClaimId").toString()
        };

        var response = ClaimCenterClaimDetailsService.getLostDamagedItemList(paramLostDamageList);
        response.then(function (success) {
            $scope.LostDamagedItemList = success.data.data;
            $scope.FiletrLostDamageList = success.data.data;
        }, function (error) { });

        //get Covergae Category
        var promiseGet = ClaimCenterClaimDetailsService.GetCategoriesHomeAppliance();
        promiseGet.then(function (success) { $scope.DdlClaimCategoryWithCovers = success.data.data; },
            function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });

        //get GetPendingTask for claim
        var paramUserTaskListList = {
            "claimId": sessionStorage.getItem("ManagerScreenClaimId").toString()
        };
        var GetPendingTaskPromise = ClaimCenterClaimDetailsService.GetPendingTask(paramUserTaskListList);
        GetPendingTaskPromise.then(function (success) { $scope.PendingTaskList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        //Get state List
        var Getstate = ClaimCenterClaimDetailsService.GetStateList();
        Getstate.then(function (success) { $scope.stateList = success.data.data; }, function () { $scope.stateList = []; $scope.ErrorMessage = error.data.errorMessage; });
        //category
        var CategoryPromise = ClaimCenterClaimDetailsService.GetCategoriesHomeAppliance();
        CategoryPromise.then(function (success) { $scope.CategoryList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });


    }

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
                if (value === "Success") {

                }

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
        html: true,
        templateUrl: "myPopoverTemplate.html",
        open: function open() {
            $scope.dynamicPopover.isOpen = true;
            // $("[data-toggle=popover]").popover();
        },
        close: function close() {
            $scope.dynamicPopover.isOpen = false;

        }
    };
    $scope.CreatePendingTasksObjList = [];
    $scope.StoreTaskObject = StoreTaskObject;
    function StoreTaskObject(taskSet) {
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
    function AssignPolicyType() {
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
            if (success.data.status === '200')
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

    //Filter Loast Damage items
    $scope.FilterLostDamageItems = FilterLostDamageItems;
    function FilterLostDamageItems() {
        debugger;
        if (($scope.CommonObject.SearchItemCategory === "ALL") || (angular.isUndefined($scope.CommonObject.SearchItemCategory) || $scope.CommonObject.SearchItemCategory === null)) {
            debugger; $scope.FiletrLostDamageList = $scope.LostDamagedItemList;
        }
        else {
            debugger; $scope.FiletrLostDamageList = $filter('filter')($scope.LostDamagedItemList, { categoryName: $scope.CommonObject.SearchItemCategory });
        }
    }

    $scope.GetSubCategory = GetSubCategory;
    function GetSubCategory() {
        var param = {
            "categoryId": $scope.selected.categoryId
        };
        var respGetSubCategory = ClaimCenterClaimDetailsService.GetSubCategory(param);
        respGetSubCategory.then(function (success) { $scope.SubCategory = success.data.data; }, function (error) { $scope.SubCategory = null; $scope.ErrorMessage = error.data.errorMessage });

    }


    $scope.AddNewItemToList = AddNewItemToList;
    function AddNewItemToList() {
        $scope.selected = {};
        $scope.AddNewItem = true;
    }
    $scope.CancelAddNewItem = CancelAddNewItem;
    function CancelAddNewItem() {
        $scope.AddNewItem = false;
    }
    $scope.getTemplate = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.itemId === $scope.selected.itemId) return 'edit';
            else
                return 'display';
        }
        else
            return 'display';
    };
    $scope.EditItemDetails = function (item) {
        $scope.AddNewItem = false;
        $scope.selected = {};
        $scope.selected = angular.copy(item);
        //get Item Category #96
        var CategoryPromise = ClaimCenterClaimDetailsService.GetCategoriesHomeAppliance();
        CategoryPromise.then(function (success) { $scope.CategoryList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });


        $scope.GetSubCategory();
    };
    $scope.SaveItemDetails = function (idx) {

        if (!angular.isUndefined(idx)) {
            // Find index and then save it in main list  $scope.LostDamagedItemList[idx] = angular.copy($scope.selected);
            //  Shedule=selected.scheduled  age two parameter is missing
            var param = new FormData();
            param.append('filesDetails', null);
            param.append("itemDetails",
                JSON.stringify(
                 {
                     "id": $scope.selected.itemId,
                     "acv": null, "adjusterDescription": null, "brand": $scope.selected.brand, "category": { "id": $scope.selected.categoryId },
                     "dateOfPurchase": $scope.selected.dateOfPurchase, "depriciationRate": null, "description": $scope.selected.description,
                     "holdOverValue": null, "itemName": $scope.selected.itemName, "model": $scope.selected.model,
                     "quotedPrice": $scope.selected.price, "rcv": null, "subCategory": { "id": $scope.selected.subCategoryId },
                     "taxRate": null, "valueOfItem": null, "yearOfManufecturing": null, "status": { "id": $scope.selected.statusId },
                     "isScheduledItem": $scope.selected.scheduled, "age": $scope.selected.age
                 }
                ));
            param.append('file', null);
            var UpdatePostLoss = ClaimCenterClaimDetailsService.UpdatePostLoss(param);
            UpdatePostLoss.then(function (success) {
                angular.copy(MakeObjectToAddInList(success), $scope.FiletrLostDamageList[idx]);
                $scope.LostDamagedItemList = $filter('filter')($scope.LostDamagedItemList, { itemId: success.data.data.id });
                if ($scope.LostDamagedItemList.length > 0)
                    angular.copy(MakeObjectToAddInList(success), $scope.LostDamagedItemList[0]);
                $scope.reset();
            },
            function (error)
            { $scope.ErrorMessage = error.data.errorMessage; });
        }
        else {//Call Api save And get its id then assign id and pass 
            var param = new FormData();
            param.append('filesDetails', null);
            param.append("itemDetails",
                JSON.stringify({
                    "acv": null,
                    "adjusterDescription": null,
                    "assignedTo": {
                        "id": null
                    },
                    "brand": $scope.selected.brand,
                    "category": {
                        "id": $scope.selected.categoryId
                    },
                    "dateOfPurchase": null,
                    "depriciationRate": null,
                    "description": $scope.selected.description,
                    "holdOverValue": null,
                    "claimId": sessionStorage.getItem("ManagerScreenClaimId").toString(),//Need to pass the claimId
                    "itemName": $scope.selected.itemName,
                    "model": $scope.selected.model,
                    "paymentDetails": null,
                    "quotedPrice": $scope.selected.price,
                    "rcv": null,
                    "subCategory": {
                        "id": $scope.selected.subCategoryId
                    },
                    "taxRate": null,
                    "totalTax": null,
                    "valueOfItem": null,
                    "yearOfManufecturing": null,
                    "status": {
                        "id": null,
                        "status": null
                    },
                    "isScheduledItem": $scope.selected.scheduled,
                    "age": $scope.selected.age
                }
                ));
            param.append('file', null);
            var SavePostLossItem = ClaimCenterClaimDetailsService.AddPostLossItem(param);
            SavePostLossItem.then(function (success) {
                //Need to pass the ItemId which will generate after inserting item       
                if ($scope.FiletrLostDamageList !== null)
                    $scope.FiletrLostDamageList.splice(0, 0, MakeObjectToAddInList(success));
                $scope.reset();
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }

    };
    $scope.reset = function () {
        $scope.AddNewItem = false;
        $scope.selected = {};
    };

    //Make object to be add or replace after save or edit item details
    function MakeObjectToAddInList(success) {
        return {
            "itemId": success.data.data.id,
            "itemName": success.data.data.itemName,
            "itemPrice": null,
            "collection": null,
            "images": [],
            "quantity": null,
            "dateOfPurchase": success.data.data.dateOfPurchase,
            "category": null,
            "rooms": null,
            "currentValue": null,
            "brand": success.data.data.brand,
            "model": success.data.data.model,
            "description": success.data.data.description,
            "roomId": null,
            "collectionId": null,
            "price": success.data.data.quotedPrice,
            "categoryId": success.data.data.category.id,
            "categoryName": GetCategoryOrSubCategoryOnId(true, success.data.data.category.id),
            "subCategoryId": success.data.data.subCategory.id,
            "subCategoryName": GetCategoryOrSubCategoryOnId(false, success.data.data.subCategory.id),
            "templateType": null,
            "itemWorth": 0,
            "policyNumber": null,
            "appraisalValue": null,
            "productSerialNo": null,
            "imageId": null,
            "jwelleryTypeId": null,
            "jwelleryType": null,
            "claimed": false,
            "claimId": success.data.data.claimId,
            "vendorId": null,
            "age": success.data.data.age,
            "status": null,
            "statusId": success.data.data.statusId,
            "itemCategory": null,
            "contact": null,
            "notes": null,
            "additionalInfo": null,
            "approved": false,
            "scheduled": success.data.data.isScheduledItem
        }
    }
    //get Category name on category id for showing in grid of post loss itemd
    function GetCategoryOrSubCategoryOnId(OpertionFlag, id) {
        if (OpertionFlag) {
            var list = $filter('filter')($scope.CategoryList, { categoryId: id });
            return list[0].categoryName;
        }
        else {
            var list = $filter('filter')($scope.SubCategory, { id: id });
            return list[0].name;
        }
    }

    //Lost Damage Items 
    $scope.DeletItem = DeletItem;
    function DeletItem(obj) {
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
                    paramIdList.push({ "itemId": obj.itemId })
                    var response = ClaimCenterClaimDetailsService.DeleteLostDamageItem(paramIdList);
                    response.then(function (success) { //Filter list and remove item                      
                        var index = $scope.FiletrLostDamageList.indexOf(obj);
                        if (index > -1) {
                            $scope.FiletrLostDamageList.splice(index, 1);
                        }
                    }, function (error) { });
                }
            }
        });
    }

    //Save policy details
    $scope.SavePolicyDetails = SavePolicyDetails;
    function SavePolicyDetails() {
        var policytypeObject = $filter('filter')($scope.DdlSourcePolicyType, { typeName: $scope.PolicyDetails.policyType });
        var PolicyTypeId = policytypeObject[0].id;
        var PolicyDetailsParam = {
            "policyNumber": $scope.PolicyDetails.policyNumber,
            "homeOwnerPolicyTypeId": PolicyTypeId,
            "policyCoverage": $scope.PolicyDetails.policyCoverage,
            "aggregateCoverage": $scope.PolicyDetails.aggregateCoverage,
            "specialLimits": $scope.PolicyDetails.specialLimits,
            "detuctables": $scope.PolicyDetails.detuctables,
            "policyType": "HOME",
            "policyName": "UPDATED POLICY For Testing",
            "companyId": sessionStorage.getItem("CompanyId"),
            "agentId": sessionStorage.getItem("UserId"),
            "policyHolder": {
                "firstName": $scope.PolicyDetails.policyHolder.firstName,
                "lastName": $scope.PolicyDetails.policyHolder.lastName,
                "email": $scope.PolicyDetails.policyHolder.email,
                "cellPhone": $scope.CellPhoneFirst + $scope.CellPhoneSecond + $scope.CellPhoneThird,
                "eveningTimePhone": $scope.EveningPhoneFirst + $scope.EveningPhoneSecond + $scope.EveningPhoneThird,
                "dayTimePhone": $scope.DayPhoneFirst + $scope.DayPhoneSecond + $scope.DayPhoneThird,
                "insuranceNumber": "5354367546785",
                "address": {
                    "streetAddressOne": $scope.PolicyDetails.policyHolder.address.streetAddressOne,
                    "streetAddressTwo": $scope.PolicyDetails.policyHolder.address.streetAddressTwo,
                    "city": $scope.PolicyDetails.policyHolder.address.city,
                    "state": {
                        "id": $scope.PolicyDetails.policyHolder.address.state.id
                    },
                    "zipcode": $scope.PolicyDetails.policyHolder.address.zipcode
                }
            }
        }
        var SavePolicyDetailsPromise = ClaimCenterClaimDetailsService.SavePolicy(PolicyDetailsParam);
        SavePolicyDetailsPromise.then(function (success) {
            var CategoryWithCoverages = [];
            angular.forEach($scope.ClaimCategoryWithCovers, function (item) {
                CategoryWithCoverages.push({
                    "categoryId": item.categoryId,
                    "categoryLimit": item.coverageLimit
                });
            });
            var ParamCategoryCoverage = {
                "policyNumber": $scope.PolicyDetails.policyNumber,
                "categoryList": CategoryWithCoverages
            };
            var SaveCategoryCoverage = ClaimCenterClaimDetailsService.AlterCategoryCoverage(ParamCategoryCoverage);
            SaveCategoryCoverage.then(function (success) {
                bootbox.alert({
                    size: "", closeButton: false,
                    title: $translate.instant('ClaimDetails_Save.Title'),
                    message: $translate.instant('ClaimDetails_Save.Message'),
                    className: "modalcustom",
                    callback: function () { /* your callback code */ }
                });
            }, function (error) { });
        }, function (error) {
            if (error.data !== null) {
                bootbox.alert({
                    size: "", closeButton: false,
                    title: "Policy update",
                    // message: $translate.instant('FNOL_Save.Message'),
                    message: error.data.errorMessage,
                    className: "modalcustom",
                    callback: function () { /* your callback code */ }
                });
            }
        });
    }
});