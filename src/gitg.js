/**
 * Created by yinlu on 2018/4/23.
 */


import "./scss/gitg.scss";
import "./images/trees.png";
import "./images/branches.png";

// js

import $ from "jquery";


$('.widget-yiming').click(function () {
    $(this).toggleClass('click');
    $('.navbox').toggleClass('expand');
    $('#zhezhao').toggleClass('scale')
});
