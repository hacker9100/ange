/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-01
 * Description : animate 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('slider', function($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope:{
                images: '='
            },
            link: function (scope, element) {

                scope.currentIndex=0;

                scope.setCurrentSlideIndex = function (index) {
                    scope.currentIndex = index;
                };

                scope.isCurrentSlideIndex = function (index) {
                    return scope.currentIndex === index;
                };

                scope.next = function () {
                    scope.currentIndex = (scope.currentIndex < scope.images.length - 1) ? ++scope.currentIndex : 0;
                };

                scope.prev = function () {
                    scope.currentIndex = (scope.currentIndex > 0) ? --scope.currentIndex : scope.images.length - 1;
                };

                /* Start: For Automatic slideshow*/

                var timer;

                var sliderFunc=function(){
                    timer=$timeout(function(){
                        scope.next();
                        timer=$timeout(sliderFunc,1000);
                    },1000);
                };

                sliderFunc();

                scope.$on('$destroy',function(){
                    $timeout.cancel(timer);
                });

                /* End : For Automatic slideshow*/

                scope.$watch('currentIndex',function(){
                    scope.images.forEach(function(image){
                        image.visible=false;
                    });
                    scope.images[scope.currentIndex].visible=true;
                });

            },
            template : '<div class="slider">' +
                        '   <div class="slide" ng-repeat="image in images" ng-show="image.visible" >' +
                        '       <img ng-src="{{image.src}}" width="400px" height="250px" ng-hide="!isCurrentSlideIndex($index)"/>' +
                        '   </div>' +
                        '   <div class="arrows">' +
                        '       <a ng-click="prev()"><img ng-src="/imgs/ange/img/left-arrow.png" width="20px" height="20px"/></a> <!--<imgng-src="/imgs/left-arrow.png"/>-->&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '       <a ng-click="next()"><img ng-src="/imgs/ange/img/right-arrow.png" width="20px" height="20px"/></a><!--<img ng-src="/imgs/right-arrow.png"/>-->' +
                        '   </div>' +
                        '   <div class="nav1 wrapper"><ul class="dots"><li class="dot" ng-repeat="image in images">' +
                        '       <a ng-class="{active:isCurrentSlideIndex($index)}" ng-click="setCurrentSlideIndex($index);">{{image.description}}</a></li></ul>' +
                        '   </div>' +
                        '</div>'

        }
    });
});