angular.module('MetronicApp').controller('LoginController', function ($rootScope, UserService, LoginService, $scope, $http, $location, $cookies, $timeout, $state, $translate,
    $translatePartialLoader, RoleBasedService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('Login');
    $translate.refresh();

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.errormsg = "";
    $scope.username = "";
    $scope.password = "";
    $scope.errormsg = "";   
    $scope.RememberMe=false;
    
    ////Implement auto login if remember me clicked
    AutoLogIn();
    $scope.AutoLogIn = AutoLogIn;
    function AutoLogIn()
    {
        var flag = $cookies.get("UserName");
        if (angular.isDefined(flag))
        {
            $scope.username = $cookies.get("UserName");
            $scope.password = $cookies.get("Password");
            LogIn();
        }          
    }

    $scope.LogIn = LogIn;
    function LogIn(ev)
    {
        delete $http.defaults.headers.common['X-Auth-Token'];
        $scope.token = ""; 
        var  data= {
            "username": $scope.username,
            "password": $scope.password
        };       
        var response=LoginService.LogIn(data);
        response.then(function(success){
            var result = UserService.initUserDetails(success.data, $scope.password,$scope.RememberMe);
            $http.defaults.headers.common['X-Auth-Token'] = success.data.data.token;            
            $scope.RolePermission = success.data.data.role;
            //Make single list of screen and its permission stored in session uisng RolebasedService
            $scope.ScreenList = [];
            $scope.RoleList = [];
            for (var i = 0; i < $scope.RolePermission.length; i++) {
                
                if ((angular.isDefined($scope.RolePermission[i].roleName)) && ($scope.RolePermission[i].roleName !== null)) {
                    //Get Role List
                    $scope.RoleList.push($scope.RolePermission[i].roleName);
                }
           
                if ($scope.RolePermission[i].permissions !== null) {
                    //Get Screen List
                    for (var j = 0; j < $scope.RolePermission[i].permissions.length; j++) {
                        $scope.ScreenList.push($scope.RolePermission[i].permissions[j].name);
                    }                   
                }               
            }
            //Set Role of user 
            RoleBasedService.SetUserRoles($scope.RoleList[0]);
            //Get set Home page for each role  RoleBasedService.SetHomePageForUser($scope.RoleList); to save multiple row
            RoleBasedService.SetHomePageForUser($scope.RoleList[0]);
            //set screen list of logged in user
            RoleBasedService.SetUserScreenList($scope.ScreenList);
            
              
            $location.path(RoleBasedService.GetHomePageForUser());

            // init core components 
            Layout.init(); 
            App.initComponents();
        },function(error){
            $scope.errormsg = "Invalid userid or password..";
        });      
    }

    $scope.RegisterUserForm = RegisterUserForm;
    function RegisterUserForm(event)
    {
        $location.path('/register');
    }
   $scope.ForgotPasswordForm = ForgotPasswordForm;
 function  ForgotPasswordForm(event){
     $location.path('/forgotpassword');
   }
});
