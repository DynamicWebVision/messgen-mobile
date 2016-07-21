messgenApp.factory('MessageGenFact', function($http, $q) {

	var service = {};
	service.searches = {};
	service.searchTweets = {};

	service.createCategory = function(newCategory) {
		$(".process").show();

        var createCategory = $http.post('message_gen/create_category', {"category": newCategory});

        createCategory.then(function(data){
			$(".process").hide();
            $("#createCategoryModal").modal('toggle');
            $(".successMessage").successFade("Category Created");
            return data;
		});
        return createCategory;
	}

    service.createMessage = function(newMessage) {
        $(".process").show();

        var createMessage = $http.post('message_gen/create_message', {"message": newMessage});

        createMessage.then(function(data){
            $(".process").hide();
            $("#createMessageModal").modal('toggle');

            $(".successMessage").successFade("Message Created");
            return data;
        });
        return createMessage;
    }

    service.modifyMessage = function(modifyMessage) {
        $(".process").show();

        var modifyMessage = $http.post('/message_gen/modify_message', {"message": modifyMessage});

        modifyMessage.then(function(data){
            $(".process").hide();
            $("#modifyMessageModal").modal('toggle');

            $(".successMessage").successFade("Message Modified");
            return "1";
        });
        return modifyMessage;
    }

    service.deleteMessage = function(messageId) {
        $(".process").show();
        var deleteMessage = $http.post('/message_gen/delete_message', {"messageId": messageId});

        deleteMessage.then(function(data){
            $(".process").hide();
            $("#deleteMessageModal").modal('toggle');

            $(".successMessage").successFade("Message Deleted");
            return "1";
        });
        return deleteMessage;
    }

	service.getMessageGen = function() {
		var getMessageGen = $http.get('get_message_gen');

        getMessageGen.then(function(messageData){
			return messageData;
		});
		return getMessageGen;
	}

	service.pageLoad = function() {
		var messageGenStart  = $http.get(apiUrl+'/load_messages');
        messageGenStart.then(function(response){
			return response;
		});
		return messageGenStart;
	}

	service.getTwitterUserInfo = function(screenName) {
		var getUserInfo  = $http.get('twitter/getUser/'+screenName);
		getUserInfo.then(function(userInfo){
			return userInfo;
		});
		return getUserInfo;
	}

    service.deleteCategory = function(post) {
        var deleteCategory  = $http.post('delete_category', post);
        deleteCategory.then(function(response){
            $(".successMessage").successFade("Category Deleted");
            return response;
        });
        return deleteCategory;
    }

	return service;
})