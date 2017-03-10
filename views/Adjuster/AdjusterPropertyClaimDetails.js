angular.module('MetronicApp').controller('AdjusterPropertyClaimController', function ($rootScope, AdjusterPropertyClaimDetailsService, $uibModal, $scope, settings, $filter, $http, $timeout, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('AdjusterPropertyClaimDetails');
    $translate.refresh();


    //Sorting of datatbale
    $scope.sortpostlostitem = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.sortVendor = function (keyname) {
        $scope.sortVendorKey = keyname;
        $scope.reverseVendor = !$scope.reverseVendor;
    }

    $scope.sortClaimDetails = function (keyname) {
        $scope.sortClaimDetailsKey = keyname;
        $scope.reverseClaimDetails = !$scope.reverseClaimDetails;
    }

    //Varaibles
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.ClaimNumber = sessionStorage.getItem("AdjusterClaimNo");
    $scope.ClaimStatusInvoiceDetails = [];
    $scope.ClaimStatusContent = [];
    $scope.ClaimAttachments = [];
    $scope.ClaimParticipantsList=[]; //we are adding vendor working on claim to this object  which is used for autocomplete extender
    $scope.ParticipantId=null;
    $scope.ParticipantName="";
    $scope.ErrorMessage = "";
    $scope.LostOrDamagedContent = [];
    $scope.LostDamagedContentByCategory = [];//for stoaring lost damaged item list to preform category wise selection

    $scope.DdlSourceCategoryList = [];
    $scope.VendorsAgainstClaim = [];
    $scope.ClaimNotes = [];
   // $scope.EventDate = new Date("dd/mm/yyyy");
    $scope.CommonObj =
        {
            claimNote: "",
            eventNote:"",
            Categories: "ALL",
            Attachment : '',
            EventDate: $filter('date')(new Date(), "dd/MM/yyyy")
        };

    $scope.displayEvent = true;
    $scope.displayNotes = false;
    $scope.displayParticipant = false;
    $scope.displayOrigionalItems = true;
    $scope.displayContentList = false;
    $scope.reverseIcon = true;
    $scope.displayClaimDetails = false;
    $scope.displayAddAttachmentbtn = true;
    $scope.displayClaimFileName = false;
  

    $scope.Notes = [
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' },
                { Author: 'LN,FN', Date: '12:45, 09th Dec 2016', EventType: 'Notification', Message: 'Message', Reminder: '12:45, 09th Dec 2016' }
    ];

    $scope.ShowEvent = function () {
        $scope.displayEvent = true;
        $scope.displayNotes = false;
        $scope.displayParticipant = false;
    }
    $scope.ShowNotes = function () {
        $scope.displayEvent = false;
        $scope.displayNotes = true;
        $scope.displayParticipant = false;
    }
    $scope.ShowParticipant = function () {
        $scope.displayEvent = false;
        $scope.displayNotes = false;
        $scope.displayParticipant = true;
    }

    $scope.showOriginalItems = function () {
        $scope.displayOrigionalItems = true;
        $scope.displayContentList = false;
    }
    $scope.showContentList = function () {
        $scope.displayOrigionalItems = false;
        $scope.displayContentList = true;
    }


    function init() {
        if (sessionStorage.getItem("AdjusterClaimId") != null || sessionStorage.getItem("AdjusterClaimNo") != null) {


            //get claim status details for invoice section API #155

            var param = {

                "id": sessionStorage.getItem("AdjusterClaimId"),
               
            };

            var getpromise = AdjusterPropertyClaimDetailsService.getClaimsStatusInvoiceDetails(param);
            getpromise.then(function (success) {
            
                $scope.ClaimStatusInvoiceDetails = success.data.data;
            }, function (error) {
                //$scope.ErrorMessage =error.data.errorMessage;
            });

            //--------------------------------------------------------------------------------------------------------------

            //get claim status details for content section API #158
            var param = {

                "id": sessionStorage.getItem("AdjusterClaimId")
             
            };

            var getpromise = AdjusterPropertyClaimDetailsService.getClaimsStatusContentDetails(param);
            getpromise.then(function (success) {
               
                $scope.ClaimStatusContent = success.data.data;

            }, function (error) {
                //$scope.ErrorMessage =error.data.errorMessage;
            });
            //--------------------------------------------------------------------------------------------------------------

            //Get lost or damaged content  API #78
            var param = {
                //"claimId": sessionStorage.getItem("AdjusterClaimId")
                "claimId": 482
            }

            var getpromise = AdjusterPropertyClaimDetailsService.getLostOrDamagedContent(param);
            getpromise.then(function (success) {

                $scope.LostOrDamagedContent = success.data.data;
                $scope.LostDamagedContentByCategory = success.data.data;; //stoaring value in another object to perform category wise selection

            }, function (error) {
                // $scope.ErrorMessage = error.data.errorMessage;
            });

            //--------------------------------------------------------------------------------------------------------------

            //Get Category List API #161

            var getpromise = AdjusterPropertyClaimDetailsService.getCategories();
            getpromise.then(function (success) {
                $scope.DdlSourceCategoryList = success.data.data;

            }, function (error) {
                //$scope.ErrorMessage = error.data.errorMessage;
            });


            //--------------------------------------------------------------------------------------------------------------

            // get active vendors against claim with all details for binding to grid
            var param =
               {
                   "claimNumber": sessionStorage.getItem("AdjusterClaimNo").toString()
                  
               }

            var getpromise = AdjusterPropertyClaimDetailsService.getVendorsAgainstClaimDetails(param);
            getpromise.then(function (success) {
               
                $scope.VendorsAgainstClaim = success.data.data;
               
            }, function (error) {

                //$scope.ErrorMessage = error.data.errorMessage;
            });



            //--------------------------------------------------------------------------------------------------------------

            // get active vendors against claim for autocomplete textbox
            var param =
               {
                   "claimNumber": sessionStorage.getItem("AdjusterClaimNo").toString()

               }

            var getpromise = AdjusterPropertyClaimDetailsService.getVendorsListAgainstClaim(param);
            getpromise.then(function (success) {
                debugger;
                $scope.ClaimParticipantsList = success.data.data;
            }, function (error) {

                //$scope.ErrorMessage = error.data.errorMessage;
            });

            //--------------------------------------------------------------------------------------------------------------

            // get claim notes API New-#126
            var param =
               {
                   "claimId": sessionStorage.getItem("AdjusterClaimId").toString()
               }

            var getpromise = AdjusterPropertyClaimDetailsService.getClaimNotes(param);
            getpromise.then(function (success) {
                debugger;
                $scope.ClaimNotes = success.data.data;
            }, function (error) {

                // $scope.ErrorMessage = error.data.errorMessage;
            });

            //----------------------------------------------------------------------------------------------------------------

            //get claim attachments #156
            var param =
              {
                 "claimNumber":sessionStorage.getItem("AdjusterClaimNo").toString()
              }

            var getpromise = AdjusterPropertyClaimDetailsService.getClaimAttachments(param);
            getpromise.then(function (success) {
                debugger;
                $scope.ClaimAttachments = success.data.data;
            }, function (error) {

                // $scope.ErrorMessage = error.data.errorMessage;
            });

            //----------------------------------------------------------------------------------------------------------------

            
        }

        else {
            $location.url('AdjusterDashboard'); //if session data is lost then redirect to previous page
        }

    }

    init();
    $scope.IconClick=function()
    {
        $("#hdnDate").trigger("click");
      
    }
    $scope.ModalAssignAdjustor = function () {
        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "/views/Adjuster/AdjusterList.html",
                controller: "AdjustorListController",

                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {
                        $rootScope.items = "Root";
                        return "Testing Pas Value";
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

    $scope.AssignPostLostItem = function () {

        $location.url('AssignPostLostItem')
        //$scope.animationsEnabled = true;
        //$scope.items = "Testing Pas Value";

        //var out = $uibModal.open(
        //    {size:"lg",
        //        animation: $scope.animationsEnabled,
        //        templateUrl: "/views/Adjuster/AssignPostLostItem.html",
        //        controller: "AssignPostLostItemController",

        //        resolve:
        //        {
        //            /**
        //             * @return {?}
        //             */

        //            items: function () {
        //                $rootScope.items = "Root";
        //                return "Testing Pas Value";
        //            }
        //        }

        //    });
        //out.result.then(function (value) {

        //    //Call Back Function success
        //}, function () {

        //});
        //return {
        //    open: open
        //};
    }

    //Get items by category
    $scope.GetItemsByCategory = GetItemsByCategory;
    function GetItemsByCategory(e) {


        if (($scope.CommonObj.Categories === "ALL") || (angular.isUndefined($scope.CommonObj.Categories) || $scope.CommonObj.Categories === null)) {
            $scope.LostOrDamagedContent = $scope.LostDamagedContentByCategory;
        }
        else {

            $scope.LostOrDamagedContent = $filter('filter')($scope.LostDamagedContentByCategory, { categoryName: $scope.CommonObj.Categories });

        }


    }



    //Delete Items Form Damage Lost
    $scope.LostOrDamagedContent;
    $scope.DeleteListLostDamageItem = [];

    $scope.DeleteAllItems = DeleteAllItems;
    function DeleteAllItems() {
        $scope.DeleteListLostDamageItem = [];
        if ($scope.DeleteAll) {
            angular.forEach($scope.LostOrDamagedContent, function (item) {
                $scope.DeleteListLostDamageItem.push(item.itemId)
            });
        }
    }

    $scope.exists = exists;

    function exists(item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.AddToDeleteList = function (item) {
        var idx = $scope.DeleteListLostDamageItem.indexOf(item);
        if (idx > -1) {
            $scope.DeleteAll = false;
            $scope.DeleteListLostDamageItem.splice(idx, 1);
        }
        else {
            $scope.DeleteListLostDamageItem.push(item);
        }
    }

    $scope.DeletItem = DeletItem;
    function DeletItem(ev) {
        bootbox.confirm({
            size: "",
            title: $translate.instant('ClaimDetails_Delete.Title'),
            message: $translate.instant('ClaimDetails_Delete.Message'), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('ClaimDetails_Delete.BtnYes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('ClaimDetails_Delete.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    var paramIdList = [];
                    angular.forEach($scope.DeleteListLostDamageItem, function (item) {
                        paramIdList.push({ "itemId": item })
                    });
                    var response = AdjusterPropertyClaimDetailsService.removePostLostItem(paramIdList);
                    response.then(function (success) { //Filter list and remove item     
                        $scope.DeleteListLostDamageItem = [];
                        var paramLostDamageList = {
                            "claimId": sessionStorage.getItem("AdjusetrClaimId")
                        };
                        var response = AdjusterPropertyClaimDetailsService.getLostOrDamagedContent(paramLostDamageList);
                        response.then(function (success) { $scope.LostOrDamagedContent = success.data.data; }, function (error) { });
                    }, function (error) { });
                }
            }
        });
    }
    //End Post loss
    $scope.back = back;
    function back() {
        $location.url('AdjusterDashboard');
    }

    //Redirect to line item details
    $scope.openLineItemdetails = openLineItemdetails;
    function openLineItemdetails(item) {

        //  sessionStorage.setItem("AdjusterPostLostItemId", item.itemId)
        sessionStorage.setItem("AdjusterPostLostItemId", 27716)
        $location.url('AdjusterLineItemDetails');
    }
    $scope.ApproveClaim = ApproveClaim;
    function ApproveClaim(e) {

        bootbox.alert({
            size: "",
            title: "Approve Claim",
            closeButton: false,
            message: "The claim details approved successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }

    $scope.SaveClaimDetails = SaveClaimDetails;
    function SaveClaimDetails(e) {
        bootbox.alert({
            size: "",
            closeButton: false,
            title: "Claim Details",
            message: "Claim details updated successfully..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }


    $scope.AddnewItemPopup = AddnewItemPopup;
    function AddnewItemPopup() {
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "/views/Adjuster/AddNewLostDamageItem.html",
                controller: "AddNewLostDamageItemController",
                resolve:
                {
                    items: function () {
                        return "Testing Pas Value";
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

    $scope.showAddNoteBox = false; //hide addd note textbox

    $scope.ShowAddNoteArea = function (e) {
        $scope.showAddNoteBox = true;
    }


    //Add note against claim API #66
    $scope.AddNote = function (e) {
      
        var data = new FormData();
        data.append("mediaFilesDetail", JSON.stringify([{ "fileName": $scope.fileName, "fileType": $scope.FileType, "extension": $scope.FileExtension, "filePurpose": "NOTE", "latitude": null, "longitude": null }]))
        data.append("noteDetail", JSON.stringify({ "claimId": sessionStorage.getItem("AdjusterClaimId"), "senderName": $scope.ParticipantName, "addedBy": sessionStorage.getItem("Name"), "addedById": sessionStorage.getItem("UserId"), "message": $scope.CommonObj.claimNote }))
        data.append("file", $scope.files[0]);

        var getpromise = AdjusterPropertyClaimDetailsService.addClaimNoteWithOptionalAttachment(data);
        getpromise.then(function (success) {
            debugger;
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {

                $scope.CommonObj.claimNote = "";
                angular.element("input[type='file']").val(null);
                $scope.fileName = '';
                $scope.FileType = '';
                $scope.FileExtension = '';

            }
        }, function (error) {
           
            //$scope.ErrorMessage = error.data.errorMessage;
        });


    }


    $scope.HideAddNoteArea = function (e) {
        $scope.CommonObj.claimNote = "";
        $scope.showAddNoteBox = false;

    }

    //Open Add New Vendor PopUp
    $scope.OpenAddNewVendorModel = function (e) {
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size: "lg",
                templateUrl: "/views/Adjuster/AddNewVendor.html",
                controller: "AddNewVendorController",
                resolve:
                {
                    items: function () {
                        return "Testing Pas Value";
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
    //open model item payout
    $scope.openItemPayoutModel = function openItemPayoutModel() {

        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size: "lg",
                templateUrl: "/views/Adjuster/ItemPayout.html",
                controller: "ItemPayoutController",

                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {
                        $rootScope.items = "Root";
                        return "Testing Pas Value";
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

    //open model item value
    $scope.openValueModel = function openValueModel() {

        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "/views/Adjuster/ItemValue.html",
                controller: "ItemValueController",

                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {
                        $rootScope.items = "Root";
                        return "Testing Pas Value";
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

    //Go to Item settled page
    $scope.GotoItemStteled = GotoItemStteled;
    function GotoItemStteled() {

        $location.url('ItemsSetteled');

    }
    $scope.GotoItemToBeStteled = GotoItemToBeStteled;
    function GotoItemToBeStteled() {

        $location.url('ItemsToBeSetteled');

    }

    $scope.HoldoverDetails = function () {
        $location.url('ItemsHoldover');
    }
    $scope.GotoVendorInvoices = function () {
        $location.url('VendorInvoices');
    }


    $scope.showDetails = function () {
        $scope.displayClaimDetails = !$scope.displayClaimDetails;

        $scope.reverseIcon = !$scope.reverseIcon;
    }
    

    $scope.AddEvent=function()
    {
     
            alert($scope.CommonObj.EventDate);
            alert($scope.EventTime);
            alert($scope.CommonObj.eventNote);
            alert($scope.ParticipantId);
        
    }
    ////External Functions for time picker

// -------Time picker--------------------------------

    /** @type {Date} */
    $scope.EventTime = new Date;
    /** @type {number} */
    $scope.hstep = 1;
    /** @type {number} */
    $scope.mstep = 15;
    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    /** @type {boolean} */
    $scope.ismeridian = true;
    /**
     * @return {undefined}
     */
    $scope.toggleMode = function () {
        /** @type {boolean} */
        $scope.ismeridian = !$scope.ismeridian;
    };
    /**
     * @return {undefined}
     */
    $scope.update = function () {
        /** @type {Date} */
        var d = new Date;
        d.setHours(14);
        d.setMinutes(0);
        /** @type {Date} */
        $scope.EventTime = d;
    };
    /**
     * @return {undefined}
     */
    $scope.changed = function () {
        debugger;
        $log.log("Time changed to: " + $scope.EventTime);
    };
    /**
     * @return {undefined}
     */
    $scope.clear = function () {
        /** @type {null} */
        $scope.EventTime = null;
    };

//--------End Time Picker-------------------------------------------------------------


//--------Auto complete extender to search and participant------------------------------

   
    $scope.ParticipantName = "";
    $scope.afterSelectedParticipant = function (selected) {
        if (selected) {

            $scope.ParticipantId = selected.originalObject.id;
            $scope.ParticipantName = selected.originalObject.firstName + " " + selected.originalObject.lastName;
          
        }
    }


    // search function to match full text
    $scope.localSearch = function (str) {
        debugger;
        var matches = [];
        $scope.ClaimParticipantsList.forEach(function (person) {
            debugger;
            var fullName = person.firstName + ' ' + person.lastName;
            if ((person.firstName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (person.lastName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (fullName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
                matches.push(person);
            }
        });
        return matches;
    };


    //-------- End Auto complete extender --------------------------------------------------

    //------File Upload----------------------------------------------------

    //for note attachment
    $scope.SelectNoteFile=  function ()
    {
        angular.element('#NoteFileUpload').trigger('click');
       
    }

    $scope.fileName = '';
    $scope.FileExtension = '';
    $scope.FileType = '';
    $scope.files = [];
    $scope.getNoteFileDetails = function (e) {
        debugger;
        $scope.$apply(function () {
            $scope.fileName = e.files[0].name;
            $scope.FileType = e.files[0].type
            $scope.FileExtension = $scope.fileName.substr($scope.fileName.lastIndexOf('.'))
            $scope.files.push(e.files[0]);
            fr = new FileReader();
            //fr.onload = receivedText;
            fr.readAsDataURL(e.files[0]);
        });
        debugger;
    };


    //for claim attachment

    $scope.SelectClaimFile=function()
    {
        angular.element('#ClaimFileUpload').trigger('click');
      
    }

    $scope.ClaimfileName = '';
    $scope.Claimfiles = [];
    $scope.getClaimFileDetails = function (e) {
        debugger;
        $scope.displayClaimFileName = true;
        $scope.displayAddAttachmentbtn = false;
        $scope.$apply(function () {
            $scope.ClaimfileName = e.files[0].name;
            $scope.Claimfiles.push(e.files[0]);
            fr = new FileReader();
            //fr.onload = receivedText;
            fr.readAsDataURL(e.files[0]);
        });

       
    };


    $scope.AddClaimAttachment=function()
    {
        var data = new FormData();
        data.append("claimDetail", { "claimNumber": "C90GUW08" })
        data.append("filesDetails", [{ "fileName": "Claim Invoice", "fileType": "INVOICE", "extension": ".png", "filePurpose": "CLAIM" }])
        data.append("file", $scope.Claimfiles[0]);
   
        var getpromise = AdjusterPropertyClaimDetailsService.addClaimAttachment(data);
        getpromise.then(function (success) {
            debugger;
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                $scope.CommonObj.claimNote = "";
            }
        }, function (error) {

            $scope.ErrorMessage = error.data.errorMessage;
        });
        
        angular.element("input[type='file']").val(null);
        $scope.displayClaimFileName = false;
        $scope.displayAddAttachmentbtn = true;
    }
    $scope.ClearAttachments=function()
    {
        angular.element("input[type='file']").val(null);
      
        $scope.displayClaimFileName = false;
        $scope.displayAddAttachmentbtn = true;
    }
    //------End File Upload----------------------------------------------------
});