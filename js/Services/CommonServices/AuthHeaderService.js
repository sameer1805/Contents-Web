angular.module('MetronicApp').service('AuthHeaderService', ['$http', '$rootScope', function ($http, $rootScope) {
  //attach auth header to all the calls by calling this property
    this.getHeader = function () {     
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Auth-Token": sessionStorage.getItem("AccessToken")
        }
    }
    this.getFileHeader = function () {
        return {
            'Content-Type': undefined,          
            "X-Auth-Token": sessionStorage.getItem("AccessToken")
        }
    }
    this.getApiURL = function () {
        var apiurl = 'http://69.164.195.59:8080/ArtigemRS-FI/api/';
        return apiurl;
    }
}]);