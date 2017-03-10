angular.module('MetronicApp').service('PricingSpecialistsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //Pricing Specialists list
    this.GetPricingSpecialistsList = function (param) {
        var SpecialistList = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/price/specialist",
            data: param,
            headers:AuthHeaderService.getHeader()
        });
        return SpecialistList;        
    }

}]);