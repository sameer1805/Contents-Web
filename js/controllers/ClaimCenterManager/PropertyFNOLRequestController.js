angular.module('MetronicApp').controller('ClaimCenterPropertyFNOLRequestController', function ($scope, $rootScope, $translatePartialLoader,  $translate,$filter,
    $uibModal, $location, PropertyFNOLRequestService, AssignClaimForManagerService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $('.datepicker').datepicker();    
    $translatePartialLoader.addPart('ClaimCenterPropertyFNOLRequest');
    $translate.refresh();
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  
    $scope.PolicyDetails = {};
    $scope.DdlSourcePolicyType;
    
    $scope.ErrorMessage = "";
    $scope.DdlClaimCategoryWithCovers;
    $scope.ClaimCategoryWithCovers = [];
    $scope.LostDamagedItemList = [];
    $scope.FiletrLostDamageList = [];
    $scope.PolicyExists = "";
    $scope.DdlItemCatregoryList;
    $scope.DdlStateList=[];
    $scope.CommonObject = {
        Note: '',
        ClaimId: 533,
        claimStatusId: "4",
        PolicyType: '',
        ItemCategoryId: '',
        SearchItemCategory:''
    };
    $scope.PolicyDetails.dt = $filter('date')(new Date(), "dd/MM/yyyy");
  //  $scope.dt = Date.parse(new Date())
    $scope.DisableAssignbtn = true;
    $scope.CreatePolicybutton = true;
    function init()
    {        
        //Get ApplianceCategory with coveragre limit   API# 161
        var promiseGet = PropertyFNOLRequestService.GetCategoriesHomeAppliance();
        promiseGet.then(function (success) {  $scope.DdlClaimCategoryWithCovers = success.data.data; }, function (error) {  $scope.ErrorMessage = error.data.errorMessage; });
       
        //Get Policy Type #95
        var GetPolicyType = PropertyFNOLRequestService.getPolicyType();
        GetPolicyType.then(function (success) {  $scope.DdlSourcePolicyType = success.data.data; }, function (error) {  $scope.ErrorMessage = error.data.errorMessage; });

        //get Item Category #96
        var CategoryPromise = PropertyFNOLRequestService.GetItemCategory();
        CategoryPromise.then(function (success) {  $scope.DdlItemCatregoryList = success.data.data; }, function (error) {  $scope.ErrorMessage = error.data.errorMessage; });

        //Get all the state #123
        var GetStatList = PropertyFNOLRequestService.GetState();
        GetStatList.then(function (success) {  $scope.DdlStateList = success.data.data; }, function (error) {  $scope.ErrorMessage = error.data.errorMessage; });
    }

    init();

    function GetLostDamageItem()
    {
        //Get Lost Damage Item   API #78   Pass Claim Id after saving the claim details and policy details
        var ParamClaimId = {
            "claimId": 482
        };
        var GetLostItem = PropertyFNOLRequestService.getPostLostItems(ParamClaimId);
        GetLostItem.then(function (success) { //$scope.LostDamagedItemList = success.data.data;
            $scope.LostDamagedItemList = [];
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }

    //Get policya and claim details  API# 184 ""P13PJJ64
    $scope.GetPolicyDetails = GetPolicyDetails;   
    function GetPolicyDetails()
    {
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
                $scope.ClaimCategoryWithCovers = success.data.data.categories;
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
    //Add Note 
    $scope.AddNote = AddNote;
    function AddNote() {       
        var paramNote = {
            "claimId": $scope.CommonObject.ClaimId,
            "incidentNote": $scope.CommonObject.Note
        };//API 66
        var promisePost = PropertyFNOLRequestService.AddNote(paramNote);
        promisePost.then(function (pl) { 
                $scope.data = pl.data.status;
        }, function (errorPl) {
          
            //Error Message
        });
    }
   
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
    //New Property Claim
    $scope.RaiseNewPropertyClaim = RaiseNewPropertyClaim;
    function RaiseNewPropertyClaim()
    {
        var CalimParam = {};
        var promisePost = PropertyFNOLRequestService.RaiseNewPropertyClaim(CalimParam);
        promisePost.then(function (success) {}, function (errorPl) {
            //Error Message
        });

    }

    //New Auto Claim
    $scope.RaiseNewAutoClaim = RaiseNewAutoClaim;
    function RaiseNewAutoClaim(){
        var CalimParam = {};
        var promisePost = PropertyFNOLRequestService.RaiseNewAutoClaim(CalimParam);
        promisePost.then(function (Success) {
           
        }, function (error) {

            //Error Message
        });
    }

    //Update Claim Status
    $scope.UpdateClaimStatus = UpdateClaimStatus;
    function UpdateClaimStatus()
    {
        var ParamStatusClaim = {
            "claimId": $scope.CommonObject.ClaimId,
            "claimStatusId": $scope.CommonObject.claimStatusId
        };      
        var promisePost = PropertyFNOLRequestService.UpdateClaimStatus(ParamStatusClaim);
        promisePost.then(function (success) {
            if(success.data.status==='200')
            {               
                $scope.ErrorMessage = "Claim status updated successfully";
            }
        }, function (error) {          
            $scope.ErrorMessage = error.data.errorMessage;
            //Error Message
        });
    }

    //Add item in list of category of items
    $scope.CreateItemList = CreateItemList;
    function CreateItemList()
    {
        var flag = $filter('filter')($scope.ClaimCategoryWithCovers, { categoryId: $scope.CommonObject.ItemCategoryId });
        if (flag.length === 0 && $scope.CommonObject.ItemCategoryId!==null) {
            obj = $filter('filter')($scope.DdlClaimCategoryWithCovers, { categoryId: $scope.CommonObject.ItemCategoryId });
            $scope.ClaimCategoryWithCovers.push(obj[0]);         
        }       
    }

    //Remove Category fro list (From Ui only)
    $scope.DeleteItemCategory = DeleteItemCategory;
    function DeleteItemCategory(item)
    {
        var index =  $scope.ClaimCategoryWithCovers.indexOf(item);
        $scope.ClaimCategoryWithCovers.splice(index, 1);       
    }

    //Filter Item Category wise
    $scope.FilterLostDamageOnCategory = FilterLostDamageOnCategory;
    function FilterLostDamageOnCategory()
    {
        if (($scope.CommonObject.SearchItemCategory === "ALL") || (angular.isUndefined($scope.CommonObject.SearchItemCategory) || $scope.CommonObject.SearchItemCategory === null))
            $scope.FiletrLostDamageList = $scope.LostDamagedItemList;
        else
            $scope.FiletrLostDamageList = $filter('filter')($scope.LostDamagedItemList, { categoryName: $scope.CommonObject.SearchItemCategory });
    }

    //Images Of Incident
    $scope.IncidentImages=[1,2,3,4]
    $scope.ShowIncidentImages = ShowIncidentImages;
    function ShowIncidentImages()
    {
       
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

    $scope.GoBack = GoBack;
    function GoBack() {
        $location.url('ManagerDashboard');
    }
    //Create Policy
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
            "companyId":  sessionStorage.getItem("CompanyId"),
            "agentId": sessionStorage.getItem("UserId"),
                "policyHolder":{
                    "firstName": $scope.PolicyDetails.policyHolder.firstName,
                    "lastName": $scope.PolicyDetails.policyHolder.lastName,
                    "email": $scope.PolicyDetails.policyHolder.email
                }           
        };
        //cellPhone eveningTimePhone dayTimePhone address
        debugger;
        var promiseCreatePolicy = PropertyFNOLRequestService.createHomePolicy(Policydata);
        promiseCreatePolicy.then(function (success) {// Hide create policy button 
            debugger;
        }, function (error) { debugger; $scope.ErrorMessage = error.data.errorMessage; });
    }
    //end

    $scope.SaveFnolRequest = SaveFnolRequest

    function SaveFnolRequest(e)
    {
        $scope.DisableAssignbtn = false;
        bootbox.alert({
            size: "", closeButton: false,
            title: $translate.instant('FNOL_Save.Title'),
            message: $translate.instant('FNOL_Save.Message'),
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
       

    }
});