angular.module('starter.controllers', ['ionic', 'ngCordova'])
    .run(function($cordovaSplashscreen) {
        setTimeout(function() {
            $cordovaSplashscreen.hide()
        }, 2000)
    })

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaOauth, $http,
    $ionicActionSheet, $http, $templateCache, $interval, Car) {
    $('#information_panel').hide();
    $scope.facebook_firstName = "Bas";
    $scope.facebook_lastName = "Patipan";

    //Hide Panel don't use at first
    $('#car_select_div').hide();
    $('#slotCheckin').hide();

    //Car List
    $scope.allCar = Car.all();
    $scope.imageProfile = 'img/avartar.png';

    //Scope of Username
    $scope.userName = '';
    //Scope of UserID
    $scope.userLoginID = '';
    //Scope of Payamount
    $scope.payamount = 20;

    //Scope of Location
    $scope.checkInplace = window.localStorage['location'];
    //Check is empty ??
    if ($scope.checkInplace != '') {
        $('#slotCheckin').show();
    }

    function hello() {
        swal("Good job!", "You clicked the button!", "success")
    }

    $scope.faceBookLogin = function() {
        $cordovaOauth.facebook("926602354070538", ["email", "user_about_me"]).then(function(result) {
            $http.get("https://graph.facebook.com/me?access_token=" + result.access_token + "&fields=id,first_name,last_name,email")
                .then(function(jsondata) {
                    console.log(jsondata);

                    $http.get("https://graph.facebook.com/" + jsondata.data.id + "/picture?redirect=false&width=160&height=160")
                        .then(function(success) {
                            // console.log(success);
                            $scope.faceBookID = jsondata.data.id;
                            $scope.imageProfile = success.data.data.url;
                            $scope.facebook_firstName = jsondata.data.first_name;
                            $scope.facebook_lastName = jsondata.data.last_name;

                            //Check if this Facebook ID is existing.
                            $http.get('http://omaximumo.asuscomm.com/SCP/login.php')
                                .then(function(resp) {
                                    var result = resp.data;
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].facebook_id == $scope.faceBookID) {
                                            //This facebook ID is already existing....

                                            //GET CAR LIST
                                            $scope.userLoginID = result[i].user_id;

                                            //UPDATE CALL CAR LICENSE
                                            $http.get('http://omaximumo.asuscomm.com/SCP/getallcar.php?id=' + $scope.userLoginID)
                                                .then(function(resp) {
                                                    var result = resp.data;
                                                    if (result.indexOf("Notice") > -1) {
                                                        return;
                                                    }
                                                    for (var i = 0; i < result.length; i++) {
                                                        Car.add(result[i].car_license, result[i].car_model,
                                                            '00-00-0000 00:00:00 AM', '00-00-0000 00:00:00 AM',
                                                            '');
                                                    }
                                                    console.log(resp.data);
                                                    $scope.allCar = Car.all();
                                                })


                                            //Hide & Show Div
                                            $('#login_panel').hide();
                                            $('#information_panel').show();
                                            return;
                                        }
                                    }
                                    //ID is not existing.. Regis with facebook ID
                                    //Keep Facebook ID to database to login in the next time. [Register Part]
                                    //Start Posting
                                    var FormData = {
                                        'username': '',
                                        'pass': '',
                                        'first': $scope.facebook_firstName,
                                        'last': $scope.facebook_lastName,
                                        'facebook': $scope.faceBookID,
                                        'google': '',
                                        'avar': $scope.imageProfile
                                    };

                                    $http({
                                        method: 'POST',
                                        url: 'http://omaximumo.asuscomm.com/SCP/regismember.php',
                                        data: FormData,
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        cache: $templateCache
                                    }).success(function(response) {
                                        swal("Successful !", "Your registration is successful", "success")
                                            //Show Info
                                        $('#information_panel').show();
                                        $('#login_panel').hide();
                                    }).error(function(response) {

                                    });
                                })
                        });
                });
        });
    }

    $scope.googleLogin = function() {
        $cordovaOauth.google("535244044809-73unimn9tq9qaoi0spbqsb4g6gefg0hh.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"])
            .then(function(result) {
                var access_token = result.access_token;
                // console.log(access_token);
                $http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + access_token)
                    .then(function(jsondata) {
                        // console.log(jsondata);
                        $scope.googleID = jsondata.data.id;
                        $scope.imageProfile = jsondata.data.picture;
                        $scope.facebook_firstName = jsondata.data.given_name;
                        $scope.facebook_lastName = jsondata.data.family_name;

                        //Keep Google+ ID to database to login in the next time. [Register Part]
                        $http.get('http://omaximumo.asuscomm.com/SCP/login.php')
                            .then(function(resp) {
                                var result = resp.data;
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].google_id == $scope.googleID) {
                                        //This facebook ID is already existing....

                                        //GET CAR LIST
                                        $scope.userLoginID = result[i].user_id;

                                        //UPDATE CALL CAR LICENSE
                                        $http.get('http://omaximumo.asuscomm.com/SCP/getallcar.php?id=' + $scope.userLoginID)
                                            .then(function(resp) {
                                                var result = resp.data;
                                                if (result.indexOf("Notice") > -1) {
                                                    return;
                                                }
                                                for (var i = 0; i < result.length; i++) {
                                                    Car.add(result[i].car_license, result[i].car_model,
                                                        '00-00-0000 00:00:00 AM', '00-00-0000 00:00:00 AM',
                                                        '');
                                                }
                                                console.log(resp.data);
                                                $scope.allCar = Car.all();
                                            })

                                        //Hide & Show Div
                                        $('#login_panel').hide();
                                        $('#information_panel').show();
                                        return;
                                    }
                                }
                                //ID is not existing.. Regis with google+ ID
                                //Keep Facebook ID to database to login in the next time. [Register Part]
                                //Start Posting
                                var FormData = {
                                    'username': '',
                                    'pass': '',
                                    'first': $scope.facebook_firstName,
                                    'last': $scope.facebook_lastName,
                                    'facebook': '',
                                    'google': $scope.googleID,
                                    'avar': $scope.imageProfile
                                };
                                $http({
                                    method: 'POST',
                                    url: 'http://omaximumo.asuscomm.com/SCP/regismember.php',
                                    data: FormData,
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    cache: $templateCache
                                }).success(function(response) {
                                    swal("Successful !", "Your registration is successful", "success")
                                        //Show Info
                                    $('#information_panel').show();
                                    $('#login_panel').hide();
                                }).error(function(response) {

                                });
                            })
                    });
            });
    }

    $scope.logout = function() {
        $('#information_panel').hide();
        $('#login_panel').show();
        $scope.imageProfile = 'img/avartar.png';
        Car.Clear();
        window.localStorage['location'] = '';
        $scope.allCar = Car.all();
        $('#username_normal_login').val('');
        $('#password_normal_login').val('');
    }

    $scope.deleteLicense = function($index) {
        if ($scope.allCar[$index].class == 'ion-ios-checkmark-outline') {
            swal("Error !", "You should deselect this car before remove it.", "error")
            return;
        }

        var index = $index;
        //GET VALUE FROM SLIDE INDEX
        var carLicen = $scope.allCar[index].license;
        //Ask for Confirmaton
        swal({
            title: "Are you sure?",
            text: "Do you want to delete this Car (" + carLicen + ") !",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function() {
            $http.get('http://omaximumo.asuscomm.com/SCP/deleteLicense.php?licen=' + carLicen)
                .then(function(resp) {
                    Car.Remove(carLicen);
                    $scope.allCar = Car.all();
                })
        });
    }

    $scope.normal_login = function() {
        var username = $('#username_normal_login').val();
        var password = $('#password_normal_login').val();

        if (username == '' || password == '') {
            swal("Error !", "The username or password is incorrect !.", "error")
            return;
        }

        //GET REQUEST TO CHECK ACCOUNT

        $http.get('http://omaximumo.asuscomm.com/SCP/login.php')

        .then(function(resp) {
            var result = resp.data;
            // console.log(result);
            //Set value of username to match of php

            $scope.userName = username;

            for (var i = 0; i < result.length; i++) {
                if (result[i].username == username && result[i].password == password) {
                    $scope.facebook_firstName = result[i].firstname;
                    $scope.facebook_lastName = result[i].lastname;

                    //SET USER_ID
                    $scope.userLoginID = result[i].user_id;

                    //UPDATE CALL CAR LICENSE
                    $http.get('http://omaximumo.asuscomm.com/SCP/getallcar.php?id=' + $scope.userLoginID)
                        .then(function(resp) {
                            var result = resp.data;
                            if (result.indexOf("Notice") > -1) {
                                return;
                            }
                            for (var i = 0; i < result.length; i++) {
                                Car.add(result[i].car_license, result[i].car_model,
                                    '00-00-0000 00:00:00 AM', '00-00-0000 00:00:00 AM',
                                    '');
                            }
                            console.log(resp.data);
                            $scope.allCar = Car.all();
                        })

                    //Set Data to show
                    $('#information_panel').show();
                    $('#login_panel').hide();
                    return;
                }
            }
            swal("Error !", "The username or password is incorrect !.", "error")
        });

        return;
    }

    $scope.selectIndex = function($index) {
        var index = $index;
        var carCheck = Car.all();
        if (carCheck[index].class == 'ion-ios-checkmark-outline') {
            Car.unActiveClass(index);

            //Show - Hide Div
            $('#car_select_div').hide();
            $('#car_unselect_div').show();
            return;
        }

        Car.activeClass(index);
        $scope.car_licenseUse = $scope.allCar[index].license;
        $scope.car_modelUse = $scope.allCar[index].model;
        $scope.car_start_timeUse = $scope.allCar[index].start_time;
        $scope.payamount = 0;

        //Do Calculation..... -> Call timestamp from the server and calculate price. [2 Tables]
        $http.get("http://omaximumo.asuscomm.com/SCP/getcheckintime.php?licen=" + $scope.car_licenseUse)
            .then(function(resp) {
                var result = resp.data;
                var checkInTime = result[0].checkin;

                //Get Current Time to comapre with SQL Timestamp
                var date = new Date();
                var useDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getUTCDate() +
                    ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                //Calculate the different of 2 timestamp
                //Convert string to time type
                var timein = stringToDate(checkInTime);
                var timeout = stringToDate(useDate);

                var diffMs = (timeout - timein); // milliseconds between now & Christmas
                var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours            

                var income = 0;
                if (diffHrs == 0) {
                    income = 20;
                } else {
                    income = diffHrs * 20;
                }
                $scope.car_start_timeUse = checkInTime;
                $scope.payamount = income;
            })
            //Show - Hide Div
        $('#car_select_div').show();
        $('#car_unselect_div').hide();
    }

    $scope.reloadPayment = function() {
        // alert('Reload');
        //Do Calculation..... -> Call timestamp from the server and calculate price. [2 Tables]
        $http.get("http://omaximumo.asuscomm.com/SCP/getcheckintime.php?licen=" + $scope.car_licenseUse)
            .then(function(resp) {
                var result = resp.data;
                var checkInTime = result[0].checkin;

                //Get Current Time to comapre with SQL Timestamp
                var date = new Date();
                var useDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getUTCDate() +
                    ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                //Calculate the different of 2 timestamp
                //Convert string to time type
                var timein = stringToDate(checkInTime);
                var timeout = stringToDate(useDate);

                var diffMs = (timeout - timein); // milliseconds between now & Christmas
                var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours            

                var income = 0;
                if (diffHrs == 0) {
                    income = 20;
                } else {
                    income = diffHrs * 20;
                }
                $scope.car_start_timeUse = checkInTime;
                $scope.payamount = income;
            })
    }

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/regis.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.regis_modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.regis_modal.hide();
        $scope.imageProfile = 'img/avartar.png';
        clearTextRegis();
    };

    $scope.regis = function() {
        $scope.regis_modal.show();
    }

    // Create the AddCar modal
    $ionicModal.fromTemplateUrl('templates/addcar.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.addCar_modal = modal;
    });

    $scope.addCar = function() {
        $scope.addCar_modal.show();
    }

    $scope.closeAddCar = function() {
        $scope.addCar_modal.hide();
    }

    //Create Checkin modal
    $ionicModal.fromTemplateUrl('templates/checkIn.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.checkIn = modal;
    });

    $scope.showCheckin = function() {
        $scope.checkIn.show();
    }
    $scope.hideCheckin = function() {
        $scope.checkIn.hide();
    }

    $scope.checkOUT = function() {
        //SET PLACE TO NULL -> PERSISTANCE
        window.localStorage['location'] = '';

        $('#slotCheckin').hide();
    }

    $scope.checkIN = function() {
        var place = $('#checkpoint_place').val();
        //SET PLACE TO VALUE -> PERSISTANCE
        window.localStorage['location'] = place;


        //Show slot and checkin plact
        $scope.checkInplace = place;
        $('#slotCheckin').show();

        $scope.checkIn.hide();
        $('#checkpoint_place').val('');
    }

    $scope.userAddCar = function() {
        //Get User_ID TO USER FOR THE FOREIGN KEY
        var variable = $scope.userName;

        $http.get('http://omaximumo.asuscomm.com/SCP/getUsername.php?user=' + variable)
            .then(function(resp) {
                var userID = resp.data[0].user_id;

                //Starting Post Data to Server
                //Start Posting

                var licen = $('#caradd_license').val();
                var model = $('#caradd_model').val();

                var FormData = {
                    'lincese': licen,
                    'model': model,
                    'userid': userID
                };

                $http({
                    method: 'POST',
                    url: 'http://omaximumo.asuscomm.com/SCP/addcarinfo.php',
                    data: FormData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    cache: $templateCache
                }).success(function(response) {
                    swal("Successful !", "Your car adding is successful", "success")
                    clearTextAddCar();
                    $scope.addCar_modal.hide();

                    //UPDATE CALL CAR LICENSE
                    $http.get('http://omaximumo.asuscomm.com/SCP/getallcar.php?id=' + $scope.userLoginID)
                        .then(function(resp) {

                            Car.Clear();
                            $scope.allCar = Car.all();
                            var result = resp.data;
                            for (var i = 0; i < result.length; i++) {
                                Car.add(result[i].car_license, result[i].car_model,
                                    '00-00-0000 00:00:00 AM', '00-00-0000 00:00:00 AM',
                                    '');
                            }
                            console.log(resp.data);
                            $scope.allCar = Car.all();
                        })
                }).error(function(response) {

                });
            });
    }

    $scope.refreshfloor = function() {
        //Do Refresh with ardui no also.....
        // var socket = io('https://socket.jumpwire.io');
        //Catch jumpwire.io message
        socket.on('f', function(msg) {
            if (msg[0] == 'A') { //if Key is A
                if (msg[1] == 0) { // and Value is 0
                    alert('0');
                    location.reload();
                } else if (msg[1] == 1) { // and Value is 1
                    alert('1');
                    location.reload();
                }
            }
        });
        // alert('refresh');
    }

    $scope.turnOn = function() {
        // var socket = io('https://socket.jumpwire.io');
        socket.emit('f', ['A', 1]); //always use 'f'. ['key(A-Z)',value(float)]
    }

    $scope.turnOff = function() {
        // var socket = io('https://socket.jumpwire.io');
        socket.emit('f', ['A', 0]); //always use 'f'. ['key(A-Z)',value(float)]
    }

    //Time Interval to refresh every 8 sec.
    // $interval($scope.refreshfloor, 5000);

    $scope.confirm_regis = function() {
        // Accept and query to server.
        var username = $('#username_regis_txt').val();
        var password = $('#password_regis_txt').val();
        var fName = $('#firstname_regis_txt').val();
        var lName = $('#lastname_regis_txt').val();
        var facebook = '';
        var google = '';
        // $scope.profileImgToDB;

        if (username == '' || password == '' || fName == '' || lName == '') {
            swal("Error !", "Please fill in all field(s).", "error")
            return;
        }

        //Set variable of username
        $scope.userName = username;

        //Start Posting
        var FormData = {
            'username': username,
            'pass': password,
            'first': fName,
            'last': lName,
            'facebook': facebook,
            'google': google,
            'avar': $scope.profileImgToDB
        };

        $http({
            method: 'POST',
            url: 'http://omaximumo.asuscomm.com/SCP/regismember.php',
            data: FormData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            cache: $templateCache
        }).success(function(response) {
            clearTextRegis();
            $scope.regis_modal.hide();

            swal("Successful !", "Your registration is successful. You can use this account to login now.", "success")

        }).error(function(response) {

        });

    }

    function clearTextRegis() {
        $('#username_regis_txt').val('');
        $('#password_regis_txt').val('');
        $('#firstname_regis_txt').val('');
        $('#lastname_regis_txt').val('');
    }

    function clearTextAddCar() {
        $('#caradd_license').val('');
        $('#caradd_model').val('');
    }

    //Image Picker Part

    $scope.takePicture = function() {
        var option = {};

        try {
            option = {
                quality: 100,
                destinationType: navigator.camera.DestinationType.DATA_URL,
                sourceType: navigator.camera.PictureSourceType.CAMERA,
                correctOrientation: true,
                targetWidth: 440,
                targetHeight: 520,
                saveToPhotoAlbum: true,
                allowEdit: true
            };
        } catch (e) {
            alert('This function can use only with the devices.');
            return;
        }
        navigator.camera.getPicture(onSuccess, onFail, option);

        function onSuccess(imageData) {
            // $scope.addImage = imageData;
            var img = imageData; //base64
            $scope.imageProfile = "data:image/png;base64," + img;
            $scope.profileImgToDB = imageData;

            // Contacts.updateAvatar($scope.contact.id, $scope.addImage);

            // //Put timeout function
            $timeout(function() {
                angular.element('#reloadImage').trigger('click');
            }, 1500);

        }

        function onFail(message) {

        }
    }

    function UploadPicture(imageResult) {
        // $scope.addImage = imageResult;
        var img = imageResult; //base64
        $scope.imageProfile = "data:image/png;base64," + img;
        $scope.profileImgToDB = imageResult;
        // Contacts.updateAvatar($scope.contact.id, $scope.addImage);

        // Put timeout function
        $timeout(function() {
            angular.element('#reloadImage').trigger('click');
        }, 1500);

    }

    $scope.ShowPictures = function() {
        try {
            navigator.camera.getPicture(UploadPicture, function(message) {
                // alert('get picture failed');
            }, {
                quality: 100,
                destinationType: navigator.camera.DestinationType.DATA_URL,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                correctOrientation: true,
                targetWidth: 440,
                targetHeight: 520,
                allowEdit: true
            });
        } catch (e) {
            alert('This function can use only with the devices.');
        }
    }

    // Action Sheet
    $scope.showActionSheet = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: 'Take Photo'
            }, {
                text: 'Photo Libraly'
            }],
            titleText: 'Update your new avatar.',
            cancelText: 'Cancel',
            cancel: function() {

            },
            buttonClicked: function(index) {
                if (index == 0) {
                    $scope.takePicture();
                    hideSheet();
                } else if (index == 1) {
                    $scope.ShowPictures();
                    hideSheet();
                }
            }
        });
        // For example's sake, hide the sheet after two seconds
        $timeout(function() {
            hideSheet();
        }, 4000);
    }

    //End Action Sheet

    //Useful function

    function stringToDate(s) {
        var dateParts = s.split(' ')[0].split('-');
        var timeParts = s.split(' ')[1].split(':');
        var d = new Date(dateParts[0], --dateParts[1], dateParts[2]);
        d.setHours(timeParts[0], timeParts[1], timeParts[2])

        return d
    }
    //ENd Useful function
})

.controller('PlaylistsCtrl', function($scope, Floor, $state) {
    $scope.allFlor = Floor.all();
    for (var i = 0; i < $scope.allFlor.length; i++) {
        if ($scope.allFlor[i].available == 0) {
            $scope.allFlor[i].available = 'FULL';
            // alert('floor ' + (i + 1) + ' is full.');
        }
    }

    $scope.gotoFloor = function($index) {
        if ($scope.allFlor[$index].available == 'FULL') {
            alert('This floor is full !!');
            return;
        } else {
            location.href = '#/app/floor/' + $scope.allFlor[$index].id;
        }
    }

})

.controller('PlaylistCtrl', function($scope, $stateParams, Floor, $state) {
    var floorID = $stateParams.playlistId;
    $scope.floorDetail = Floor.get(floorID);

    if ($scope.floorDetail.available == 'FULL') {
        alert('This floor is full !!.');
        $state.go('app.allFloor');
    }

});