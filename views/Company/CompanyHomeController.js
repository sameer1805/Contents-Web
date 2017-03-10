//
angular.module('MetronicApp').controller('CompanyHomeController', function ($rootScope, $scope, settings, $http, $location, $translate, $translatePartialLoader, CompanyHomeService) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('CompanyHome');
    $translate.refresh();

   
   
   
   
    $scope.ErrorMessage = "";
    $scope.ComapnyList = [];
    init();
    function init()
    {
        //Get Comapany List API# 91
        var getCompanyPromise = CompanyHomeService.GetCompanyList();
       // getCompanyPromise.then(function (success) { $scope.ComapnyList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

    }

    $scope.ComapnyList = [
    { CompanyName: "Demo Company1", CompanyWebSite: "www.Dummy.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company2", CompanyWebSite: "www.Dummy.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company3", CompanyWebSite: "www.Dummy.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company4", CompanyWebSite: "www.Dummy.com4", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company", CompanyWebSite: "www.Dummy.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company", CompanyWebSite: "www.Dummy4.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company", CompanyWebSite: "www.Dummy.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company", CompanyWebSite: "www.Dummy.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company", CompanyWebSite: "www.Dummy44.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company", CompanyWebSite: "www.Dummy.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company", CompanyWebSite: "www.Dumm4y.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" },
    { CompanyName: "Demo Company", CompanyWebSite: "www.Dummy.com", Phone: "9854785478", FAX: "857867944", ContactPerson: "Jon Dummy", PhoneNo: "897845634" } ];
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

});