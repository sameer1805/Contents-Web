angular.module('MetronicApp').service('AddNewClaimAssociateService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //GetAssociate List
    this.GetAssociateDetails = function (param) {
        var AssociateDetails = $http({
            method: "Post", url: AuthHeaderService.getApiURL() + "",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return AssociateDetails;
    }
}]);