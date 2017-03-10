//Store claimid in session object of sessionStorage.getItem("ManagerScreenClaimId")
angular.module('MetronicApp').controller('ClaimCenterPropertyFNOLRequestController', function ($scope, $rootScope, $translatePartialLoader, $translate, $filter,
    $uibModal, $location, PropertyFNOLRequestService, AssignClaimForManagerService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $('.datepicker').datepicker();
    $translatePartialLoader.addPart('ClaimCenterPropertyFNOLRequest');
    $translate.refresh();

    $scope.CellPhoneFirst; $scope.CellPhoneSecond; $scope.CellPhoneThird;
    $scope.DayPhoneFirst; $scope.DayPhoneSecond; $scope.DayPhoneThird;
    $scope.EveningPhoneFirst; $scope.EveningPhoneSecond; $scope.EveningPhoneThird;
    $scope.PolicyDetails = {};
    $scope.PolicyDetails.reportDate = new Date();
    $scope.DdlSourcePolicyType;
    $scope.ErrorMessage = "";
    $scope.DdlClaimCategoryWithCovers;
    $scope.ClaimCategoryWithCovers = [];
    // claimDetails object
    $scope.claimDetails = {};
    $scope.PolicyExists = "";
    $scope.DdlItemCatregoryList;
    $scope.DdlStateList = [];
    $scope.CommonObject = {
        Note: '',
        ClaimId: 533,
        claimStatusId: "4",
        PolicyType: '',
        ItemCategoryId: '',
        SearchItemCategory: "ALL"
    };
    $scope.SubCategory = [];

    $scope.LostDamagedItemList = [];
    $scope.FiletrLostDamageList = [];

    $scope.PolicyDetails.dt = $filter('date')(new Date(), "dd/MM/yyyy");
    //$scope.dt = Date.parse(new Date())
    $scope.ResetPhoneNumbers = ResetPhoneNumbers;
    function ResetPhoneNumbers() {
        $scope.CellPhoneFirst = null; $scope.CellPhoneSecond = null; $scope.CellPhoneThird = null;
        $scope.DayPhoneFirst = null; $scope.DayPhoneSecond = null; $scope.DayPhoneThird = null;
        $scope.EveningPhoneFirst = null; $scope.EveningPhoneSecond = null; $scope.EveningPhoneThird = null;
    }
       //Split Mobile number in three parts
    $scope.SplitPhoneNumber = SplitPhoneNumber;
    function SplitPhoneNumber(cell, Evening, Day) {
        if (angular.isDefined(cell) && cell !== null) {

            $scope.CellPhoneFirst = cell.substring(0, 4); $scope.CellPhoneSecond = cell.substring(4, 8); $scope.CellPhoneThird = cell.substring(8, 12);
        }
        if (angular.isDefined(Day) && Day !== null) {
            $scope.DayPhoneFirst = Day.substring(0, 4); $scope.DayPhoneSecond = Day.substring(4, 8); $scope.DayPhoneThird = Day.substring(8, 12);
        }
        if (angular.isDefined(Evening) && Evening !== null) {
            $scope.EveningPhoneFirst = Evening.substring(0, 4); $scope.EveningPhoneSecond = Evening.substring(4, 8); $scope.EveningPhoneThird = Evening.substring(8, 12);
        }
    }

    $scope.CreatePolicybutton = true;
    function init() {
        //Remove session value if any on page load
        sessionStorage.setItem("ManagerScreenClaimId", "");
        if (sessionStorage.getItem("ManagerScreenClaimId") === "")
            $scope.DisableAssignbtn = true;

        //Get ApplianceCategory with coveragre limit   API# 161
        var promiseGet = PropertyFNOLRequestService.GetCategoriesHomeAppliance();
        promiseGet.then(function (success) { $scope.DdlClaimCategoryWithCovers = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        //Get Policy Type #95
        var GetPolicyType = PropertyFNOLRequestService.getPolicyType();
        GetPolicyType.then(function (success) { $scope.DdlSourcePolicyType = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        //get Item Category #96
        var CategoryPromise = PropertyFNOLRequestService.GetItemCategory();
        CategoryPromise.then(function (success) { $scope.DdlItemCatregoryList = success.data.data; $scope.CategoryList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        //Get all the state #123
        var GetStatList = PropertyFNOLRequestService.GetState();
        GetStatList.then(function (success) { $scope.DdlStateList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

    }
    init();
   
    //Get policya and claim details  API# 184 ""P13PJJ64
    $scope.GetPolicyDetails = GetPolicyDetails;
    function GetPolicyDetails() {
        $scope.PolicyExists = "";
        if ((angular.isDefined($scope.PolicyDetails.policyNumber)) && ($scope.PolicyDetails.policyNumber !== null)) {
            var paramPolicyNO = {
                "policyNumber": $scope.PolicyDetails.policyNumber
            };

            var promisePost = PropertyFNOLRequestService.GetPolicyAndClaimDetails(paramPolicyNO);
            promisePost.then(function (success) {
                $scope.PolicyExists = "";
                $scope.CreatePolicybutton = false;
                $scope.PolicyDetails = success.data.data;
                $scope.ResetPhoneNumbers();
                if (success.data.data !== null) {
                    if (success.data.data.policyHolder !== null || angular.isUndefined(success.data.data.policyHolder)) {
                        $scope.SplitPhoneNumber(success.data.data.policyHolder.cellPhone, success.data.data.policyHolder.eveningTimePhone, success.data.data.policyHolder.dayTimePhone);
                        if ($scope.PolicyDetails.policyHolder.address === null) {
                            $scope.PolicyDetails.policyHolder.address = { "streetAddressOne": null, "streetAddressTwo": null, "city": null, "state": { id: null }, "zipcode": null };
                        }
                    }
                    $scope.ClaimCategoryWithCovers = success.data.data.categories;
                    $scope.GetDamageTypes();
                }
                else
                    $scope.PolicyExists = "Policy number does not exists. Create new policy.";
            }, function (error) {
                //Error Message
                $scope.PolicyExists = "Policy number does not exists. Create new policy.";
                $scope.CreatePolicybutton = true;
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }
        else {
            $scope.PolicyDetails.policyNumber = null;
            $scope.PolicyExists = "Please enter policy #.";
        }
    }

    //Get policy holder information on email
    $scope.GetPolicyHolderInfo = GetPolicyHolderInfo;
    function GetPolicyHolderInfo() {
        var param = { "email": $scope.PolicyDetails.policyHolder.email };
        var HolderDetails = PropertyFNOLRequestService.GetPolicyHolderDetails(param);
        HolderDetails.then(function (success) {
            $scope.PolicyDetails.policyHolder = success.data.data;
            if (success.data.data != null || (angular.isDefined(success.data.data))) {
                $scope.SplitPhoneNumber(success.data.data.cellPhone, success.data.data.eveningTimePhone, success.data.data.dayTimePhone);
                if ($scope.PolicyDetails.policyHolder.address === null) {
                    $scope.PolicyDetails.policyHolder.address = { "streetAddressOne": null, "streetAddressTwo": null, "city": null, "state": { id: null }, "zipcode": null };
                }
            }

        }, function (error) {
            $scope.ErrorMessage = error.data.message;
        })
    }
    //// Reset holder information if not found  on email
    //function ResetPolicyHolderInfo() {
    //    $scope.PolicyDetails.policyHolder.firstName = "";
    //    $scope.PolicyDetails.policyHolder.lastName = "";
    //    $scope.PolicyDetails.policyHolder.email = "";
    //    $scope.CellPhoneFirst = ""; $scope.CellPhoneSecond = ""; $scope.CellPhoneThird = "";
    //    $scope.EveningPhoneFirst = ""; $scope.EveningPhoneSecond = ""; $scope.EveningPhoneThird = "";
    //    $scope.DayPhoneFirst = ""; $scope.DayPhoneSecond = ""; $scope.DayPhoneThird = "";
    //    $scope.PolicyDetails.policyHolder.address.streetAddress = "";
    //    $scope.PolicyDetails.policyHolder.address.city = "";
    //    $scope.PolicyDetails.policyHolder.address.state.id = "";
    //    $scope.PolicyDetails.policyHolder.address.zipcode = "";
    //}
    //Assign Claim to adjuster
    $scope.AssignClaimToAdjuster = AssignClaimToAdjuster;
    function AssignClaimToAdjuster(ev) {
        var obj = {
            //On claimid genertaion pass it 
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

    
    //Images Of Incident
    $scope.IncidentImages = []
    $scope.ShowIncidentImages = ShowIncidentImages;
    function ShowIncidentImages() {

    }

    //Lost Damge items section
    //Filter Item Category wise
    $scope.FilterLostDamageOnCategory = FilterLostDamageOnCategory;
    function FilterLostDamageOnCategory() {
        if (($scope.CommonObject.SearchItemCategory === "ALL") || (angular.isUndefined($scope.CommonObject.SearchItemCategory) || $scope.CommonObject.SearchItemCategory === null))
            $scope.FiletrLostDamageList = $scope.LostDamagedItemList;
        else
            $scope.FiletrLostDamageList = $filter('filter')($scope.LostDamagedItemList, { categoryName: $scope.CommonObject.SearchItemCategory });
    }

    //Inline Edit show
    $scope.selected = {};
    $scope.AddNewItem = false;
    $scope.AddNewItemToList = AddNewItemToList;
    function AddNewItemToList() {
        if ($scope.DisableAssignbtn === false) {
            $scope.selected = {};
            $scope.AddNewItem = true;
        }
        else {
            bootbox.alert({
                size: "", closeButton: false,
                title: $translate.instant('AddItemWarning.Title'),
                message: $translate.instant('AddItemWarning.Message'),
                className: "modalcustom",
                callback: function () { /* your callback code */ }
            });
        }
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
        var CategoryPromise = PropertyFNOLRequestService.GetItemCategory();
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
            var UpdatePostLoss = PropertyFNOLRequestService.UpdatePostLoss(param);
            UpdatePostLoss.then(function (success) {
                angular.copy(MakeObjectToAddInList(success), $scope.FiletrLostDamageList[idx]);
                $scope.LostDamagedItemList = $filter('filter')($scope.LostDamagedItemList, { itemId: success.data.data.id });
                if ($scope.LostDamagedItemList.length > 0)
                    angular.copy(MakeObjectToAddInList(success), $scope.LostDamagedItemList[0]);
                $scope.reset();
            },
            function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
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
                    "claimId": sessionStorage.getItem("ManagerScreenClaimId"),//Need to pass the claimId
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
            var SavePostLossItem = PropertyFNOLRequestService.AddPostLossItem(param);
            SavePostLossItem.then(function (success) {
                //Need to pass the ItemId which will generate after inserting item  
                if ($scope.FiletrLostDamageList !== null)
                    $scope.FiletrLostDamageList.splice(0, 0, MakeObjectToAddInList(success));
                $scope.reset();
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }
        $scope.reset();
    };
    $scope.reset = function () {
        $scope.AddNewItem = false;
        $scope.selected = {};
    };
    //Get Lost/ damage items
    function GetLostDamageItem() {
        //Get Lost Damage Item   API #78   Pass Claim Id after saving the claim details and policy details
        var ParamClaimId = {
            "claimId": sessionStorage.getItem("ManagerScreenClaimId")
        };
        var GetLostItem = PropertyFNOLRequestService.getPostLostItems(ParamClaimId);
        GetLostItem.then(function (success) {

            $scope.LostDamagedItemList = success.data.data;
            $scope.FiletrLostDamageList = success.data.data;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
            $scope.LostDamagedItemList = [];
        });
    }
    //Filter Loast Damage items
    $scope.FilterLostDamageItems = FilterLostDamageItems;
    function FilterLostDamageItems() {
        if (($scope.CommonObject.SearchItemCategory === "ALL") || (angular.isUndefined($scope.CommonObject.SearchItemCategory) || $scope.CommonObject.SearchItemCategory === null)) {
            $scope.FiletrLostDamageList = $scope.LostDamagedItemList;
        }
        else {
            $scope.FiletrLostDamageList = $filter('filter')($scope.LostDamagedItemList, { categoryName: $scope.CommonObject.SearchItemCategory });
        }
    }


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
                    var response = PropertyFNOLRequestService.DeleteLostDamageItem(paramIdList);
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
    //End lost damage

    $scope.GoBack = GoBack;
    function GoBack() {
        $location.url('ManagerDashboard');
    }

    //Create Policy and get damage types

    $scope.createPolicy = createPolicy;
    function createPolicy() {
        var Policydata = {
            "homeOwnerPolicyTypeId": $scope.PolicyDetails.homeOwnerPolicyTypeId,
            "policyCoverage": $scope.PolicyDetails.policyCoverage,
            "aggregateCoverage": $scope.PolicyDetails.aggregateCoverage,
            "specialLimits": $scope.PolicyDetails.specialLimits,
            "detuctables": $scope.PolicyDetails.detuctables,
            "policyType": $scope.PolicyDetails.policyType,
            "policyName": null,
            "companyId": sessionStorage.getItem("CompanyId"),
            "agentId": sessionStorage.getItem("UserId"),
            "policyHolder": {
                "firstName": $scope.PolicyDetails.policyHolder.firstName,
                "lastName": $scope.PolicyDetails.policyHolder.lastName,
                "email": $scope.PolicyDetails.policyHolder.email,
                "cellPhone": $scope.CellPhoneFirst + $scope.CellPhoneSecond + $scope.CellPhoneThird,
                "eveningTimePhone": $scope.EveningPhoneFirst + $scope.EveningPhoneSecond + $scope.EveningPhoneThird,
                "dayTimePhone": $scope.DayPhoneFirst + $scope.DayPhoneSecond + $scope.DayPhoneThird,
                "insuranceNumber": null,
                "address": {
                    "streetAddress": $scope.PolicyDetails.policyHolder.address.streetAddress,
                    "city": $scope.PolicyDetails.policyHolder.address.city,
                    "state": {
                        "id": $scope.PolicyDetails.policyHolder.address.state.id
                    },
                    "zipcode": $scope.PolicyDetails.policyHolder.address.zipcode
                }
            }
        };
        var promiseCreatePolicy = PropertyFNOLRequestService.createHomePolicy(Policydata);
        promiseCreatePolicy.then(function (success) {
            $scope.PolicyDetails.policyNumber = success.data.data.policyNumber;
            // Hide create policy button
            $scope.CreatePolicybutton = false;
            $scope.GetDamageTypes();
            bootbox.alert({
                size: "", closeButton: false,
                title: "Policy creation",
                // message: $translate.instant('FNOL_Save.Message'),
                message: 'Policy created successfully.',
                className: "modalcustom",
                callback: function () { /* your callback code */ }
            });
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
            bootbox.alert({
                size: "", closeButton: false,
                title: "Policy creation",
                // message: $translate.instant('FNOL_Save.Message'),
                message: $scope.ErrorMessage,
                className: "modalcustom",
                callback: function () { /* your callback code */ }
            });

        });
    }
    //end
    //Get damage types
    $scope.DamageTypesList = [];
    $scope.GetDamageTypes = GetDamageTypes;
    function GetDamageTypes() {
        var policyNoparam = {
            "policyNumber": $scope.PolicyDetails.policyNumber
        };
        var GetDamageTypes = PropertyFNOLRequestService.getDamageType(policyNoparam);
        GetDamageTypes.then(function (success) { $scope.DamageTypesList = success.data.data; }, function (error) { $scope.DamageTypesList = null; });
    }

    //Set question on damage type
    $scope.SetQuestionForDamageType = SetQuestionForDamageType;
    function SetQuestionForDamageType() {
        $scope.SeletedDamageTypeObject = $filter('filter')($scope.DamageTypesList, { id: $scope.claimDetails.damageTypeId });
        $scope.QuestionList = $scope.SeletedDamageTypeObject[0].questions;
    }
    //end damage type

    $scope.GetSubCategory = GetSubCategory;
    function GetSubCategory() {
        var param = {
            "categoryId": $scope.selected.categoryId
        };
        var respGetSubCategory = PropertyFNOLRequestService.GetSubCategory(param);
        respGetSubCategory.then(function (success) { $scope.SubCategory = success.data.data; }, function (error) { $scope.SubCategory = null; $scope.ErrorMessage = error.data.errorMessage });

    }

    //Save Claim with Report Details
    $scope.SaveClaimReportDetails = SaveClaimReportDetails;
    function SaveClaimReportDetails() {
        $scope.claimDetails.policyCategoryCoverages = [];
        angular.forEach($scope.ClaimCategoryWithCovers, function (item) {
            $scope.claimDetails.policyCategoryCoverages.push({ "categoryId": item.categoryId, "coverageLimit": item.coverageLimit });
        });

        var IsACV; var IsRCV;
        if (angular.isUndefined($scope.claimDetails.isRCV))
            IsRCV = false;
        else
            IsRCV = true;

        if (angular.isUndefined($scope.claimDetails.isACV))
            IsACV = false;
        else
            IsACV = true;

        var ClaimandReportDetails = new FormData();
        ClaimandReportDetails = {
            filesDetails:null,
                    //[{
                    //    "fileName": "", "fileType": "IMAGE",
                    //    "extension": ".png",
                    //    "filePurpose": "CLAIM", "latitude": 41.403528, "longitude": 2.173944,
                    //    "footNote": "This is the testing text to test the image note and its description"
                    //},
                    //],
            claimDetails:JSON.stringify( {
                "claimNumber": $scope.claimDetails.claimNumber, "policyNumber": $scope.PolicyDetails.policyNumber,
                "claimType": $scope.PolicyDetails.claimType, "taxRate": $scope.claimDetails.taxRate,
                "damageTypeId": $scope.claimDetails.damageTypeId, "incidentDate": $scope.PolicyDetails.incidentDate,
                "incidentDescription": $scope.PolicyDetails.incidentDescription,
                "isACV": IsACV, "isRCV": IsRCV,
                "policyCategoryCoverages": $scope.claimDetails.policyCategoryCoverages,
                "claimNote": $scope.claimDetails.claimNote,
                "questions": $scope.QuestionList,
            }),
            file: null
        }
        //Save details
        var SaveDetails = PropertyFNOLRequestService.SaveClaimandReportDetails(ClaimandReportDetails);
        SaveDetails.then(function (success) {
            debugger;
            $scope.DisableAssignbtn = false;
            bootbox.alert({
                size: "", closeButton: false,
                title: $translate.instant('FNOL_Save.Title'),
                message: $translate.instant('FNOL_Save.Message'),
                className: "modalcustom",
                callback: function () { /* your callback code */ }
            });
        }, function (error) { debugger; $scope.ErrorMessage = error.data.errorMessage; });
    }

    //upload image
    //$scope.uploadImage = uploadImage;
    //function uploadImage(event) {
    //    debugger;
    //    var files = event.target.files;
    //    for (var i = 0; i < files.length; i++) {
    //        var file = files[i];
    //        var reader = new FileReader();
    //        reader.onload = $scope.imageIsLoaded;
    //        reader.readAsDataURL(file);
    //    }       
    //}
    //$scope.imageIsLoaded = function (e) {
    //    debugger;
    //    $scope.$apply(function () {
    //        $scope.IncidentImages.push(e.target.result);
    //    });
    //}
});
