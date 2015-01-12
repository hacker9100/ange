/**
 * Author : Sung-hwan Kim
 * Date   : 2014-12-30
 * Description : uiLnb 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('uiLnb', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
//            replace: true,
//            controller: "@",
//            name: "controllerName",
            template: function(element, attr) {
                var scope = element.scope();
                var menu = scope.location.split('/');

                var channelNo = '';
                var channel = null;
                var templet = '';

                switch(menu[1]) {
                    case 'main' :
                        channelNo = '0';
                        break;
                    case 'story' :
                        channelNo = '1';
                        break;
                    case 'people' :
                        channelNo = '2';
                        break;
                    case 'moms' :
                        channelNo = '3';
                        break;
                    case 'myange' :
                        channelNo = '4';
                        break;
                    case 'store' :
                        channelNo = '5';
                        break;
                    case 'infodesk' :
                        channelNo = '6';
                        break;
                    case 'join' :
                        channelNo = '7';
                        break;
                    default :
                        channelNo = '0';
                }

                for (var i in scope.ange_channel) {
                    if (scope.ange_channel[i].CHANNEL_NO == channelNo) {
                        channel = scope.ange_channel[i];
                    }
                }

                templet = '<div ng-if="'+ (menu[1] != 'main') + '" id="lnb" class="lnb"' +
                        '   <div class="localmenu_wrap">' +
                        '       <div ng-include=" \'/partials/ange/com/lnb-filter.html\' "></div>';

                for (var j in channel.MENU_INFO) {
                    if (channel.MENU_INFO[j].DIVIDER_FL == 'Y' && j != 0) {
                        templet += '</div></div>';
                    }

                    if (channel.MENU_INFO[j].DIVIDER_FL == 'Y') {
                        templet += '<div class="localmenu_col_'+channel.COLUMN_CNT+'"><div class="localmenu_block">';
                    }

                    if (channel.MENU_INFO[j].DEPTH == '1')
                        templet += '<a class="localmenu_link main '+angular.lowercase(channel.MENU_INFO[j].CLASS_GB)+'" ng-click="click_selectMenu(\''+channel.MENU_INFO[j].MENU_URL+'\', \''+channel.MENU_INFO[j].LINK_FL+'\')">'+channel.MENU_INFO[j].MENU_NM+'</a>';
                    else
                        templet += '<a class="localmenu_link sub" ng-click="click_selectMenu(\''+channel.MENU_INFO[j].MENU_URL+'\', \''+channel.MENU_INFO[j].LINK_FL+'\')">'+channel.MENU_INFO[j].MENU_NM+'</a>';

                    if (channel.MENU_INFO[j].TAIL_DESC != null)
                        templet += '<span class="localmenu_comment">'+channel.MENU_INFO[j].TAIL_DESC+'</span>';

                    if (j == channel.MENU_INFO.length - 1 ) {
                        templet += '</div></div>';
                    }
                }

                templet += '       <div ng-include=" \'/partials/ange/com/lnb-handle.html\' "></div>' +
                        '   </div>' +
                        '</div>';

                return templet;
            },
            controller: ['$scope', '$location', function($scope, $location) {

                /********** 초기화 **********/
                // 카테고리 데이터
//                $scope.category = [];

                // 초기화
                $scope.init = function() {
//                    $scope.getList('cms/category', 'list', {}, {}, false).then(function(data){
//
////                        $scope.category = data;
//
//                        var category_a = [];
//                        var category_b = [];
//
//                        for (var i in data) {
//                            var item = data[i];
//
//                            if (item.CATEGORY_GB == '1' && item.CATEGORY_ST == '0') {
//                                category_a.push(item);
//                            } else if (item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO == '0') {
//                                category_b.push(item);
//                            }
//                        }
//
//                        $scope.category_a = category_a;
//                        $scope.category_b = category_b;
//                    })
//                        .catch(function(error){});
                };

                /********** 이벤트 **********/
                $scope.click_selectMenu = function(url, link) {
                    $location.url(url);
                };

                $scope.click_selectCategory = function(idx, category) {
                    $scope.category[idx] = category;
                    $scope.reload = true;
                    $scope.getContentList();
                };

                /********** 화면 초기화 **********/
                $scope.init();
            }]
        }
    }]);
});