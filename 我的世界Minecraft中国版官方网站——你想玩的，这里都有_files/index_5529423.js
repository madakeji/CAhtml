nie.define(function() {
	nie.config.copyRight.setWhite();
	nie.config.stats.clickStats=true;
	var flash = nie.require("util.swfobject");

	//  $('#flash-wrap').flash({
	//      swf: "",
	//      height: 921,
	//      width: "100%",
	//      allowScriptAccess: 'always',
	//      wmode: "opaque",
	//      // wmode:'transparent'
	//  });
	var setShare = function() {
		var shareUrl = $("#share_url").html()
		var sharePic = $("#share_pic").attr("data-src")
		var shareTxt = $("#share_desc").html()
		var shareTitle = $("#share_title").html()
		var shareV5 = nie.require("nie.util.shareV5")
		var share = shareV5({
			fat: "#NIE-share",
			type: 1,
			defShow: [23, 22, 2, 1, 24],
			title: shareTxt,
			img: sharePic
		})
		// 音量控制
		var btnAudioIndex = 1;
		// $('.btnAudio').bind('click',function(){
		//     if(btnAudioIndex==1){
		//         btnAudioIndex++;
		//         $('.btnAudio').addClass('cur');
		//         $('.bg-video')[0].muted =true;
		//     }else{
		//         btnAudioIndex=1;
		//         $('.btnAudio').removeClass('cur');
		//         $('.bg-video')[0].muted =false;
		//     }
		// }); 
	}

	var bindSubmitBook = function() {
		var $submit = $('.submit_order');
		var $tel = $('.tel_input');
		var $code = $('.qrcode_input');
		var $btnCode = $('.get_qrcode');
		var formCheck = nie.require('nie.util.FormCheck');

		var HOST = 'https://dora.webcgi.163.com/api/123_215_2016_05_18/';
		var required = formCheck.required;
		var phone = formCheck.phone;
		var verify = formCheck.verify;

		function checkPhone() {
			if(!required($tel)) {
				alert('请输入您的手机号码');
				return
			}
			if(!phone($tel)) {
				alert('手机号码格式不正确');
				return
			}
			return $tel.val();
		}

		function checkCode() {
			if(!required($code)) {
				alert('请输入您的验证码');
				return
			}
			if(!verify($code)) {
				alert('验证码格式不正确');
				return
			}
			return $code.val();
		}

		function clear() {
			$tel.val('');
			$code.val('');
		}

		function countdown() {
			var s = 60
			var time = setInterval(function() {
				if(s <= 0) {
					clearInterval(time);
					$btnCode.text('获取验证码').removeClass('disable');
				} else {
					s--
					$btnCode.text(s + 's').addClass('disable');
				}
			}, 1000)
		}
		$btnCode.on('click', function() {
			if($btnCode.hasClass('disable')) return
			var mobile = checkPhone()
			if(!mobile) return
			$.ajax({
				url: HOST + 'get_authcode_apnt',
				dataType: 'jsonp',
				data: {
					mobile: mobile
				},
				success: function(data) {
					if(data.status === true) {
						countdown();
						alert('获取成功');
					} else {
						alert(data.msg);
					}
				}
			})
		})
		$submit.on('click', function() {
			var mobile = checkPhone();
			if(!mobile) return
			var authcode = checkCode();
			if(!authcode) return
			$.ajax({
				url: HOST + 'verify_authcode',
				dataType: 'jsonp',
				data: {
					mobile: mobile,
					authcode: authcode
				},
				success: function(data) {
					if(data.status === true) {
						clear();
						$('#order_pop').removeClass('on');
						alert('恭喜您预约成功！《我的世界》官方手游即将公测，敬请期待！')
					} else if(data.status == 201) {
						clear();
						$('#order_pop').removeClass('on');
						alert('您已预约成功，无需再次预约，关注官方微博微信，最新消息抢先知道！')
					} else {
						alert(data.msg);
					}
				}
			})
		})
		$('.reg_btn2').on('click', function() {
			$('#order_pop').removeClass('on');
			$('#dialog-reg').addClass('on');
		})
	}

	// var setSubscribe = function() {
	//     var $btn = $('.link-android');
	//     var $close = $('#order_pop .btn_close');
	//     var $pop = $('#order_pop');
	//     $btn.on('click', function() {
	//         $pop.addClass('on');
	//     })
	//     $close.on('click', function() {
	//         $pop.removeClass('on');
	//     })
	// }

	var setDownload = function() {
		var niedownload = nie.require("nie.util.niedownload")
		NieDownload.create({
			wrapper: $(".nie-download"), //下载模块最外层容器
			enableAndroid: true, //是否开发安卓下载
			enableIos: true, //是否开发IOS下载
			useSSL: true, //是否使用https，默认为false
			// qrcode:"",//自定义二维码里面的icon
			disableClick: function() { //设置未开发下载的按钮点击后执行此函数
			}
		})

		$('.btn-downloadClose').bind('click', function() {
			popDownloadIndex = 'off';
			$('.pop-download').removeClass('on');
		})
		$('.btn-dsdownloadClose').bind('click', function() {
			// popDownloadIndex='off';
			$('.dashen-download').removeClass('on');
		})
	}

	function isIE() {
		var browser = $.browser;
		//获取版本号
		if(browser.msie == true) {
			return browser.version;
		} else {
			return 11;
		}
	}

	var setVideo = function() {
		// var bg_video = $('.bg-video')[0]
		var video;
		var videoModule = nie.require("nie.util.videoV2");
		$('.video-btn').on('click', function() {
			// $('.bg-video').get(0).pause();
			$('.pop-video').css('display', 'block');
			video = videoModule({
				fat: ".videoWrap", //放视频的容器
				width: "800", //视频宽度
				height: "450", //视频高度
				movieUrl: "https://mc.v.netease.com/2022/0217/cb2a3bbbd81a90ba2c544546dbbf9182.mp4", //标清视频地址
				HDmovieUrl: "", //高清视频地址
				SHDmovieUrl: "", //超清视频地址
				vtype: "", //默认选用哪种清晰度，分别有d,hd,shd，默认不填则会采用校验网速然后自动匹配
				autoPlay: true //是否自动播放，默认false
			});
			if(isIE() < 8) {
				return
			}
			//bg_video.pause()
		})
		$('.videoClose').on('click', function() {
			$('.pop-video').css('display', 'none');
			// $('.bg-video')[0].play();
			video.destroy(); //清空并销毁视频
			if(isIE() < 8) {
				return
			}
			//bg_video.play()
		})
	}
	var setLive = function(){
		$('.Layer').addClass('on');
		var obj = $('.popLive');
		var csstop = $(window).scrollTop() + ($(window).height() / 2 - obj.height() / 2) +80; //绝对定位时使用，改变obj的top值
		obj.show();
		obj.css({
			'position':'absolute',
			'top': csstop,
			'margin-top': 0
		});

		$('.btnClose').on('click',function(){
			Change = [false,false,false]; 
			$('.Layer').removeClass('on');
			obj.hide();
			$liveBox.empty();
			clearInterval(clearTime);
		});
		
		
		var $liveBox = $('#live');
		var video1mp4_1 = '<video src="https://nie.v.netease.com/nie/2018/0918/e14ec68c894679c30b60ea245df0947bqt.mp4" autoplay="autoplay" loop="loop" controls="" preload="auto" muted=""></video>';
		var video1mp4_2 = '<video src="https://nie.v.netease.com/nie/2018/0918/e14ec68c894679c30b60ea245df0947bqt.mp4" autoplay="autoplay" loop="loop" controls="" preload="auto"></video>';
		var video2mp4_1 = '<video src="https://nie.v.netease.com/nie/2018/0918/e14ec68c894679c30b60ea245df0947bqt.mp4" autoplay="autoplay" loop="loop" controls="" preload="auto" muted=""></video>';
		var video2mp4_2 = '<video src="https://nie.v.netease.com/nie/2018/0918/e14ec68c894679c30b60ea245df0947bqt.mp4" autoplay="autoplay" loop="loop" controls="" preload="auto"></video>';
		var videosrc = '<embed src="https://cc.res.netease.com/act/webPlayer/webcc/stoneSwf/ClientLoader.swf?roomId=777&subId=5217979&showGetInRoomLayer=0&useChat=0&showChat=0&webccType=4523&showBarrage=0&limitJump=1&useBarrage=0&config=_common&showIntroduce=0&shortAddress=1&playerParam=nomask,1;src,webcc_4523" type="application/x-shockwave-flash" wmode="opaque" allowfullscreen="true" quality="high" bgcolor="#060f1e" allowscriptaccess="always" base=".">';
		var mvideosrc = '<iframe src="https://cc.163.com/act/m/daily/m3u8_player/index.html?cid=5217979&from=1271" frameborder="0" allowfullscreen="allowfullscreen" ></iframe>';
		
		var Time = nie.require("util.bjTime");
		var time1 = new Date('2018/09/29 23:30').getTime(); //9月29日23:29
		var time2 = new Date('2018/09/30 02:00').getTime(); //9月30日02:01
		var curTime = 0;
		var clearTime ;
		var Change = [true,true,true]; 
		var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
		var isSafari = window.navigator.userAgent.indexOf("Safari") !== -1;
		
		
		function flashFun(){
			var roomPlayerUrl = "https://cc.res.netease.com/act/webPlayer/webcc/stoneSwf/ClientLoader.swf?roomId=777&subId=5217979&showGetInRoomLayer=0&useChat=0&showChat=0&webccType=4523&showBarrage=0&limitJump=1&useBarrage=0&config=_common&showIntroduce=0&shortAddress=1&playerParam=nomask,1;src,webcc_4523";

	        //播放器宽度
	        var winWidth = 992;  
	        //播放器高度
	        var winHeight = 569;
	        //页面嵌入播放器的容器id
	        var roomPlayerDiv = 'live2';
	        //flashplayer最低版本号
	        var swfVersionStr = "9.0.0";
	        var xiSwfUrlStr = "http://cc.res.netease.com/act/webPlayer/webcc/stoneSwf/playerProductInstall.swf";
	        var flashvars = {};
	        
	
	        var params = {};
	        params.base = ".";
	        params.allowscriptaccess = "always";
	        params.allowfullscreen = "true";
	        var attributes = {};
	        attributes.id = "ClientLoader";
	        attributes.name = "ClientLoader";
	        attributes.align = "middle";
	        swfobject.embedSWF(roomPlayerUrl, roomPlayerDiv, winWidth, winHeight, swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
		}
		
		function showFun(){
			Time.bjTime.getDate(function djsFun(time) {
				if(window.location.href.indexOf('test') != -1) {
					curTime = new Date().getTime();
				}else{
					curTime = time.dateObj.getTime();
				}
				console.log(new Date(curTime).format('yyyy.MM.dd.HH.mm.ss'));
				if(curTime < time1) {
//					console.log(1);
					if(Change[0]){
						
						if(isChrome || isSafari) {
							$liveBox.empty().append(video1mp4_1);
						} else {
							$liveBox.empty().append(video1mp4_2);
						}
						
						Change[0] = false;
					}
				}else if(curTime>time1 && curTime<time2){
//					console.log(2);
					if(Change[1]){
						if(commonAction.browser.versions.iPad) {
							$liveBox.empty().append(mvideosrc);
						} else {
							$liveBox.empty().append(videosrc);
						}
						Change[1] = false;
					}
				}else if(curTime>time2){
//					console.log(3);
					if(Change[2]){
						
						if(isChrome) {
							$liveBox.empty().append(video2mp4_1);
						} else {
							$liveBox.empty().append(video2mp4_2);
						}
						
						Change[2] = false;
					}
				}
			})
		}
		showFun();
		clearTime = setInterval(showFun, 1000);
	}
	
	var setSize = function(){
		function resizeFun() {
			var hei = $(window).height();
			console.log(hei)
			if(hei < 781) {
				var scaleNum = hei / 781;
				scaleNum = scaleNum < 0.65 ? 0.65 : scaleNum;
				console.log(scaleNum);
				$('.popLive').css({
					'transform': 'scale(' + scaleNum + ')',
					'transform-origin': 'center center'
				});
			} else {
				$('.popLive').css({
					'transform': 'scale(1)',
					'transform-origin': 'center center'
				});
			}
	
		}
		resizeFun();
		$(window).resize(resizeFun);
	}
	var setGallery = function() {
		var $btns = $('.pagination_btn'),
		 index=0,
		 _st;
		var myGallery = Gallery.create({
			galleryContainer: ".gallery_container",
			rotate: 0,
			depth: 1000,
			slidesPerView: 3,
			stretch: -300,
			initialSlide: 0,
			autoPlay: 3000,
			gallery_prev: '.gallery_prev',
			gallery_next: '.gallery_next',
			onGalleryStart: function(gallery_item) {
				var index = gallery_item.index
				$btns.removeClass('active')
				$btns.eq(index).addClass('active');				
				clearTimeout(_st);
			},
			onGalleryEnd: function(el) {
				// console.log(el);
				index = el.index;
				// _autoPlay();
			}
		});
		function _autoPlay(){
			clearTimeout(_st);
			_st = setTimeout(function(){	
				if(index<($btns.length-1) &&index>-1){
					index++;
				}else{
					index=0;
				}
				myGallery.toSlide(index);				
			},3000);
		}
		
		// _autoPlay();
		
		$btns.on('click', function(evt) {
			var index = Number(evt.target.innerHTML)
			$btns.removeClass('active')
			myGallery.toSlide(index)
			$(this).addClass('active')
		})
	}
	var popDownloadIndex = 'on';
	var setScroll = function() {
		var $win = $(window)
		$win.scroll(function() {
			var dist = $win.scrollTop()
			// console.log(popDownloadIndex);
			if(dist > 800 && popDownloadIndex == 'on') {

				$('.pop-download').addClass('on');
				$('.dashen-download').addClass('on');
			} else if(dist <= 800) {
				popDownloadIndex = 'on';
				$('.pop-download').removeClass('on');
				$('.dashen-download').removeClass('on');
			}
		})
	}

	var setRegister = function() {
		var $register = $('#dialog-reg');
		var $btn = $('.btn-register');
		var Login = nie.require("nie.util.fur3");
		var example = new fur3({
			holder: '#register-module',
			product: 'x19',
			host: 'mc.163.com',
			promark: 'bAUtEHA',
			pop: false,
			law: false,
			regagree: true,
			css: 'https://mc.res.netease.com/pc/fab/20171220151954/css/register_f224f5b.css',
			cb: function(username, url) {
				console.log(username + "" + url);
				$('.success_url').attr('href', 'https://adl.netease.com/d/g/mc/c/pc');

				$('.success_url').bind('click', function() {
					$register.removeClass('on');
				});
			}
		});
		$btn.on('click', function() {
			$register.addClass('on');
		})
		$('.dialog-close').on('click', function() {
			$register.removeClass('on');
		})
	}

	  var setEnvent =function(){
	      $('.act .Btnact').on('click', function() {
	          var popcur = $(this).attr("data-pop");
	          if( popcur != '' ){
	              // if(popcur === '1'){
	              //     $('.activityPopMian').addClass('show');
	              // }else{
	              //     $('.activityPopMian').removeClass('show');
	              // }
	              $('.act-txt0' + popcur ).addClass('show');
	              $('#activity_pop').addClass('on');
	          }
	      })
	      $('.activity_close').on('click', function() {
	          $('.act-txt').removeClass('show');
	          $('#activity_pop').removeClass('on');
	      })
	  }
	var test = function() {
		window.addEventListener('click', function(evt) {
			var target = evt.target
			console.log(target);
		})
	}
	var fixtop_wrap = function(){
		let w=$(window).width();
		let w2 = (w / 1920 * 1019) +'px';
		
		if(w>1920){
			$(".header").height(w2)
		}else{
			$(".header").height("1019px")
		}
	}
	var __init = function() {
		setEnvent()
		setShare()
		setDownload()
//		setSize()
		setVideo()
//		setLive()
		setGallery()
		setScroll()
		setRegister()
		// setSubscribe()
		bindSubmitBook()
		fixtop_wrap()
		$(window).resize(function () {
			fixtop_wrap();
		})
	}
	__init()
	// test()

	// 适龄弹窗
	$(".age").click(function(){
		$(".popup").show();
	});

	$(".age_box .close").click(function(){
		$(".popup").hide();
	});

})