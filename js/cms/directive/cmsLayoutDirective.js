/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-11-15
 * Description : portletList 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('cmsLayout', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: { code:'=' },
            replace: true,
//            templateUrl: function(element, attr) {
//                return 'partials/cms/'+attr.type+'_list.html';
//            },
            compile: function(element, attrs){
                var scope = element.scope();

                angular.forEach(scope.cms_menu, function(menu) {
                    if (scope.path == menu.MENU_URL) {
                        angular.forEach(menu.SUB_MENU_INFO, function(sub_menu) {
                            var templet = '<'+sub_menu.SUB_MENU+' type="'+sub_menu.SUB_MENU_GB+'" url="'+sub_menu.SUB_MENU_URL+'" api="'+sub_menu.API+'" title="'+sub_menu.TITLE+'" css="'+sub_menu.CSS+'" />'
                            element.append(templet);
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