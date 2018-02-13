(function(angular, DomenowApp, undefined) {
    DomenowApp
        .service('CommonRequestHandler', CommonRequestHandler);

    function CommonRequestHandler($rootScope, $http, $localStorage, HttpService, SEMI_REALTIME_CHANGES, SocketBroadCastEvents, utilityService, $ionicScrollDelegate, myService, $timeout, ServiceHandler) {
        var self = this;

        self.commonHandler = function($scope, request_data) {
            request_data.app.api.user_id = $localStorage.user_id;
            request_data.app.api.access_token = $localStorage.access_token;
            var api_url = request_data.app.api.api_url || $scope.api_url + "/master_api_handler";
            var api_mode = request_data.app.api.api_mode || "GET";
            var api_type = request_data.app.api.api_type || "";
            var api_next_fn = request_data.app.api.api_next_fn || "";
            var api_offline_queue = request_data.app.api.api_offline_queue || "";
            var api_offline_fn = request_data.app.api.api_offline_fn || "";
            var api_on_error_fn = request_data.app.api.api_on_error_fn || "";
            delete request_data.app.api.api_url;
            delete request_data.app.api.api_mode;
            delete request_data.app.api.api_type;
            delete request_data.app.api.api_next_fn;
            delete request_data.app.api.api_on_error_fn;
            delete request_data.app.api.api_offline_queue;
            delete request_data.app.api.api_offline_fn;
            api_type = api_type.toUpperCase();
            switch (api_type) {
                case "ADD_DETAIL":
                    {
                        api_offline_queue = true;
                        api_offline_fn = "$scope.mark_detail_pending()";
                        api_next_fn = api_next_fn || "$scope.getPage()";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "POST";
                        break;
                    }
                case "DELETE_DETAIL":
                    {
                        api_offline_queue = true;
                        api_offline_fn = "$scope.mark_detail_pending()";
                        api_next_fn = api_next_fn || "$scope.deleteDetail(request_data)";
                        api_on_error_fn = api_on_error_fn || "$scope.delete_error_fn(request_data, err_data)";
                        api_mode = "POST";
                        break;
                    }
                case "GET_PAGE":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "$scope.setPage()";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "GET_PAGE";
                        break;
                    }
                    //all_user_pages      
                case "ALL_USER_PAGES":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "$scope.setPage()";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "ALL_USER_PAGES";
                        break;
                    }
                case "UPDATE_GET_USER_TASK":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "";
                        api_mode = "GET";
                        break;
                    }
                case "UPDATE_GET_PAGES":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "";
                        api_mode = "GET";
                        break;
                    }
                case "URL":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "";
                        api_mode = "OTHER";
                        break;
                    }
                case "UPDATE_MORE_INFO":
                    {
                        api_offline_queue = true;
                        api_offline_fn = "$scope.mark_detail_pending()";
                        api_next_fn = api_next_fn || "$scope.getPage()";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "POST";
                        break;
                    }
                case "UPDATE_USER_DETAILS":
                    {
                        api_offline_queue = true;
                        api_offline_fn = "$scope.mark_detail_pending()";
                        api_next_fn = api_next_fn || "$scope.goPage(2)";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "POST";
                        break;
                    }
                case "UPDATE_EDIT_SHORT_DETAIL":
                    {
                        var obj = {};
                        obj[request_data.app.api.table_data.type] = request_data.app.api.table_data.type;
                        request_data.app.api.table_data.type = obj;
                        api_offline_queue = true;
                        api_offline_fn = "$scope.mark_detail_pending()";
                        api_next_fn = api_next_fn || "$scope.getPage(2)";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "POST";
                        break;
                    }
                case "GET_DATA_FOR_TASK":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "GET_DATA_FOR_TASK";
                        break;
                    }
                case "GET_ALL_TASK":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "GET_ALL_TASK";
                        break;
                    }
                case "ADD_DETAIL_TO_TASK":
                    {

                        //remove extra data which are mot requried.
                        delete request_data.app.api.table_data.type;
                        delete request_data.app.api.table_data.display_if_empty;
                        delete request_data.app.api.table_data.message;
                        delete request_data.app.api.table_data.page_id;
                        delete request_data.app.api.table_data.task_name;

                        api_offline_queue = false;
                        api_offline_fn = "";
                        api_next_fn = "$scope.success_fn(res_data)";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "POST";
                        break;
                    }
                case "GET_ASSISTANTS":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "GET_ASSISTANTS";
                        break;
                    }
                case "EDIT_ASSISTANTS":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "$scope.goPage(21);";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "EDIT_ASSISTANTS";
                        break;
                    }
                case "ADD_ASSISTANTS":
                    {
                        api_offline_queue = true;
                        api_offline_fn = "$scope.mark_detail_pending()";
                        api_next_fn = api_next_fn || "$scope.getPage(20)";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "POST";
                        break;
                    }

                case "GET_USERS_GROUPS":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "GET_USERS_GROUPS";
                        break;
                    }

                case "ADD_ASSISTANT_INTO_GROUP":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "ADD_ASSISTANT_INTO_GROUP";
                        break;
                    }
                case "UPDATE_SCHEDULE":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "$scope.getPage(config.from_page_id)";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "UPDATE_SCHEDULE";
                        break;
                    }

                case "PAGINATION_DATA":
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = "";
                        api_on_error_fn = api_on_error_fn || "$scope.add_error_fn(request_data, err_data)";
                        api_mode = "PAGINATION_METHOD";
                        break;
                    }

                default:
                    {
                        api_offline_queue = false;
                        api_offline_fn = "$scope.goOffline()";
                        api_next_fn = api_next_fn || "$scope.defaultNextFn(request_data, res_data)";
                        api_on_error_fn = api_on_error_fn || "";
                        api_mode = "OTHER";
                        break;
                    }
            }
            ServiceHandler.Request($scope, request_data, api_url, api_mode, api_type, api_next_fn, api_offline_queue, api_offline_fn, api_on_error_fn);
        };
    }
})(angular, DomenowApp);