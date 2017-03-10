angular.module('MetronicApp').service('ForgotpasswordService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    this.ForgotPassword = function (param) {
        debugger;
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "customer/forgetpassword",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        debugger;
        return response;
    }
}]);