angular.module('MetronicApp').service('ClaimAssociatesService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //GetAssociate List
    this.GetAssociateList = function (param) {
        var AsscociateList = $http({
            method: "Post", url: AuthHeaderService.getApiURL() + "",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return AsscociateList;
    }    
}]);