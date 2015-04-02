/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-30
 * Description : companyintro.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
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
