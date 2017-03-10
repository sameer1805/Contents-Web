angular.module('MetronicApp').controller('CategoryController', function ($rootScope,$uibModal,$scope, $http, $location, $translatePartialLoader, $translate,CategoryService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });  
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $translatePartialLoader.addPart('AddCategory');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.CategoryList;
    $scope.SubCategoryList;
    $scope.Categoryobject;
   
   init();
    function init()
    {
        $scope.Category = true;
        $scope.AddCategory = false;
        var promisePost = CategoryService.GetCategoryList();
        promisePost.then(function (success) {
            $scope.CategoryList = success.data.data;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;                    
        });
    }

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.sortCategory = function (keyname) {
        $scope.CategorysortKey = keyname;   //set the sortKey to the param passed
        $scope.Categoryreverse = !$scope.Categoryreverse; //if true make it false and vice versa
    }

    //Edit or Add new Category
    $scope.showNewCategory = showNewCategory;
    function showNewCategory(item) {
        $scope.Category = false;
        $scope.AddCategory = true;
        if (angular.isDefined(item)) {
            $scope.Categoryobject = angular.copy(item);
            if (item.categoryId > 0) {
                var param = {
                    "categoryId": item.categoryId
                }
                var response = CategoryService.GetSubCategoryList(param);
                response.then(function (Success) { $scope.SubCategoryList=Success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
            }
        }
        else
        {
            $scope.Categoryobject = {};
            $scope.SubCategoryList = {};
        }
       
    }

    //Go back to Category form add category
    $scope.BtnBackClick = BtnBackClick;
    function BtnBackClick() {
        $scope.Category = true;
        $scope.AddCategory = false;    }

    //Add Update category
    $scope.AddUpdateCategory=AddUpdateCategory
    function AddUpdateCategory()
    {
        //"deductible": $scope.Categoryobject.deductible,         
        if (angular.isUndefined($scope.Categoryobject.categoryId))
            $scope.Categoryobject.categoryId = null;
        var param = {
            "categoryId": $scope.Categoryobject.categoryId,
            "categoryName": $scope.Categoryobject.categoryName,
            "coverageLimit": $scope.Categoryobject.coverageLimit,            
            "description": $scope.Categoryobject.description
        };      
        var AddCategoryPromise = CategoryService.AddUpdateCategory(param);
        AddCategoryPromise.then(function (success) {           
            //Show alert
        }, function (error) { debugger; $scope.ErrorMessage = error.data.ErrorMessage; });
    }

    //Pop to add sub category
    $scope.AddSubCategory = AddSubCategory;
    function AddSubCategory(item) {
        $scope.animationsEnabled = true;
        $scope.Subcat;
        if (angular.isDefined(item)) {
            $scope.Subcat = angular.copy(item)
        }
        else
            $scope.Subcat = null;
        
        var out = $uibModal.open(            {               
            templateUrl: "/views/Company/AddSubCategory.html",
            controller: "AddSubCategoryController",
                resolve:
                {
                    SubCategoryObject: function () {                      
                        return $scope.Subcat;
                    }
                }
            });
        out.result.then(function (value) {
            //Call Back Function success
        }, function () {
        });
        return {
            open: open
        };
    }


});