
var $=function(args){
	return new Base(args);
}

function Base(args){
	this.elements=[];

	if(typeof args == "string"){

		if(args.indexOf(" ") != -1){
			var elements=args.split(" ");
			var childElements=[];
			var node=[];
			for(var i=0;i<elements.length;i++){
				if(node.length == 0) node.push(document);
				switch(elements[i].charAt(0)){
					case "#":
						childElements=[];
						childElements.push(this.getId(elements[i].substring(1)));
						node=childElements;
						break;
					case ".":
						childElements=[];
						for(var j=0;j<node.length;j++){
							var temps=this.getClass(elements[i].substring(1),node[j]);
							for(var k=0;k<temps.length;k++){
								childElements.push(temps[k]);
							}
						}
						node=childElements;
						break;
					default:
						childElements=[];
						for(var j=0;j<node.length;j++){
							var temps=this.getTagName(elements[i],node[j]);
							for(var k=0;k<temps.length;k++){
								childElements.push(temps[k]);
							}
						}
						node=childElements;
					    break;
				}
			}
			this.elements=childElements;
		}else{
			switch(args.charAt(0)){
				case "#":
					this.elements.push(this.getId(args.substring(1)));
					break;
				case ".":
					this.elements = this.getClass(args.substring(1));
					break;
				default:
					this.elements = this.getTagName(args);
				    break;
			}
		}
		
	}else if(typeof args == "object"){
		this.elements[0]=args;
	}else if(typeof args == "function"){
		this.ready(args);
	}
	
}

Base.prototype.ready = function (fn) {
	addDomLoaded(fn);
};

Base.prototype.getId=function(id){
	return document.getElementById(id);
};


Base.prototype.getTagName=function(tagName,parentNode){
	var node=null;
	if(arguments.length == 2){
		node=parentNode;
	}else if(arguments.length == 1){
		node=document;
	}
	var tags=node.getElementsByTagName(tagName);
	var temps=[];
	for(var i=0;i<tags.length;i++){
		temps.push(tags[i]);
	}
	return temps;
}

// getClassName 的兼容性不是特别的好，所以选择另一种方式
Base.prototype.getClass=function(className,parentNode){
	var node=null;
	var temps=[];
	if(arguments.length == 2){
		node=parentNode;
	}else if(arguments.length == 1){
		node=document;
	}

	var all=node.getElementsByTagName("*")
	for(var i=0;i<all.length;i++){
		if ((new RegExp('(\\s|^)' +className +'(\\s|$)')).test(all[i].className)) {
			temps.push(all[i]);
		}

	}
	return temps;
}

Base.prototype.find=function(str){
	var childElements=[];
	for(var i=0;i<this.elements.length;i++){
		switch(str.charAt(0)){
			case "#":
				childElements.push(this.getId(str.substring(1)));
				break;
			case ".":
				tags=this.getClass(str.substring(1),this.elements[i]);
				for(var j=0;j<tags.length;j++){
					childElements.push(tags[j]);
				}
				break;
			default:
				tags=this.getTagName(str,this.elements[i]);
				for(var j=0;j<tags.length;j++){
					childElements.push(tags[j]);
				}
		}
		
	}
	this.elements=childElements;

	return this;	
}

Base.prototype.addClass=function(className){
	for(var i=0;i<this.elements.length;i++){
		if(!this.elements[i].className.match(new RegExp('(^|\\s)'+className+'($|\\s)'))){
			this.elements[i].className += " "+className;
		}
		
	}
	return this;
}

Base.prototype.removeClass=function(className){
	for(var i=0;i<this.elements.length;i++){
		var reg=new RegExp('(^|\\s)'+className+'($|\\s)')
		var name=this.elements[i].className.match(reg);

		if(name){
			this.elements[i].className=this.elements[i].className.replace(reg,'');
		}
	}
	return this;
}
//获取集合中的某一个元素
Base.prototype.getElement=function(num){
	return this.elements[num];
}

Base.prototype.eq=function(num){
	var ele=this.elements[num];
	this.elements=[];
	this.elements[0]=ele;
	return this;
}

Base.prototype.len=function(){
	return this.elements.length
}

//获取和设置行内的CSS样式
Base.prototype.css=function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length == 1){
			return getStyle(this.elements[i],attr);
		}else if(arguments.length == 2){
			this.elements[i].style[attr]=value;
		}
		
	}
	return this;
}

Base.prototype.attr=function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length == 1){
			return this.elements[i].getAttribute(attr);
		}else if(arguments.length == 2){
			this.elements[i].setAttribute(attr,value);
		}
	}
	return this;
}


//添加外嵌和外链的CSS样式
Base.prototype.addRule=function(num,selector,css,position){
	var sheet=document.styleSheets[num];
	insertRule(sheet,selector,css,position);
	return this;
}
//删除外嵌和外链的CSS样式
Base.prototype.removeRule=function(num,position){
	var sheet=document.styleSheets[num];
	deleteRule(sheet,position);
	return this;
}

Base.prototype.html=function(str){

	for(var i=0;i<this.elements.length;i++){
		if(arguments.length == 0){
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML=str;
	}
	return this;
}

Base.prototype.click=function(fn){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onclick=fn;
	}
	return this;
}

Base.prototype.hover=function(over,out){
	for(var i=0;i<this.elements.length;i++){
		// this.elements[i].onmouseover=over;
		// this.elements[i].onmouseout=out;
		addEvent(this.elements[i],"mouseover",over);
		addEvent(this.elements[i],"mouseout",out);
	}
	return this;
}

Base.prototype.toggle=function(){
	var args=arguments;

	for(var i=0;i<this.elements.length;i++){
		
		(function(element){
			var count=0;
	
			addEvent(element,"click",function(){
				args[count++ % args.length].call(this);
			});
		})(this.elements[i])

	}
	return this;
}

//设置innerText
Base.prototype.text = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return getInnerText(this.elements[i]);
		}
		setInnerText(this.elements[i], text);
	}
	return this;
}

//设置事件发生器
Base.prototype.bind = function (event, fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		addEvent(this.elements[i], event, fn);
	}
	return this;
};

Base.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display="block";
	}
	return this;
}

Base.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display="none";
	}
	return this;
}

Base.prototype.center=function(width,height){
	var top=(getInner().height-height)/2 + getScroll().top;
	var left=(getInner().width-width)/2 + getScroll().left;

	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.top=top+"px";
		this.elements[i].style.left=left+"px";
	}
	return this;
}

Base.prototype.resize=function(fn){
	
	addEvent(window,"resize",fn)
}

Base.prototype.lock=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.width=getInner().width+getScroll().top+"px";
		this.elements[i].style.height=getInner().height+getScroll().left+"px";

		document.documentElement.style.overflow="hidden" ;

		// addEvent(document,"mousedown",prevDef);
		// addEvent(document,"mouseup",prevDef);
		// addEvent(document,"selectstart",prevDef);
	}
	return this;
}

Base.prototype.unlock=function(){
	for(var i=0;i<this.elements.length;i++){
	
		document.documentElement.style.overflow="auto" ;

		// removeEvent(document,"mousedown",prevDef);
		// removeEvent(document,"mouseup",prevDef);
		// removeEvent(document,"selectstart",prevDef);
	}
	return this;
}

Base.prototype.next=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i]=this.elements[i].nextSibling;
		if(this.elements[i]==null) throw new Error("错误");
		if(this.elements[i].nodeType == 3) this.next();
	}
	return this;
}

//设置表单字段元素
Base.prototype.form = function (name) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i][name];
	}
	return this;
};

//设置表单字段内容获取
Base.prototype.value = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return this.elements[i].value;
		}
		this.elements[i].value = str;
	}
	return this;
}

Base.prototype.animate=function(obj){
	for(var i=0;i<this.elements.length;i++){
		
		var _this=this.elements[i];

		clearInterval(_this.timer);
		

		var attr=obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' : obj['attr'] == 'w'
		                         ? 'width' : obj['attr'] == 'h' ? 'height' : obj['attr'] == 'o'
		                         ? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left';
		var start=obj['start'] !=undefined ? obj['start'] : attr == 'opacity' ? parseFloat(getStyle(_this,attr))*100
		                         :parseInt(getStyle(_this,attr));
		var t=obj['t'] != undefined ?obj['t'] : 10;
		var step=obj['step'] != undefined ?obj['step'] : 20;
		var target=obj['target'];
		var alter=obj['alter'];  //增量

		var speed=obj['speed'] != undefined ? obj['speed'] :6; //运动可以逐渐变缓慢的速度
		var type=obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer' ; //0为匀速运动，1为缓冲运动
		
		var fn=obj['fn'];

		var mul=obj['mul'];  //同步动画

		if(attr=='opacity'){
			_this.style.opacity = start /100;
			_this.style.filter = 'alpha(opacity='+start+')';
		}else{
			_this.style[attr]=start+"px";
		}

	
		if(alter != undefined && target == undefined){
			target=alter+start;
		}else if(alter == undefined && target == undefined && mul == undefined){
			throw  new Error("错误");
		}

		if(attr == 'opacity'){
			if(parseInt(getStyle(_this,attr))*100 > target){
				step=-step;
			}
		}else{
			if(parseInt(getStyle(_this,attr)) > target){
				step=-step;
			}
		}


		if(mul == undefined){
			mul={};
			mul[attr]=target;
		}

		
		_this.timer=setInterval(function(){
			for(var i in mul){
				attr=i =='x' ? 'left' : i == 'y' ? 'top' : i == 'w'
		                         ? 'width' : i == 'h' ? 'height' : i == 'o'
		                         ? 'opacity' : i != undefined ? i : 'left';
				target=mul[i];
			
				if(type == 'buffer'){
					if(attr == 'opacity'){
						step=(target-parseFloat(getStyle(_this,attr))*100)/speed;
					}else{
						step=(target-parseInt(getStyle(_this,attr)))/speed;

					}
					step=step>0 ? Math.ceil(step) : Math.floor(step);
					
				}

				var flag=true;

				if(attr == 'opacity'){
					if(Math.abs(target-parseFloat(getStyle(_this,attr))*100 )<= Math.abs(step)){
						_this.style.opacity = target/100
						_this.style.filter = 'alpha(opacity='+target+')';
				
					}else{
						var temp=parseFloat(getStyle(_this,attr))*100 +step;
						_this.style.opacity = temp/100
						_this.style.filter = 'alpha(opacity='+temp+')';
					}
					if(target != parseInt(parseFloat(getStyle(_this,attr))*100)) flag=false;
				}else{
					if(Math.abs(target-parseInt(getStyle(_this,attr))) <= Math.abs(step)){
						_this.style[attr]=target+"px";
					
					}else{
						_this.style[attr]=parseInt(getStyle(_this,attr))+step +"px";
					}
					
					if(target != parseInt(getStyle(_this,attr))) flag=false;
				}
				
			}

			if(flag){
					clearInterval(_this.timer);
					if(obj.fn != undefined) fn();
				}
				
		},t)
	}
	return this;
}


//插件入口
Base.prototype.extend=function(name,fn){
	Base.prototype[name]=fn;
}

