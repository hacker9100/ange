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
    controllers.controller('companyaffiliates', ['$rootScope', '$scope', '$window', '$location', 'dialogs', 'CONSTANT', function ($rootScope, $scope, $window, $location, dialogs, CONSTANT) {

        $scope.item = {};
        $scope.disabledEmail = false;

        $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });
        
        /********** 초기화 **********/
        $scope.init = function () {
            $scope.item = {AFFILIATE_GB: 'MAGAZINE', AFFILIATE_FL: 1, COMPANY_GB: 'AFFILIATE', COMPANY_NM: '', CHARGE_NM: '', URL: '', PHONE_1: '', PHONE_2: '', EMAIL: '', NOTE: '', COMPANY_AGREE_YN: false};

            $scope.item.PHONE_1_1 = '';
            $scope.item.PHONE_1_2 = '';
            $scope.item.PHONE_1_3 = '';
            $scope.item.PHONE_2_1 = '';
            $scope.item.PHONE_2_2 = '';
            $scope.item.PHONE_2_3 = '';
            $scope.item.EMAIL_ID = '';
            $scope.item.EMAIL_TYPE = '';
        };

        /********** 이벤트 **********/
        $scope.$watch('item.EMAIL_SELECT', function() {
            console.log($scope.item.EMAIL_SELECT);
            if ($scope.item.EMAIL_SELECT != undefined) {
                if ($scope.item.EMAIL_SELECT == '') {
                    $scope.item.EMAIL_TYPE = '';
                    $scope.disabledEmail = false;
                } else {
                    $scope.disabledEmail = true;
                    $scope.item.EMAIL_TYPE = $scope.item.EMAIL_SELECT;
                }
            }
        });
        
        $scope.click_cancel = function (){
            history.back();
        }
        
        $scope.click_comp = function (){

            if (!$scope.item.COMPANY_AGREE_YN) {
                dialogs.notify('알림', '개인정보 취급방침에 동의해야 합니다.', {size: 'md'});
                return;
            }

            if ($scope.item.COMPANY_NM == '') {
                $('#company_nm').focus();
                dialogs.notify('알림', '기업명을 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.item.CHARGE_NM == '') {
                $('#charge_nm').focus();
                dialogs.notify('알림', '담당자명을 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.item.URL == '') {
                $('#url').focus();
                dialogs.notify('알림', '홈페이지를 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.item.PHONE_1_1 != '' && $scope.item.PHONE_1_2 != '' && $scope.item.PHONE_1_3 != '') {
                $scope.item.PHONE_1 = $scope.item.PHONE_1_1 + $scope.item.PHONE_1_2 + $scope.item.PHONE_1_3;
            }

            if ($scope.item.PHONE_2_1 == '' || $scope.item.PHONE_2_2 == '' || $scope.item.PHONE_2_3 == '') {
                $('#phone_2').focus();
                dialogs.notify('알림', '휴대폰을 확인해주세요.', {size: 'md'});
                return;
            } else {
                $scope.item.PHONE_2 = $scope.item.PHONE_2_1 + $scope.item.PHONE_2_2 + $scope.item.PHONE_2_3;
            }

            if ($scope.item.EMAIL_ID == '' || $scope.item.EMAIL_TYPE == '') {
                $('#email').focus();
                dialogs.notify('알림', '이메일을 확인해주세요.', {size: 'md'});
                return;
            } else {
                $scope.item.EMAIL = $scope.item.EMAIL_ID + '@' + $scope.item.EMAIL_TYPE;
            }

            if ($scope.item.NOTE == '') {
                $('#note').focus();
                dialogs.notify('알림', '내용을 입력해주세요.', {size: 'md'});
                return;
            }

            if ($scope.file) {
                $scope.item.FILE = $scope.file;
                $scope.item.FILE.$destroy = '';
            }

            $scope.insertItem('ange/company', 'item', $scope.item, false)
                .then(function(){
                    dialogs.notify('알림', '정상적으로 접수되었습니다.', {size: 'md'});
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }



        $scope.init();
	}]);
});
