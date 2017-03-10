angular.module('MetronicApp').controller('AddNewVendorController', function ($rootScope, AdjusterPropertyClaimDetailsService, $uibModal, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

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

    $scope.ContactDeatils = [];
    $scope.counter = 0;

    $scope.PhoneNumbers = [];
    $scope.phonecounter = 0;
    $scope.AddRow=function(type)
    {
        if (type == 'contactdetails')
        {
            $scope.ContactDeatils.push($scope.counter)
            $scope.counter = parseInt($scope.counter) + 1;
        }
        else {
            $scope.PhoneNumbers.push($scope.phonecounter)
            $scope.phonecounter = parseInt($scope.phonecounter) + 1;
        }
       
    }

    $scope.RemoveRow=function(row,type)
    {
        if (type == 'contactdetails')
        {
            $scope.ContactDeatils.splice(row, 1)   //1 -removes item , 0- adds item
        }
        else
        {
            $scope.PhoneNumbers.splice(row, 1)
        }
      
    }

    $scope.displayNewVendor = false;
    $scope.displayInternalParticipant = false;
    $scope.displayExistingVendor = false;
    
    
    $scope.NewThirdPartyVendor=function()
    {
        $scope.displayNewVendor = true;
        $scope.displayInternalParticipant = false;
        $scope.displayExistingVendor = false;
    }

    $scope.InternalPraticipant = function () {
        $scope.displayNewVendor = false;
        $scope.displayInternalParticipant = true;
        $scope.displayExistingVendor = false;
    }

    $scope.ExistingThirdPartyVendor = function () {
        $scope.displayNewVendor =false;
        $scope.displayInternalParticipant = false;
        $scope.displayExistingVendor = true;
    }
    
    //adding vendor to system
    $scope.AddVendor=function()
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
});