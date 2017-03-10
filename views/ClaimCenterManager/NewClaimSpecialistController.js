//
angular.module('MetronicApp').controller('NewClaimSpecialistController', function ($rootScope,$filter, $translate, $translatePartialLoader, $scope, settings, $location, NewClaimSpecialistService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('NewClaimSpecialist');
    $translate.refresh();    
    $scope.ErrorMessage = "";
    $scope.CategoryList = [];
    $scope.Branch = [];
    $scope.Roles = [];
    $scope.Designations = [];
    $scope.Reportingmanagers = [];
    $scope.State = [];

    //Ng model object for page
    $scope.ContactDetails ;
    $scope.ProfessionalDetails;
    $scope.SpecialtyOfSpecialist;

    //Phone numbers Region
    $scope.CellPhoneFirst; $scope.CellPhoneSecond; $scope.CellPhoneThird;
    $scope.DayPhoneFirst; $scope.DayPhoneSecond; $scope.DayPhoneThird;

    $scope.CategoryList = [];
    
    $scope.init = function () {      
        var categoryPromise = NewClaimSpecialistService.GetCategoryList();
        categoryPromise.then(function (success) {
            $scope.CategoryList = success.data.data;
            $scope.OriginalCategoryList = success.data.data;         
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage });

        var paramComanyId = {
            "companyId": sessionStorage.getItem("CompanyId")
        };
        var Getbranch = NewClaimSpecialistService.GetBranch(paramComanyId);
        Getbranch.then(function (success) { $scope.Branch = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        var GetReportingmanager = NewClaimSpecialistService.GetReportingmanager(paramComanyId);
        GetReportingmanager.then(function (success) { $scope.Reportingmanagers = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        var GetRoles = NewClaimSpecialistService.GetRole();
        GetRoles.then(function (success) { $scope.Roles = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        var getDesignation = NewClaimSpecialistService.GetDesignation();
        getDesignation.then(function (success) { $scope.Designations = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        var GetState = NewClaimSpecialistService.GetState();
        GetState.then(function (success) { $scope.State = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    };
    $scope.init();

    //CategoryExpert Section    
    //Current categoryId of specialty
    $scope.SpecialtyOfSpecialist = [];
    $scope.OriginalCategoryList = [];

    //Add Category to expert button > click
    $scope.AddToExpertCategory = AddToExpertCategory;
    function AddToExpertCategory() {
        angular.forEach($scope.AddSpecialtyList, function (item) {
            if ($scope.SpecialtyOfSpecialist.indexOf(item) === -1)
                $scope.SpecialtyOfSpecialist.push(item);
        });
        angular.forEach($scope.AddSpecialtyList, function (item) {
            $scope.CategoryList = $filter('filter')($scope.CategoryList, { 'categoryId': '!' + item.id });
        });

        $scope.AddSpecialtyList = [];
    }

    //Remove Category to expert button < click
    $scope.RemoveFromExpertCategory = RemoveFromExpertCategory;
    function RemoveFromExpertCategory() {
        //Splice item form specialty list
        angular.forEach($scope.RemoveSpecialtyList, function (item) {
            var objindex = $scope.SpecialtyOfSpecialist.indexOf(item);
            if (objindex !== undefined || objindex > -1) {
                $scope.SpecialtyOfSpecialist.splice(objindex, 1)
            }
        });
        //Splice item form Category list       
        angular.copy($scope.OriginalCategoryList, $scope.CategoryList);
        angular.forEach($scope.SpecialtyOfSpecialist, function (item) {
            $scope.CategoryList = $filter('filter')($scope.CategoryList, { 'categoryId': '!' + item.id });
        });
        $scope.RemoveSpecialtyList = [];
    }

    //Add Category to specialist specialty Check item is in list or not on checkbox click
    $scope.AddSpecialtyList = [];
    $scope.AddCategoryToExpert = AddCategoryToExpert;
    function AddCategoryToExpert(item) {
        var cat = {
            "id": item.categoryId,
            "speciality": item.categoryName
        };
        var flag = true; var index = 0;
        if ($scope.AddSpecialtyList.length !== 0) {
            for (var i = 0; i < $scope.AddSpecialtyList.length; i++) {
                if ($scope.AddSpecialtyList[i].id === item.categoryId) {
                    flag = false;
                    index = i;
                }
            }
            if (flag)
                $scope.AddSpecialtyList.push(cat);
            else
                $scope.AddSpecialtyList.splice(index, 1)
        }
        else {
            $scope.AddSpecialtyList.push(cat);
        }
    }

    //Remove Category from specialist specialty
    $scope.RemoveSpecialtyList = [];
    $scope.RemoveExpertCategory = RemoveExpertCategory;
    function RemoveExpertCategory(item) {//Remove specialty of specialist Check item is in list or not on checkbox click      
        if ($scope.RemoveSpecialtyList.indexOf(item) === -1) {
            $scope.RemoveSpecialtyList.push(item);
        }
        else {
            $scope.RemoveSpecialtyList.splice($scope.RemoveSpecialtyList.indexOf(item), 1)
        }
    }

    //Get checkbox is cheed or not
    $scope.GetIsChecked = function (list, item) {
        list.indexOf(item) > -1
    }

    //Save specialist
    $scope.SaveClaimSpecialist = SaveClaimSpecialist;
    function SaveClaimSpecialist()
    {
        var stateName = $filter('filter')($scope.State, { 'id': $scope.ContactDetails.address.state.id });
        if (stateName.length === 0)
            stateName = null;
        else
            stateName = stateName[0].name;

        var DesignationName = $filter('filter')($scope.Designations, { 'id': $scope.ProfessionalDetails.designation.id });
        if (DesignationName.length === 0)
            DesignationName = null;
        else
            DesignationName = DesignationName[0].name;

        var BranchName = $filter('filter')($scope.Branch, { 'id': $scope.ProfessionalDetails.branch.id });
        if (BranchName.length === 0)
            BranchName = null;
        else
            BranchName = BranchName[0].name;

        var RoleName = $filter('filter')($scope.Roles, { 'roleId': $scope.ProfessionalDetails.roles.roleId });
        if (RoleName.length === 0)
            RoleName = null;
        else
            RoleName = RoleName[0].roleName;

        var ReportingManagerName = $filter('filter')($scope.Reportingmanagers, { 'id': $scope.ProfessionalDetails.reportingManager.id });
        if (ReportingManagerName.length === 0)
            ReportingManagerName = null;
        else
            ReportingManagerName = ReportingManagerName[0].name;

        var DetailsParam = {
            "specialistId": null,
            "contactInfo": {
                "firstName": $scope.ContactDetails.firstName,
                "lastName": $scope.ContactDetails.lastName,
                "email": $scope.ContactDetails.email,
                "cellPhone": $scope.CellPhoneFirst + $scope.CellPhoneSecond + $scope.CellPhoneThird,
                "dayTimePhone": $scope.DayPhoneFirst + $scope.DayPhoneSecond + $scope.DayPhoneThird,
                "address": {
                    "id": null,
                    "streetAddressOne": $scope.ContactDetails.address.streetAddressOne,
                    "streetAddressTwo": $scope.ContactDetails.address.streetAddressTwo,
                    "city": $scope.ContactDetails.address.city,
                    "zipcode": $scope.ContactDetails.address.zipcode,
                    "state": {
                        "state": stateName,
                        "id": $scope.ContactDetails.address.state.id
                    },
                    "completeAddress": $scope.ContactDetails.address.streetAddress + $scope.ContactDetails.address.streetAddress + $scope.ContactDetails.address.city +
                    stateName + $scope.ContactDetails.address.zipcode
                }
            },
            "professionalInfo": {
                "reportingManager": {
                    "id": $scope.ProfessionalDetails.reportingManager.id,
                    "name":ReportingManagerName,
                    "designation": null,
                    "roles": null
                },
                "branch": {
                    "id": $scope.ProfessionalDetails.branch.id,
                    "name": BranchName
                },
                "designation": {
                    "id": $scope.ProfessionalDetails.designation.id,
                    "name": DesignationName
                },
                "roles": [
                  {
                      "roleId": $scope.ProfessionalDetails.roles.roleId,
                      "contactRoleId": null,
                      "rolePermissionId": null,
                      "roleName": RoleName,
                      "status": false,
                      "description": null,
                      "permissions": null
                  }
                ]
            },
            "specialities": $scope.SpecialtyOfSpecialist
        };
       
        var SaveDetails = NewClaimSpecialistService.SaveSpecialist(DetailsParam);
        SaveDetails.then(function (success) {         
            $location.url("ClaimSpecialistHome");
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
});