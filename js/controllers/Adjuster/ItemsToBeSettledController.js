
angular.module('MetronicApp').controller('ItemsToBeSettledController', function ($scope, $rootScope, $translatePartialLoader, $translate, $location) {
    $translatePartialLoader.addPart('ItemsToBeSettled');
    $translate.refresh();
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.search;
    $scope.Category = "1";
    $scope.ItemList = null;
    init();
    function init() {
        $scope.ClaimNo = sessionStorage.getItem("AdjusterClaimNo").toString();
    }
    $scope.GoBack = GoBack;
    function GoBack() {
        $location.url('AdjusterPropertyClaimDetails');
    }

    //$scope.ShowPaymentDetails = function (param) {
    //    if (param == 'DirectDeposit') {
    //        $scope.DebitCardSection = false;
    //        $scope.CheckSection = false;
    //     //   $scope.DirectDepositSection = true;

    //    }
    //    else if (param == 'DebitCard') {
    //        $scope.DebitCardSection = true;
    //        $scope.CheckSection = false;
    //       // $scope.DirectDepositSection = false;
    //    }
    //    //else if (param = 'check') {
    //    //    $scope.DebitCardSection = false;
    //    //    $scope.CheckSection = true;
    //    //    $scope.DirectDepositSection = false;
    //    //}
    //}
});