/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-29
 * Description : ui_utility.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ui-utility', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', function ($scope, $rootScope, $stateParams, $location, dialogs) {

        var spMenu = $location.path().split('/');

        /********** 이벤트 **********/
        $scope.click_login = function () {
            $scope.openModal(null, 'md');
        };

        $scope.click_joinMember = function () {
            $location.url('join/join-terms');
        };

        // 로그인 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('login_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'CMS';

                        $scope.login($scope.item.id, $scope.item)
                            .then(function(data){
                                $rootScope.authenticated = true;
                                $rootScope.uid = data.USER_ID;
                                $rootScope.name = data.USER_NM;
                                $rootScope.role = data.ROLE_ID;
                                $rootScope.menu_role = data.MENU_ROLE;
                                $rootScope.email = data.EMAIL;

                                $modalInstance.close();
                            }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        $scope.logoutMe = function() {
            if ($rootScope.uid != undefined) {
                $scope.logout($rootScope.uid).then( function(data) {
                    dialogs.notify('알림', "로그아웃 되었습니다.", {size: 'md'});
                });
            }
        };

/*        // 세션 체크
        $scope.sessionCheck = function(session) {
            if (session.USER_ID == undefined) {
//                $location.path("/signin");
//                throw( new String('세션이 만료되었습니다.') );
//            throw( new Error("세션이 만료되었습니다.") );
            } else if (session.USER_ID == '') {
//                $location.path("/signin");
//                throw( new String('로그인 후 사용가능합니다.') );
            } else {
                $rootScope.session = session;



                $rootScope.authenticated = true;
                $rootScope.uid = session.USER_ID;

                //console.log($rootScope.uid);

                $rootScope.name = session.USER_NM;
                $rootScope.role = session.ROLE_ID;
                $rootScope.menu_role = session.MENU_ROLE;
                $rootScope.email = session.EMAIL;
            }

            //console.log($rootScope.uid);

            return;

        };*/

        $scope.click_mainLogo = function() {

        };

//        $scope.getSession()
//            .then($scope.sessionCheck)
//            .catch($scope.reportProblems);


	}]);
});
