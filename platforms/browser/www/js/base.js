/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var messgenApp = angular.module('messgenApp', ['ngCordova']);
var apiUrl = 'https://messgen.com';
var currentDisplaySection = 'MobileLoginSection';

//messgenApp.config(['ngClipProvider', function(ngClipProvider) { ngClipProvider.setPath("js/ZeroClipboard/ZeroClipboard.swf"); }]);

messgenApp.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
});

var changeDisplaySection = function(newSection) {
    $("#"+currentDisplaySection).fadeOut(200, function() {
        $("#"+newSection).fadeIn(200);
        currentDisplaySection = newSection;
    });
}