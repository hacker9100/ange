/**
 * Author : Sung-hwan Kim
 * Date   : 2014-12-30
 * Description : uiLnb 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('uiLnb', ['$controller', 'UPLOAD', function($controller, UPLOAD) {
        return {
            restrict: 'EA',
//            scope: true,
//            replace: true,
//            controller: "@",
//            name: "controllerName",
            template: function(element, attr) {
                var scope = element.scope();
                var path = scope.location.split('/');
                var channel = null;
                var menu_info = [];

                for (var i in scope.ange_channel) {
                    if (scope.ange_channel[i].CHANNEL_ID == path[1]) {
                        channel = scope.ange_channel[i];
                        break;
                    }
                }
                var templet = '';

                if (channel.CHANNEL_NO <= 6) {
                    for (var i in scope.ange_menu) {
//                        console.log(scope.ange_menu[i].CHANNEL_NO)
                        if (scope.ange_menu[i].CHANNEL_NO == channel.CHANNEL_NO) {
                            menu_info.push(scope.ange_menu[i]);
//                            console.log(scope.ange_menu[i])
                        }
                    }

                    templet += '<div ng-if="'+ (path[1] != 'main') + '" id="lnb" class="lnb">' +
                                '   <div class="localmenu_wrap">' +
                                '       <div ng-include=" \'/partials/ange/com/lnb-filter.html\' "></div>';

                    for (var j in menu_info) {
                        if (menu_info[j].DIVIDER_FL == 'Y' && j != 0) {
                            templet += '</div></div>';
                        }

                        if (menu_info[j].DIVIDER_FL == 'Y') {
                            templet += '<div class="localmenu_col_'+channel.COLUMN_CNT+'"><div class="localmenu_block">';
                        }

                        if (menu_info[j].DEPTH == '1') {
                            templet += '<a class="localmenu_link main '+angular.lowercase(menu_info[j].CLASS_GB)+'" ng-click="click_selectMenu(\''+menu_info[j].MENU_URL+'\', \''+menu_info[j].LINK_FL+'\')" style="'+(menu_info[j].LINK_FL == 'N' ? 'cursor:default;' : 'cursor:hand;')+(menu_info[j].LINK_FL == 'C' ? 'opacity:.35;' : '')+'">'+menu_info[j].MENU_NM+'</a>';
                        } else {
                            if (menu_info[j].ETC == 'DOWNLOAD') {
                                templet += '<a class="localmenu_link sub" style="cursor:hand">'+menu_info[j].MENU_NM+'</a>';
//                                templet += '<a target="_self" href="'+UPLOAD.BASE_URL+'/admin/'+menu_info[j].FILE_ID+'" download="'+menu_info[j].FILE_ID+'" class="localmenu_link sub" style="cursor:hand">'+menu_info[j].MENU_NM+'</a>';
                            } else {
                                templet += '<a class="localmenu_link sub" ng-click="click_selectMenu(\''+menu_info[j].MENU_URL+'\', \''+menu_info[j].LINK_FL+'\')" style="cursor:hand;'+(menu_info[j].LINK_FL == 'C' ? 'color:#bcbcbc;' : '')+'">'+menu_info[j].MENU_NM+'</a>';
                            }
                        }

                        if (menu_info[j].TAIL_DESC != null)
                            templet += '<span class="localmenu_comment">'+menu_info[j].TAIL_DESC+'</span>';

                        if (j == menu_info.length - 1 ) {
                            templet += '</div></div>';
                        }
                    }

                    templet += '       <div ng-include=" \'/partials/ange/com/lnb-handle.html\' "></div>' +
                            '   </div>' +
                            '</div>';
                }
                return templet;
            },
            controller: ['$scope', '$location', 'dialogs', function($scope, $location, dialogs) {

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

                    if(url == '/people/supporter/list'){

                        console.log($scope.user_gb );
                        if($scope.uid == null || $scope.uid == ''){
                            dialogs.notify('알림', '로그인 후 이용 가능합니다.', {size: 'md'});
                            return;
                        }else if($scope.user_gb !== 'SUPPORTERS'){
                            dialogs.notify('알림', '서포터즈 회원만 이용 가능합니다.', {size: 'md'});
                            return;
                        }else{
                            $location.url(url);
                        }
                    }

                    if(url == '/infodesk/myqna/list'){ // 고객센터 내 질문과 답변
                        if($scope.uid == null || $scope.uid == ''){
                            dialogs.notify('알림', '로그인 후 이용 가능합니다.', {size: 'md'});
                            return;
                        }else{
                            $location.url(url);
                        }
                    }

                    if (link == 'C') {
                        dialogs.notify('알림', '1차 체험기간에는 제공되지 않습니다.', {size: 'md'});
                    } else if (link != 'N') {
                        $location.url(url);
                    }


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