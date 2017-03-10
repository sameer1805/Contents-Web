angular.module('MetronicApp').service('UserService', ['$rootScope', '$cookies', function ($rootScope, $cookies) {

    this.initUserDetails = function (response, password, RememberMe) {
        sessionStorage.setItem("IsLogined", "true");
        $rootScope.IsLoginedUser = true;
        sessionStorage.setItem("AccessToken", response.data.token);  
        sessionStorage.setItem("UserName", response.data.email);
        sessionStorage.setItem("Name", response.data.firstName + " " + response.data.lastName);
        sessionStorage.setItem("Office", response.data.office);
        sessionStorage.setItem("UserId", response.data.userId);
        sessionStorage.setItem("Password", password);
        sessionStorage.setItem("CompanyId", response.data.companyId);  
        if (RememberMe) {
            $cookies.put('UserName', response.data.email);
            $cookies.put('Password', password);
        }
        return true;
    }
    this.removeUserDetails = function () {      
        $cookies.remove('UserName');
        $cookies.remove('Password');
        sessionStorage.setItem("IsLogined", "false");
        $rootScope.IsLoginedUser = false;
        sessionStorage.setItem("AccessToken", "");
        sessionStorage.setItem("UserName", "");
        sessionStorage.setItem("Name", "");
        sessionStorage.setItem("Office", "");
        sessionStorage.setItem("UserId", "");
        sessionStorage.setItem("Password", "");
        sessionStorage.setItem("CompanyId", "");
        
        return true;
    }
}]);