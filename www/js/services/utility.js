/**
 * Created by Brian on 6/15/15.
 */
messgenApp.service('UtilityService', function($http, $q) {

    var service = {};

    service.getAllUsers = function() {
        var csrfToken  = $http.get('/crfToken');
        csrfToken.then(function(response){
            return response;
        });
        return csrfToken;
    }

    service.sessionCheck = function() {
        var csrfToken  = $http.get('/sessionCheck');
        csrfToken.then(function(response){
            if (response == 0) {
                window.location="/";
            }
        });
    }

    service.sessionCheck = function() {
        var csrfToken  = $http.get('/sessionCheck');
        csrfToken.then(function(response){
            if (response == 0) {
                window.location="/";
            }
        });
    }
    service.functiontofindIndexByKeyValue = function(arraytosearch, key, valuetosearch) {

        for (var i = 0; i < arraytosearch.length; i++) {

            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
        return null;
    }

    service.sortArrayByPropertyAlpha = function (array , propertyName) {
        return array.sort(function(a, b){
            var nameA=a[propertyName].toLowerCase(), nameB=b[propertyName].toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });
    }

    return service;
});
