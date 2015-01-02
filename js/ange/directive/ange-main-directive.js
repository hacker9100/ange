/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-11-15
 * Description : portletList 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('angeMain', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: { code:'=' },
            replace: true,
//            templateUrl: function(element, attr) {
//                return 'partials/cms/'+attr.type+'_list.html';
//            },
            compile: function(element, attrs){
                var scope = element.scope();
console.log('location : '+scope.path);
                angular.forEach(scope.ange_menu, function(menu) {
                    if (scope.path == menu.MENU_URL) {
                        var templet = '';
console.log('url : '+menu.MENU_URL);
console.log('sub : '+menu.SUB_MENU_INFO);
                        angular.forEach(menu.SUB_MENU_INFO, function(sub_menu) {
                            var directive = sub_menu.SYSTEM_GB + '-' + sub_menu.SUB_MENU_GB + '-' + sub_menu.TYPE;
                            var model = directive.replace(/-/g, '_')
console.log('directive : '+angular.lowercase(directive));
                            console.log('url : '+sub_menu.SUB_MENU_URL);
                            templet = '<div><'+angular.lowercase(directive)+' ng-model="option_r1_c1" type="'+angular.lowercase(sub_menu.SUB_MENU_GB)+'" url="'+angular.lowercase(sub_menu.SUB_MENU_URL)+'" api="'+sub_menu.API+'" title="'+sub_menu.TITLE+'" css="'+sub_menu.CSS+'" /></div>'
                            element.append(templet);

                            scope.option_r1_c1 = {title: '테스트', tab: true, image: true, head: true, date: true};
                        });
                    }
                });

//                element.append('<cms-portlet-list type="portlet" api="{{list1.api}}" title="{{list1.title}}" css="{{list1.css}}"></cms-portlet-list>');
//                return {
//                    pre: function(scope, element, attrs, controller, transcludeFn){
////                        element.append('<cms-portlet-list type="portlet" api="webboard" title="게시판" css="list-group-item list-group-item-labeling-green"></cms-portlet-list>');
//                        alert("0")
//                    },
//                    post: function(scope, element, attrs, controller, transcludeFn){
////                        element.append('<cms-portlet-list type="portlet" api="webboard" title="게시판" css="list-group-item list-group-item-labeling-green"></cms-portlet-list>');
//                        alert("0-2")
//                    }
//                }
            },
            controller: function($scope, $location, $compile) {
//                $scope.$parent.list1 = {api: 'webboard', title: '공지사항', css: 'list-group-item list-group-item-labeling-green'};
//                $scope.list1 = {api: 'webboard', title: '공지사항', css: 'list-group-item list-group-item-labeling-green'};
//                alert("1");
//                $compile.post;
            }
//            ,
//            link: function (scope, element, attrs) {
//                element.append('<cms-portlet-list type="portlet" api="{{list1.api}}" title="{{list1.title}}" css="{{list1.css}}"></cms-portlet-list>');
//            }
        }
    }]);
});