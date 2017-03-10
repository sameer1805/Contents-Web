angular.module('MetronicApp').service('AdjusterDashboardService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //get  list of claims API #72- New #12
    this.getClaimsInProgress = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get  notifications API #103- New -#43
    this.getNotification = function ()
    {
        
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/get/claimfornotification",
            //data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }
    //get  getClaimStatusList API #124
    this.getClaimStatusList = function ()
    {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/claim/statuslist",
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

    //get result for global search from dashboard

    this.getSearchClaims = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/search/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }
}]);