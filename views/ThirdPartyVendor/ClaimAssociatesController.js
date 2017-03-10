angular.module('MetronicApp').controller('ClaimAssociatesController', function ($rootScope, $translate, ClaimAssociatesService, $translatePartialLoader, $scope, settings,
    $timeout, $location, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('ClaimAssociates');
    $translate.refresh();

   
   
   
   
    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.ErrorMessage = "";
    $scope.ClaimAssociatesList = [];
    init();
    function init() {
        var param = {};
        var AssociateList = ClaimAssociatesService.GetAssociateList(param);
        AssociateList.then(function (success) { $scope.ClaimAssociatesList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
    $scope.ClaimAssociatesList = [{
        "EmployeeId": "1",
        "Name": "Emp Name",
        "Claimsinhand": "2",
        "Designation": "Manager",
        "Type": "Internal",
        "Status": "Active"
    }];
    $scope.AddNewAssociate = AddNewAssociate;
    function AddNewAssociate()
    {
        $location.url('NewClaimAssociate');
    }
    $scope.EditAssociate = EditAssociate;
    function EditAssociate(item) {
        //Get Id in session and nevigate
        $location.url('NewClaimAssociate');
    }
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});