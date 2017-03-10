angular.module('MetronicApp').controller('EditClaimSpecialistsController', function ($rootScope,$filter, $translate, $translatePartialLoader, $scope, settings, $location, EditClaimSpecialistsService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('EditClaimSpecialists');
    $translate.refresh();

    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.ErrorMessage = "";
    $scope.CategoryList = [];
    $scope.Branch = [];
    $scope.Roles = [];
    $scope.Designations = [];
    $scope.Reportingmanagers = [];
    $scope.State = [];
    $scope.Claimlist = [];
    $scope.ClaimSpecialistsId;
    //Specialist Details variables
    $scope.ContactDetails = {};
    $scope.ProfessionalDetails = {};
    $scope.specialities = [];

    //Phone numbers Region
    $scope.CellPhoneFirst; $scope.CellPhoneSecond; $scope.CellPhoneThird;
    $scope.DayPhoneFirst; $scope.DayPhoneSecond; $scope.DayPhoneThird;
   // $scope.EveningPhoneFirst; $scope.EveningPhoneSecond; $scope.EveningPhoneThird;
    //Split Mobile number in three parts
    $scope.SplitPhoneNumber = SplitPhoneNumber;
    function SplitPhoneNumber(cell, Day) {// Evening,
        if (angular.isDefined(cell)) {

            $scope.CellPhoneFirst = cell.substring(0, 4); $scope.CellPhoneSecond = cell.substring(4, 8); $scope.CellPhoneThird = cell.substring(8, 12);
        }
        if (angular.isDefined(Day)) {
            $scope.DayPhoneFirst = Day.substring(0, 4); $scope.DayPhoneSecond = Day.substring(4, 8); $scope.DayPhoneThird = Day.substring(8, 12);
        }
        //if (angular.isDefined(Evening)) {
        //    $scope.EveningPhoneFirst = Evening.substring(0, 4); $scope.EveningPhoneSecond = Evening.substring(4, 8); $scope.EveningPhoneThird = Evening.substring(8, 12);
        //}
    }


    $scope.init = function () {
        //If session null then new specialists if has value then edit go and get the values       
        $scope.ClaimSpecialistsId = sessionStorage.getItem("ClaimSpecialistsId");       
        if ($scope.ClaimSpecialistsId === null) {
            $location.url('ClaimSpecialistHome');
        }
        else {
            //Get ddl source
            var paramComanyId = {
                "companyId": sessionStorage.getItem("CompanyId")
            };
            var Getbranch = EditClaimSpecialistsService.GetBranch(paramComanyId);
            Getbranch.then(function (success) { $scope.Branch = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

            var GetReportingmanager = EditClaimSpecialistsService.GetReportingmanager(paramComanyId);
            GetReportingmanager.then(function (success) { $scope.Reportingmanagers = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

            var GetRoles = EditClaimSpecialistsService.GetRole();
            GetRoles.then(function (success) { $scope.Roles = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

            var getDesignation = EditClaimSpecialistsService.GetDesignation();
            getDesignation.then(function (success) { $scope.Designations = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

            var GetState = EditClaimSpecialistsService.GetState();
            GetState.then(function (success) { $scope.State = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

            //get specialist
            var param = {
                "specialistId": $scope.ClaimSpecialistsId
            }
            var Details = EditClaimSpecialistsService.GetSpecialistDetails(param);
            Details.then(function (success) {              
                $scope.ContactDetails = success.data.data.contactInfo;
                $scope.SplitPhoneNumber(success.data.data.contactInfo.cellPhone, success.data.data.contactInfo.dayTimePhone);//success.data.data.contactInfo.eveningTimePhone,
                $scope.ProfessionalDetails = success.data.data.professionalInfo;
                $scope.SpecialtyOfSpecialist = success.data.data.specialities;
                //Get category
                var categoryPromise = EditClaimSpecialistsService.GetCategoryList();
                categoryPromise.then(function (success) {                   
                    $scope.CategoryList = success.data.data;
                    $scope.OriginalCategoryList = success.data.data;
                    angular.forEach($scope.SpecialtyOfSpecialist, function (item) {
                        $scope.CategoryList = $filter('filter')($scope.CategoryList, { 'categoryId': '!' + item.id });
                    });
                }, function (error) { $scope.ErrorMessage = error.data.errorMessage });              

            }, function (error) {
                $location.url('ClaimSpecialistHome');
            });
            var paramClaim = {
                "assignedUserId": $scope.ClaimSpecialistsId
            };
            var ClaimList=EditClaimSpecialistsService.GetClaims(paramClaim);
            ClaimList.then(function (success) { $scope.Claimlist = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage;});            

        }

       
    }

    $scope.init();
    
    //Sort New ClaimSpecialists  Grid wiith radiobutton
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

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
    //end category
    
    $scope.SaveClaimSpecialist=SaveClaimSpecialist;
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
        if (BranchName.length===0)
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
            "specialistId": $scope.ClaimSpecialistsId,
            "contactInfo":  {
                "firstName": $scope.ContactDetails.firstName,
                "lastName": $scope.ContactDetails.lastName,
                "email":$scope.ContactDetails.email,
                "cellPhone": $scope.CellPhoneFirst + $scope.CellPhoneSecond +$scope.CellPhoneThird,
                "dayTimePhone": $scope.DayPhoneFirst + $scope.DayPhoneSecond + $scope.DayPhoneThird,
                "eveningTimePhone": null,
                "address": {
                    "id" : $scope.ContactDetails.address.id,
                    "streetAddressOne": $scope.ContactDetails.address.streetAddressOne,
                    "streetAddressTwo": $scope.ContactDetails.address.streetAddressTwo,
                    "city": $scope.ContactDetails.address.city,
                    "zipcode":$scope.ContactDetails.address.zipcode,
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
                    "name": ReportingManagerName,
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
        var abc = DetailsParam;
        var SaveDetails = EditClaimSpecialistsService.UpdateSpecialist(DetailsParam);
        SaveDetails.then(function (success) {
           
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
});

//var data={
//    "data": {
//        "specialistId": 27693,
//        "contactInfo": {
//            "policyHolderId": 27693,
//            "firstName": "Mohan",
//            "lastName": "Srivastava",
//            "email": "mohan.srivastava4@gmail.com",
//            "cellPhone": "9897542145",
//            "eveningTimePhone": null,
//            "dayTimePhone": "9965876000",
//            "address": {
//                "id": 27655,
//                "streetAddress": "steet 5 Noida sector-63",
//                "city": "Noida",
//                "state": {
//                    "id": 21,
//                    "state": "Uttar Pradesh"
//                },
//              "zipcode": "245765",
//              "completeAddress": "steet 5 Noida sector-63,Noida,Uttar Pradesh,245765"
//            }
//        },
//      "professionalInfo": {
//          "reportingManager": {
//              "id": 253,
//              "name": "Mohan Srivastava",
//              "designation": null,
//              "roles": null
//          },
//        "branch": {
//            "id": 347,
//            "name": "ARTIGEM- CT Branch"
//        },
//        "designation": {
//            "id": 3,
//            "name": "AGENT"
//        },
//        "roles": [
//          {
//              "roleId": 37,
//              "contactRoleId": null,
//              "rolePermissionId": null,
//              "roleName": "ADJUSTER",
//              "status": true,
//              "description": null,
//              "permissions": null
//          },
//          {
//              "roleId": 36,
//              "contactRoleId": null,
//              "rolePermissionId": null,
//              "roleName": "UNDER WRITER",
//              "status": true,
//              "description": null,
//              "permissions": null
//          }
//        ]
//      },
//      "specialities": [
//        {
//            "id": 15,
//            "speciality": "BEDDING"
//        },
//        {
//            "id": 13,
//            "speciality": "BABY ITEMS"
//        }
//      ]
//    },
    
//}