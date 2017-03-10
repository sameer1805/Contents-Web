angular.module('MetronicApp').service('ThirdPartyVendorService', function ($http, $rootScope, AuthHeaderService) {
   
    //API #116
    this.getVendorList = function (param) {
       
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/company/vendors",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //API#55
    this.inviteVendor=function(param)
    {
        debugger;
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/invite/vendor",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
});
