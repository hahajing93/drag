// JavaScript Document
function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}
//function removeClass(element,clsNames){
//			var classNameArr = element.className.split(" ");
//			for( var i = 0; i < classNameArr.length; i++ ){
//				if( classNameArr[i] === clsNames ){
//					classNameArr.splice(i,1);
//					i--;
//				}
//			}
//			element.className = classNameArr.join(" ");
//		}


function fnLoad(){
	var wc = id("welcome");
	var imgLoad = true;/*图片加载完毕*/
	var animationTime = false;//动画时间加载未完毕
	var iTime = new Date().getTime();//获取开始的毫秒数
	var oTimer = null;//开个定时器
	bind(wc,"transitionend",end);
	bind(wc,"webkitTransitionEnd",end);
	oTimer = setInterval(function(){
		if(new Date().getTime()-iTime>=8500){
			animationTime = true;
		}
		if(imgLoad && animationTime){//图片加载完毕 和动画时间加载完毕
			clearInterval(oTimer);
			wc.style.opacity = 0;
		}
	},1000);
	function end(){
			removeClass(wc,"pageShow");
			fnTab();
	}
}

//图片切换
function fnTab(){
	var oTab = id("tabPic");
	var oList = id("picList");
	var aNav = oTab.getElementsByTagName("nav")[0].children;
	var oTimer = null;
	var iNow = 0;
	var ix = 0;
	var iStartTouchx = 0;
	var iStartx = 0;
	var iw = view().w;
	function auto(){
			oTimer = setInterval(function(){
			iNow++;
			iNow = iNow%aNav.length;
			Tab();
		},2000);
	}
	function Tab(){
		ix = -iNow*iw;
		oList.style.transition = "0.5s";
		oList.style.transform = oList.style.WebkitTransform = "translateX("+ix+"px)";
		for(var i = 0;i<aNav.length;i++){
			removeClass(aNav[i],"active");
		}
		addClass(aNav[iNow],"active");
	}
	bind(oTab,"touchstart",fnStart);
	bind(oTab,"touchmove",fnMove);
	bind(oTab,"touchend",fnEnd);
	auto();
	fnScore();
	function fnStart(ev){
		oList.style.transition = "none";
		ev = ev.changedTouches[0];
		iStartTouchx = ev.pageX;
		iStartx = ix;
		clearInterval(oTimer);
	}
	function fnMove(ev){
		ev = ev.changedTouches[0];
		var iDis = ev.pageX - iStartTouchx;//移动的距离
		ix = iStartx + iDis;
		oList.style.transform = oList.style.WebkitTransform = "translateX("+ix+"px)";
	}
	function fnEnd(ev){
		iNow = ix/iw;
		iNow = -Math.round(iNow);//四舍五入
		if(iNow < 0){
			iNow = 0;
		}
		if(iNow>aNav.length-1){
			iNow = aNav.length-1;
		}
		console.log(iNow);
		Tab();
		auto();
	}
}

function fnScore(){
	var oScore = id("score");
	var oUl = oScore.getElementsByTagName("ul")[0];
	var aLi = oUl.getElementsByTagName("li");//获取三个li
	var arr = ["差","一般","可以","良好","优秀"];
	for(var i=0;i<aLi.length;i++){
		fn(aLi[i]);
	}
	function fn(oLi){
		var aNav = oLi.getElementsByTagName("a");
		var oInput = oLi.getElementsByTagName("input")[0];
		for(var i=0;i<aNav.length;i++){
			aNav[i].index = i;
			bind(aNav[i],"touchstart",function(){
				for(var i=0;i<aNav.length;i++){
					if(i<=this.index){
						addClass(aNav[i],"active");
					}else{
						removeClass(aNav[i],"active");
					}
				}
				oInput.value = arr[this.index];
			});
		}
	}
}

function fnInfo(oInfo,sInfo){
	oInfo.innerHTML = sInfo;
	oInfo.style.webkitTransform = "scale(1)";
	oInfo.style.opacity = "1";
	setTimeout(function(){
		oInfo.style.webkitTransform = "scale(0)";
		oInfo.style.opacity = "0";
	},1000);
}
function fnIndex(){
	var oIndex = id("index");
	var oBtn = oIndex.getElementsByClassName("btn")[0];
	var bScore = false;
	var oInfo = oIndex.getElementsByClassName("info")[0];
	console.log(oInfo);
	bind(oBtn,"touchend",fnEnd);
	function fnEnd(){
		bScore = fnScoreChecked();
		if(bScore){//星星验证通过
			if( bTag()){//标签验证通过
				fnIndexOut();
			}else{
				fnInfo(oInfo,"给景区添加标签");
			}
		}else{//验证没有通过
			fnInfo(oInfo,"给景区评分");
		}
	}
	
	function fnScoreChecked(){
		var oScore = id("score");
		var aInput = oScore.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++){
			if(aInput[i].value == 0){//有一个值为零  就叫返回false
				return false;
			}
		}
		return true;
	}
	function bTag(){
		var oIndexTag = id("indexTag");
		var aInput = oIndexTag.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++){
			if(aInput[i].checked){
				return true;
			}
		}
		return false;
	}
}

function fnIndexOut(){
	var oMask = id("mask");
	var oIndex = id("index");
	var oNews = id("news");
	addClass(oMask,"pageShow");
	addClass(oNews,"pageShow");
	setTimeout(function(){//displaynone到displayblock有一段时间
		oMask.style.opacity = 1;
		oIndex.style.filter = oIndex.style.WebkitFilter ="blur(3px)";//模糊程度
	},14);
	
	setTimeout(function(){
		oMask.style.opacity = 0;
		oIndex.style.filter = oIndex.style.WebkitFilter ="blur(0px)";
		oNews.style.opacity = 1;
		removeClass(oMask,"pageShow");
//		oNews.style.transition = "2s";
	},3000);
	fnNews();
}

function fnNews(){
	var oNews = id("news");
//	console.log(oNews);
	var oInfo = oNews.getElementsByClassName("info")[0];
//	console.log(oInfo);
	var aInput = oNews.getElementsByTagName("input");
//	console.log(aInput);
	aInput[0].onchange = function(){
		console.log(this.files);//上传文件包含的文件信息 
		if(this.files[0].type.split("/")[0]=="video"){
			fnNewsOut();
			this.value = "";//清除当前文件的缓存
		}else{
			 fnInfo(oInfo,"请上传视频");
		}
	}
	aInput[1].onchange = function(){
		console.log(this.files);//上传文件包含的文件信息 
		if(this.files[0].type.split("/")[0]=="image"){
			fnNewsOut();
			this.value = "";//清除当前文件的缓存
		}else{
			 fnInfo(oInfo,"请上传图片");
		}
	}
}

function fnNewsOut(){
	var oNews = id("news");
	var oForm = id("form");
	oNews.style.cssText = "";
	removeClass(oNews,"pageShow");
	addClass(oForm,"pageShow");
	formIn();
}

function formIn(){
	var oForm = id("form");
	var oOver = id("over");
	var aLabel = id("formTag").getElementsByTagName("label");
	var oBtn = oForm.getElementsByClassName("btn")[0];
	var bOff = false;//是不是可以提交状态
	for(var i=0;i<aLabel.length;i++){
		bind(aLabel[i],"touchend",function(){
			bOff = true;
			addClass(oBtn,"submit");
		});
	}
	bind(oBtn,"touchend",function(){
			if(bOff){
				for(var i = 0;i<aLabel.length;i++){//清空所有被选中的
					aLabel[i].getElementsByTagName("input")[0].checked = false;
				}
				bOff = false;
				addClass(oOver,"pageShow");
				removeClass(oForm,"pageShow");
				removeClass(oBtn,"submit");
				over();
			}
		});
}

function over(){
	var oIndex = id("index");
	var oOver = id("over");
	var oBtn = oOver.getElementsByClassName("btn")[0];
	bind(oBtn,"touchend",function(){
		removeClass(oOver,"pageShow");
//		addClass(oIndex,"pageShow");
	})
}

