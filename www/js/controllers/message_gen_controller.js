/**
 * Created by Brian on 5/4/15.
 */

messgenApp.controller('MessageGenController', function(MessageGenFact, UtilityService, $scope,  $timeout, $compile,
                                                 $rootScope, $cordovaClipboard) {
	$scope.newPhrase = {};
	$scope.newPhraseSubmit = false;
	$scope.searches = {};
	$scope.userInfo = {};

	$scope.searchTweets = {};

    $scope.newMessage = {};
    $scope.newMessage.text = "";
    $scope.newMessageSubmit = false;

    $scope.modifyMessageSubmit = false;

    $scope.messageBody = "";
    $scope.clearedMessageBody = "";

    $scope.modifyCatIndx = "";
    $scope.modifyMesIndx = "";

    $scope.messFilter = "";

    $scope.categories = [];

    $scope.customVariableText = "";
    $scope.customVariables = [];

    $scope.newCustomVariableShow = false;
    $scope.modifyCustomVariableShow = false;

    $scope.newCustomVariableText = "";
    $scope.modifyCustomVariableText = "";
    $scope.customVariableBlankError = false;
    $scope.modifyCustomVariableBlankError = false;
    $scope.showUndoClear = false;

    $scope.categoriesFormStage = "categoryList";

    $scope.deleteCategory;
    $scope.deleteCategoryCategories;

    $scope.showMaxMessage = false;

    $scope.accountType;

    $scope.showOnlyCategory = '';

    var deleteMessageId;

    $scope.customTextAddType;
    var deleteMessageIndex;
    var deleteMessageCategory;
    var deleteCategoryIndex;
    var deleteMessageCategoryIndex;
    var accountType;

    $scope.deleteMessageName = "";

    $rootScope.$on("MessagesLoad", function() {
        $scope.loadMessages();
    });


    $scope.loadMessages = function() {
        MessageGenFact.pageLoad().then(function (response) {
            $scope.messageData = response.data.messageData;
            $scope.nonCategoryMessages = response.data.nonCategoryMessages;
            $scope.categories = response.data.categories;
            $scope.categories[-1] = {
                "category_name": 'NO CATEGORY',
                "id": '-1'
            };
            $scope.searchMessages = response.data.searchMessages;

            $("#messagePreLoaderProcessor").hide();
            $(".preLoad").fadeIn();

            $scope.accountType = response.data.accountType;
        });
    }


    function getSelectedText() {
        var text = "";
        if (typeof window.getSelection != "undefined") {
            text = window.getSelection().toString();
        } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    resetNewMessageFaded = function() {
        if ($scope.accountType == "2") {
            $scope.newMessageForm.newMessageCategory.$faded = false;
        }
        $scope.newMessageForm.newMessageName.$faded = false;
        $scope.newMessageForm.messageText.$faded = false;
    }

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'MessageModController',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    };

    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.createNewCategory = function () {
        $scope.newCategorySubmit = true;

        if ($scope.newCategoryForm.$valid) {
            MessageGenFact.createCategory($scope.newCategory).then(function(response) {
                newCategory = response.data;
                $scope.messageData.push({
                    "categoryId": newCategory.id,
                    "categoryName": newCategory.category_name,
                    "catMessagesShow": false,
                    "messages": []
                });
                $scope.messageData = UtilityService.sortArrayByPropertyAlpha($scope.messageData, "categoryName");
                $scope.categories.push(
                    {
                        "id": newCategory.id,
                        "category_name": newCategory.category_name
                    }
                );
                $scope.newCategory = "";
                $scope.newCategoryForm.newCategory.$faded = false;
                $scope.categoriesFormStage = 'categoryList';
                $scope.newCategorySubmit = false;
            });
        }
    };

    $scope.createNewMessage = function () {
        $scope.newMessageSubmit = true;

        if ($scope.newMessageForm.$valid) {
            MessageGenFact.createMessage($scope.newMessage).then(function(response) {
                var alteredCategory = UtilityService.functiontofindIndexByKeyValue($scope.messageData, "categoryId", $scope.newMessage.category);

                if ($scope.accountType == "2") {
                    if ($scope.newMessage.category == -1) {
                        $scope.nonCategoryMessages.push(response.data);
                        $scope.nonCategoryMessages = UtilityService.sortArrayByPropertyAlpha($scope.nonCategoryMessages, "message_name");
                    }
                    else {
                        $scope.messageData[alteredCategory]['messages'].push(response.data);
                        $scope.messageData[alteredCategory]['messages'] = UtilityService.sortArrayByPropertyAlpha($scope.messageData[alteredCategory]['messages'], "message_name");
                    }
                }
                $scope.searchMessages.push(response.data);
                $scope.searchMessages = UtilityService.sortArrayByPropertyAlpha($scope.searchMessages, "message_name");

                $scope.newMessageForm.$setPristine();
                resetNewMessageFaded();
                $scope.newMessageSubmit = false;
                $scope.newCategory = "";
                $scope.newMessage = {};
            });
        }
    };

    $scope.addCustomMessageText = function() {
        var messageText = getSelectedText();
    }

    $scope.setModCatIndx = function($indx) {
        $scope.modifyCatIndx = $indx;
    }

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    spanStrip = function(value, start, finish) {
        var endLength = finish.length;
        var spanEnd = value.indexOf(finish) + endLength;
        return value.substring(0, value.indexOf(start)) + value.substring(spanEnd);
    }

    openCustomVariableDialog = function(messageText) {
        var counter = 0;

        while (messageText.indexOf("XXX_") != -1) {
            var variableName = messageText.substring(messageText.indexOf("XXX_") + 4, messageText.indexOf("_XXX"));

            var messageText = messageText.replace("XXX_", "<span id='variable"+counter+"' class='variable'>");
            messageText = messageText.replace("_XXX", "</span>");

            $scope.customVariables[counter] = {
                "name": variableName,
                "variableText": ""
            };
            counter++;
        }
        $scope.variableTextCount = counter;
        $(".message-text").html(messageText);
        $("#customVariableModal").modal();
    }

    $scope.addNewCustomText = function() {
        $scope.newCustomVariableShow = true;
        $timeout(function() {
            $("#newCustomVariable").focus();
        }, 20, false);
    }

    $scope.addModifyCustomText = function() {
        $scope.modifyCustomVariableShow = true;
        $timeout(function() {
            $("#modifyCustomVariable").focus();
        }, 20, false);
    }

    $scope.customEnterKey = function(e) {
        if (e.keyCode == 13) {
            $scope.addNewCustomVariableText();
        }
    }

    $scope.customModifyEnterKey = function(e) {
        if (e.keyCode == 13) {
            $scope.addModifyCustomVariableText();
        }
    }

    $scope.addNewCustomVariableText = function() {
        if ($scope.newCustomVariableText.length > 0) {
            $scope.newCustomVariableShow = false;
            $scope.newMessage.text += " XXX_"+$scope.newCustomVariableText.toUpperCase()+"_XXX ";
            $("#newMessageText").focus();
            $scope.customVariableBlankError = false;
            $scope.newCustomVariableText = "";
        }
        else {
            $scope.customVariableBlankError = true;
        }
    }

    $scope.addModifyCustomVariableText = function() {
        if ($scope.modifyCustomVariableText.length > 0) {
            $scope.modifyCustomVariableShow = false;
            $scope.modifyMessageItem.message += " XXX_"+$scope.modifyCustomVariableText.toUpperCase()+"_XXX ";
            $("#newMessageText").focus();
            $scope.modifyCustomVariableBlankError = false;
            $scope.modifyCustomVariableText = "";
        }
        else {
            $scope.modifyCustomVariableBlankError = true;
        }
    }

    $scope.newLineButton = function(messageText) {
        if (messageText.indexOf("XXX_") != -1) {
            openCustomVariableDialog(messageText);
            $scope.customTextAddType = "oneLine";
        }
        else {
            if ($scope.messageBody.substr($scope.messageBody.length-1) == "." || $scope.messageBody.substr($scope.messageBody.length-1) == "!"
                || $scope.messageBody.substr($scope.messageBody.length-1) == "?") {
                $scope.messageBody += "  "+messageText;
            }
            else {
                $scope.messageBody += messageText;
            }
        }

    }

    $scope.customQuickCopy = function(messageText) {
        openCustomVariableDialog(messageText);
        $scope.customTextAddType = "quickCopy";
    }

    $scope.newParagLine = function(messageText) {
        if (messageText.indexOf("XXX_") != -1) {
            openCustomVariableDialog(messageText);
            $scope.customTextAddType = "paragraph";
        }
        else {
            $scope.messageBody += "\n\n"+messageText;
        }
    }

    $scope.quickCopy = function() {

    }

    $scope.modifyMessageDialog = function(message , indx) {
        $scope.modifyMesIndx = indx;
        $scope.modifyMessageItem = message;
        $scope.modifyMessageInitialCategory = message.category_id;
    }

    $scope.modifyMessage = function() {
        $scope.modifyMessageSubmit = true;
        if ($scope.modifyMessageForm.$valid) {
            MessageGenFact.modifyMessage($scope.modifyMessageItem).then(function() {
                $scope.messageData[$scope.modifyCatIndx]['messages'][$scope.modifyMesIndx]['message_name'] = $scope.modifyMessageItem.message_name;
                $scope.messageData[$scope.modifyCatIndx]['messages'][$scope.modifyMesIndx]['message'] = $scope.modifyMessageItem.message;
            });
        }
    }

    $scope.submitVariableText = function() {
        var counter = 1;
        var messageText = $(".message-text").html();

        while (counter <= $scope.variableTextCount) {
            messageText = spanStrip(messageText, "<span", ">");
            messageText = spanStrip(messageText, "</span", ">");
            counter++;
        }

        if ($scope.customTextAddType == "oneLine") {
            if ($scope.messageBody.substr($scope.messageBody.length-1) == "." || $scope.messageBody.substr($scope.messageBody.length-1) == "!"
                || $scope.messageBody.substr($scope.messageBody.length-1) == "?") {
                $scope.messageBody += "  "+messageText;
            }
            else {
                $scope.messageBody += messageText;
            }
        }
        else {
            $scope.messageBody += "\n\n"+messageText;
        }
        $("#customVariableModal").modal('hide');
    }

    $scope.getCustomText = function() {
        var counter = 1;
        var messageText = $(".message-text").html();

        while (counter <= $scope.variableTextCount) {
            messageText = spanStrip(messageText, "<span", ">");
            messageText = spanStrip(messageText, "</span", ">");
            counter++;
        }
        return messageText;
    }

    $scope.deleteMessageDialog = function(message , indx, catIndex) {
        deleteMessageId = message.id;
        deleteMessageIndex = indx;
        deleteMessageCategory = message.category_id;
        $scope.deleteMessageName = message.message_name;
        deleteMessageCategoryIndex = catIndex;
    }

    $scope.confirmDeleteMessage = function() {
        MessageGenFact.deleteMessage(deleteMessageId).then(function(response) {
            if (deleteMessageCategoryIndex != -6) {
                $scope.messageData[deleteMessageCategoryIndex]['messages'].splice(deleteMessageIndex, 1);
            }
            else {
                $scope.nonCategoryMessages.splice(deleteMessageIndex, 1);
            }
            var searchIndex = getSearchMessageIndex(deleteMessageId);
            $scope.searchMessages.splice(searchIndex, 1);
        });
    }

    $scope.addCustomVariableText = function(variable, index, e) {
        if (e.keyCode == 13) {
            var nextIndex = index + 1;
            if (typeof $scope.customVariables[nextIndex] == "undefined") {
                if ($scope.customTextAddType != 'quickCopy') {
                    $scope.submitVariableText(index);
                }
            }
            else {
                $("#variableField"+nextIndex).focus();
            }
        }
        else {
            if (typeof  variable  != 'undefined') {
                if (typeof  variable.variableText  == 'undefined') {
                    $("#variable"+index).html(variable.name);
                }
                else {
                    $("#variable"+index).html(variable.variableText);
                }
            }
        }
    }

    $scope.messageFilter = function(element) {
        var regexSearch = new RegExp( $scope.messFilter.toUpperCase(), 'g' );

        //Check Artist Search
        if (element.message_name.toUpperCase().match(regexSearch) ||
            element.message.toUpperCase().match(regexSearch)) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.setCreatePristine = function() {
        resetNewMessageFaded();
        $scope.newMessageSubmit = false;
        $scope.newMessage = {};
        $scope.newMessage.text = "";
        $scope.newMessageSubmit = false;
        $scope.newMessageForm.$setPristine();
    }

    $scope.deleteCategoryConfirm = function(deleteCategory, index) {
        $scope.deleteCategory = deleteCategory;
        $scope.categoriesFormStage = 'deleteCategory';
        deleteCategoryIndex = index;
    }

    getCategoryIndexInMessages = function(categoryId) {
        for (i = 0; i < $scope.messageData.length; i++) {
            if ($scope.messageData[i].categoryId == categoryId) {
                return i;
                break;
            }
        }
    }

    getSearchMessageIndex = function(messageId) {
        for (i = 0; i < $scope.searchMessages.length; i++) {
            if ($scope.searchMessages[i].id == messageId) {
                return i;
                break;
            }
        }
    }

    $scope.deleteCategoryMessages = function() {
        var categoryIndex = getCategoryIndexInMessages($scope.deleteCategory.id);
        $scope.deletedCategoryMessages = $scope.messageData[categoryIndex]['messages'];

        for (i = 0; i < $scope.deletedCategoryMessages.length; i++) {
            $scope.deletedCategoryMessages[i].newCategoryDecision = "-1";
        }

        $scope.deleteCategoryCategories = $scope.categories;
        $scope.deleteCategoryCategories.splice(deleteCategoryIndex, 1);

        if ($scope.deletedCategoryMessages.length > 0) {
            $scope.categoriesFormStage = 'handleDeletedCategoryMessages';
        }
        else {
            $scope.finalDeleteCategoryMessages();
        }
    }

    $scope.hasCustomText = function(text) {
        if (text.indexOf("XXX_") != -1) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.setAllCategoryMessagesDelete = function() {
        for (i = 0; i < $scope.deletedCategoryMessages.length; i++) {
            $scope.deletedCategoryMessages[i].newCategoryDecision = "-5";
        }
    }

    $scope.finalDeleteCategoryMessages = function() {
        var post = {
            messages: $scope.deletedCategoryMessages,
            category: $scope.deleteCategory
        }
        MessageGenFact.deleteCategory(post).then(function() {
            for (i = 0; i < $scope.deletedCategoryMessages.length; i++) {
                if ($scope.deletedCategoryMessages[i].newCategoryDecision != "-5")
                {
                    if ($scope.deletedCategoryMessages[i].newCategoryDecision == -1) {
                        $scope.nonCategoryMessages.push($scope.deletedCategoryMessages[i]);
                    }
                    else {
                        var categoryIndex = getCategoryIndexInMessages($scope.deletedCategoryMessages[i].newCategoryDecision);
                        $scope.messageData[categoryIndex]['messages'].push($scope.deletedCategoryMessages[i]);
                        $scope.messageData[categoryIndex]['messages'] = UtilityService.sortArrayByPropertyAlpha($scope.messageData[categoryIndex]['messages'], "message_name");
                    }

                }
            }
            var catIndex = getCategoryIndexInMessages($scope.deleteCategory.id);
            //$scope.categories.splice(catIndex, 1);
            $scope.messageData.splice(catIndex, 1);

            $scope.nonCategoryMessages = UtilityService.sortArrayByPropertyAlpha($scope.nonCategoryMessages, "message_name");
            $scope.categoriesFormStage = 'categoryList';

        });

    }

    $scope.messageCharactersRemaining = function(characters) {
        return 250 - characters;
    }

    $scope.showCategorySection = function(val) {
        if ($scope.showOnlyCategory != val && $scope.showOnlyCategory != '') {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.setShowCategory = function(val) {
        $scope.showOnlyCategory = val;
    }

    $scope.clearMessage = function() {
        $scope.clearedMessageBody = $scope.messageBody;
        $scope.messageBody = "";
        $scope.showUndoClear = true;
    }

    $scope.cordovaCopy = function() {
        $cordovaClipboard
            .copy('text to copy')
            .then(function () {
                // success
            }, function () {
                // error
            });
    }
});

$(document).ready(function(){
	$(".bsModal").each(function(){
		$('#'+this.id).modal('hide');
	});
});
