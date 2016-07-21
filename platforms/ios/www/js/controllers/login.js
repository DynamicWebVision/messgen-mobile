/**
 * Created by brianoneill on 2/19/15.
 */

app.controller('LoginController', function($http, $scope) {

    $scope.login = {};


    if(window.location.href.indexOf("logout") > -1) {
        window.location="/";
    }
    else {
        console.log("Not Hitting");
    }

    $http.get('crfToken').success(function(data){
        app.csrfToken = data;
    });

	$scope.loginProcess = function() {

        $(".process").show();

        var d = new Date();
        var tzo = d.getTimezoneOffset()/60;


        $scope.login.csrf_token = app.csrfToken;
        $scope.login.tzoOffset = tzo;

        $http.post('/login_check', $scope.login).success(function(data){
            $(".process").hide();

            if (data == 1) {
                $(".process").hide();

                $("#fixedAjaxSuccess").show();
                $(".successHead").html("Welcome Back!");
                $(".successMessage").successFade(function(){ $("#fixedAjaxSuccess").hide();
                    window.location="main";
                });
            }
            else {

            }

        });
	}

});

$(document).ready(function(){
        var canvasLoader = new CanvasLoader('loginLoader');
        canvasLoader.setColor('#ff6600'); // default is '#000000'
        canvasLoader.setShape('oval'); // default is 'oval'
        canvasLoader.setDiameter(65); // default is 40
        canvasLoader.show(); // Hidden by default
});