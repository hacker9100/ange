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
    controllers.controller('ui-gnb', ['$scope', '$rootScope', '$location', 'dialogs', '$stateParams', function ($scope, $rootScope, $location, dialogs, $stateParams) {

        $scope.search = {};

        $scope.channeltitle = $stateParams.channel; //채널 타이틀(GNB 하이라이트용)

        var spMenu = $location.path().split('/');

        var channel_nm = $stateParams.channel;

        /********** 이벤트 **********/
        $scope.init = function () {
            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            $scope.search.SEARCH_KEYWORD = getParam("search_key");
        };

        $scope.click_channel = function() {

        };

        $scope.click_login = function () {
            $scope.openModal(null, 'md');
        };

        $scope.click_myange = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                return;
            }

            //$location.url('/myange/home');
            $location.url('/myange/mileage');
        }

        $scope.click_showSearch = function (){
            if($scope.search.SEARCH_KEYWORD == undefined){
                $scope.search.SEARCH_KEYWORD = '';
            }

            $location.url('/search/list?search_key='+$scope.search.SEARCH_KEYWORD);
        }

        $scope.init();
	}]);


    // 사용할 서비스를 주입
    controllers.controller('ui-lnb-mobile', ['$scope', '$rootScope', '$location', 'dialogs', '$stateParams', function ($scope, $rootScope, $location, dialogs, $stateParams) {

        var spMenu = $location.path().split('/');

        var channel_nm = $stateParams.channel;

        /********** 이벤트 **********/
        $scope.click_channel = function() {

        };

        $scope.click_login = function () {
            $scope.openModal(null, 'md');
        };

        $scope.click_myange = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                return;
            }

            //$location.url('/myange/home');
            $location.url('/myange/mileage');
        }

    }]);

});
