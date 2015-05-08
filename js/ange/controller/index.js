/**
 * Author : Sung-hwan Kim
 * Date   : 2014-12-29
 * Description : 사용할 모든 controller를 로드
 */

define([
//    // 공통
//    '../../../partials/ange/com/com',
//
//    // 메인
//    '../../../partials/ange/main',
//
//    // 앙쥬스토리
//    '../../../partials/ange/story/story',
//
//    // 앙쥬피플
//    '../../../partials/ange/people/people',
//
//    // 앙쥬맘스
//    '../../../partials/ange/moms/moms',
//
//    // 마이앙쥬
//    '../../../partials/ange/myange/myange',
//
//    // 앙쥬스토어
//    '../../../partials/ange/store/store',
//
//    '../../../partials/ange/store/storeauction-intro',
//
//    // 앙쥬클럽
//    '../../../partials/ange/club/club',
//
//    // 고객센터
//    '../../../partials/ange/infodesk/infodesk',
//
//    // 회사소개
//    '../../../partials/ange/company/company',
//
//    // 검색
//    '../../../partials/ange/search/searchlist'

    // 공통
    '../../../partials/ange/com/ange-common',
    '../../../partials/ange/com/ui-ads',
    '../../../partials/ange/com/ui-gnb',
    '../../../partials/ange/com/ui-lnb',
    '../../../partials/ange/com/ui-utility',
    '../../../partials/ange/com/subside-ad',
    '../../../partials/ange/com/module-reply',
    '../../../partials/ange/com/board-report',

    // 메인
    '../../../partials/ange/main',

    // 앙쥬스토리
    '../../../partials/ange/story/storycontent-list',
    '../../../partials/ange/story/storycontent-view-popup',
    '../../../partials/ange/story/storymagazine-list',

    // 앙쥬피플
    '../../../partials/ange/people/peoplehome',
    '../../../partials/ange/people/peoplelinetalk-list',
    '../../../partials/ange/people/peoplepoll-list',
    '../../../partials/ange/people/peoplepoll-edit',
    '../../../partials/ange/people/peopleboard-list',
    '../../../partials/ange/people/peopleboard-edit',
    '../../../partials/ange/people/peopleboard-view',
    '../../../partials/ange/people/peopleclinic-list',
    '../../../partials/ange/people/peopleclinic-edit',
    '../../../partials/ange/people/peopleclinic-view',
    '../../../partials/ange/people/peoplephoto-list',
    '../../../partials/ange/people/peoplephoto-edit',
    '../../../partials/ange/people/peoplephoto-view',
    '../../../partials/ange/people/peoplediscusstitle-list',
    '../../../partials/ange/people/peoplediscuss-list',
    '../../../partials/ange/people/peoplediscuss-view',
    '../../../partials/ange/people/peoplediscuss-edit',

    // 앙쥬맘스
    '../../../partials/ange/moms/momshome',
    '../../../partials/ange/moms/momsboard-list',
    '../../../partials/ange/moms/momsboard-edit',
    '../../../partials/ange/moms/momsboard-view',
    '../../../partials/ange/moms/momsexperience-list',
    //'../../../partials/ange/moms/momsexperience-edit',
    '../../../partials/ange/moms/momsexperience-view',
    '../../../partials/ange/moms/momsevent-list',
    //'../../../partials/ange/moms/momsevent-edit',
    '../../../partials/ange/moms/momsevent-view',
    '../../../partials/ange/moms/momsreview-list',
    '../../../partials/ange/moms/momsreview-edit',
    '../../../partials/ange/moms/momsreview-view',
    '../../../partials/ange/moms/momssamplepack-intro',
    '../../../partials/ange/moms/momssamplepack-edit',
    '../../../partials/ange/moms/supporter-intro',
    '../../../partials/ange/moms/momspostcard-edit',

    // 마이앙쥬
    '../../../partials/ange/myange/myangehome',
    '../../../partials/ange/myange/myangecalendar',
    '../../../partials/ange/myange/myangealbum-list',
    '../../../partials/ange/myange/myangealbum-view-popup',
    '../../../partials/ange/myange/myangeaccount',
    '../../../partials/ange/myange/myangebaby',
    '../../../partials/ange/myange/myangegroup',
    '../../../partials/ange/myange/myangemate',
    '../../../partials/ange/myange/myangewriting',
    '../../../partials/ange/myange/myangescrap',
    '../../../partials/ange/myange/myangemileage',
    '../../../partials/ange/myange/myangemessage',
    '../../../partials/ange/myange/myangecoupon',
    '../../../partials/ange/myange/myangeorderlist',
    '../../../partials/ange/myange/myangeorderstatus',
    '../../../partials/ange/myange/myangepostcard',

    // 앙쥬스토어
    '../../../partials/ange/store/storehome',
    '../../../partials/ange/store/storemall-list',
    '../../../partials/ange/store/storemall-view',
    '../../../partials/ange/store/storeauction-intro',
    '../../../partials/ange/store/storeauction-list',
    '../../../partials/ange/store/storeauction-view',
    '../../../partials/ange/store/storephotozone-list',
    '../../../partials/ange/store/storenamingintro',
    '../../../partials/ange/store/storenamingstory-list',
    '../../../partials/ange/store/storenamingstory-view',
    '../../../partials/ange/store/storenaming-request',
    '../../../partials/ange/store/storedream',
    '../../../partials/ange/store/storecart-list',
    '../../../partials/ange/store/storeorder-list',

    // 고객센터
    '../../../partials/ange/infodesk/infodeskhome',
    '../../../partials/ange/infodesk/infodeskboard-list',
    '../../../partials/ange/infodesk/infodeskboard-view',
    '../../../partials/ange/infodesk/infodeskboard-edit',
    '../../../partials/ange/infodesk/infodeskforgot-request',
    '../../../partials/ange/infodesk/infodeskdrop-request',
    '../../../partials/ange/infodesk/infodesksignon',

    // 앙쥬클럽
    '../../../partials/ange/club/clubhome',
    '../../../partials/ange/club/clubboard-list',
    '../../../partials/ange/club/clubboard-view',
    '../../../partials/ange/club/clubboard-edit',
    '../../../partials/ange/club/clubclinic-list',
    '../../../partials/ange/club/clubclinic-view',
    '../../../partials/ange/club/clubclinic-edit',

    // 회사소개
    '../../../partials/ange/company/companyintro',
    '../../../partials/ange/company/companyaffiliates',

    // 검색
    '../../../partials/ange/search/searchlist'
], function () {});
