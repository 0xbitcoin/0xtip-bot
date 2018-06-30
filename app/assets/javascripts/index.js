
const $ = require('jquery');

import logo from '../images/lavalogo4.png'
import githubLogo from '../images/GitHub-Mark-64px.png'

import Vue from 'vue'

import AlertRenderer from './alert-renderer'


import HomeRenderer from './home-renderer'

var homeRenderer = new HomeRenderer();
//var web3 = this.connectWeb3();


var alertRenderer = new AlertRenderer();

var navbar = new Vue({
  el: '#navbar',
  data: {
    brandImageUrl: logo,
    githubLogo: githubLogo
  }
})


$(document).ready(function(){

  if($("#home").length > 0){
  //  var web3 = ethHelper.init( alertRenderer);

    homeRenderer.init();
  }


});


//dashboardRenderer.hide();
