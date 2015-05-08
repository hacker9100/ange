/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 사용할 모든 controller를 로드
 *               새로 생성되는 파일들은 http://closure-compiler.appspot.com/home 사이트의 Simple 옵션으로 간소화 한다.
 *               Advanced을 사용할 경우 시스템 지시어까지 축약해 인식 못하는 문제가 발생하므로 반드시 Simple옵션을 사용한다.
 */

define([
    // Component Test
//    '../../../partials/cms/dashboard-calendara',
    '../../../partials/cms/portlet-list',

    // CMS 공통
    '../../../partials/cms/com/cms-common',
    '../../../partials/cms/com/gnb',
    '../../../partials/cms/com/lnb',
    '../../../partials/cms/com/locater',
    '../../../partials/cms/com/file-list',
    // CMS 로그인
    '../../../partials/cms/signin',
    '../../../partials/cms/forgot-idpw',
    // CMS 대시보드
    '../../../partials/cms/dashboard-main',
    '../../../partials/cms/account-main',
//    '../../../partials/cms/scheduler',
    // CMS 콘텐츠
    '../../../partials/cms/project-list',
    '../../../partials/cms/project-edit',
    '../../../partials/cms/project-view',
    '../../../partials/cms/task-list',
    '../../../partials/cms/task-edit',
    '../../../partials/cms/task-view',
    '../../../partials/cms/content-edit',
    '../../../partials/cms/content-view',
    '../../../partials/cms/content-edit-popup',
//    '../../../partials/cms/content-view-popup',
    '../../../partials/cms/publish-list',
    '../../../partials/cms/publish-edit',
    // CMS 게시판
    '../../../partials/cms/webboard-list',
    '../../../partials/cms/webboard-edit',
    '../../../partials/cms/webboard-view',
    // CMS 관리자
    '../../../partials/cms/user-main',
    '../../../partials/cms/permission-main',
    '../../../partials/cms/category-main',
    '../../../partials/cms/series-main',
    '../../../partials/cms/section-main',
    // CMS 부가기능
    '../../../partials/cms/contact-list'

], function () {});
