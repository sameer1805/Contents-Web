
angular.module('MetronicApp').controller('EditMemberAdminstrationsController', function ($rootScope, $scope, $uibModal, settings, $http,  $location, $translate, $translatePartialLoader) {
        $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    //set language
    $translatePartialLoader.addPart('EditMemberAdminstrations');
    $translate.refresh();
    $scope.RoleOfUser = [{ RoleId: 1, Role: 'DemoRoleAdmin is DemoRole 1' }, { RoleId: 2, Role: 'DemoRole DemoRole 2' }];
    $scope.NewRole = NewRole;
    $scope.Cancel = Cancel;
    function NewRole() {
       var item = angular.copy($scope.RoleOfUser)
        $scope.animationsEnabled = true;
        var out = $uibModal.open({
            templateUrl: "/views/Company/AssignRoleToMember.html",
            controller: "AssignRoleToMemberController",
            resolve:
            {
                RoleOfUser: function () {
                    return item;
                }
            }

        });
        out.result.then(function (list) {
            //Call Back
          if(angular.isDefined(list))
                $scope.RoleOfUser = list;
           
        }, function () {
         
        });
        return {
        };
    }

    $scope.Update = Update;
    function Cancel() {

    }
    function Update() {

    }

    $scope.ResetPassword = ResetPassword;
    function ResetPassword(ev)
    {
        bootbox.alert({
            size: "",
            title: $translate.instant('PopPasswordResetLink.title'),
            message: $translate.instant('PopPasswordResetLink.Message'),
            closeButton: false,
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
    }
});