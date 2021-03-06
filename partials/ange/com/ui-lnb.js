/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-30
 * Description : ui-lnb.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ui-lnb', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$filter', 'dialogs', function ($scope, $rootScope, $stateParams, $controller, $location, $filter, dialogs) {

        /********** 초기화 **********/
        // 카테고리 데이터
        $scope.category = [];

        // 초기화
        $scope.init = function() {
            $scope.getList('cms/category', 'list', {}, {SYSTEM_GB: 'CMS'}, false).then(function(data){

                $scope.category = data;

                var category_a = [];
                var category_b = [];

                for (var i in data) {
                    var item = data[i];

                    if (item.CATEGORY_GB == '1' && item.CATEGORY_ST == '0') {
                        category_a.push(item);
                    } else if (item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO == '0') {
                        category_b.push(item);
                    }
                }

                $scope.category_a = category_a;
                $scope.category_b = category_b;
            })
            ['catch'](function(error){$scope.projects = []; console.log(error)});
        };

        /********** 좌측 메뉴 **********/
        var channelNo = "2";

        var channel = $filter('filter')($rootScope.ange_channel, function (data) {
            return data.CHANNEL_NO === channelNo;
        })[0];

        $scope.item = channel;

        /********** 화면 초기화 **********/
        $scope.init();
	}]);
});
