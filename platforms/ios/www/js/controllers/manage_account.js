/**
 * Created by Brian on 5/4/15.
 */
$(document).ready(function(){
    var canvasLoader = new CanvasLoader("messagePreLoaderProcessor");
    canvasLoader.setColor('#666666'); // default is '#000000'
    canvasLoader.setShape('oval'); // default is 'oval'
    canvasLoader.setDiameter(155); // default is 40
    canvasLoader.show(); // Hidden by default
});

app.config(['ngClipProvider', function(ngClipProvider) { ngClipProvider.setPath("js/ZeroClipboard/ZeroClipboard.swf"); }]);

app.controller('ManageAccountController', function(UtilityService, $scope,  $timeout, $compile,
                                                $location, $http) {

    $scope.cc = {};
    $scope.ccSubmitted = false;
    $scope.changeCard = false;
    $scope.showAccount = false;

    var preAccountLoader = new CanvasLoader("preAccountLoader");
    preAccountLoader.setColor('#666666'); // default is '#000000'
    preAccountLoader.setShape('oval'); // default is 'oval'
    preAccountLoader.setDiameter(45); // default is 40
    preAccountLoader.show(); // Hidden by default

    //Get Customer Info on Page Load
    $http.get('/get_user_info').success(function(data){
        if (!data.session) {
            window.location="/logout";
        }
        else {
            $scope.showAccount = true;
            if (data.accountType == "1") {
                $scope.accountType = "free";
            }
            else if (data.accountType == "2") {
                $scope.accountType = "premium";
            }
            $scope.validCC = data.validCard;
        }
    });

    $scope.showAccountTypeClass = function(value) {
        if ($scope.accountType == value) {
            return "selectedAccount";
        }
        else {
            return "unselectedAccount";
        }
    }

    $scope.saveCreditCard = function() {

        $scope.ccSubmitted = true;
        $("#saveCCLoader").show();

        var scopeTest = $scope.stripeErrorMessage;

        function stripeResponseHandler(status, response) {
            console.log('here abcdefg');
            // Grab the form:
            if (response.error) { // Problem!
                $("#stripeError").html(response.error.message);
                $("#stripeError").show();
                $("#saveCCLoader").hide();
            } else { // Token was created!

                // Get the token ID:
                var token = response.id;

                $http.post('/save_customer_card', {'stripeToken': token}).success(function(data){
                        $("#saveCCLoader").hide();

                        $(".successMessage").successFade("Credit Card Saved");
                        $("#stripeError").hide();
                        $scope.cc = data;

                        $scope.ccForm.cHFirstName.$faded = false;
                        $scope.ccForm.cHLastName.$faded = false;
                        $scope.ccForm.cardNunber.$faded = false;
                        $scope.ccForm.expYear.$faded = false;
                        $scope.ccForm.expMonth.$faded = false;
                        $scope.ccForm.cvv.$faded = false;

                        $scope.ccSubmitted = false;

                        $scope.validCC = true;

                });
            }
        };

        var stripeResponse = Stripe.card.createToken({
            "number": $scope.cc.cardNumber,
            "exp_month": $scope.cc.expMonth,
            "exp_year": $scope.cc.expYear,
            "cvc": $scope.cc.cvv
        }, stripeResponseHandler);


//            $scope.ccSubmitted = true;
//
//            if ($scope.ccForm.$valid) {
//
//                $(".process").show();
//
//                $http.post('/save_credit_card', $scope.cc).success(function(data){
//
//
//                    if (!data.session) {
//                        window.location="/logout";
//                    }
//                    else {
//                        $scope.validCC = $scope.validCard;
//                        $(".process").hide();
//
//                        $(".successMessage").successFade("Credit Card Saved");
//                        $scope.cc = data;
//
//                        $scope.ccForm.cHFirstName.$faded = false;
//                        $scope.ccForm.cHLastName.$faded = false;
//                        $scope.ccForm.cardNunber.$faded = false;
//                        $scope.ccForm.expYear.$faded = false;
//                        $scope.ccForm.expMonth.$faded = false;
//                        $scope.ccForm.cvv.$faded = false;
//
//                        $scope.ccSubmitted = false;
//                    }
//
//                });
//            }
    }

    $scope.changeAccountType = function(newAccountType) {
        if (newAccountType != $scope.accountType) {
            $("#planChangeLoader").show();
            $http.post('/change_account_type', {"newAccountType": newAccountType}).success(function(data){
                if (!data.session) {
                    window.location="/logout";
                }
                else {
                    $("#planChangeLoader").hide();
                    if (data.accountType == "1") {
                        $scope.accountType = "free";
                    }
                    else if (data.accountType == "2") {
                        $scope.accountType = "premium";
                    }
                    $scope.validCC = data.validCard;
                }
            });
        }
    }

});
