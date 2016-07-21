
//MessageGenFact, UtilityService,
app.controller('RegistrationController', function($scope, Users, $timeout) {

    $scope.submit = false;
    $scope.validation = 1;
    $scope.emailExist = false;

    $scope.email = "";
    $scope.fullName = "";
    $scope.password = "";
    $scope.confirmPassword = "";

    $scope.cc = {};
    $scope.ccError = false;

    if(typeof serverPromo == "undefined") {
        $scope.promoId = "";
        $scope.accountType = "";
    }
    else {
        $scope.promoId = serverPromo;
        $scope.accountType = "premium";
    }

    $scope.submitRegistration = function() {
        if ($scope.regForm.$valid) {
            $scope.submit = true;
            var newUser = {
                email: $scope.email,
                password: $scope.password,
                fullName: $scope.fullName,
                accountType: $scope.accountType,
                cc: $scope.cc,
                promo: $scope.promoId
            };

            $(".processing").show();
            Users.registerUser(newUser).then(function(response) {
                $(".processing").hide();
                if (response.data == 1) {
                    if ($scope.accountType == "premium" && $scope.promoId == "") {
                        $(".successMessage").successFade("Welcome!", function() {
                            window.location="/manage_account";
                        });
                    }
                    else {
                        $(".successMessage").successFade("Welcome!", function() {
                            window.location="/main";
                        });
                    }
                }
                else if (response.data == 2) {
                    $scope.emailExist = true;
                }
                else if (response.data == 3) {
                    $scope.ccError = true;
                }
            });
        }
    }

    $scope.showAccountTypeClass = function(value) {
        if ($scope.accountType == value) {
            return "selectedAccount";
        }
        else {
            return "unselectedAccount";
        }
    }

});

