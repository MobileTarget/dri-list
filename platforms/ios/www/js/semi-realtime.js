(function(angular, DomenowApp, undefined){
  'use strict'  ;
  
  DomenowApp.service('SEMI_REALTIME_CHANGES', SemiRealTimeChangesMethod);
  
  SemiRealTimeChangesMethod.$inject = ['LOCAL_DB', '$http', 'utilityService', 'SocketBroadCastEvents', '$localStorage', 'myService'];
  
  function SemiRealTimeChangesMethod(LOCAL_DB, $http, utilityService, SocketBroadCastEvents, $localStorage, myService){
    var self = this ;
    
    /**
     *  Following function is used to check whether any LocalUserTask exits ? or not
     *  if exits then return it back.
     *  There is no need to dirty checking of record in localdb. 
     *  Because while saving record to localdb first of all I check whether record exits in
     *  localdb or not? if record already exits I'm going to remove old record first of all
     *  then going to save the new record into db. so next time I don't need to make dirtyCheking.
     *  and by doing like this I'm reducing memory expansion of local_db.
     **/
    self.IsLocalUserTaskExists = function(page_id){
      LOCAL_DB.GetData("USER_PAGE-"+ page_id, function(err, user_page){
        if(err){
          return [];
        }else{
          if(utilityService.isEmpty(user_page)){
            return [];
          }else{
            if(user_page.isDirty){
              return [user_page];
            }else{
              return [];
            }
          }
        }
      });
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
    self.StoreDataToLocalDb = function(server_data, isDirty){ // this method is used to save data into local_storage regarding the page and user_page
      if(!utilityService.isEmpty(server_data)){
        var page_details = server_data.detail;
        
        if(utilityService.isEmpty(page_details)){
          console.info("No need to save user_page when detail are empty");
        }else{
          for(var each in page_details){
            if(page_details[each].page_id){
                var user_page_id    = "USER_PAGE-"+ page_details[each].page_id;
                LOCAL_DB.SaveData(user_page_id, {
                  user_id			    : server_data.user._id     || 0,
                  page_id         : page_details[each].page_id,
                  synchronized    : 1,
                  status          : 1,
                  date_updated    : new Date().getTime(),
                  counts          : page_details[each].count,
                  isDirty         : isDirty
                });
            }
          }
        }
        
        LOCAL_DB.SavePages(server_data);                         
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
    
    self.SaveAllPages = function(obj,page_data){ //for web-socket refrence.
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

    self.UpdateSpecificPageDetail = function(page_id, details){
      LOCAL_DB.UpdateSpecificPageWithDetails(page_id, details, function(err, success){
        if(err) {
          console.warn("Error while updateing local pageDEtails", err);
        }else{
          console.info("Page updated successfully", success);
        }
      });
    };
    
    
    /**
     *Update unread counts for new arrived messages with the following object
     *  { isRefresh: false
     *    msg: Object { bot_data: "I didn't understand. You can try rephrasing.", user_data: "hiii" }
     *    page_id: 18
     *    phone: 919814698146
     *    previous_page: 5
     *    refresh_pages: Array [ 18, 1513748138895 ]
     *    stumped_page_id: 26
     *   }
     **/ 
    self.UpdateCountsToLocalPages = function(obj, cb){
      var refresh_pages = obj.refresh_pages;
      if(utilityService.isEmpty(refresh_pages)){
        cb("There isn't any refresh page from server.", null);
      }else{
        for(var page_id in refresh_pages){
          if(refresh_pages[page_id]){
            LOCAL_DB.GetData(refresh_pages[page_id], function(err, page_data){
              if(utilityService.isEmpty(page_data) || err){
                //console.info("page_id " + refresh_pages[page_id] +" doesn't exists in local_storage no need to do any changes");
                //cb("page_id " + refresh_pages[page_id] +" doesn't exists in local_storage no need to do any changes", null);
                LOCAL_DB.GetData("USER_PAGE-"+ refresh_pages[page_id], function(err, local_page){
                  if(utilityService.isEmpty(local_page)){
                    console.log("USER_PAGE-"+ refresh_pages[page_id] + "is not in local_storage");
                  }else{
                    var local_count = local_page.counts;
                        local_count.unread = local_count.unread + 4;
                        
                    local_page.counts    = local_count;
                    local_page.isDirty  = true ;
                    
                    //console.info("before going to save page>>>>", local_page);
                    self.saveDataLocal("USER_PAGE-"+ refresh_pages[page_id], JSON.stringify(local_page));
                  }
                });
              }else{
                var task_obj = page_data.task;
                if(task_obj.from_page_id){
                    self.UpdateLocalDbPages(task_obj.from_page_id);
                    cb(null, {previous_id: task_obj.from_page_id});
                }else{
                  console.info("from_page_id " + task_obj.from_page_id +" doesn't exists in local_storage no need to do any changes");
                  cb("from_page_id " + task_obj.from_page_id +" doesn't exists in local_storage no need to do any changes", null);
                }
              }
            });
          }
        }
        
      }
      
    };
    
    /**
     * Create User_page Locally
     **/
    
    self.createUserPage = function(data, obj){
      var isMyChat = true , phone = obj.phone, page_id = data.previous_id;
      LOCAL_DB.GetData(page_id, function(err, pages){
        if(utilityService.isEmpty(pages) || err){
          LOCAL_DB.GetData("USER_PAGE-"+ page_id, function(err, local_page){
            if(err || utilityService.isEmpty(local_page)) console.log("USER_PAGE-"+ page_id + "is not in local_storage");
            var local_count = local_page.counts;
                local_count.unread = local_count.unread + 4;
                
            local_page.counts    = local_count;
            local_page.isDirty  = true ;
            
            self.saveDataLocal("USER_PAGE-"+ page_id, JSON.stringify(local_page));
          });
        }else{
          var detail = pages.detail;
          for(var each in detail){
            if(detail[each].user_incoming){
              if(detail[each].user_incoming.message == phone.toString()){
                isMyChat = false;
                detail[each].count.unread = detail[each].count.unread + 4 ;  
              }
            }
          }
          
          if(isMyChat) {
            detail[0].count.unread = detail[0].count.unread + 1 ;
          }
          
          self.StoreDataToLocalDb(pages, true);    
        }
      });  
    };
    
    /**
     *  Following function were used in serviceHandler file to update
     *  isDirty records for user_page.
     **/
    self.getLocalData = function(key){
      LOCAL_DB.GetData(key, function(err, data){
        if(err) {
          return {};
        }else{
          return data;
        }
      });
    };
    
    self.saveDataLocal = function(key, data){
      LOCAL_DB.SaveData(key, data);
      return true;
    };
    
    self.makePageUnDirty = function(user_pages){
      if(user_pages.length){
        for(var each in user_pages){
          if(user_pages[each].isDirty){
            user_pages[each].isDirty = false;
            LOCAL_DB.SaveData("USER_PAGE-"+ user_pages[each].page_id, JSON.stringify(user_pages[each]));
            LOCAL_DB.RemoveByKey(user_pages[each].page_id);
          }
        }
      }
    };
    
    self.getAllUserPages = function(){
      return LOCAL_DB.GetAllUserPages();
    };
    
    self.setUserPageCountToDefault = function(page_id){
      LOCAL_DB.GetData('USER_PAGE-' + page_id, function(err, page_data){
        if(err || utilityService.isEmpty(page_data)) {
          console.log("UserPage doesn't exists with current page_id " + page_id);
        }else{
          if(!utilityService.isEmpty(page_data.counts)){
            if(page_data.counts.unread){
              page_data.counts.unread = 0;
              page_data.isDirty = true ;
              LOCAL_DB.SaveData("USER_PAGE-"+ page_id, JSON.stringify(page_data));
              LOCAL_DB.RemoveByKey(page_id);
              console.info("Current UserPage Sets to default values successfully!!!");
            }
          }else{
            console.log("There isn't any counts avilable for current userPage");
          }
        }
      });
    };
  }
})(angular, DomenowApp);
