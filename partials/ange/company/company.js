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

    controllers.controller('companyintro', ['$rootScope', '$scope', '$window', '$location', '$anchorScroll', 'dialogs', 'CONSTANT', function ($rootScope, $scope, $window, $location, $anchorScroll, dialogs, CONSTANT) {

        /********** 초기화 **********/
        $scope.search = {COMPANY_GB: 'PARTNER'};

        $scope.partner1 = [];
        $scope.partner2 = [];
        $scope.partner3 = [];
        $scope.partner4 = [];
        $scope.partner5 = [];
        $scope.partner6 = [];
        $scope.partner7 = [];
        $scope.partner8 = [];
        $scope.partner9 = [];
        $scope.partner10 = [];
        $scope.partner11 = [];
        $scope.partner12 = [];
        $scope.partner13 = [];
        $scope.partner14 = [];
        $scope.partner15 = [];
        $scope.partner16 = [];
        $scope.partner17 = [];
        $scope.partner18 = [];
        $scope.partner19 = [];
        $scope.partner20 = [];
        $scope.partner21 = [];
        $scope.partner22 = [];
        $scope.partner23 = [];

        $scope.init = function () {
            $scope.selectIdx = 1;
        };

        /********** 이벤트 **********/

        $scope.init();

        $scope.partnerLink = function (item) {
            $window.open (item.URL);
        }

        $scope.click_selectTab = function (idx){
            $scope.selectIdx = idx;
        }

        $scope.click_focus = function (id) {
            $location.hash(id);

            // call $anchorScroll()
            $anchorScroll();
        }

        $scope.download_click = function (no) {
            switch(no){
                case 1:
                    window.open ('/imgs/ange/temp/20150324_angemediakit.pdf', '_blank');
                    //location.href = '/imgs/ange/temp/20150324_angemediakit.pdf';
                    break;
                case 2:
                    window.open ('/imgs/ange/temp/201503_angebeakwa.pdf', '_blank');
                    //$location.url = '/imgs/ange/temp/201503_angebeakwa.pdf';
                    break;
                case 3:
                    alert('준비중입니다');
                    //window.open ('/imgs/ange/temp/20150324_angemediakit.pdf', '_blank');
                    //$location.url = '/imgs/ange/temp/20150324_angemediakit.pdf';
                    break;
                case 4:
                    window.open ('/imgs/ange/temp/201503_angedisplayad.pdf', '_blank');
                    //$location.url = '/imgs/ange/temp/201503_angedisplayad.pdf';
                    break;
                case 5:
                    window.open ('/imgs/ange/temp/201503_angestudio.pdf', '_blank');
                    //$location.url = '/imgs/ange/temp/201503_angestudio.pdf';
                    break;
                default:
                    alert('다운로드 경로를 찾을 수 없습니다.');
                    break;
            }
        }

        $scope.getPartnerList = function () {
            $scope.getList('ange/company', 'list', {}, $scope.search, true)
                .then(function(data){

                    for (var i in data) {
                        data[i].img = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;

                        if (data[i].CATEGORY_GB == 1) {
                            $scope.partner1.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 2) {
                            $scope.partner2.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 3) {
                            $scope.partner3.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 4) {
                            $scope.partner4.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 5) {
                            $scope.partner5.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 6) {
                            $scope.partner6.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 7) {
                            $scope.partner7.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 8) {
                            $scope.partner8.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 9) {
                            $scope.partner9.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 10) {
                            $scope.partner10.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 11) {
                            $scope.partner11.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 12) {
                            $scope.partner12.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 13) {
                            $scope.partner13.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 14) {
                            $scope.partner14.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 15) {
                            $scope.partner15.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 16) {
                            $scope.partner16.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 17) {
                            $scope.partner17.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 18) {
                            $scope.partner18.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 19) {
                            $scope.partner19.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 20) {
                            $scope.partner20.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 21) {
                            $scope.partner21.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 22) {
                            $scope.partner22.push(data[i]);
                        } else if (data[i].CATEGORY_GB == 23) {
                            $scope.partner23.push(data[i]);
                        }
                    }
                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
        };

        $scope.getPartnerList();

    }]);
});
