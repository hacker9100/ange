/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-30
 * Description : companyaffiliates.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('companyaffiliates', ['$rootScope', '$scope', '$window', '$location', 'dialogs', 'UPLOAD', function ($rootScope, $scope, $window, $location, dialogs, UPLOAD) {

        $scope.item = {};
        /********** 초기화 **********/
        $scope.init = function () {

            $scope.item.COMPANY_GB = 'MAGAZINE';
        };

        /********** 이벤트 **********/
        $scope.click_comp = function (){

            $scope.item.COMPANY_PHONE1 = $scope.item.PHONE1_1+$scope.item.PHONE1_2+$scope.item.PHONE1_3;
            $scope.item.COMPANY_PHONE2 = $scope.item.PHONE2_1+$scope.item.PHONE2_2+$scope.item.PHONE2_3;
            $scope.item.COMPANY_EMAIL = $scope.item.EMAIL_ID+'@'+$scope.item.EMAIL_ADDRESS;

            $scope.insertItem('ange/company', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                    $location.url("main");
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }



        $scope.init();
	}]);
});
