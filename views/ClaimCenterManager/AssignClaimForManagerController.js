angular.module('MetronicApp').controller('AssignClaimForManagerController',
function AssignClaimForManagerController($translate, $translatePartialLoader, $rootScope,  $scope,AssignClaimForManagerService,
     $http, $location, items, AdjusterList) {
    $translatePartialLoader.addPart('AssignClaimForManager');
    $translate.refresh();
    $scope.Error = "";
    $scope.assignedUserId;   
    $scope.objClaim = items;
  
    $scope.AdjusterList = AdjusterList;
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.ok = function () {
        $scope.Error = "";
        //success call back
        if ($scope.assignedUserId > 0) {
            var param = {
                "claimId": $scope.objClaim.claimId,
                "assignedUserId": $scope.assignedUserId,
                "claimStatusId": 2
            };
            var promisePost = AssignClaimForManagerService.AssignClaim(param);
            promisePost.then(function (pl) {
                if (pl.data.status == 200)
                    $scope.$close("Success");
                else
                    $scope.$close("Fail");
            }, function (errorPl) {            //Error Message
                $scope.$close("Fail");
            });
            $scope.$close("Success");
        }
        else { $scope.Error = "Please select adjuster.." }
    };
    $scope.cancel = function () {
        $scope.$close();
    };

    $scope.getAdjusterId = getAdjusterId;
    function getAdjusterId(id) {
        $scope.Error = "";
        $scope.assignedUserId = id;
    }
});