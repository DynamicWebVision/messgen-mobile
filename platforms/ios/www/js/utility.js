/**
 * Created by Brian on 4/25/16.
 */

var utility = {

    setCookie: function(cookieName, cookieValue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    },
    getCookie: function(cookieName) {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    checkCookie: function(cookieName) {
        var cookieVal = this.getCookie(cookieName);
        if (cookieVal != "") {
            return cookieVal;
        }
        else {
            return false;
        }
    }
};