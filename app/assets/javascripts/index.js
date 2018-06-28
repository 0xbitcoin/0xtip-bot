
const $ = require('jquery');

import logo from '../images/lavalogo4.png'
import githubLogo from '../images/GitHub-Mark-64px.png'

import Vue from 'vue'

import AlertRenderer from './alert-renderer'



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

     




});


//dashboardRenderer.hide();
