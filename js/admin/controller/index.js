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

    // ADMIN 로그인
    '../../../partials/admin/signin',
    '../../../partials/admin/message',

    // ADMIN 회원현황
    '../../../partials/admin/member-list',
    '../../../partials/admin/member-edit',
//    '../../../partials/admin/user_view'
    '../../../partials/admin/pagehit-main',

    // ADMIN 참여 관리
    '../../../partials/admin/event-list',
    '../../../partials/admin/event-edit',

    // ADMIN 상품 관리
    '../../../partials/admin/product-list',
    '../../../partials/admin/product-edit',

    // ADMIN 사이트 관리
    '../../../partials/admin/site-main',
    '../../../partials/admin/category-main',

    // ADMIN 관리자
    '../../../partials/admin/user-main',
    '../../../partials/admin/permission-main'

//    '../../../partials/admin/menu-main'
], function () {});
