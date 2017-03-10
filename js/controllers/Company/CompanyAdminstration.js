angular.module('MetronicApp').controller('CompanyAdminstrationController', function ($rootScope,$state, $scope, settings, $http, $location, $translate, $translatePartialLoader) {
    
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    //set language
    $translatePartialLoader.addPart('CompanyAdminstration');
    $translate.refresh();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.pagesize = "5"
    $scope.data = [
                    { Id: 1, UserName: "Jon", Status: "Active", Role: "Admin", LastAccess: "01 Dec 2015", MemberSince: "2015" },
                    { Id: 2, UserName: "Jon", Status: "Active", Role: "Admin", LastAccess: "01 Dec 2015", MemberSince: "2015" },
                    { Id: 3, UserName: "Jon", Status: "Active", Role: "Admin", LastAccess: "01 Dec 2015", MemberSince: "2015" },
                    { Id: 4, UserName: "Jon", Status: "Active", Role: "Admin", LastAccess: "01 Dec 2015", MemberSince: "2015" },
                    { Id: 7, UserName: "Jon", Status: "Active", Role: "Admin", LastAccess: "01 Dec 2015", MemberSince: "2015" },
                    { Id: 5, UserName: "Jon", Status: "Active", Role: "Admin", LastAccess: "01 Dec 2015", MemberSince: "2015" },
                    { Id: 6, UserName: "Jon", Status: "Active", Role: "Admin", LastAccess: "01 Dec 2015", MemberSince: "2015" },
                    { Id: 8, UserName: "Jon", Status: "Active", Role: "Admin", LastAccess: "01 Dec 2015", MemberSince: "2015" }];

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.editAdminContact = function (item) {
        $state.go('AdminstrationsEditMember');
    };
    $scope.DeleteAdminContact = function (item,index) {
        if (!angular.isUndefined(item)) {
            $scope.data.splice(index, 1);
        }
        $scope.reset();
    };
});