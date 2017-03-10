angular.module('MetronicApp').controller('RolesAndScreenMappingController', function ($rootScope, $log, $scope,
    settings, $http, $timeout, $location, $translate, $translatePartialLoader) {
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    //set language
    $translatePartialLoader.addPart('AdminScreenMapping');
    $translate.refresh();
    $scope.message = "Roles And Screen Mapping";
});