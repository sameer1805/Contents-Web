angular.module('MetronicApp').controller('RolesAndScreenMappingController', function ($rootScope, $scope,
    settings, RolesAndScreenMapping, $location, $translate, $translatePartialLoader) {
   
   
   

    //set language
    $translatePartialLoader.addPart('AdminScreenMapping');
    $translate.refresh();
    $scope.RoleList = [];
    $scope.ErrorMessage = "";
    init();
    function init() {
        //Get Role List #94
        var promiseGetRoles = RolesAndScreenMapping.GetRoleList();
        promiseGetRoles.then(function (success) { debugger; $scope.RoleList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
});