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
    controllers.controller('companyintro', ['$rootScope', '$scope', '$window', '$location', 'dialogs', 'CONSTANT', function ($rootScope, $scope, $window, $location, dialogs, CONSTANT) {

        /********** 초기화 **********/
        $scope.search = {COMPANY_GB: 'PARTNER'};

        $scope.partner1 = [];
        $scope.partner2 = [];
        $scope.partner3 = [];
        $scope.partner4 = [];

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

        $scope.click_focus = function (id, name) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+name).focus();
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
                        }
                    }
                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
        };

        $scope.getPartnerList();
	}]);
});
