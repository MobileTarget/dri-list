(function(angular, DomenowApp, undefined){
    DomenowApp
    .service('RequestHandler', CommonRequestHandler);
    
    CommonRequestHandler.$inejct = ['$scope', '$http', '$localStorage', 'HttpService', 'SEMI_REALTIME_CHANGES', 'SocketBroadCastEvents', 'utilityService', '$ionicScrollDelegate', 'myService'];
    
    function CommonRequestHandler($scope, $http, $localStorage, HttpService, SEMI_REALTIME_CHANGES, SocketBroadCastEvents, utilityService, $ionicScrollDelegate, myService){
      var self = this ;

      self.Request = function(request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn){
        
        var isOnline = HttpService.isOnline(); //check if user having internet connectivity
        if (isOnline) { //if network is online
          utilityService.setBusy(true, "Processing...");
          var headers = {
            "Content-Type": "application/json"
          };
          var config = {
            headers: headers
          };
          api_mode = api_mode.toUpperCase();
          if (api_mode == "POST") { //POST request case
            var checkObj = {tableName: request_data.app.api.table_data.table, page_id: request_data.app.api.table_data.page_id};
    
            $http.post(api_url, request_data, config).then(function (res) {
              var res_data = res.data;
              if(checkObj.tableName == "add_detail") SEMI_REALTIME_CHANGES.UpdateLocalDbPages(checkObj.page_id);
              if (api_next_fn) {
                setTimeout(function() {
                  eval(api_next_fn);
                }, 500);
              }
              utilityService.setBusy(false);
            }, function (err_data) {
              console.log("api err>>>", err_data, api_on_error_fn);
              if (api_on_error_fn) {
                eval(api_on_error_fn);
              }
              utilityService.setBusy(false);
            });
          } else if (api_mode == "GET") { //GET Request case
            config.params = request_data;
            $http.get(api_url, config).then(function (res) {
              var res_data = res.data;
              eval(api_next_fn);
              utilityService.setBusy(false);
            }, function (err_data) {
              console.log("api err>>>", err_data);
              utilityService.setBusy(false);
            });
          } else if (api_mode == "GET_PAGE") { //special purpose Get_Page request
            config.params = request_data;
            var page_id   = request_data.app.api.content.page_id || $scope.config.page_id ;
                isPage    = SEMI_REALTIME_CHANGES.isPageExistsInLocalDb(page_id);
            
            //isPage.isExists = false;     //this is for debuging prupose.
            if(isPage.isExists){
              myService.apiResult = isPage.local_pages;
              $scope.setPage();
              SocketBroadCastEvents.onPageChangeSuccessfully(page_id); //update new page_id to web-socket server.
            }else{
              config.params = {app: {api: { type: "update_get_pages", content: {page_id: page_id, access_token: $localStorage.access_token , phone: $localStorage.logger_user_phone} }} , platform:{}, other_users:{}};
            
              var local_user_task = SEMI_REALTIME_CHANGES.IsLocalUserTaskExists();
              if(!utilityService.isEmpty(local_user_task)) {
                config.params.app.api.content.user_task_list = local_user_task ;
                SEMI_REALTIME_CHANGES.RemoveRecordLocally();
              }
              console.log("get_page request >>>");
              $http.get(api_url, config).then(function (res) {
                var res_data = res.data.records ;
                    page_id  = res_data.req_page.page_id;
                    
                    res_data.status = 1;
                    
                    if( (page_id == 1 ) || (page_id == 11) ){
                      console.info("No need to save Login and verify page into local_db.");
                      myService.apiResult = res_data.req_page;
                      eval(api_next_fn);
                      $timeout(function(){
                        $scope.$evalAsync(function(){
                          $ionicScrollDelegate.scrollBottom(true);
                          utilityService.setBusy(false);                  
                        });
                      },200);
                    }else{
                        SEMI_REALTIME_CHANGES.StoreDataToLocalDb(res_data.req_page); //this stores this requested page into local_db if not exists
                        
                        if(res_data.pages.length) {
                          SEMI_REALTIME_CHANGES.StorePagesToLocalDb(res_data.pages); //this stores all the pages which are sync = 0  on server
                          SEMI_REALTIME_CHANGES.SaveAllPages(res_data.pages.push(res_data.req_page)); //replace/update pages into all new_pages
                        }
                        
                        myService.apiResult = res_data.req_page;
                        eval(api_next_fn);
                        SocketBroadCastEvents.onPageChangeSuccessfully(page_id); //update new page_id to web-socket server.
                        SEMI_REALTIME_CHANGES.SaveAllPages({user_id: $localStorage.user_id}, [res_data.req_page]); //update/replace pages into all new_pages
                        $timeout(function(){
                          $scope.$evalAsync(function(){
                            $ionicScrollDelegate.scrollBottom(true);
                            utilityService.setBusy(false);                  
                          });
                        },200);
                    }
              }, function (err_data) {
                console.log("api err>>>", err_data);
                if (api_on_error_fn) {
                  eval(api_on_error_fn);
                }
                utilityService.setBusy(false);
              });
            }
          } else if(api_mode == "ALL_USER_PAGES"){
            console.log("new_page request >>>");
            config.params = {app: {api: { type: "update_get_pages", content: {page_id: 2, access_token: $localStorage.access_token , phone: $localStorage.logger_user_phone, all_pages: true } }} , platform:{}, other_users:{}};
            $http.get(api_url, config).then(function (res) {
                var res_data = res.data.records ;
                if(!utilityService.isEmpty(res_data.pages)){
                  SEMI_REALTIME_CHANGES.SaveAllPages({user_id: $localStorage.user_id}, res_data.pages);
                }else{
                  console.info("There isn't any new pages on server.....");
                }
              }, function (err_data) {
                console.warn("api err>>>", err_data);
                //alert("Exception raised >>" + err_data);
                utilityService.setBusy(false);
              });
          }else if (api_mode == "GET_DATA_FOR_TASK") {
            config.params = request_data;
            $http.get(api_url, config).then(function (result) {
              if (result.data.status === 200) {
                var populated_content = result.data.data;
                $scope.temp_data = populated_content.formatted_template;
                $scope.task_arr = populated_content.formatted_task;
                $scope.timeout_arr = populated_content.formatted_timeout;
                $scope.location_arr = populated_content.formatted_location;
                $scope.user_list = populated_content.formatted_user;
                $scope.task_data = populate_task_obj(populated_content.task_obj);
                utilityService.setBusy(false);
              }
            }, function (err) {
              console.log("Error occured while populating result", err);
              utilityService.setBusy(false);
            });
          } else if(api_mode == "GET_ALL_TASK"){
            config.params = request_data;
            $http.get(api_url, config).then(function (result) {
              if (result.data.status === 200) {
                var populated_content = result.data.data;
                $scope.all_task_list = populated_content;
              }
            }, function (err) {
              console.log("Error occured while populating result", err);
              utilityService.setBusy(false);
            });
          }else if(api_mode == "GET_ASSISTANTS"){
            config.params = request_data;
            $timeout(function(){
              utilityService.setBusy(true);
              $http
              .get(api_url, config)
              .then(function(assistants){
                var records = assistants.data.record ,
                    myDetails = [];
    
                if(records.type == "list_assistant"){
                  records = records.result;
                  if(records && records.length){
                    angular.forEach(records, function(item){
                      myDetails.push({
                        "detail_id" :	item._id,
                        "name"      :	(item.firstname||item.lastname) ? (item.firstname + " " + item.lastname) : item.virtual_phone ,
                        "page_id"   :	item._id,
                        "type"      : item.type
                      });
                    });
                  }
                  $scope.details = utilityService.sortByKey(myDetails, "name", {sort: {order: "asc"}});
                  utilityService.setBusy(false);
                }else{
                  $scope.assistant_list = records.result;
                  utilityService.setBusy(false);
                }
              }, function(err_data){
                console.log("err_data", err_data);
                utilityService.setBusy(false);
                if (api_on_error_fn) {
                  eval(api_on_error_fn);
                }
              });
            }, 200);
          }else if( api_mode == "EDIT_ASSISTANTS"){
            config.params = request_data ;
            console.log("comes in EDIT_ASSISTANT section");
            $http.get(api_url, config).then(function(api_data){
              $scope.assistant = api_data.data.records;
              $timeout(function(){
                eval(api_next_fn);
              },200);
            }, function(err_data){
              console.log("err_data", err_data);
              utilityService.setBusy(false);
              if (api_on_error_fn) {
                eval(api_on_error_fn);
              }
            });
          }else if( api_mode == "GET_USERS_GROUPS" ){
            config.params = request_data;
            $timeout(function(){
              utilityService.setBusy(true);
              $http
              .get(api_url, config)
              .then(function(users_groups){
                var records = users_groups.data.record , myDetails = [];
                if(records && records.length){
                  angular.forEach(records, function(item){
                    myDetails.push({
                      "id"        :	item._id,
                      "name"      :	item.group_name || "Anynomous Group",
                      "page_id"   :	item._id,
                      "owner_id"  : item.owner_id
                    });
                  });
                }
                $scope.details = utilityService.sortByKey(myDetails, "name", {sort: {order: "asc"}});
                utilityService.setBusy(false);
              }, function(err_data){
                console.log("err_data", err_data);
                utilityService.setBusy(false);
                if (api_on_error_fn) {
                  eval(api_on_error_fn);
                }
              });
            }, 200);
          }else if(api_mode == "ADD_ASSISTANT_INTO_GROUP"){
            $http.post(api_url, request_data, config).then(function (res) {
              var res_data = res.data;
              utilityService.showAlert("Success: " + res_data.msg ? res_data.msg: "Record updated successfully" );
              utilityService.setBusy(false);
            }, function (err_data) {
              if (api_on_error_fn) eval(api_on_error_fn);
              utilityService.setBusy(false);
            });
          }else if(api_mode == "UPDATE_SCHEDULE"){
            $http.post(api_url, request_data, config).then(function (res) {
              var res_data = res.data,
                  page_id = $scope.config.from_page_id || 1504598299371 ;
              $scope.goPage(page_id);
              //utilityService.setBusy(false);
            }, function (err_data) {
              console.log("error <>>>>>>", err_data);
              if (api_on_error_fn) eval(api_on_error_fn);
              utilityService.setBusy(false);
            });
          }else if (api_mode == "OTHER") { //Un specified case
            if (api_type == "URL") {
              utilityService.setBusy(false);
    
              var url = request_data.url || "";
              if (url) {
                if (window.cordova) {
                  cordova.InAppBrowser.open(url, "_blank", "location=yes");
                } else {
                  window.open(url, "_system");
                }
              } else {
                utilityService.showAlert("Warning: URL is missing.");
              }
            }
          } else {
            console.log("Warning: api_mode is missing.");
            utilityService.setBusy(false);
          }
        } else { //offline
    
          if (api_offline_queue) { //save to queue
            var offline_data = JSON.parse($localStorage.offline_queue);
            if (Object.prototype.toString.call(offline_data) !== '[object Array]') {
              offline_data = [];
            }
            var queue_data = {
              "page_id": $scope.config.page_id,
              "api_type": api_type,
              "api_url": api_url,
              "api_mode": api_mode,
              "request_data": request_data
            };
            offline_data.push(queue_data);
            $localStorage.offline_queue = JSON.stringify(offline_data);
          }
          if (api_offline_fn) {
            eval(api_offline_fn);
          }
        }
      };
    }
})(angular, DomenowApp);
