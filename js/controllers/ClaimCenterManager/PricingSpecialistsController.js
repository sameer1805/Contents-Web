angular.module('MetronicApp').controller('PricingSpecialistsController', function ($rootScope, $translate, $translatePartialLoader, $scope, settings, $location, PricingSpecialistsService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('PricingSpecialists');
    $translate.refresh();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.ErrorMessage = "";
    $scope.PricingSpecialistList=[];
    function init()
    {   //Get pricing specialists list for company
        var ComapanyId = {
            "companyId":  sessionStorage.getItem("CompanyId")
        };
        var getPricingSpecialistlist= PricingSpecialistsService.GetPricingSpecialistsList(ComapanyId);
        getPricingSpecialistlist.then(function (success) {           
            $scope.PricingSpecialistList = success.data.data;
        }, function (error) {  $scope.ErrorMessage = error.data.errorMessage });

    }
   
   init();

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }


    $scope.NewSpecialists = NewSpecialists;
    function NewSpecialists(e, item) {
        //Add specialistId in session and access it on new specilists if null the new 
        //sessionStorage.setItem("ClaimSpecialistsId", item);
        // $location.url('NewPricingSpecialist'); 
        $location.url('SearchPricingSpecialists');
    }
    $scope.EditSpecialists = EditSpecialists;
    function EditSpecialists(e, item) {
        //Add specialistId in session and access it on new specilists if null the new 
        sessionStorage.setItem("ClaimSpecialistsId", item);
        $location.url('EditPricingSpecialists');
    }
});