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
                scope.menu_info = [];

                for (var i in scope.ange_channel) {
                    if (scope.ange_channel[i].CHANNEL_ID == path[1]) {
                        channel = scope.ange_channel[i];
                        break;
                    }
                }
                var templet = '';

                if (channel.CHANNEL_NO <= 6) {
                    for (var i in scope.ange_menu) {
                        if (scope.ange_menu[i].CHANNEL_NO == channel.CHANNEL_NO) {
                            scope.menu_info.push(scope.ange_menu[i]);
                        }
                    }

                    templet += '<div ng-if="'+ (path[1] != 'main') + '" id="lnb" class="lnb">' +
                                '   <div class="localmenu_wrap">' +
                                '       <div ng-include=" \'/partials/ange/com/lnb-filter.html\' "></div>';

                    for (var j in scope.menu_info) {

                        var nowpath = scope.menu_info[j].MENU_URL.split('/');

                        if (scope.menu_info[j].DIVIDER_FL == 'Y' && j != 0) {
                            templet += '</div></div>';
                        }

                        if (scope.menu_info[j].DIVIDER_FL == 'Y') {
//                            templet += '<div>' + location + '</div>'; //임시블럭
                            templet += '<div class="localmenu_col_'+channel.COLUMN_CNT+'"><div class="localmenu_block">';
                        }

                        if (scope.menu_info[j].DEPTH == '1') {
                            if( nowpath[2] == path[2] ){
                                templet += '<a class="localmenu_link main ' + angular.lowercase(scope.menu_info[j].CLASS_GB) + ' nowmenu" ng-click="click_selectMenu(1, \''+scope.menu_info[j].MENU_ID+'\', \'\', \''+scope.menu_info[j].MENU_URL + '\', \'' + scope.menu_info[j].LINK_FL+'\')" style="cursor:default;' + (scope.menu_info[j].LINK_FL == 'C' ? 'opacity:.35;' : '')+'">' + scope.menu_info[j].MENU_NM + '</a>';
                            } else {
                                templet += '<a class="localmenu_link main ' + angular.lowercase(scope.menu_info[j].CLASS_GB) + (scope.menu_info[j].LINK_FL == 'N' ? ' notlink' : '') + '" ng-click="click_selectMenu(1, \''+scope.menu_info[j].MENU_ID+'\', \'\', \''+scope.menu_info[j].MENU_URL + '\', \'' + scope.menu_info[j].LINK_FL+'\')" style="' + (scope.menu_info[j].LINK_FL == 'C' ? 'opacity:.35;' : '') + '">' + scope.menu_info[j].MENU_NM + '</a>';
//                                templet += '<a class="localmenu_link main ' + angular.lowercase(scope.menu_info[j].CLASS_GB) + '" ng-click="click_selectMenu(\''+scope.menu_info[j].MENU_URL + '\', \'' + scope.menu_info[j].LINK_FL+'\')" style="' + (scope.menu_info[j].LINK_FL == 'N' ? 'cursor:default;' : 'cursor:pointer;')+(scope.menu_info[j].LINK_FL == 'C' ? 'opacity:.35;' : '') + '">' + scope.menu_info[j].MENU_NM + '</a>';
                            }

                        } else {
                            if (scope.menu_info[j].ETC == 'DOWNLOAD') {
                                templet += '<a class="localmenu_link sub" style="cursor:hand">'+scope.menu_info[j].MENU_NM+'</a>';
//                                templet += '<a target="_self" href="'+UPLOAD.BASE_URL+'/admin/'+scope.menu_info[j].FILE_ID+'" download="'+scope.menu_info[j].FILE_ID+'" class="localmenu_link sub" style="cursor:hand">'+scope.menu_info[j].MENU_NM+'</a>';
                            } else {
                                //templet += '<div style="font-size:0.68em;">' + scope.location + '<br />' + scope.menu_info[j].MENU_URL + '</div>'; //임시블럭

                                if( nowpath[2] == path[2] ){
                                    templet += '<a class="localmenu_link sub nowmenu" ng-click="click_selectMenu(2, \''+scope.menu_info[j].MENU_ID+'\', \''+scope.menu_info[j].PARENT_ID+'\', \''+scope.menu_info[j].MENU_URL+'\', \''+scope.menu_info[j].LINK_FL+'\')" style="' + (scope.menu_info[j].LINK_FL == 'C' ? 'color:#bcbcbc;' : '') + '">' + scope.menu_info[j].MENU_NM + '</a>';
                                } else {
                                    templet += '<a class="localmenu_link sub" ng-click="click_selectMenu(2, \''+scope.menu_info[j].MENU_ID+'\', \''+scope.menu_info[j].PARENT_ID+'\', \''+scope.menu_info[j].MENU_URL+'\', \''+scope.menu_info[j].LINK_FL+'\')" style="' + (scope.menu_info[j].LINK_FL == 'C' ? 'color:#bcbcbc;' : '') + '">' + scope.menu_info[j].MENU_NM + '</a>';
                                }
                            }
                        }

                        if (scope.menu_info[j].TAIL_DESC != null)
                            templet += '<span class="localmenu_comment">'+scope.menu_info[j].TAIL_DESC+'</span>';

                        if (j == scope.menu_info.length - 1 ) {
                            templet += '</div></div>';
                        }
                    }

                    templet += '       <div ng-include=" \'/partials/ange/com/lnb-handle.html\' "></div>' +
                            '   </div>' +
                            '</div>';


                    //모바일 메뉴구성
//                    templet += '<div class="localmenu_mobile_wrap" ng-controller="ui-lnb-mobile">';
//                    templet += '    <div class="localmenu_mobile_col">';
//                    templet += '        <span class="glyphicon glyphicon-home"></span>  <!-- 채널홈으로 이동 -->';
//                    templet += '    </div>';
//                    templet += '    <div class="localmenu_mobile_col smenu">';
//                    templet += '       <div class="btn-group" role="group" aria-label="Depth-1">';
//                    templet += '            <div class="btn-group" role="button">';
//                    templet += '               <button type="button" class="btn btn-link dropdown-toggle no-margin" data-toggle="dropdown" aria-expanded="false" style="color:#fff; text-decoration: none;">';
//                    templet += '               행복한 임신';
//                    templet += '                   <span class="caret" style="margin-left:5px;"></span>';
//                    templet += '                </button>';
//                    templet += '                <ul class="dropdown-menu" role="menu" style="top:33px;">';
//                    templet += '                    <li><a href="#">행복한 임신</a></li>';
//                    templet += '                    <li><a href="#">기분좋은 출산</a></li>';
//                    templet += '                    <li><a href="#">즐거운 육아</a></li>';
//                    templet += '                    <li><a href="#">현명한 부모</a></li>';
//                    templet += '                    <li><a href="#">앙쥬 스페셜</a></li>';
//                    templet += '                    <li><a href="#">앙쥬 매거진</a></li>';
//                    templet += '                </ul>';
//                    templet += '            </div>';
//                    templet += '        </div>';
//                    templet += '    </div>';
//
//                    templet += '    <div class="localmenu_mobile_col smenu">';
//                    templet += '        <div class="btn-group" role="group" aria-label="Depth-2">';
//                    templet += '           <div class="btn-group" role="button">';
//                    templet += '                <button type="button" class="btn btn-link dropdown-toggle no-margin" data-toggle="dropdown" aria-expanded="false" style="color:#fff; text-decoration: none;">';
//                    templet += '                임신부 지침서';
//                    templet += '                    <span class="caret" style="margin-left:5px;"></span>';
//                    templet += '                </button>';
//                    templet += '                <ul class="dropdown-menu" role="menu" style="top:33px;">';
//                    templet += '                    <li><a href="#">임신부 지침서</a></li>';
//                    templet += '                    <li><a href="#">푸드 솔루션</a></li>';
//                    templet += '                    <li><a href="#">뷰티/헬스 솔루션</a></li>';
//                    templet += '                    <li><a href="#">임신부용품</a></li>';
//                    templet += '                    <li><a href="#">태교/태담</a></li>';
//                    templet += '               </ul>';
//                    templet += '           </div>';
//                    templet += '       </div>';
//                    templet += '   </div>';
//                    templet += '</div>';




                    templet += '<div ng-if="'+ (path[1] != 'main') + '" class="localmenu_mobile_wrap" ng-controller="ui-lnb-mobile">';
                    templet += '    <div class="localmenu_mobile_col" ng-click="channelhometo(\'' + channel.CHANNEL_URL + '\')">';
                    templet += '        <span class="glyphicon glyphicon-home" style="margin-top:2px;"></span>  <!-- 채널홈으로 이동 -->';
                    templet += '    </div>';
                    templet += '    <div class="localmenu_mobile_col smenu">';
                    templet += '        <div class="btn-group" role="group" aria-label="Depth-1">';
                    templet += '            <div class="btn-group" role="button">';
                    templet += '               <button type="button" class="btn btn-link dropdown-toggle no-margin" data-toggle="dropdown" aria-expanded="false" style="color:#fff; font-size:1em; text-decoration: none;">';
                    //templet += '                선택하세요';

                    var now_title = '';
                    var menu_big = '';
                    var menu_small = '';

                    now_title = 'Depth1';

                    for (var k in scope.menu_info) {

                        if(scope.menu_info[k].LINK_FL != 'C'){

//                            if( scope.menu_info[j].DEPTH == '1'){
//                                now_title = scope.menu_info[j].MENU_NM;
//                                if( scope.menu_info[j].MENU_URL == scope.location){
//                                    menu_big += '<li>' + scope.menu_info[j].MENU_NM + '</li>';
//                                } else {
//                                    menu_big += '<li><a href="" ng-click="click_selectMenu(\''+scope.menu_info[j].MENU_URL+'\', \''+scope.menu_info[j].LINK_FL+'\')" >' + scope.menu_info[j].MENU_NM + '</li>';
//                                }
//                            } else {
//                                if( scope.menu_info[j].MENU_URL == scope.location){
//                                    menu_small += '<li>' + scope.menu_info[j].MENU_NM + '</li>';
//                                } else {
//                                    menu_small += '<li><a href="" ng-click="click_selectMenu(\''+scope.menu_info[j].MENU_URL+'\', \''+scope.menu_info[j].LINK_FL+'\')" >' + scope.menu_info[j].MENU_NM + '</li>';
//                                }
//                            }
//
//                            if( scope.menu_info[j].DEPTH == '1' && scope.menu_info[j].MENU_URL == scope.location){
//                                //now_title = scope.menu_info[j].MENU_NM;
//                                menu_big += '<li>' + scope.menu_info[j].MENU_NM + '</li>';
//                            } else if( scope.menu_info[j].DEPTH == '1' && scope.menu_info[j].MENU_URL != scope.location) {
//                                menu_big += '<li><a href="" ng-click="click_selectMenu(\''+scope.menu_info[j].MENU_URL+'\', \''+scope.menu_info[j].LINK_FL+'\')" >' + scope.menu_info[j].MENU_NM + '</li>';
//                            }

                            if( scope.menu_info[k].DEPTH == '1'){
                                menu_big += '<li><a href="" ng-click="click_selectMenu(1, \''+scope.menu_info[k].MENU_ID+'\', \'\', \''+scope.menu_info[k].MENU_URL+'\', \''+scope.menu_info[k].LINK_FL+'\')" >' + scope.menu_info[k].MENU_NM + '</a></li>';
                            } else {
                                menu_small += '<li><a href="" ng-click="click_selectMenu(2, \''+scope.menu_info[k].MENU_ID+'\', \'\', \''+scope.menu_info[k].MENU_URL+'\', \''+scope.menu_info[k].LINK_FL+'\')" >' + scope.menu_info[k].MENU_NM + '</a></li>';
                            }
                        }
                    }

//                    templet += now_title;
//                    console.log(menu_big);
                    templet += '                {{ depth1_nm == \'\' ? \'선택\' : depth1_nm }}';
                    templet += '                   <span class="caret" style="margin-left:5px;"></span>';
                    templet += '               </button>';
                    templet += '                <ul class="dropdown-menu" role="menu" style="top:33px;">';

                    templet += menu_big;

                    templet += '</ul>' +
                                '</div>' +
                                '</div>' +
                                '</div>';

                    templet += '    <div ng-show="depth2 != \'\'" class="localmenu_mobile_col smenu">';
                    templet += '        <div class="btn-group" role="group" aria-label="Depth-2">';
                    templet += '            <div class="btn-group" role="button">';
                    templet += '                <button type="button" class="btn btn-link dropdown-toggle no-margin" data-toggle="dropdown" aria-expanded="false" style="color:#fff; font-size:1em; text-decoration: none;">';
                    templet += '                {{ depth2_nm == \'\' ? \'선택\' : depth2_nm }}';
                    templet += '                   <span class="caret" style="margin-left:5px;"></span>';
                    templet += '                </button>';
                    templet += '                <ul class="dropdown-menu" role="menu" style="top:33px;">';
                    templet += '                    <li ng-repeat="small in depth2" ><a ng-click="click_selectMenu(2, small.MENU_ID, small.PARENT_ID, small.MENU_URL, small.LINK_FL)" > {{ small.MENU_NM }} </a></li>';

//                    templet += menu_small;

//                    templet += '                    <li><a href="#">임신부 지침서</a></li>';
//                    templet += '                    <li><a href="#">푸드 솔루션</a></li>';
//                    templet += '                    <li><a href="#">뷰티/헬스 솔루션</a></li>';
//                    templet += '                    <li><a href="#">임신부용품</a></li>';
//                    templet += '                    <li><a href="#">태교/태담</a></li>';
                    templet += '                </ul>';
                    templet += '            </div>';
                    templet += '        </div>';
                    templet += '    </div>';
                    templet += '</div>';
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
//                        ['catch'](function(error){});

                    var current_menu = null;
                    var current_pid = null;
                    $scope.depth2 = [];
                    $scope.depth1_nm = '';
                    $scope.depth2_nm = '';

                    for (var i in $scope.menu_info) {
                        if ($scope.menu_info[i].DEPTH == '1') {
                            current_menu = $scope.menu_info[i];
                            current_menu.SUB_MENU = [];
                        } else if ($scope.menu_info[i].DEPTH == '2') {
                            $scope.menu_info[i].PARENT_ID = current_menu.MENU_ID;
                            current_menu.SUB_MENU.push($scope.menu_info[i]);
                        }

                        if ($scope.menu_info[i].MENU_ID == $scope.path[2]) {
                            if ($scope.menu_info[i].DEPTH == '1') {
                                $scope.depth1_nm = $scope.menu_info[i].MENU_NM;
                            } else {
                                $scope.depth2_nm = $scope.menu_info[i].MENU_NM;
                                current_pid = current_menu.MENU_ID;
                            }
                        }
                    }

                    for (var i in $scope.menu_info) {
                        if ($scope.menu_info[i].DEPTH == '1' && $scope.menu_info[i].MENU_ID == current_pid) {
                            $scope.depth1_nm = $scope.menu_info[i].MENU_NM;
                            $scope.depth2 = $scope.menu_info[i].SUB_MENU;
                        }
                    }
                };

                /********** 이벤트 **********/
                $scope.click_selectMenu = function(depth, id, pid, url, link) {

                    if($scope.location == url){

                        $scope.nowurl = url;
                    }

                    if(url == '/people/supporter/list'){

                        console.log($scope.role);
                        if($scope.uid == null || $scope.uid == ''){
                            dialogs.notify('알림', '로그인 후 이용 가능합니다.', {size: 'md'});
                            return;
                        }else if($scope.role == 'SUPPORTERS' || $scope.role == 'ANGE_MANAGER' || $scope.role == 'ANGE_ADMIN'){
                            $location.url(url);
                        }else{
                            dialogs.notify('알림', '서포터즈 회원만 이용 가능합니다.', {size: 'md'});
                            return;
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

                    if(url == '/infodesk/signon'){ // 회원 가입
                        if($scope.session != null){
                            dialogs.notify('알림', '로그인된 사용자는 회원가입을 할수 없습니다.', {size: 'md'});
                            return;
                        }else{
                            $location.url(url);
                        }
                    }

                    if (link == 'C') {
                        dialogs.notify('알림', '점검중입니다.', {size: 'md'});
                    } else if (link != 'N') {
                        $location.url(url);
                    }

                    $scope.depth2 = [];
                    $scope.depth1_nm = '';
                    $scope.depth2_nm = '';

                    if (depth == 1) {
                        for (var i in $scope.menu_info) {
                            if ($scope.menu_info[i].DEPTH == '1' && $scope.menu_info[i].MENU_ID == id) {
                                $scope.depth1_nm = $scope.menu_info[i].MENU_NM;
                                $scope.depth2 = $scope.menu_info[i].SUB_MENU;
                            }
                        }
                    } else  if (depth == 2) {
                        for (var i in $scope.menu_info) {
                            if ($scope.menu_info[i].DEPTH == '2' && $scope.menu_info[i].MENU_ID == id) {
                                $scope.depth2_nm = $scope.menu_info[i].MENU_NM;
                            } else if ($scope.menu_info[i].DEPTH == '1' && $scope.menu_info[i].MENU_ID == pid) {
                                $scope.depth1_nm = $scope.menu_info[i].MENU_NM;
                                $scope.depth2 = $scope.menu_info[i].SUB_MENU;
                            }
                        }
                    }

//                    var checkDepth = false;
//
//                    if (depth == 1) {
//                        $scope.depth2 = [];
//
//                        for (var i in $scope.menu_info) {
//                            if ($scope.menu_info[i].DEPTH == '1' && $scope.menu_info[i].MENU_ID == id) {
//                                checkDepth = true;
//                            } else if ($scope.menu_info[i].DEPTH == '1' && $scope.menu_info[i].MENU_ID != id) {
//                                checkDepth = false;
//                            }
//
//                            if ($scope.menu_info[i].DEPTH == '2' && checkDepth) {
//                                $scope.depth2.push($scope.menu_info[i]);
//                            }
//                        }
//                    }
                };

                $scope.click_selectCategory = function(idx, category) {
                    $scope.category[idx] = category;
                    $scope.reload = true;
                    $scope.getContentList();
                };

                $scope.channelhometo = function (url){
                    //alert(url);
                    $location.url(url);
                }

                /********** 화면 초기화 **********/
                $scope.init();
            }]
        }
    }]);
});