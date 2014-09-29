/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-25
 * Description : $stateProvider에 각 메뉴별로 url과 해당 화면 정보, 콘트롤을 정의 한다.
 */

define([], function() {
    return {
        states: [{ 'content': {
            url: '/content',
            views: {
                '' : { templateUrl : 'partial/contentMain.html', controller : "ContentMainCtrl" },
                'menuView@content' : { templateUrl : 'partial/contentMenu.html', controller: 'ContentMenuCtrl' },
                'bodyView@content' : { templateUrl: 'partial/contentMain.html' }
            }
        }}, { 'content/task': {
            url: '/content/task',
            views : {
                '' : { templateUrl : 'partial/contentMain.html', controller : "ContentMainCtrl" },
                'menuView@content/task' : { templateUrl : 'partial/contentMenu.html', controller: 'ContentMenuCtrl' },
                'bodyView@content/task' : { templateUrl: 'partial/contentList.html', controller: 'ContentListCtrl' }
            }
        }}, { 'test': {
            url: '/',
            views: {
                'topMenu': { templateUrl: '/Home/TopMenu', dependencies: ['controllers/top-menu-controller'], controller: 'TopMenuCtrl' },
                'leftMenu': { templateUrl: '/Home/LeftMenu', dependencies: [ 'controllers/left-menu-controller' ] }
            }
        }}]
    };
});