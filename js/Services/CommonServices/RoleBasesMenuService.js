angular.module('MetronicApp').service('RoleBasedService', ['$http', '$rootScope', function ($http, $rootScope) {
    //Set get Screen list
    this.SetUserScreenList = function (ScreenList) {
        sessionStorage.setItem("ScreenList", ScreenList);
        return true;
    }
    this.GetUserScreenList = function () {
        var Rolelist=  sessionStorage.getItem("RoleList");
        var list=[];//  = sessionStorage.getItem("ScreenList");
        if (Rolelist === "ADJUSTER") {
            list = [{ "ScreenCode": "AdjusterDashboard", "URL": "AdjusterDashboard" }, { "ScreenCode": "AdjusterMyClaim", "URL": "AdjusterClaimInProgress" },
            { "ScreenCode": "ThirdPartyVendorDashboard", "URL": "ThirdPartyVendorDashboard" }, { "ScreenCode": "Inventory", "URL": "Inventory" }];
        }
        if (Rolelist === "CLAIM MANAGER" || Rolelist === "CLAIM CENTER ADMIN") {
            list = [{ "ScreenCode": "ClaimManagerDashboard", "URL": "ManagerDashboard" }, { "ScreenCode": "ClaimManagerMyClaim", "URL": "ClaimCenterAllClaims" },
            { "ScreenCode": "ThirdPartyVendorDashboard", "URL": "ThirdPartyVendorDashboard" }, { "ScreenCode": "Inventory", "URL": "Inventory" }];
        }       
        return list;
    }
    //Set and Role list
    this.SetUserRoles = function (RoleList) {
        sessionStorage.setItem("RoleList", RoleList);
        return true;
    }

    this.GetUserRoles = function () {
        return sessionStorage.getItem("RoleList");
    }

    this.SetHomePageForUser=function(RoleName)
    {
        if ((RoleName === "CLAIM MANAGER") ||( RoleName === "CLAIM CENTER ADMIN")) {
           sessionStorage.setItem("HomeScreen","/ManagerDashboard");
        } else if (RoleName === 'ADJUSTER') {
            sessionStorage.setItem("HomeScreen", "/AdjusterDashboard"); 
        }
        else
            sessionStorage.setItem("HomeScreen", "/ManagerDashboard");
    }

    this.GetHomePageForUser =function()
    {
       return sessionStorage.getItem("HomeScreen");
    }
}]);