(function(angular, DomenowApp, undefined){
  'use strict'  ;
  
  DomenowApp.service('SEMI_REALTIME_CHANGES', SemiRealTimeChangesMethod);
  
  SemiRealTimeChangesMethod.$inject = ['LOCAL_DB', '$http', 'utilityService', '$localStorage'];
  
  function SemiRealTimeChangesMethod(LOCAL_DB, $http, utilityService){
    var self = this ;
    
    /**
     * Clear local_db data when user logout
     **/
    self.RemoveItemFromDB = function(){
      LOCAL_DB.SaveData("APP_LOCAL_USER_TASK", []);
      LOCAL_DB.SaveData("APP_LOCAL_PAGES", []);
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
      return LOCAL_DB.GetData("APP_LOCAL_USER_TASK");
    };
    
    /**
     *  Check if request user_task is exits in database or not ?
     **/
    self.isUserTaskExistsInLocalDb = function(page_id, user_task, task_id){
      var saved_user_task = LOCAL_DB.GetData("APP_LOCAL_USER_TASK"),
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
    self.isPageExistsInLocalDb = function(page_id){
      var saved_pages = LOCAL_DB.GetData("APP_LOCAL_PAGES"),
          local_pages = {};
      angular.forEach(saved_pages, function(page){
        if(page.page_id == page_id){
          local_pages = page;
        }
      });
      return {
        isExists    : !utilityService.isEmpty(local_pages),
        local_pages : local_pages
      };
    };
    
    /**
     *  Store data into local_db when get_page api-endpoint trigers and recieved
     *  data from server side. Bascailly stores the requested_pages into database
     **/
    self.StoreDataToLocalDb = function(server_data){ 
      if(!utilityService.isEmpty(server_data)){
        var saved_pages     = LOCAL_DB.GetData("APP_LOCAL_PAGES"),
            local_user_task = LOCAL_DB.GetData("APP_LOCAL_USER_TASK");
            
        if(utilityService.isEmpty(saved_pages)) saved_pages = [];
        if(utilityService.isEmpty(saved_pages)) local_user_task =[];
        
        var isPage      = self.isPageExistsInLocalDb(server_data.page_id) ,
            isUserTask  = self.isUserTaskExistsInLocalDb(server_data.page_id);
            
        if( !(isPage.isExists) ) saved_pages.push(server_data);
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
        LOCAL_DB.SaveData("APP_LOCAL_PAGES", saved_pages);
        LOCAL_DB.SaveData("APP_LOCAL_USER_TASK", local_user_task);
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
        var saved_pages     = LOCAL_DB.GetData("APP_LOCAL_PAGES"),
            new_local_pages = [], new_user_task = [];
            
        if(utilityService.isEmpty(saved_pages)) saved_pages = [];
        angular.forEach(saved_pages, function(local_page){
          angular.forEach(server_pages, function(server_page){
            if(local_page.page_id == server_page.page_id){
              new_local_pages.push(server_page);
              new_user_task.push({
                task_id 		    : server_pages.task.task_id || 0,
                user_id			    : server_pages.user._id     || 0,
                page_id         : server_pages.page_id,
                synchronized    : 1,
                status          : 1,
                date_updated    : new Date().getTime(),
                ancestors       : [],
                unread          : 1 
              });
            }else{
              new_local_pages.push(local_page); 
            }
          });
        });
        LOCAL_DB.SaveData("APP_LOCAL_PAGES", new_local_pages);
        LOCAL_DB.SaveData("APP_LOCAL_USER_TASK", new_user_task);
      }else{
        console.warn("Exception raised while saving data to local_db.", server_pages);
      }
    };
    
    self.UpdateLocalDbPages = function(page_id){
      var local_pages     = LOCAL_DB.GetData("APP_LOCAL_PAGES"),
          updated_pages   = [];
      
      angular.forEach(local_pages, function(pages){
        if(pages.page_id !== page_id){
          updated_pages.push(pages);
        }
      });
      
      LOCAL_DB.SaveData("APP_LOCAL_PAGES", updated_pages);
    };
  }
})(angular, DomenowApp);