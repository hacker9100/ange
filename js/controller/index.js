/**
 * Author : Han-sik Choi
 * Blog   : http://hans.or.kr
 * Date   : 2014-06-07
 * Description : 사용할 모든 controller를 로드
 */

define([
    // CMS Common Controller
    '../../partials/cms/gnb',
    '../../partials/cms/lnb',
    '../../partials/cms/locater',
    '../../partials/cms/cms_common',

    // CMS Controller
    '../../partials/cms/dashboard_calendara',

    // Component Test
    '../../partials/cms/file',
    '../../partials/cms/upload',
    '../../partials/cms/signin',

    // 대시보드
    '../../partials/cms/dashboard',
    '../../partials/cms/account_edit',
    '../../partials/cms/scheduler_calendar',
    '../../partials/cms/archive',
    '../../partials/cms/archive_list',

    // 콘텐츠
    '../../partials/cms/project_list',
    '../../partials/cms/project_edit',
    '../../partials/cms/task_list',
    '../../partials/cms/task_edit',
    '../../partials/cms/content_list',

    '../../partials/cms/article_list',
    '../../partials/cms/article_edit',
    '../../partials/cms/article_confirm_list',
    '../../partials/cms/article_confirm_edit',
    '../../partials/cms/edit_list',
    '../../partials/cms/edit_edit',
    '../../partials/cms/edit_confirm_list',
    '../../partials/cms/edit_confirm_edit',
    '../../partials/cms/publish_list',
    '../../partials/cms/publish_edit',

    // 게시판
    '../../partials/cms/webboard_list',
    '../../partials/cms/webboard_edit',

    '../../partials/cms/webboard',
    '../../partials/cms/webboardEdit',
    '../../partials/cms/webboardView',

    // 관리자
    '../../partials/cms/user',
    '../../partials/cms/permission',
    '../../partials/cms/category',
    '../../partials/cms/series'
], function () {});
