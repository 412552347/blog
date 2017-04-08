//浏览器检测
(function(){
	window.sys={};
	var ua=navigator.userAgent.toLowerCase();
	var s;

	if(/msie ([\d.]+)/.test(ua) || /infopath\.3\; rv\:([\d.]+)/.test(ua)){
		s=ua.match(/msie ([\d.]+)/) == null ?  ua.match(/rv\:([\d.]+)/) : ua.match(/msie ([\d.]+)/);
		sys.ie=s[1];
	}

	if(/firefox\/([\d.]+)/.test(ua)){
		s=ua.match(/firefox\/([\d.]+)/);
		sys.firefox=s[1];
	}

	if(/chrome\/([\d.]+)/.test(ua) && !/opr\/([\d.]+)/.test(ua)){
		s=ua.match(/chrome\/([\d.]+)/);
		sys.chrome=s[1];
	}

	if(/opr\/([\d.]+)/.test(ua)){
		s=ua.match(/opr\/([\d.]+)/);
		sys.opera=s[1];
	}

	if(/version\/([\d.]+)/.test(ua)){
		s=ua.match(/version\/([\d.]+)/);
		sys.safari=s[1];
	}
	
})()


function addDomLoaded(fn){
	var isReady=false;
	var timer=null;

	function doReady(){
		if(timer) clearInterval(timer);
		if(isReady) return;
		isReady=true;
		fn();
	}

	if(document.addEventListener){
		addEvent(document,'DOMContentLoaded',function(){
			fn();
			removeEvent(document,'DOMContentLoaded',arguments.callee);
		})
	}else{  //兼容ie6,7,8
		timer=setInterval(function(){
			try{
				document.documentElement.doScroll("left");
				doReady();
			}catch(e){}
		},1)
	}
}
// function addDomLoaded(fn) {
// 	var isReady = false;
// 	var timer = null;
// 	function doReady() {
// 		if (timer) clearInterval(timer);
// 		if (isReady) return;
// 		isReady = true;
// 		fn();
// 	}
	
// 	if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
// 		//无论采用哪种，基本上用不着了
// 		/*timer = setInterval(function () {
// 			if (/loaded|complete/.test(document.readyState)) { 	//loaded是部分加载，有可能只是DOM加载完毕，complete是完全加载，类似于onload
// 				doReady();
// 			}
// 		}, 1);*/

// 		timer = setInterval(function () {
// 			if (document && document.getElementById && document.getElementsByTagName && document.body) {
// 				doReady();
// 			}
// 		}, 1);
// 	} else if (document.addEventListener) {//W3C
// 		addEvent(document, 'DOMContentLoaded', function () {
// 			fn();
// 			removeEvent(document, 'DOMContentLoaded', arguments.callee);
// 		});
// 	} else if (sys.ie && sys.ie < 9){
// 		var timer = null;
// 		timer = setInterval(function () {
// 			try {
// 				document.documentElement.doScroll('left');
// 				doReady();
// 			} catch (e) {};
// 		}, 1);
// 	}
// }


function addEvent(obj,event,fn){
	if(typeof obj.addEventListener != 'undefined'){
		obj.addEventListener(event,fn,false);
	}else{
		if(!obj.events) obj.events={};
		if(!obj.events[event]) {
			obj.events[event]=[]
			obj.events[event][0]=fn;
		}else{
			if(addEvent.equal(obj.events[event],fn)) return false;
			obj.events[event][addEvent.ID++]=fn;
		}
		
		obj["on"+event]=addEvent.exec;
	}
}

addEvent.ID=1;

addEvent.equal=function(es,fn){
	for(var i=0;i<es.length;i++){
		if(es[i] == fn) return true;
	}
	return false;
}

addEvent.exec=function(event){
	var e=event||addEvent.fixEvent(window.event);
	var es=this.events[e.type];
	for(var i in es){
		es[i].call(this,e);
	}
}

// 冒充W3C方式下的冒泡和阻止默认行为
addEvent.fixEvent=function(event){
	event.preventDefalut=addEvent.fixEvent.preventDefalut;
	event.stopPropagation=addEvent.fixEvent.stopPropagation;
	event.target=event.srcElement;
	return event;
}

addEvent.fixEvent.preventDefalut=function(){
	return this.returnValue=false;
}

addEvent.fixEvent.stopPropagation=function(){
	return this.cancelBubble=true;
}

function removeEvent(obj,type,fn){
	if(typeof obj.removeEventListener != 'undefined'){
		obj.removeEventListener(type,fn,false);
	}else{
		if(obj.events){
			var es=obj.events[type];
			for(var i in es){
				if(es[i]==fn){
					delete es[i];
				}
			}
		}
	}
}


function getInner(){
	if(typeof window.innerWidth != 'undefined'){
		return {
			width:window.innerWidth,
			height:window.innerHeight
		}
	}else{
		return {
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		}
	}
}

function getScroll(){
	return {
		top:document.documentElement.scrollTop || document.body.scrollTop,
		left:document.documentElement.scrollLeft || document.body.scrollLeft
	}
}

function offsetTop(ele){
	var top=ele.offsetTop;
	var par=ele.offsetParent;
	while(par != null){
		top += par.offsetTop;
		par=par.offsetParent;
	}
	return top;
}

function getStyle(element,attr){
	if(typeof window.getComputedStyle != 'undefined'){
		return window.getComputedStyle(element,null)[attr];
	}else if(typeof element.currentStyle != 'undefined'){
		return element.currentStyle[attr];
	}
}

function insertRule(sheet,selector,css,position){
	if(typeof sheet.insertRule != 'undefined'){
		sheet.insertRule(selector+"{"+css+"}",position)
	}else if(typeof sheet.addRule != 'undefined'){
		sheet.addRule(selector,css,position)
	}
}

function deleteRule(sheet,position){
	if(typeof sheet.deleteRule != 'undefined'){
		sheet.deleteRule(position);
	}else if(typeof sheet.removeRule != 'undefined'){
		sheet.removeRule(position);
	}
}

function prevDef(event){
	var e=getEvent(event);

	if(typeof e.preventDefalut != 'undefined'){
		e.preventDefalut();
	}else if(typeof e.returnValue != 'undefined'){
		e.returnValue=false;
	}
}

function getEvent(event){
	return event||window.event;
}

function trim(str){
	return str.replace(/(^\s*)|($\s*)/g,"")
}

function index(ele){
	var parent=ele.parentNode;
	var child=parent.children;
	for(var i=0;i<child.length;i++){
		if(ele == child[i]) return i;
	} 
}

//跨浏览器获取innerText
function getInnerText(element) {
	return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
}

//跨浏览器设置innerText
function setInnerText(elememt, text) {
	if (typeof element.textContent == 'string') {
		element.textContent = text;
	} else {
		element.innerText = text;
	}
}

//某一个值是否存在某一个数组中
function inArray(array, value) {
	for (var i in array) {
		if (array[i] === value) return true;
	}
	return false;
}

//删除左后空格
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

//创建cookie
function setCookie(name, value, expires, path, domain, secure) {
	var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	if (expires instanceof Date) {
		cookieText += '; expires=' + expires;
	}
	if (path) {
		cookieText += '; expires=' + expires;
	}
	if (domain) {
		cookieText += '; domain=' + domain;
	}
	if (secure) {
		cookieText += '; secure';
	}
	document.cookie = cookieText;
}

//获取cookie
function getCookie(name) {
	var cookieName = encodeURIComponent(name) + '=';
	var cookieStart = document.cookie.indexOf(cookieName);
	var cookieValue = null;
	if (cookieStart > -1) {
		var cookieEnd = document.cookie.indexOf(';', cookieStart);
		if (cookieEnd == -1) {
			cookieEnd = document.cookie.length;
		}
		cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
	}
	return cookieValue;
}

//删除cookie
function unsetCookie(name) {
	document.cookie = name + "= ; expires=" + new Date(0);
}

