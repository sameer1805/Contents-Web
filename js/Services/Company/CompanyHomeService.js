angular.module('MetronicApp').service('CompanyHomeService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    this.GetCompanyList = function () {
        var response=$http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/companylist",
            header: AuthHeaderService.getHeader()
        });
        return response;
    }

}]);