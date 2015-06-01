/**
 * Author : Sung-hwan Kim
 * Date   : 2014-12-29
 * Description : angeLayout 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('angeLayout', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
            replace: true,
            compile: function(element, attrs){
                var menu = element.scope().location.split('/');

                if (menu.length > 2) {
                    if (menu[2] == '' || menu[2] == '') {
                        if (menu[3] == 'list') {
                            menu[2] = '';
                        } else {
                            menu[2] = '';
                        }
                    }
                }
//                element.append('<div ng-include src=" \'/partials/cms/'+menu[1]+'_'+menu[2]+'.html\' "></div>');
                element.append('<ange-body></ange-body>');
            }
        }
    }]);

    directives.directive('angeBody', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
//            replace: true,
//            controller: "@",
//            name: "controllerName",
            templateUrl: function(element, attr) {
                var path = element.scope().location.split('/');
                var ange_menu = element.scope().ange_menu;
                var menu = null;
                var url = '';

                for (var i=0; i<ange_menu.length; i++) {
                    if (ange_menu[i].MENU_ID.indexOf(path[2]) > -1) {
                        menu = ange_menu[i];
                    }
                }

                switch(path.length) {
                    case 2 :
                        url = path[1];
                        break;
                    case 3 :
                        url = path[1] + '/' + path[1] + path[2];
                        break;
                    default :
                        // 앙쥬스토리
                        if (path[1] == 'story') {
                            path[2] = 'content';

//                            if (path[2] != 'magazine') {
//                                path[2] = 'content';
//                            }
                            // 앙쥬피플
                        } if (path[1] == 'people') {
                        if (menu.COMM_GB != null) {

                            //path[2] = angular.lowercase(menu.COMM_GB);
                            if(path[2] == 'discusstitle'){ // 온라인토론 타이틀 리스트
                                path[2] == 'discusstitle';
                            }else if(path[2] == 'discuss'){
                                path[2] == 'discuss';
                            }else{
                                path[2] = angular.lowercase(menu.COMM_GB);
                            }
                        }

//                            if (path[2] == 'angeroom' || path[2] == 'momstalk' || path[2] == 'babycare' || path[2] == 'firstbirthtalk' || path[2] == 'booktalk'){
//                                path[2] = 'board';
//                            } else if (path[2] == 'angemodel' || path[2] == 'recipearcade' || path[2] == 'peopletaste'){
//                                path[2] = 'photo';
//                            } else if (path[2] == 'childdevelop' || path[2] == 'chlidoriental' || path[2] == 'obstetrics' || path[2] == 'momshealth' || path[2] == 'financial'){
//                                path[2] = 'clinic';
//                            }
                        //                        }else if (path[2] == 'poll'){
                        //                            path[2] = 'poll';
                        // 앙쥬맘스
                    } else if (path[2] == 'experienceprocess' || path[2] == 'experiencepast') {
                        path[2] = 'experience';
                    } else if (path[2] == 'eventprocess' || path[2] == 'eventperformance') {
                        path[2] = 'event';
                    } else if (path[2] == 'experiencewinner' || path[2] == 'eventwinner' || path[2] == 'supporterboard' || path[2] == 'postwinner') {
                        path[2] = 'board';
                    } else if (path[2] == 'experiencereview' || path[2] == 'productreview' || path[2] == 'angereview' || path[2] == 'samplereview' || path[2] == 'samplepackreview' || path[2] == 'eventreview' || path[2] == 'bookreview' || path[2] == 'dolreview' || path[2] == 'storereview') {
                        path[2] = 'review';
                    } else if (path[2] == 'ranknow' || path[2] == 'rankbest') {
                        path[2] = 'rank';
                        // 앙쥬스토어
                    } else if (path[2] == 'mileagemall' || path[2] == 'cummerce') {
                        path[2] = 'mall';
                    }
                    // 고객센터
                    else if (path[2] == 'notice' || path[2] == 'system' || path[2] == 'faq') {
                        path[2] = 'board';
                    }else if(path[2] == 'qna' || path[2] == 'myqna'){
                        path[2] = 'board';
                    }

                        url = path[1] + '/' + path[1] + path[2] + '-' + path[3];
                        break;
                }

                return '/partials/ange/'+url+'.html';
            },
//            controller: function(element, attr) {
//                return attr.menu+'_'+attr.type;
//            },
//            controller: function($scope, $location) {
//                angular.extend(this, $controller('cms-common', {$scope: $scope}));
//
//                /********** 초기화 **********/
//                // 초기화
//                $scope.PAGE_NO = 0;
//                $scope.PAGE_SIZE = 5;
//
//                /********** 이벤트 **********/
//                // 목록 이동
//                $scope.click_showList = function () {
//                    $location.url('/'+$scope.api+'/list');
//                };
//
//                // 선택
//                $scope.click_showView = function (key) {
//                    $location.url('/'+$scope.api+'/view/'+key);
//                };
//
//                // 포틀릿 조회
//                $scope.getPortlet = function (api) {
//                    $scope.getList(api, {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
//                        .then(function(data){$scope.list = data})
//                        .catch(function(error){$scope.list = [];  alert(error)});
//                };
//            },
            link: function (scope, element, attr) {
//                alert("1");
            }
        }
    }]);

    directives.directive('uiAds', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
//            replace: true,
//            controller: "@",
//            name: "controllerName",
            templateUrl: function(element, attr) {
                return '/partials/ange/com/ui-ads.html';
            }
        }
    }]);

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

                        if (scope.menu_info[j].TAIL_DESC != null && scope.menu_info[j].TAIL_DESC != '' )
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

                    if((url == '/infodesk/myqna/list') || (url == '/infodesk/drop/request') || (url == '/store/cart/list')){ // 고객센터 내 질문과 답변
                        if($scope.uid == null || $scope.uid == ''){
//                            dialogs.notify('알림', '로그인 후 이용 가능합니다.', {size: 'md'});
                            $scope.openLogin(null, 'md')
                            return;
                        }else{
                            $location.url(url);
                        }
                    }

                    if((url == '/infodesk/signon') || (url == '/infodesk/forgot/request')){ // 회원 가입
                        if($scope.session != null){
                            dialogs.notify('알림', '로그인된 사용자는 이용할 수 없습니다.', {size: 'md'});
                            return;
                        }else{
                            $location.url(url);
                        }
                    }

                    if (link == 'C') {
                        dialogs.notify('알림', '준비중입니다.', {size: 'md'});
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

                        $scope.click_selectMenu(2, $scope.depth2[0].MENU_ID, '', $scope.depth2[0].MENU_URL, $scope.depth2[0].LINK_FL);
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

    directives.directive('moduleReply', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
//            replace: true,
//            controller: "@",
//            name: "controllerName",
            templateUrl: '/partials/ange/com/module-reply.html',
            controller: 'module-reply',
            link: function (scope, element, attr) {
//                alert("1");
            }
        }
    }]);
});