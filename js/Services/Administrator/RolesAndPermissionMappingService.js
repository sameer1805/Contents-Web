angular.module('MetronicApp').service('RolesAndPermissionMappingService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    this.GetRoleList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/user/getrole",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
}]);