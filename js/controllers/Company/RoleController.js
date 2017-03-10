angular.module('MetronicApp').controller('RoleController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location) {

    $translatePartialLoader.addPart('Role');
    $translate.refresh();

    //data
    $scope.Roles = [{ Role: 'DemoRole' }, { Role: 'DemoRole' }, { Role: 'DemoRole' }, { Role: 'DemoRole' }, { Role: 'DemoRole' },
        { Role: 'DemoRole' }, { Role: 'DemoRole' }, { Role: 'DemoRole' }, { Role: 'DemoRole' }, { Role: 'DemoRole' },
        { Role: 'DemoRole' }, { Role: 'DemoRole' }
    ]
    $scope.ok = function () {
        //Success Call Back is the value to be pass after opertion deone
        $scope.$close("Success Call Back test");
    };
    $scope.cancel = function () {
        $scope.$close("Close call back");
    };
});