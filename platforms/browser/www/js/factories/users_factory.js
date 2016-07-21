messgenApp.factory('Users', function($http, $q) {

    var service = {};

    service.getAllUsers = function() {
        var allUsers  = $http.get('/get_all_users');
        allUsers.then(function(response){
            return response;
        });
        return allUsers;
    }

    service.createUser = function(newUser) {
        $(".process").show();

        $http.post(apiUrl+'/create_user', newUser).success(function(data){
            $(".process").hide();
            $("#createUserModal").modal('toggle');

            $("#fixedAjaxSuccess").show();
            $(".successHead").html("Welcome");
            $(".successMessage").successFade(function(){ $("#fixedAjaxSuccess").hide(); });
        });
    }

    service.removeUser = function(userId) {
        $http.post(apiUrl+'/remove_user', {"userId":userId}).success(function(data){
            $("#removeUserModal").modal('toggle');
        });
    }

    service.registerUser = function(newUser) {
        var registerUser  = $http.post(apiUrl+'/register_user', newUser);
        registerUser.then(function(response){
            return response;
        });
        return registerUser;
    }

    service.logOn = function(logOnCriteria) {
        var logOnAttempt  = $http.post(apiUrl+'/log_on', logOnCriteria);
        logOnAttempt.then(function(response){
            return response;
        });
        return logOnAttempt;
    }

    return service;
})