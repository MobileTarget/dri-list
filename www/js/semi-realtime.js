(function(angular, DomenowApp, undefined){
  'use strict'  ;
  
  DomenowApp.service('SEMI_REALTIME_CHANGES', SemiRealTimeChangesMethod);
  
  SemiRealTimeChangesMethod.$inject = ['LOCAL_DB', '$http', 'utilityService', 'SocketBroadCastEvents', '$localStorage'];
  
  function SemiRealTimeChangesMethod(LOCAL_DB, $http, utilityService, SocketBroadCastEvents, $localStorage){
    var self = this ;
    
    /**
     * Clear local_db data when user logout
     **/
    self.RemoveItemFromDB = function(){
      LOCAL_DB.SaveData("APP_LOCAL_USER_TASK", []);
      return true;
    };
     /**
      * remove old user_task from local_db before set new task or once updated
      * to server-side just remove it from local_machine.
      **/
    self.RemoveRecordLocally = function(){
      LOCAL_DB.SaveData("APP_LOCAL_USER_TASK", []);
      return true;
    };
    /**
     *  Following function is used to check whether any LocalUserTask exits ? or not
     *  if exits then return it back.
     *  There is no need to dirty checking of record in localdb. 
     *  Because while saving record to localdb first of all I check whether record exits in
     *  localdb or not? if record already exits I'm going to remove old record first of all
     *  then going to save the new record into db. so next time I don't need to make dirtyCheking.
     *  and by doing like this I'm reducing memory expansion of local_db.
     **/
    self.IsLocalUserTaskExists = function(){
      return LOCAL_DB.GetTask("APP_LOCAL_USER_TASK");
    };
    
    /**
     *  Check if request user_task is exits in database or not ?
     **/
    self.isUserTaskExistsInLocalDb = function(page_id, user_id, task_id){
      var saved_user_task = LOCAL_DB.GetTask("APP_LOCAL_USER_TASK"),
          local_user_task = {};
      angular.forEach(saved_user_task, function(user_task){
        if(
          (page_id == user_task.page_id)  &&
          (user_id == user_task.user_id)  &&
          (task_id == user_task.task_id)
        ){
          local_user_task = user_task;
        }
      });
      
      return {
        isExists : !utilityService.isEmpty(local_user_task),
        user_task: local_user_task
      };
    };
    
    /**
     *  check is pageExists in local_db with respect to page_id
     **/
    self.isPageExistsInLocalDb = function(page_id, callback){
      LOCAL_DB.GetData(page_id, function(err, saved_pages){
        if(err) {
          callback(err, null);
        }else{
          callback(null, {
            isExists    : !utilityService.isEmpty(saved_pages),
            local_pages : saved_pages
          });
        }
      });
    };
    
    /**
     *  Store data into local_db when get_page api-endpoint trigers and recieved
     *  data from server side. Bascailly stores the requested_pages into database
     **/
    self.StoreDataToLocalDb = function(server_data){ 
      if(!utilityService.isEmpty(server_data)){
        
        var local_user_task = LOCAL_DB.GetTask("APP_LOCAL_USER_TASK");
        if(utilityService.isEmpty(local_user_task)) local_user_task =[];
        
        var isUserTask  = self.isUserTaskExistsInLocalDb(server_data.page_id, server_data.user_id, server_data.task_id);
        if( !(isUserTask.isExists)) {
          local_user_task.push({
            task_id 		    : server_data.task.task_id || 0,
            user_id			    : server_data.user._id     || 0,
            page_id         : server_data.page_id,
            synchronized    : 1,
            status          : 1,
            date_updated    : new Date().getTime(),
            ancestors       : [],
            unread          : 1 
          });
        }
        LOCAL_DB.SavePages(server_data);                         
        LOCAL_DB.SaveData("APP_LOCAL_USER_TASK", local_user_task);
        return true;
      }else{
        console.warn("Exception raised while saving data to local_db.", server_data);
      }
    };
    
    /**
     *  Save multiple-pages if comes in update_get_pages
     *  from user_task.synchronized = 0. In that case pages comes in format of array not in a Object.
     *  Basically saves all the pages which are sync = 0 on server and saved into local_db.
     **/
    
    self.StorePagesToLocalDb = function(server_pages){
      if(!utilityService.isEmpty(server_pages)){
        var new_local_pages = [], new_user_task = [];
        angular.forEach(server_pages, function(server_page){
            new_local_pages.push(server_page);
            new_user_task.push({
              task_id 		    : server_page.task.task_id || 0,
              user_id			    : server_page.user._id     || 0,
              page_id         : server_page.page_id,
              synchronized    : 1,
              status          : 1,
              date_updated    : new Date().getTime(),
              ancestors       : [],
              unread          : 1 
            });
        });
        LOCAL_DB.SavePages(new_local_pages);
        LOCAL_DB.SaveData("APP_LOCAL_USER_TASK", new_user_task);
      }
    };
    
    self.UpdateLocalDbPages = function(page_id){
      LOCAL_DB.RemoveByKey(page_id);
      return true;
    };
    
    self.SaveAllPages = function(obj,page_data){
      LOCAL_DB.SaveData("NEW_PAGES", page_data);
      self.StorePagesToLocalDb(page_data);
      SocketBroadCastEvents.sendNewPagesToWebSocketServer(obj.user_id, page_data);
    };
    
    self.logout = function(){
      var phone = $localStorage.logged_user_phone ;
      LOCAL_DB.ClearAll();
      setTimeout(function(){
        $localStorage.logged_user_phone = phone;
      }, 200);
      return true;
    };
    
    self.updateLocalPagesWithServer = function(page_arr){
      if( utilityService.isEmpty(page_arr) ){
        console.warn("Cannot remove pages from Local_db due to undefined||null page_arr", page_arr);
      }else{
        angular.forEach(page_arr, function(page_id){
          LOCAL_DB.RemoveByKey(page_id);
        });
        console.info("Request pages were removed from local_db to get serverPages", page_arr);
      }
    };
  }
})(angular, DomenowApp);