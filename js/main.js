


/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies", "angularUtils.directives.dirPagination", "pascalprecht.translate", "ngIdle", "angucomplete-alt"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

MetronicApp.config(function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'Translation/{part}/{lang}.json'
    });
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.preferredLanguage('en-US');

});



/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: true, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout4',
        pagesize:"10",
        apiurl: 'http://69.164.195.59:8080/ArtigemRS-FI/api/'
    };
    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', 'Idle', '$location', '$http', function ($scope, Idle, $cookieStore, $rootScope, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        App.initComponents(); // init core components
        Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });

}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$location', '$rootScope', '$http', 'UserService', function ($scope, $location, $rootScope, $http, UserService) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
    $scope.Name = sessionStorage.getItem("Name")
    $scope.toggleSidebar = function () {
        var body = $('body');
        var sidebar = $('.page-sidebar');
        var sidebarMenu = $('.page-sidebar-menu');
        $(".sidebar-search", sidebar).removeClass("open");

        if (body.hasClass("page-sidebar-closed")) {
            body.removeClass("page-sidebar-closed");
            sidebarMenu.removeClass("page-sidebar-menu-closed");
            if (Cookies) {
                Cookies.set('sidebar_closed', '0');
            }
        } else {
            body.addClass("page-sidebar-closed");
            sidebarMenu.addClass("page-sidebar-menu-closed");
            if (body.hasClass("page-sidebar-fixed")) {
                sidebarMenu.trigger("mouseleave");
            }
            if (Cookies) {
                Cookies.set('sidebar_closed', '1');
            }
        }

        $(window).trigger('resize');


    };
    $scope.Logout = Logout;
    function Logout(e) {
        UserService.removeUserDetails();        
        $location.path('/');
    }
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', '$translatePartialLoader', '$translate', '$filter','RoleBasedService', function ($state, $scope, $translatePartialLoader, $translate,$filter, RoleBasedService) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
    $translatePartialLoader.addPart('SideBar');
    $translate.refresh();
    $scope.ScreenList;
    //Method should be call on init method    
    function init()
    {
        $scope.ScreenList = RoleBasedService.GetUserScreenList();
    }
    init();
    $scope.IsAccess = IsAccess;
    function IsAccess(param)
    {
        if ($scope.ScreenList === null)
            $scope.ScreenList = RoleBasedService.GetUserScreenList();

        //var index = $scope.ScreenList.indexOf(param);
        //if(index !==-1)
        //{           
        //    return true;
        //}
        //else
        //{
        //    if ("webuser@artigem.com" === sessionStorage.getItem("UserName"))
        //        return true
        //    else
        //    return false;
        //}
        //When need to turn off Role based screen use this and comment above part
        // return true;
        var list = $filter('filter')($scope.ScreenList, { ScreenCode: param });     
        if (list.length > 0)
            return true;
        else
        {
                if ("webuser@artigem.com" === sessionStorage.getItem("UserName"))
                    return true
                else
                return false;
            }
    }
    
    
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url and if user not logined or unautherised access
    $urlRouterProvider.otherwise("/");

    $stateProvider
         .state('login', {
             url: "/",
             templateUrl: "views/User/Login.html",
             data: { pageTitle: '' },
             controller: "LoginController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                              'assets/global/plugins/morris/morris.css',
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',                            
                            'assets/pages/css/login.css',                            
                            'views/User/LoginController.js',
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/LoginService.js',
                         ]
                     });
                 }]
             }
         })

        .state('forgotpassword', {
            url: "/forgotpassword",
            templateUrl: "views/User/ForgotPassword.html",
            data: { pageTitle: 'Forgot Password' },
            controller: "ForgotPasswordController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                          'assets/pages/css/login.css',
                           'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/ForgetpasswordService.js',
                          'views/User/ForgotPasswordController.js',
                        ]
                    });
                }]
            }
        })

        .state('register', {
            url: "/register",
            templateUrl: "views/User/RegisterUser.html",
            data: { pageTitle: 'Register' },
            controller: "RegisterController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                           'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                           'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                           'assets/pages/css/login.css',
                            'js/Services/CommonServices/AuthHeaderService.js',
                           'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            'js/Services/RegisterUserService.js',
                           'views/User/RegisterController.js',
                        ]
                    });
                }]
            }
        })

        //Claim Center Manager
        .state('ClaimCenterMangerDashboard', {
            url: "/ManagerDashboard",
            templateUrl: "views/ClaimCenterManager/ClaimCenterManagerDashboard.html",
            data: { pageTitle: 'Dashboard' },
            controller: "ClaimCenterMangerDashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            'assets/global/plugins/datatables/datatables.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            'assets/global/plugins/datatables/datatables.all.min.js',

                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/ClaimCenterManager/ClaimCenterManagerDashboard.js',
                            'views/ClaimCenterManager/AssignClaimForManagerController.js',
                             'views/ClaimCenterManager/RejectorApproveClaimController.js',

                            //services
                             'js/Services/ClaimCenterManager/ClaimCenterDashboardService.js',
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ClaimCenterManager/AssignClaimForManagerService.js',
                            'js/Services/ClaimCenterManager/RejectApproveClaimService.js',
                            
                        ]
                    });
                }]
            }
        })

        .state('PropertyFNOLRequest', {
              url: "/PropertyFNOLRequest",
              templateUrl: "views/ClaimCenterManager/ClaimCenterPropertyFNOLRequest.html",
              data: { pageTitle: 'FNOL Request' },
              controller: "ClaimCenterPropertyFNOLRequestController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                          files: [
                                'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                               'views/ClaimCenterManager/ClaimCenterPropertyFNOLRequestController.js',
                               'views/ClaimCenterManager/AssignClaimForManagerController.js',
                               'views/ClaimCenterManager/NewItemDamageLostController.js',
                               'views/Adjuster/AddNewLostDamageItemDetailsController.js',
                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ClaimCenterManager/AssignClaimForManagerService.js',
                              'js/Services/ClaimCenterManager/PropertyFNOLRequestService.js',
                              'js/Services/ClaimCenterManager/NewItemDamageLostService.js',
                          ]
                      });
                  }]
              }
          })

        .state('ClaimCenterAllClaims', {
            url: "/ClaimCenterAllClaims",
            templateUrl: "views/ClaimCenterManager/ClaimCenter-AllClaims.html",
            data: { pageTitle: 'My Claims' },
            controller: "ClaimCenter-AllClaimsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/ClaimCenterManager/ClaimCenter-AllClaimsController.js',
                            'views/ClaimCenterManager/AssignClaimForManagerController.js',
                            'views/ClaimCenterManager/RejectorApproveClaimController.js',


                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ClaimCenterManager/ClaimCenterMyClaims.js',
                            'js/Services/ClaimCenterManager/AssignClaimForManagerService.js',
                            'js/Services/ClaimCenterManager/RejectApproveClaimService.js', ]
                    });
                }]
            }
        })

        .state('ClaimCenter-ClaimDetails', {
            url: "/ClaimCenter-ClaimDetails",
            templateUrl: "views/ClaimCenterManager/ClaimCenter-ClaimDetails.html",
            data: { pageTitle: 'Claim Details' },
            controller: "ClaimCenter-ClaimDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',

                            'views/ClaimCenterManager/ClaimCenter-ClaimDetailsController.js',
                           'views/ClaimCenterManager/AssignClaimForManagerController.js',
                            'views/ClaimCenterManager/NewItemDamageLostController.js',
                            'views/ClaimCenterManager/RejectorApproveClaimController.js',

                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ClaimCenterManager/AssignClaimForManagerService.js',
                            'js/Services/ClaimCenterManager/ClaimCenterClaimDetailsService.js',
                            'js/Services/ClaimCenterManager/NewItemDamageLostService.js',
                             'js/Services/ClaimCenterManager/RejectApproveClaimService.js',
                            

                        ]
                    });
                }]
            }
        })

          .state('ClaimSpecialistHome', {
              url: "/ClaimSpecialistHome",
              templateUrl: "views/ClaimCenterManager/ClaimSpecialistHome.html",
              data: { pageTitle: 'Claim Specialists' },
              controller: "ClaimSpecialistHomeController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                          files: [
                                'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                              'views/ClaimCenterManager/ClaimSpecialistHomeController.js',
                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ClaimCenterManager/ClaimSpecialistHomeService.js'
                          ]
                      });
                  }]
              }
          })

        .state('ClaimSpecialists', {
            url: "/ClaimSpecialists",
            templateUrl: "views/ClaimCenterManager/ClaimSpecialists.html",
            data: { pageTitle: 'Claim Specialists' },
            controller: "ClaimSpecialistsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',

                            'views/ClaimCenterManager/ClaimSpecialistsController.js',
                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ClaimCenterManager/ClaimSpecialistsService.js'
                        ]
                    });
                }]
            }
        })

        .state('EditClaimSpecialists', {
            url: "/EditClaimSpecialists",
            templateUrl: "views/ClaimCenterManager/EditClaimSpecialists.html",
             data: { pageTitle: 'Claim Specialists' },
             controller: "EditClaimSpecialistsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',

                             'views/ClaimCenterManager/EditClaimSpecialistsController.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ClaimCenterManager/EditClaimSpecialistsService.js'
                         ]
                     });
                 }]
             }
        })

        .state('SearchClaimSpecialists', {
            url: "/SearchClaimSpecialists",
            templateUrl: "views/ClaimCenterManager/SearchClaimSpecialists.html",
             data: { pageTitle: 'Specialists' },
             controller: "SearchClaimSpecialistsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             'views/ClaimCenterManager/SearchClaimSpecialistsController.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ClaimCenterManager/SearchClaimSpecialistsService.js'
                         ]
                     });
                 }]
             }
         })

        .state('NewClaimSpecialist', {
            url: "/NewClaimSpecialist",
            templateUrl: "views/ClaimCenterManager/NewClaimSpecialist.html",
             data: { pageTitle: 'Claim Specialists' },
             controller: "NewClaimSpecialistController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             'views/ClaimCenterManager/NewClaimSpecialistController.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ClaimCenterManager/NewClaimSpecialistService.js'
                         ]
                     });
                 }]
             }
         })

        //Adjuster
        .state('AdjusterDashboard', {
            url: "/AdjusterDashboard",
            templateUrl: "views/Adjuster/AdjusterDashboard.html",
            data: { pageTitle: 'Dashboard' },
            controller: "AdjusterDashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                           
                            'views/Adjuster/AdjusterDashboardController.js',

                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/Adjuster/AdjusterDashboardService.js',
                        ]
                    });
                }]
            }
        })

        .state('AdjusterMyClaims', {
            url: "/AdjusterMyClaims",
            templateUrl: "views/Adjuster/AdjusterMyClaims.html",
            data: { pageTitle: 'My Claims' },
            controller: "AdjusterMyClaimsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/Adjuster/AdjusterMyClaimsController.js',
                            'views/ClaimCenterManager/AssignClaimForManagerController.js',

                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/Adjuster/AdjusterMyClaimsService.js',
                             'js/Services/ClaimCenterManager/AssignClaimForManagerService.js'

                        ]
                    });
                }]
            }
        })

        .state('AdjusterPropertyClaimDetails', {
            url: "/AdjusterPropertyClaimDetails",
            templateUrl: "views/Adjuster/AdjusterPropertyClaimDetails.html",
            data: { pageTitle: 'Claim Details' },
            controller: "AdjusterPropertyClaimController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                          
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            //'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css',
                            //'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',


                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                           
                             'views/Adjuster/AdjusterPropertyClaimDetails.js',
                             'views/Adjuster/AdjusterListController.js',
                             'views/ClaimCenterManager/NewItemDamageLostController.js',
                             'views/Adjuster/AddNewLostDamageItemDetailsController.js',
                             'views/Adjuster/AddNewVendorController.js',
                             'views/Adjuster/ItemValueController.js',
                             'views/Adjuster/ItemPayoutController.js',
                              'views/Adjuster/AssignPostLostItemController.js',

                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Adjuster/AdjusterPropertyClaimDetailsService.js',
                            'js/Services/Adjuster/AdjusterListService.js',
                            'js/Services/Adjuster/AdjusterItemPayoutService.js',
                            'js/Services/Adjuster/AdjusterItemValueService.js',
                             'js/Services/ClaimCenterManager/NewItemDamageLostService.js',

                        ]
                    });
                }]
            }
        })


         .state('AssignPostLostItem', {
             url: "/AssignPostLostItem",
             templateUrl: "views/Adjuster/AssignPostLostItem.html",
             data: { pageTitle: 'Assign Line Items' },
             controller: "AssignPostLostItemController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',

                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                              'views/Adjuster/AdjusterPropertyClaimDetails.js',
                              'views/Adjuster/AdjusterListController.js',
                              'views/ClaimCenterManager/NewItemDamageLostController.js',
                              'views/Adjuster/AddNewLostDamageItemDetailsController.js',
                              //'views/Adjuster/AddNewVendorController.js',
                              //'views/Adjuster/ItemValueController.js',
                              //'views/Adjuster/ItemPayoutController.js',
                               'views/Adjuster/AssignPostLostItemController.js',

                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/Adjuster/AdjusterPropertyClaimDetailsService.js',
                             'js/Services/Adjuster/AdjusterListService.js',
                             //'js/Services/Adjuster/AdjusterItemPayoutService.js',
                             //'js/Services/Adjuster/AdjusterItemValueService.js',
                             'js/Services/ClaimCenterManager/NewItemDamageLostService.js',

                         ]
                     });
                 }]
             }
         })

        .state('AdjusterClaimInProgress', {
            url: "/AdjusterClaimInProgress",
            templateUrl: "views/Adjuster/AdjusterClaimsInProgress.html",
            data: { pageTitle: 'Claims In Progress' },
            controller: "AdjusterClaimsInProgressController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'views/Adjuster/AdjusterClaimsInProgressContorller.js',
                            'views/Adjuster/AdjusterListController.js',
                            'views/Adjuster/MyDraftController.js',
                            'views/Adjuster/InProgressController.js',
                            'views/Adjuster/WaitingForApprovalController.js',
                            'views/Adjuster/DeclinedController.js',
                             'views/ClaimCenterManager/RejectorApproveClaimController.js',

                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/Adjuster/AdjusterClaimsInProgressService.js',
                             'js/Services/Adjuster/AdjusterListService.js',
                             'js/Services/Adjuster/AdjusterMyDraftService.js',
                              'js/Services/ClaimCenterManager/RejectApproveClaimService.js'
                            
                        ]
                    });
                }]
            }
        })

        .state('AdjusterLineItemDetails', {
            url: "/AdjusterLineItemDetails",
            templateUrl: "views/Adjuster/AdjusterLineItemDetails.html",
            data: { pageTitle: 'Line Item Details' },
            controller: "AdjusterLineItemDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                             

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                             

                            //start switch css-
                          
                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                          
                            //end switch css-

                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',


                               //start switch js-
                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            //end switch js

                           'views/Adjuster/ItemValueController.js',
                           'views/Adjuster/ItemPayoutController.js',
                           'views/Adjuster/AdjusterListController.js',
                           'views/Adjuster/AdjusterLineItemDetailsController.js',
                           'views/ClaimCenterManager/AssignClaimForManagerController.js',
                           'views/Adjuster/AdjusterComparablesListController.js',
                           'views/Adjuster/AssignLineItem.js',

                                //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/Adjuster/AdjusterListService.js',
                              'js/Services/Adjuster/AdjusterLineItemDetailsService.js',
                              'js/Services/Adjuster/AdjusterComparablesListService.js',
                              'js/Services/Adjuster/AdjusterItemPayoutService.js',
                              'js/Services/Adjuster/AdjusterItemValueService.js',
                              'js/Services/Adjuster/AssignLineItem.js'


                        ]
                    });
                }]
            }
        })
    
        .state('AdjusterGlobalSearch', {
            url: "/AdjusterGlobalSearch",
            templateUrl: "views/Adjuster/AdjusterGlobalSearch.html",
            data: { pageTitle: 'Search Result' },
            controller: "AdjusterGlobalSearchController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/Adjuster/AdjusterGlobalSearchController.js',
                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                               'js/Services/Adjuster/AdjusterDashboardService.js'
                        ]
                    });
                }]
            }
        })

        .state('ItemsSetteled',
        {
            url: "/ItemsSetteled",
            templateUrl: "views/Adjuster/ItemsSetteled.html",
            data: { pageTitle: 'Items Settled' },
            controller: "ItemsSetteledController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/Adjuster/ItemsSetteledController.js',
                                //services
                              //'js/Services/CommonServices/AuthHeaderService.js'
                        ]
                    });
                }]
            }
        })
         .state('ItemsToBeSetteled',
        {
            url: "/ItemsToBeSetteled",
            templateUrl: "views/Adjuster/ItemsToBeSettled.html",
            data: { pageTitle: 'Items To Be Settled' },
            controller: "ItemsToBeSettledController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/Adjuster/ItemsToBeSettledController.js',
                                //services
                              //'js/Services/CommonServices/AuthHeaderService.js'
                        ]
                    });
                }]
            }
        })

           .state('ItemsHoldover',
        {
            url: "/ItemsHoldover",
            templateUrl: "views/Adjuster/ItemsHoldover.html",
            data: { pageTitle: 'Holdover' },
            controller: "ItemsHoldoverController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/Adjuster/ItemsHoldoverController.js',

                                //services
                              //'js/Services/CommonServices/AuthHeaderService.js'
                        ]
                    });
                }]
            }
        })

        .state('VendorInvoices',
        {
            url: "/VendorInvoices",
            templateUrl: "views/Adjuster/VendorInvoices.html",
            data: { pageTitle: 'Vendor Invoices' },
            controller: "VendorInvoicesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/Adjuster/VendorInvoicesController.js',

                              //services
                              'js/Services/CommonServices/AuthHeaderService.js'
                        ]
                    });
                }]
            }
        })

         .state('VendorInvoiceDetails',
        {
            url: "/VendorInvoiceDetails",
            templateUrl: "views/Adjuster/VendorInvoiceDetails.html",
            data: { pageTitle: 'Vendor Invoice' },
            controller: "VendorInvoiceDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/Adjuster/VendorInvoiceDetailsController.js',

                             //services
                             'js/Services/CommonServices/AuthHeaderService.js'
                        ]
                    });
                }]
            }
        })


          .state('AdjusterThirdPartyVendor',
        {
            url: "/AdjusterThirdPartyVendor",
            templateUrl: "views/Adjuster/ThirdPartyVendor.html",
            data: { pageTitle: 'Third Party Vendor' },
            controller: "ThirdPartyVendorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            
                            'views/Adjuster/ThirdPartyVendorController.js',

                                //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Adjuster/ThirdPartyVendorService.js'
                        ]
                    });
                }]
            }
        })


           .state('NewThirdPartyVendor',
        {
            url: "/NewThirdPartyVendor",
            templateUrl: "views/Adjuster/NewThirdPartyVendor.html",
            data: { pageTitle: 'Third Party Vendor' },
            controller: "NewThirdPartyVendorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',


                            'views/Adjuster/NewThirdPartyVendorController.js',
                           
                                //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Adjuster/AdjusterPropertyClaimDetailsService.js',
                           // 'js/Services/Adjuster/ThirdPartyVendorService.js'
                        ]
                    });
                }]
            }
        })



           .state('AdjusterInviteVendor',
        {
            url: "/AdjusterInviteVendor",
            templateUrl: "views/Adjuster/AdjusterInviteVendor.html",
            data: { pageTitle: 'Invite Third Party Vendor' },
            controller: "AdjusterInviteVendorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',


                            'views/Adjuster/AdjusterInviteVendorController.js',

                                //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Adjuster/ThirdPartyVendorService.js'
                        ]
                    });
                }]
            }
        })


         .state('AdjusterEditVendor',
        {
            url: "/AdjusterEditVendor",
            templateUrl: "views/Adjuster/AdjusterEditVendor.html",
            data: { pageTitle: 'Edit Third Party Vendor' },
            controller: "AdjusterEditVendorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',


                            'views/Adjuster/AdjusterEditVendorController.js',

                                //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Adjuster/AdjusterPropertyClaimDetailsService.js',
                           
                        ]
                    });
                }]
            }
        })

        //Comapany
        .state('Company', {
            url: "/Company",
            templateUrl: "views/Company/Company.html",
            data: { pageTitle: 'Company' },
            controller: "CompanyController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/Company/RoleController.js',
                             'views/Company/CategoryController.js',
                             'views/Company/AddSubCategoryController.js',
                             'views/Company/CompanyController.js',
                             'views/Company/ContactsController.js',
                             'views/Company/CompanyAdminstration.js',
                             'views/Company/CompanyHomeController.js',

                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Company/CompanyRoleService.js',
                            'js/Services/Company/CategoryService.js',
                            'js/Services/Company/AddSubCategoryService.js',
                            'js/Services/Company/CompanyService.js',
                            'js/Services/Company/CompanyContactsService.js',
                            'js/Services/Company/CompanyAdministrationService.js',
                            'js/Services/Company/CompanyHomeService.js',
                        ]
                    });
                }]
            }
        })

        //Office
        .state('Office', {
            url: "/Office",
            templateUrl: "views/Office/Office.html",
            data: { pageTitle: 'Office' },
            controller: "OfficeController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'views/Office/MemberContactController.js',
                            'views/Office/NewBranchController.js',
                            'views/Office/OfficeSummaryController.js',
                            'views/Office/OfficeController.js',
                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Office/OfficeMemberContactService.js',
                            'js/Services/Office/OfficeNewBranchService.js',
                            'js/Services/Office/OfficeService.js',
                            'js/Services/Office/OfficeSummaryService.js',
                        ]
                    });
                }]
            }
        })

        // Edit Member
         .state('AdminstrationsEditMember', {
             url: "/AdminstrationsEditMember",
             templateUrl: "views/Company/EditMemberAdminstrations.html",
             data: { pageTitle: 'Member Details' },
             controller: "EditMemberAdminstrationsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'views/Company/EditMemberAdminstrationsController.js',
                              'views/Company/AssignRoleToMemberController.js',

                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/Company/CompanyEditMemberAdministrationService.js',
                              'js/Services/Company/CompanyAssignRoleToMemberService.js',


                         ]
                     });
                 }]
             }
         })

        //Third party vendor

        .state('ThirdPartyVendorDashboard', {
            url: "/ThirdPartyVendorDashboard",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyDashboard.html",
            data: { pageTitle: 'Third Party Vendor' },
            controller: "ThirdPartyDashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                               'views/ThirdPartyVendor/ThirdPartyDashboardController.js',

                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',

                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyVendorService.js',
                            
                        ]
                    });
                }]
            }
        })

         .state('ThirdPartyVendor', {
             url: "/ThirdPartyVendor",
             templateUrl: "views/ThirdPartyVendor/ThirdPartyVendor.html",
             data: { pageTitle: 'Third Party Vendor' },
             controller: "ThirdPartyVendorController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                                'views/ThirdPartyVendor/ThirdPartyVendorController.js',
                                'views/ThirdPartyVendor/AddInvoicesController.js',

                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyVendorService.js',
                              'js/Services/ThirdPartyVendor/AddInvoicesService.js',
                         ]
                     });
                 }]
             }
         })

         .state('Inventory', {
             url: "/Inventory",
             templateUrl: "views/ThirdPartyVendor/Inventory.html",
             data: { pageTitle: 'Inventory' },
             controller: "InventoryController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'views/ThirdPartyVendor/InventoryController.js',


                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyVendorService.js',
                              // 'js/Services/ThirdPartyVendor/InventoryService.js',
                              
                         ]
                     });
                 }]
             }
         })
         .state('ThirdPartyAddItemToInventory', {
            url: "/ThirdPartyAddItemToInventory",
            templateUrl: "views/ThirdPartyVendor/AddNewItemToInventory.html",
            data: { pageTitle: 'Add Iventory Items'},
            controller: "AddNewItemToInventoryController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/ThirdPartyVendor/AddNewItemToInventoryController.js',
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ThirdPartyVendor/AddNewItemToInventoryService.js'
                        ]
                    });
                }]
            }
        })
          //ClaimAssociates 
          .state('ClaimAssociates', {
            url: "/ClaimAssociates",
            templateUrl: "views/ThirdPartyVendor/ClaimAssociates.html",
            data: { pageTitle: 'Claim Associates' },
            controller: "ClaimAssociatesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [                             
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',

                             'views/ThirdPartyVendor/ClaimAssociatesController.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ThirdPartyVendor/ClaimAssociatesService.js',
                             
                            
                        ]
                    });
                }]
            }
          })
         .state('NewClaimAssociate', {
             url: "/NewClaimAssociate",
             templateUrl: "views/ThirdPartyVendor/AddNewClaimAssociate.html",
             data: { pageTitle: 'Claim Associates' },
             controller: "AddNewClaimAssociateController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                              'views/ThirdPartyVendor/AddNewClaimAssociateController.js',
                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/AddNewClaimAssociateService.js',


                         ]
                     });
                 }]
             }
         })

        //  Administrator Third party vendor
        .state('AdministratorThirdPartyVendor', {
            url: "/AdministratorThirdPartyVendor",
            templateUrl: "views/Administrator/AdministratorThirdPartyVendor.html",
            data: { pageTitle: '3rd Party Vendor' },
            controller: "AdministratorThirdPartyVendorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',

                             'views/Administrator/AdministratorThirdPartyVendorController.js',
                             'views/ClaimCenterManager/AssignClaimForManagerController.js',

                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/Administrator/AdministratorThirdPartyVendorService.js',
                             //'js/Services/Administrator/.js',
                        ]
                    });
                }]
            }
        })
        //Invite third party vendor
         .state('InviteThirdPartyVendor', {
         url: "/InviteThirdPartyVendor",
         templateUrl: "views/Administrator/InviteThirdPartyVendor.html",
         data: { pageTitle: '' },
         controller: "InviteThirdPartyVendorController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                     files: [

                            
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',

                             'views/Administrator/InviteThirdPartyVendorController.js',

                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/Administrator/InviteThirdPartyVendorService.js',
                     ]
                 });
             }]
         }
     })


    //Edit third party vendor
     .state('EditThirdPartyVendor', {
         url: "/EditThirdPartyVendor",
         templateUrl: "views/Administrator/EditThirdPartyVendor.html",
         data: { pageTitle: '' },
         controller: "EditThirdPartyVendorController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                     files: [

                     

                     'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                     'assets/global/plugins/select2/css/select2.min.css',
                     'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                     'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                     'assets/global/plugins/select2/js/select2.full.min.js',
                     'assets/pages/scripts/components-bootstrap-select.min.js',
                     'assets/pages/scripts/components-select2.min.js',

                      'views/Administrator/EditThirdPartyVendorController.js',
                      //services
                     'js/Services/CommonServices/AuthHeaderService.js',
                      'js/Services/Administrator/EditThirdPartyVendorService.js',
                     ]
                 });
             }]
         }
     })

    //Admin Roles and Screen  Mapping
     .state('RolesAndScreenMapping', {
         url: "/RolesAndScreenMapping",
         templateUrl: "views/Administrator/RolesAndScreenMapping.html",
         data: { pageTitle: 'Roles And Screen Mapping' },
         controller: "RolesAndScreenMappingController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                     files: [
                     'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                     'assets/global/plugins/select2/css/select2.min.css',
                     'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                     'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                     'assets/global/plugins/select2/js/select2.full.min.js',
                     'assets/pages/scripts/components-bootstrap-select.min.js',
                     'assets/pages/scripts/components-select2.min.js',
                      'views/Administrator/RolesAndScreenMappingController.js',
                      //services
                      'js/Services/CommonServices/AuthHeaderService.js',
                      'js/Services/Administrator/RolesAndScreenMappingService.js',
                     ]
                 });
             }]
         }
     })

    //Admin Roles and Permisssion  Mapping
     .state('RolesAndPermissionMapping', {
         url: "/RolesAndPermissionMapping",
         templateUrl: "views/Administrator/RolesAndPermissionMapping.html",
         data: { pageTitle: 'Roles And Permission Mapping' },
         controller: "RolesAndPermissionMappingController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                     files: [
                     'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                     'assets/global/plugins/select2/css/select2.min.css',
                     'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                     'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                     'assets/global/plugins/select2/js/select2.full.min.js',
                     'assets/pages/scripts/components-bootstrap-select.min.js',
                     'assets/pages/scripts/components-select2.min.js',
                      'views/Administrator/RolesAndPermissionMappingController.js',
                      //services
                      'js/Services/CommonServices/AuthHeaderService.js',
                    'js/Services/Administrator/RolesAndPermissionMappingService.js',
                     ]
                 });
             }]
         }
     })

    // User Profile Dashboard
    //.state("profile.dashboard", {
    //    url: "/dashboard",
    //    templateUrl: "views/profile/dashboard.html",
    //    data: { pageTitle: 'User Profile' }
    //})

    // User Profile Account
    //.state("profile.account", {
    //    url: "/account",
    //    templateUrl: "views/profile/account.html",
    //    data: { pageTitle: 'User Account' }
    //})

}]);

/* Init global settings and run the app */
MetronicApp
    .run(["$rootScope", "settings", "$state", "$location", "Keepalive", "Idle", function ($rootScope, settings, $state, $location, Idle, Keepalive, RoleBasedService) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in          
            //if (next.includes("register") || next.includes("forgotpassword") || current.includes("register") || current.includes("forgotpassword")) {
            //this method not workin Internate explorer
            //}
            if (next.indexOf('register') !==-1 || next.indexOf('forgotpassword') !==-1) 
            {
                
               }
            else {
               
                if (sessionStorage.getItem("IsLogined") === "true") {
                    $rootScope.IsLoginedUser = true;
                }
                else {
                    $rootScope.IsLoginedUser = false;
                    $location.path("/");
                }
            }           
        })      
    }]);
