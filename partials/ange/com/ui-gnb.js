/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-29
 * Description : ui-gnb.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ui-gnb', ['$scope', '$rootScope', '$location', 'dialogs', function ($scope, $rootScope, $location, dialogs) {

        var spMenu = $location.path().split('/');

        /********** 이벤트 **********/
        $scope.click_channel = function() {

        };

        $(document).ready(function(){

            $("#myange_home").click(function(){

                if ($rootScope.uid == '' || $rootScope.uid == null) {
                    dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                    return;
                }

                $location.url('/myange/home');
            });

        });

/*        $(function(){
            $("#myange_home").click(function(){

                if ($rootScope.uid == '' || $rootScope.uid == null) {
                    dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                    return;
                }

                $location.url('/myange/home');
            });
         });*/

	}]);
});
