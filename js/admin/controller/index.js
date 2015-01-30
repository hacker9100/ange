/**
 * Author : Han-sik Choi
 * Blog   : http://hans.or.kr
 * Date   : 2014-06-07
 * Description : 사용할 모든 controller를 로드
 */

define([
    // ADMIN 공통
    '../../../partials/admin/com/content',
    '../../../partials/admin/com/gnb',
    '../../../partials/admin/com/lnb',
    '../../../partials/admin/com/locater',
    '../../../partials/admin/com/file-list',
    '../../../partials/admin/contact-list',

    // ADMIN 로그인
    '../../../partials/admin/signin',
    '../../../partials/admin/message',
    '../../../partials/admin/home-main',

    // ADMIN 회원현황
    '../../../partials/admin/member-list',
    '../../../partials/admin/member-edit',
//    '../../../partials/admin/user_view'
    '../../../partials/admin/pagehit-main',

    // ADMIN 참여 관리
    '../../../partials/admin/event-list',
    '../../../partials/admin/event-edit',
    '../../../partials/admin/comp-list',

    // ADMIN 콘텐츠 관리
    '../../../partials/admin/notice-list',
    '../../../partials/admin/notice-edit',
    '../../../partials/admin/notice-view',
    '../../../partials/admin/clinic-list',
//    '../../../partials/admin/clinic-edit',
    '../../../partials/admin/download-main',

    // ADMIN 스토어 관리
    '../../../partials/admin/product-list',
    '../../../partials/admin/product-edit',
    '../../../partials/admin/order-list',
    '../../../partials/admin/pcategory-main',

    // ADMIN 사이트 관리
    '../../../partials/admin/site-main',
    '../../../partials/admin/category-main',

    // ADMIN 관리자
    '../../../partials/admin/user-main',
    '../../../partials/admin/permission-main'

//    '../../../partials/admin/menu-main'
], function () {});
