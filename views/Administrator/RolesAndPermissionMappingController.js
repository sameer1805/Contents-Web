angular.module('MetronicApp').controller('RolesAndPermissionMappingController', function ($rootScope, $scope,
    settings, $location, $translate, $translatePartialLoader, RolesAndPermissionMappingService) {
   
   
   
    //set language
    $translatePartialLoader.addPart('AdminPermissionMapping');
    $translate.refresh();
    $scope.RoleList = [];
    $scope.ErrorMessage = "";
    init();
    function init() {
        //Get Role List #94
        var promiseGetRoles = RolesAndPermissionMappingService.GetRoleList();
        promiseGetRoles.then(function (success) {  $scope.RoleList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
});