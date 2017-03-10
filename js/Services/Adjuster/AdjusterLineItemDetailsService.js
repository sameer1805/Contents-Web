angular.module('MetronicApp').service('AdjusterLineItemDetailsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //get item notes API #127
    this.getItemNotes = function (param) {
       
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/item/notes",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    
    //Add item notes API #20
    this.addItemNote = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/attachnote",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Get category API #29
    this.getCategory = function () {

        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/claim//get/category",
            //data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Add item notes API #30
    this.getSubCategory = function (param) {
      
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "/web/item/subcategories",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    this.GetComparableList=function(param)
    {
       
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "/web/claim/search/replacement",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //API New #34
    this.deleteLineItem=function(param)
    {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/remove/postlossitem",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
}]);