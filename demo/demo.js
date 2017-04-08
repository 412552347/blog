$(function(){
	//下拉菜单
	$(".member").hover(function(){
		$(".member_menu").show().animate({
			mul:{
				'height':120,
				'opacity':100
			},
			t:30,
			step:10
			
		});
		$(this).css("background","url(img/arrow2.png) no-repeat right center");
	},function(){
		$(".member_menu").animate({
			mul:{
				'height':0,
				'opacity':0
			},
			t:30,
			step:10,
			fn:function(){
				$(".member_menu").hide();
			}
		});
		$(this).css("background","url(img/arrow.png) no-repeat right center");
	});

	var screen=$("#screen");

//登陆
	//登陆窗口
	var login=$("#login");
	$("#header .login").click(function(){

		$('form').getElement(1).reset();
		bounced(login,1);

	});
	login.drag([$("#login h2").getElement(0)]);

	//判断是否能登陆成功
	$("form").eq(1).form("sub").click(function(){
		var _this=this;
		if(/[\w]{2,20}/.test(trim($("form").eq(1).form("user").value())) && $("form").eq(1).form("password").value().length>=6 ){
			$("#login .info").html("");
			$("#loading").show().center(parseInt($(this).css("width")),parseInt($(this).css("height")));
			$("#loading p").html("正在登陆...");
			$(_this).css("backgroundPosition","right");
			_this.disabled=true;


			ajax({
				method : "post",
				url : "is_login.php",
				data : $("form").eq(1).serialize() ,
				success : function (text) {
					if(text==1){
						$("#login .info").html("用户名或密码错误，请重新输入！");
					}else{
						$("#success").show().center(parseInt($("#success").css("width")),parseInt($("#success").css("height")));
						$("#success p").html("登陆成功");

						setCookie("user",trim($('form').eq(1).form("user").value()));

						setTimeout(function(){
							$("#success").hide();
							$("#login").hide().unlock();

							$("#screen").animate({
								attr:'o',
								target:0,
								t:30,
								step:10,
								fn:function(){
									screen.hide();
								}
							});


							$("#header .login").hide();
							$("#header .reg").hide();
							$("#header .info").show().html(getCookie("user")+" 您好！");
						},1500);
					}
					$("#loading").hide();
					$(_this).css("backgroundPosition","left");
					_this.disabled=false;

					

				},
				async : true
			});
		}else{
			$("#login .info").html("输入不合法，请重新输入！");
		}
	});


	


//注册
	//注册窗口
	var reg = $("#reg");
	$("#header .reg").click(function () {

		$("form").getElement(0).reset();
		bounced(reg,0);

	});
	reg.drag([$("#reg h2").getElement(0)]);

	//表单验证
	$("form").getElement(0).reset();

	$("form").eq(0).form("user").bind("focus", function () {
		$("#reg .info_user").hide();
		$("#reg .error_user").hide();
		$("#reg .succ_user").hide();
	}).bind('blur', function () {
		if (trim($(this).value()) == '') {
			$("#reg .info_user").hide();
			$("#reg .error_user").hide();
			$("#reg .succ_user").hide();
		} else if (!check_user()) {
			$("#reg .error_user").hide();
			$("#reg .info_user").hide();
			$("#reg .succ_user").hide();
		} else {
			$("#reg .succ_user").hide();
			$("#reg .error_user").hide();
			$("#reg .info_user").hide();
		}
	});


	function check_user() {
		var flag=true;
		var is_true=false;

		if (!/[\w]{2,20}/.test(trim($("form").eq(0).form("user").value()))){
			$("#reg .error_user").html("输入不合法，请重新输入！");
		} else{
			$("#reg .info_user").hide();
			$("#reg .loading").show();

			ajax({
				method : "post",
				url : "is_user.php",
				data : $('form').eq(0).serialize(),
				success : function (text) {
					if(text==1){
						$("#reg .error_user").html("用户名被占用，请重新输入！");
						flag=false;
					}else{
						flag=true;
					}
					$("#reg .loading").hide();
				},
				async:false
			});
			
		}

		return flag;
	};

	//密码验证
	$("form").eq(0).form("pass").bind("focus", function () {
		$("#reg .info_pass").show();
		$("#reg .error_pass").hide();
		$("#reg .succ_pass").hide();
	}).bind('blur', function () {
		if (trim($(this).value()) == "") {
			$("#reg .info_pass").hide();
		} else {
			if (check_pass()) {
				$("#reg .info_pass").hide();
				$("#reg .error_pass").hide();
				$("#reg .succ_pass").show();
			} else {
				$("#reg .info_pass").hide();
				$("#reg .error_pass").show();
				$("#reg .succ_pass").hide();
			}
		}
	});

	//密码强度验证
	$("form").eq(0).form("pass").bind("keyup", function () {
		check_pass();
	});

	//密码验证函数
	function check_pass() {
		var value = trim($("form").form("pass").value());
		var value_length = value.length;
		var code_length = 0;
		
		//第一个必须条件的验证6-20位之间
		if (value_length >= 6 && value_length <= 20) {
			$("#reg .info_pass .q1").html("●").css("color", "green");
		} else {
			$("#reg .info_pass .q1").html("○").css("color", "#666");
		}
		
		//第二个必须条件的验证，字母或数字或非空字符，任意一个即可
		if (value_length > 0 && !/\s/.test(value)) {
			$("#reg .info_pass .q2").html("●").css("color", "green");
		} else {
			$("#reg .info_pass .q2").html("○").css("color", "#666");
		}
		
		//第三个必须条件的验证，大写字母，小写字母，数字，非空字符 任意两种混拼即可
		if (/[\d]/.test(value)) {
			code_length++;
		}
		
		if (/[a-z]/.test(value)) {
			code_length++;
		}
		
		if (/[A-Z]/.test(value)) {
			code_length++;
		}
		
		if (/[^\w]/.test(value)) {
			code_length++;
		}
		
		if (code_length >= 2) {
			$("#reg .info_pass .q3").html("●").css("color", "green");
		} else {
			$("#reg .info_pass .q3").html("○").css("color", "#666");
		}
		
		//安全级别
		if (value_length >= 10 && code_length >= 3) {
			$("#reg .info_pass .s1").css("color", "green");
			$("#reg .info_pass .s2").css("color", "green");
			$("#reg .info_pass .s3").css("color", "green");
			$("#reg .info_pass .s4").html("高").css("color", "green");
		} else if (value_length >= 8 && code_length >= 2) {
			$("#reg .info_pass .s1").css("color", "#f60");
			$("#reg .info_pass .s2").css("color", "#f60");
			$("#reg .info_pass .s3").css("color", "#ccc");
			$("#reg .info_pass .s4").html("中").css("color", "#f60");
		} else if (value_length >= 1) {
			$("#reg .info_pass .s1").css("color", "maroon");
			$("#reg .info_pass .s2").css("color", "#ccc");
			$("#reg .info_pass .s3").css("color", "#ccc");
			$("#reg .info_pass .s4").html("低").css("color", "maroon");
		} else {
			$("#reg .info_pass .s1").css("color", "#ccc");
			$("#reg .info_pass .s2").css("color", "#ccc");
			$("#reg .info_pass .s3").css("color", "#ccc");
			$("#reg .info_pass .s4").html(" ");
		}	
		
		if (value_length >= 6 && value_length <= 20 && !/\s/.test(value) && code_length >= 2) {
			return true;
		} else {
			return false;
		}
	}

	//密码确认
	$("form").eq(0).form("notpass").bind("focus", function () {
		$("#reg .info_notpass").show();
		$("#reg .error_notpass").hide();
		$("#reg .succ_notpass").hide();
	}).bind('blur', function () {
		if (trim($(this).value()) == "") {
			$("#reg .info_notpass").hide();
		} else if (check_notpass()){
			$("#reg .info_notpass").hide();
			$("#reg .error_notpass").hide();
			$("#reg .succ_notpass").show();
		} else {
			$("#reg .info_notpass").hide();
			$("#reg .error_notpass").show();
			$("#reg .succ_notpass").hide();
		}
	});
	
	function check_notpass() {
		if (trim($("form").eq(0).form("notpass").value()) == trim($("form").form("pass").value())) return true;
	}

	//提问
	$("form").eq(0).form("ques").bind("change", function () {
		if (check_ques()) $("#reg .error_ques").hide();
	});
	
	function check_ques() {
		if ($("form").form("ques").value() != 0) return true;
	}
	
	//回答
	$("form").eq(0).form('ans').bind('focus', function () {
		$("#reg .info_ans").show();
		$("#reg .error_ans").hide();
		$("#reg .succ_ans").hide();
	}).bind('blur', function () {
		if (trim($(this).value()) == '') {
			$("#reg .info_ans").hide();
		} else if (check_ans()) {
			$("#reg .info_ans").hide();
			$("#reg .error_ans").hide();
			$("#reg .succ_ans").show();
		} else {
			$("#reg .info_ans").hide();
			$("#reg .error_ans").show();
			$("#reg .succ_ans").hide();
		}
	});

	function check_ans() {
		if (trim($("form").form("ans").value()).length >= 2 && trim($("form").form("ans").value()).length <= 32) return true;
	}

	//电子邮件
	$("form").eq(0).form("email").bind("focus", function () {
	
		//补全界面
		if ($(this).value().indexOf("@") == -1) $("#reg .all_email").show();
	
		$("#reg .info_email").show();
		$("#reg .error_email").hide();
		$("#reg .succ_email").hide();
	}).bind("blur", function () {
	
		//补全界面
		$("#reg .all_email").css("display","none");
	
		if (trim($(this).value()) == '') {
			$("#reg .info_email").hide();
		} else if (check_email()) {
			$("#reg .info_email").hide();
			$("#reg .error_email").hide();
			$("#reg .succ_email").show();
		} else {
			$("#reg .info_email").hide();
			$("#reg .error_email").show();
			$("#reg .succ_email").hide();
		}
	});
	
	function check_email() {
		if (/^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(trim($("form").form("email").value()))) return true;
	}

	//电子邮件补全系统键入
	$("form").eq(0).form("email").bind("keyup", function (event) {
		if ($(this).value().indexOf('@') == -1) {
			$("#reg .all_email").show();
			$("#reg .all_email li span").html($(this).value());
		} else {
			$("#reg .all_email").hide();
		}
		
		$("#reg .all_email li").hide();
		$("#reg .all_email li").css("color", '#666');
		
		if (event.keyCode == 40) {
			if (this.index == undefined || this.index >= $("#reg .all_email li").length() - 1) {
				this.index = 0;
			} else {
				this.index++;
			}
			$("#reg .all_email li").eq(this.index).css("background", "#e5edf2");
			$("#reg .all_email li").eq(this.index).css("color", "#369");
		}
		
		if (event.keyCode == 38) {
			if (this.index == undefined || this.index <= 0) {
				this.index = $("#reg .all_email li").length() - 1;
			} else {
				this.index--;
			}
			$("#reg .all_email li").eq(this.index).css("background", "#e5edf2");
			$("#reg .all_email li").eq(this.index).css("color", "#369");
		}
		
		
		if (event.keyCode == 13) {
			$(this).value($("#reg .all_email li").eq(this.index).text());
			$("#reg .all_email").hide();
			this.index = undefined;
		}
		
	});

	//电子邮件补全系统点击获取
	$("#reg .all_email li").bind("mousedown", function () {
		$("form").eq(0).form("email").value($(this).text());
	});
	
	//电子邮件补全系统鼠标移入移出效果
	$("#reg .all_email li").hover(function () {
		$(this).css("background", "#e5edf2");
		$(this).css("color", "#369");
	}, function () {
		$(this).css("background", "none");
		$(this).css("color", "#666");
	});


	//年月日
	var year = $("form").eq(0).form("year");
	var month = $("form").eq(0).form("month");
	var day = $("form").eq(0).form("day");
	
	var day30 = [4, 6, 9, 11];
	var day31 = [1, 3, 5, 7, 8, 10, 12];
	
	//注入年
	for (var i = 1950; i <= 2013; i ++) {
		year.getElement(0).add(new Option(i, i), undefined);
	}
	
	//注入月
	for (var i = 1; i <= 12; i ++) {
		month.getElement(0).add(new Option(i, i), undefined);
	}
	
	
	year.bind("change", select_day);
	month.bind("change", select_day);
	day.bind("change", function () {
		if (check_birthday()) $("#reg .error_birthday").hide();
	});
	
	function check_birthday() {
		if (year.value() != 0 && month.value() != 0 && day.value() != 0) return true;
	}
	
	function select_day() {
		if (year.value() != 0 && month.value() != 0) {
			
			//清理之前的注入
			day.getElement(0).options.length = 1;
			
			//不确定的日
			var cur_day = 0;
			
			//注入日
			if (inArray(day31, parseInt(month.value()))) {
				cur_day = 31;
			} else if (inArray(day30, parseInt(month.value()))) {
				cur_day = 30;
			} else {
				if ((parseInt(year.value()) % 4 == 0 && parseInt(year.value()) % 100 != 0) || parseInt(year.value()) % 400 == 0) {
					cur_day = 29;
				} else {
					cur_day = 28;
				}
			}
			
			for (var i = 1; i <= cur_day; i ++) {
				day.getElement(0).add(new Option(i, i), undefined);
			}
			
		} else {
			//清理之前的注入
			day.getElement(0).options.length = 1;
		}
	}

	//备注
	$("form").eq(0).form("ps").bind("keyup", check_ps).bind("paste", function () {
		//粘贴事件会在内容粘贴到文本框之前触发
		setTimeout(check_ps, 50);
	});

	//清尾
	$("#reg .ps .clear").click(function () {
		$("form").form("ps").value($("form").form("ps").value().substring(0,200));
		check_ps();
	});
	
	function check_ps() {
		var num = 200 - $("form").form("ps").value().length;
		if (num >= 0) {
			$("#reg .ps").eq(0).show();
			$("#reg .ps .num").eq(0).html(num);
			$("#reg .ps").eq(1).hide();
			return true;
		} else {
			$("#reg .ps").eq(0).hide();
			$("#reg .ps .num").eq(1).html(Math.abs(num)).css("color", "red");
			$("#reg .ps").eq(1).show();
			return false;
		}
	}

	//提交
	$("form").eq(0).form("sub").click(function () {
		var flag = true;
	
		if (!check_user()) {
			$("#reg .error_user").show();
			flag = false;
		}
		
		if (!check_pass()) {
			$("#reg .error_pass").show();
			flag = false;
		}
		
		if (!check_notpass()) {
			$("#reg .error_notpass").show();
			flag = false;
		}
		
		if (!check_ques()) {
			$("#reg .error_ques").show();
			flag = false;
		}
		
		if (!check_ans()) {
			$("#reg .error_ans").show();
			flag = false;
		}
		
		if (!check_email()) {
			$("#reg .error_email").show();
			flag = false;
		}
		
		if (!check_birthday()) {
			$("#reg .error_birthday").show();
			flag = false;
		}
		
		if (!check_ps()) {
			flag = false;
		}
		
		if (flag) {
			var _this=this;
			$("#loading").show().center(parseInt($(this).css("width")),parseInt($(this).css("height")));
			$("#loading p").html("正在提交注册中...");
			_this.disabled=true;
			$(_this).css("backgroundPosition","right");
			
			ajax({
				method : "post",
				url : "add.php",
				data : $("form").eq(0).serialize() ,
				success : function (text) {
					if(text==1){
						$("#loading").hide();
						$("#success").show().center(parseInt($("#success").css("width")),parseInt($("#success").css("height")));
						$("#success p").html("注册成功 请登录...");

						setTimeout(function(){
							$("#success").hide();
							$("#reg").hide().unlock();

							_this.disabled=false;
							$(_this).css("backgroundPosition","left");

							$("#screen").animate({
								attr:'o',
								target:0,
								t:30,
								step:10,
								fn:function(){
									screen.hide();
								}
							});
						},1500);
					}
				},
				async : true
			});
		}
	
	});

//发表博文
	//发表窗口
	var blog=$("#blog");
	$("#header .blog").click(function(){

		$("form").getElement(2).reset();
		bounced(blog,2);

	})
	blog.drag([$("#blog h2").getElement(0)]);
	//判断能否发表
	
	$("form").eq(2).form("sub").click(function(){
		
		if(trim($("form").eq(2).form("title").value()).length <= 0 || trim($("form").eq(2).form("content").value()).length <= 0){
			$("#blog .info").html("发表失败！")
		}else{
			var _this=this;
			$("#loading").show().center(parseInt($(this).css("width")),parseInt($(this).css("height")));
			$("#loading p").html("正在发表文章...");

			_this.disabled=true;
			$(_this).css("backgroundPosition","right");

			ajax({
				method:"post",
				url:"add_blog.php",
				data:$("form").eq(2).serialize(),
				success:function(text){
					if(text==1){
						$("#loading").hide();
						$("#blog .info").html("");
						$("#success").show().center(parseInt($("#success").css("width")),parseInt($("#success").css("height")));
						$("#success p").html("发表成功请稍后...");

						setTimeout(function(){
							$("#success").hide();

							$("#blog").hide();

							_this.disabled=false;
							$(_this).css("backgroundPosition","left");

							$("#screen").animate({
								attr:'o',
								target:0,
								t:30,
								step:10,
								fn:function(){
									screen.hide();
								}
							});

						},1500);


						//获取博文
						getBlog();
					}
					
				},
				async:true
			})
		}
	});
	//获取博文
	getBlog();
	
	function getBlog(){
		$(".index").html("<span class='loading'></span>");
		$(".index .loading").show();
		ajax({
			method:"post",
			url:"get_blog.php",
			data:{},
			success:function(text){
				$(".index .loading").hide();

				var json=JSON.parse(text);
				var text="";

				for(var i=0;i<json.length;i++){
					var temp="<div class='content'><h2><em>"+json[i]["date"]+"</em>"+json[i]["title"]+"</h2><p>"+json[i]["content"]+"</p></div>"
					text += temp;
					$(".index").html(text);
				}
			},
			async:true
		})
	}
	
//百度分享栏
	$("#share").css("top",(getInner().height - parseInt(getStyle($("#share").getElement(0),"height")))/2 +"px");

	addEvent(window,"scroll",function(){
		setTimeout(function(){
			$("#share").animate({
				attr:"y",
				target:parseInt((getInner().height - parseInt(getStyle($("#share").getElement(0),"height")))/2 + getScroll().top)
			})
		},100)
		
	})

	$("#share").hover(function(){
		$(this).animate({
			attr:"x",
			target:0
		})
	},function(){
		$(this).animate({
			attr:"x",
			target:-212
		})
	})

	//滑动导航
	$("#nav .about li").hover(function(){
		var target=$(this).getElement(0).offsetLeft;

		$("#nav .nav_bg").animate({
			attr:'x',
			target:target+20,
			t:20,
			step:10,
			fn:function(){
				$("#nav .white").animate({
					attr:"x",
					target:-target
				})
			}
		})
	},function(){
		$("#nav .nav_bg").animate({
			attr:'x',
			target:20,
			t:20,
			step:10,
			fn:function(){
				$("#nav .white").animate({
					attr:'x',
					target:0,
				})
			}
		})
	})

	//手风琴侧栏
	$("#main h2").toggle(function(){
		$(this).next().animate({
			mul:{
				height:0,
				opacity:0
			},
			step:10,
			t:30
		});
	},function(){
		$(this).next().animate({
			mul:{
				height:150,
				opacity:100
			},
			step:10,
			t:30
		});
	})
	
	//轮播图
	
	$(".banner ul li").eq(0).css("color","#333");
	$(".banner strong").html($(".banner img").getElement(0).alt);
	$(".banner img").eq(0).css("opacity","100");

	var banner_index=0;
	var img_len=$(".banner img").len();

	var banner_timer=setInterval(function(){
		var next_banner = (banner_index % img_len) +1 < img_len ? (banner_index % img_len) +1 : 0;
		
		
		$(".banner img").eq(banner_index).animate({
			attr:'o',
			target:0,
			step:10,
			t:50
		})

		$(".banner img").eq(next_banner).animate({
			attr:'o',
			target:100,
			step:10,
			t:50
		})

		$(".banner ul li").eq(banner_index).css("color","#999");
		$(".banner ul li").eq(next_banner).css("color","#333");
		$(".banner strong").html($(".banner img").getElement(next_banner).alt);
		
		banner_index >= img_len-1 ? banner_index=0 : banner_index++;
	},2000);


	//延迟加载
	var wait_load=$(".wait_load");
	var load_len=$(".wait_load").len();

	wait_load.css("opacity",0);

	addEvent(window,"scroll", _wait_load);
	addEvent(window,"resize", _wait_load);

	function _wait_load(){
		setTimeout(function(){
			var scroll_top=getInner().height+getScroll().top;

			for(var i=0 ;i<load_len;i++){
				var _this=wait_load.getElement(i);
				if(scroll_top >= offsetTop(wait_load.getElement(i))){
					$(_this).attr("src",$(_this).attr("xsrc")).animate({
						attr:"o",
						target:100,
						step:10,
						t:30
					})
				}
			}
		},100)
	}
	
	//大图弹框
	var big_img=$("#big_img");
	
	wait_load.click(function(){

		bounced(big_img);

		//预加载
		var temp_img=new Image();

		$(temp_img).bind("load",function(){
			$("#big_img .big img").attr("src",temp_img.src).animate({
				attr:'o',
				target:100,
				step:10,
				t:30
			}).css("top",0).css("width","600px").css("height","450px").css("opacity",0);
		})

		temp_img.src=$(this).attr("bigsrc");

		//加载前后两张图
		var bigImg_index=index(this.parentNode.parentNode);

		prev_next_img(bigImg_index);
		
	});

	big_img.drag([$("#big_img h2").getElement(0)]);


	//左右切换
	$("#big_img .big .left").hover(function(){
		$("#big_img .big .sl").animate({
			attr:'o',
			target:50,
			step:10,
			t:30
		})
	},function(){
		$("#big_img .big .sl").animate({
			attr:'o',
			target:0,
			step:10,
			t:30
		})
	})

	$("#big_img .big .right").hover(function(){
		$("#big_img .big .sr").animate({
			attr:'o',
			target:50,
			step:10,
			t:30
		})
	},function(){
		$("#big_img .big .sr").animate({
			attr:'o',
			target:0,
			step:10,
			t:30
		})
	})

	$("#big_img .big .left").click(function(){
		$("#big_img .big img").attr("src","img/loading.gif").css("width","32px").css("height","32px").css("top","190px");

		var img=new Image();

		$(img).bind("load",function(){
			$("#big_img .big img").attr("src",img.src).animate({
				attr:'o',
				target:100,
				step:10,
				t:30
			}).css("opacity","0").css("top",0).css("width","600px").css("height","450px");
		})

		img.src=$(this).attr("src");

		
		var bigImg_index=parseInt($("#big_img .big img").attr("index"))-1 < 0 ? load_len-1 : parseInt($("#big_img .big img").attr("index"))-1;
		
		prev_next_img(bigImg_index);
	
	})

	$("#big_img .big .right").click(function(){
		$("#big_img .big img").attr("src","img/loading.gif").css("width","32px").css("height","32px").css("top","190px");
		var img=new Image();

		$(img).bind("load",function(){
			$("#big_img .big img").attr("src",img.src).animate({
				attr:'o',
				target:100,
				step:10,
				t:30
			}).css("opacity","0").css("top",0).css("width","600px").css("height","450px");
		})

		img.src=$(this).attr("src");

		var bigImg_index=parseInt($("#big_img .big img").attr("index"))+1 > load_len-1 ? 0 : parseInt($("#big_img .big img").attr("index"))+1;

		prev_next_img(bigImg_index);
	})


	//预加载左右两张图片
	function prev_next_img(bigImg_index){
		var prev_index= bigImg_index-1 < 0 ? load_len-1 : bigImg_index-1;
		var next_index= bigImg_index+1 > load_len-1 ? 0 : bigImg_index+1;

		var prev_img=new Image();
		var next_img=new Image();

		prev_img.src=$(".photo dl dt img").eq(prev_index).attr("bigsrc");
		next_img.src=$(".photo dl dt img").eq(next_index).attr("bigsrc");

		$("#big_img .big .left").attr("src",prev_img.src);
		$("#big_img .big .right").attr("src",next_img.src);

		$("#big_img .big img").attr("index",bigImg_index);

		$("#big_img .big .index").html(parseInt(bigImg_index)+1 + "/" +load_len);
	}

	//控制弹窗函数
	function bounced(target){
		
		var width=parseInt(target.css("width"));
		var height=parseInt(target.css("height"));

		target.show().center(width,height);

		screen.show().lock().animate({
			attr:'o',
			target:70,
			t:30,
			step:0
		});

		//关闭窗口
		$(target+" .close").click(function(){

			target.hide().unlock();

			screen.animate({
				attr:"o",
				target:0,
				t:30,
				step:10,
				fn:function(){
					screen.hide();
				}
			});
		})

		bouncedResize(target);

	}
	//调整浏览器窗口大小，弹窗一直在可视范围内
	function bouncedResize(target){
		
		$().resize(function(){
			//弹框出现的位置
			var bouncedWidth=parseFloat(target.css("width"));
			var bouncedHeight=parseFloat(target.css("height"));

			if(parseFloat(target.css("left")) + bouncedWidth > getInner().width + getScroll().left){
				target.css("left",getInner().width +getScroll().left - bouncedWidth-19+"px")
			}

			if(parseFloat(target.css("top")) + bouncedHeight > getInner().height + getScroll().top){
				target.css("top",getInner().height +getScroll().top - bouncedHeight +"px")
			}

			if(parseFloat(target.css("top"))<0){
				target.css("top",0)
			}
			if(parseFloat(target.css("left"))<0){
				target.css("left",0)
			}
			if(parseFloat(target.css("top"))<getScroll().top){
				target.css("top",getScroll().top+"px")
			}
			screen.lock();   //屏幕遮罩的宽度和高度

		})

	}
	

	
})


