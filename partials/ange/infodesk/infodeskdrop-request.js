/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-06
 * Description : infodeskdrop-request.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('infodeskdrop-request', ['$rootScope', '$scope', '$window', '$location', 'dialogs', function ($rootScope, $scope, $window, $location, dialogs) {

        /********** 초기화 **********/
        $scope.checkDrop = false;

        $scope.init = function () {

        };

        // 비밀번호 변경
        $scope.click_dropUser = function () {
            if (!$scope.checkDrop) {
                dialogs.notify('알림', '안내를 확인 후 동의해야 합니다.', {size: 'md'});
                return;
            }

            var dialog = dialogs.confirm('알림', '탈퇴 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/user', 'terminate', $rootScope.uid, false)
                    .then(function(){
                        $scope.logout($rootScope.uid).then( function(data) {

                            dialogs.notify('알림', '정상적으로 탈퇴 되었습니다.', {size: 'md'});
                            $location.url('/main');
                        });


                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        };

        $scope.init();
	}]);
});
