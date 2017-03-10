angular.module('MetronicApp').controller('InProgressController', function ($rootScope, $scope, settings, $http, $timeout, $location, $uibModal, $translate,
    $translatePartialLoader, AdjusterMyDraftService, RejectApproveClaimService) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('AdjusterClaimsInProgress');
    $translate.refresh();
    $scope.claims = "";
    $scope.ErrorMessage = "";
    function init() {
        //get claims with status  API #71
        var param = {
            "claimStatus": "UNDER REVIEW"
        };
        var getpromise = AdjusterMyDraftService.getClaimsList(param);
        getpromise.then(function (success) {
            debugger;
            $scope.claims = success.data.data;

        }, function (error) {
            debugger;
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    init();
});