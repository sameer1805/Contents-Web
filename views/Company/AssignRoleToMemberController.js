angular.module('MetronicApp').controller('AssignRoleToMemberController', function ($rootScope, $scope, settings, $http, $location, $translate, $translatePartialLoader, $filter, RoleOfUser) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('AssignRoleToMember');
    $translate.refresh();  
    $scope.RoleAssigned = RoleOfUser;
    $scope.ColoseDialog = ColoseDialog;
    function ColoseDialog() {
        $scope.$close();
    }
    $scope.SaveAddedRoles = function () {
        //Success Call Back is the value to be pass after opertion done    
        $scope.$close($scope.RoleAssigned);
    };
    $scope.Roles = [{ RoleId:1, Role: 'DemoRole 1' }, { RoleId:2, Role: 'DemoRole 2' }, { RoleId: 3, Role: 'DemoRole 3' }, { RoleId: 4, Role: 'DemoRole 4' }, { RoleId: 5, Role: 'DemoRole 5' },
       { RoleId: 6, Role: 'DemoRole 6' }, { RoleId: 7, Role: 'DemoRole 7' }, { RoleId: 8, Role: 'DemoRole 8' }, { RoleId: 9, Role: 'DemoRole 9' }, { RoleId: 10, Role: 'DemoRole 10' },
       { RoleId: 11, Role: 'DemoRole 11' }, { RoleId: 12, Role: 'DemoRole 12' }
    ];
    //Add Role on check
    $scope.AddRole = AddRole;
    function AddRole(item) {
        var flag = $filter('filter')($scope.RoleAssigned, { RoleId: item.RoleId });     
        if (flag.length === 0) {           
            $scope.RoleAssigned.push(item);           
        }
        else
        {  //Remove role on uncheck    
            var Objindex=0;
            angular.forEach($scope.RoleAssigned, function (obj) {
              
                if (item.RoleId === obj.RoleId) {
                    $scope.RoleAssigned.splice(Objindex, 1);                    
                }
                Objindex = parseInt(Objindex) + 1;
            });
            }
    }
    $scope.Ischecked = Ischecked;
    function Ischecked(item) {       
        var flag = $filter('filter')($scope.RoleAssigned, { RoleId: item });
        if (flag.length!==0)
            return true;
        else
            return false;
    }
   
});