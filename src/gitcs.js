/**
 * Created by yinlu on 2018/4/23.
 */

import "./scss/gitcs.scss";

// js

import $ from "jquery";


$('.widget-yiming').click(function () {
    $(this).toggleClass('click');
    $('.navbox').toggleClass('expand');
    $('#zhezhao').toggleClass('scale')
});