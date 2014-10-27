/**
 * Author : Han-sik Choi
 * Blog   : http://hans.or.kr
 * Date   : 2014-06-07
 * Description : 사용할 모든 controller를 로드
 */

define([
//    './contentMainController',
//    './contentMenuController',
//    './contentListController',
//    './contentDetailController',
//    './managementMainController',

    '../../partials/cms/lnb',
    '../../partials/cms/locater',

    // CMS Controller
    '../../partials/cms/dashboard_calendara',

    // Component Test
    '../../partials/cms/file',
    '../../partials/cms/upload',
    '../../partials/cms/signin',

    // 대시보드
    '../../partials/cms/dashboard',
    '../../partials/cms/account',
    '../../partials/cms/account_edit',
    '../../partials/cms/scheduler',
    '../../partials/cms/scheduler_calendar',
    '../../partials/cms/archive',
    '../../partials/cms/archive_list',

    // 콘텐츠
    '../../partials/cms/project',
    '../../partials/cms/task',
    '../../partials/cms/article',
    '../../partials/cms/article_confirm',
    '../../partials/cms/edit',

    // 게시판
    '../../partials/cms/webboard',
    '../../partials/cms/webboardEdit',
    '../../partials/cms/webboardView',

    // 관리자
    '../../partials/cms/permission'
], function () {});
