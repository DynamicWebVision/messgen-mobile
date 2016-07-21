messgenApp.controller('MobileLoginController', function($scope, Users, $rootScope) {

    $scope.submit = false;
    $scope.invalidLogin = false;
    $scope.email = "";
    $scope.password = "";

    //
    $scope.logonAttempt = function() {
        if ($scope.loginForm.$valid) {
            var logOn = {
                email: $scope.email,
                password: $scope.password
            };

            $(".ajax").show();

            Users.logOn(logOn).then(function(response) {
                $(".ajax").hide();

                if (response.data == 1) {

                    //utility.setCookie("returningMobile", 1, 120);
                    changeDisplaySection('mainAppSection');
                    $rootScope.$emit("MessagesLoad", {});
                    $(".ajax").hide();
                }
                else if (response.data == 0) {
                    $scope.invalidLogin = true;
                }
            });
        }
    }

    $scope.logonClass = function(div) {
        if (!$scope.invalidLogin) {
            return "loginContain";
        }
        else {
            return "loginContainInvalidLogin";
        }
    }
    $scope.logonOuterClass = function(div) {
        if (!$scope.invalidLogin) {
            return "loginOuter";
        }
        else {
            return "loginOuterInvalidLogin";
        }
    }

});