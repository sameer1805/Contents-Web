angular.module('MetronicApp').controller('AddNewVendorController', function ($rootScope, AdjusterPropertyClaimDetailsService, $uibModal, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });


    //set language
    $translatePartialLoader.addPart('AdjustorAddNewVendor');
    $translate.refresh();


    $scope.ErrorMessage = "";

    $scope.cancel = function () {
        $scope.$close();
    };
    $scope.ok = function () {
        $scope.$close();
    };


   
    $scope.ContactDeatils = [{ FirstName: '', LastName:'' ,Phone:'',Email:''}];
    $scope.counter = 0;
    $scope.PhoneNumbers = [];
    $scope.phonecounter = 0;
    $scope.ddlParticipantTypeList = [];
    $scope.existingVendorSearchResult = [];
    $scope.InternalEmployeeSearchResult = [];
    $scope.SelectedExistingVendors = [];
    $scope.SelectedInternalEmployees = [];
    $scope.ErrorMessage = "";
    $scope.commObj =
       {
           ParticipantType: "Select",
           ExistingVendorText: '',
           InternalText: '',
           ExternalText: '',

       }

    $scope.displayNewVendor = false;
    $scope.displayInternalParticipant = false;
    $scope.displayExistingVendor = false;
    $scope.displayExternalParticipant = false;
    $scope.displayAddVendorBtn = false;
    $scope.displayAddParticipantBtn = true;
    $scope.displaySearchExistingResult = false;
    $scope.displaySearchInternalResult = false;

    $scope.AddContactPerson = function (index,contact)
    {
       
      
        $scope.ContactDeatils.push({ FirstName: '', LastName: '', Phone: '', Email: '' });
       
    }

    $scope.RemoveContactPerson = function (index, contact)
    {
     

        $scope.ContactDeatils.splice(index, 1);
      
    }

   
    $scope.selectParticipant=function()
    {
        if ($scope.commObj.ParticipantType == "Select")
        {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
        }
        else if ($scope.commObj.ParticipantType == "INTERNAL")
        {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = true;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
        }
        else if ($scope.commObj.ParticipantType == "EXTERNAL") {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = true;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
        }
        else if ($scope.commObj.ParticipantType == "EXISTING VENDOR") {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = true;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
        }
        else if ($scope.commObj.ParticipantType == "NEW VENDOR") {
            $scope.displayNewVendor = true;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = true;
            $scope.displayAddParticipantBtn = false;
        }

        else {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
        }

    }
    
   
    function init()
    {
        //get participant type
        var particiapntType=AdjusterPropertyClaimDetailsService.getParticipantType()
        particiapntType.then(function (success) {
           
            $scope.ddlParticipantTypeList = success.data.data;
        }, function (error) {
           
            //$scope.ErrorMessage = error.data.errorMessage;
        });
    }
    init();

    //search existing vendor
    $scope.searchExistingVendor=function()
    {
        var param = {
            "searchString": $scope.commObj.ExistingVendorText
        };

        var getResult = AdjusterPropertyClaimDetailsService.searchExistingEmployee(param)
        getResult.then(function (success) {
            
            $scope.existingVendorSearchResult = success.data.data;
            $scope.displaySearchExistingResult = true;

        }, function (error) {
          
            //$scope.ErrorMessage = error.data.errorMessage;
        });

    }

    //search internal employee

    $scope.searchInternalEmployee=function()
    {
        var param = {
            "searchString": $scope.commObj.InternalText
        };

        var getResult = AdjusterPropertyClaimDetailsService.searchInternalEmployee(param)
        getResult.then(function (success) {

            $scope.InternalEmployeeSearchResult = success.data.data;
            $scope.displaySearchInternalResult = true;

        }, function (error) {

            //$scope.ErrorMessage = error.data.errorMessage;
        });
    }

    //clear result

    $scope.ClearExistingVendorResult=function()
    {
        $scope.commObj.ExistingVendorText = '';
        $scope.existingVendorSearchResult = []; 
        $scope.SelectedExistingVendors = [];
        $scope.displaySearchExistingResult = false;
    }


    $scope.ClearInternalEmployeeResult=function()
    {

        $scope.commObj.InternalText = '';
        $scope.InternalEmployeeSearchResult = [];
        $scope.SelectedInternalEmployees = [];
        $scope.displaySearchInternalResult = false;
       
    }
    //adding vendor to system
    $scope.AddParticipantToClaim = function ()
    {
        var param=
            {

            }
        var addVendor = AdjusterPropertyClaimDetailsService.addVendor(param);
        addVendor.then(function (success) {
            $scope.Status = success.data.status;
            if($scope.Status==200)
            {

            }
            else if($scope.Status==400)
            {

            }
        },function(error)
        {
            $scope.ErrorMessage=error.data.errorMessage
        });
    }


    //select vendor to assing
    $scope.selectVendor = function (vendor, index)
    {
       
        vendors = {};
        var flag = 0;

        angular.forEach($scope.SelectedExistingVendors, function (vendorsObj) {

            if(vendorsObj.vendorId==vendor.vendorId)
            {
                $scope.SelectedExistingVendors.splice(index,1);
                flag += 1;
            }
        });

        if (flag == 0)
        {
         
            vendors.vendorId = vendor.vendorId;
            $scope.SelectedExistingVendors.push(vendors);
        }
       
       
    }
});