var nowIndex = 0;
var dataList;
var len;
var audio = root.audioManager;
var timer;


function getData(url){
    $.ajax({
        type:"GET",
        url:url,
        success:function(data){
            
            len = data.length;
            dataList = data;
            bindEvent();
            bindTouch();
            $('body').trigger('play:change',nowIndex);
        },
        error:function(){
            console.log("error");
        }
    })
}
//渲染图片
function renderImg(src){
    var img = new Image();
    img.src = src;
    img.onload = function(){
        $('.img-box img').attr('src',src);
        root.blurImg(img,$('body'));
    }
}
//渲染信息部分
function renderInfo(info){
    var str = '<div class="song-name">'+ info.song +'</div>\
    <div class="singer-name">'+ info.singer +'</div>\
    <div class="album-name">'+ info.album +'</div>';
    $('.song-info').html(str);
}

function renderIsLike(like){
    if(like){
        $('.like').addClass('liking');
    }else{
        $('.like').removeClass('liking');
    }
}
var render = function(data){
    renderImg(data.image);
    renderInfo(data);
    renderIsLike(data.isLike);
}

function AudioManager(){
    this.audio = new Audio();
   
    this.status = 'pause';
}
    AudioManager.prototype = {
        play:function(){
            this.audio.play();
            this.status = 'play';
        },
        pause:function(){
            this.audio.pause();
            this.status = 'pause';
        },
        getAudio:function(src){
            this.audio.src = src;
            this.audio.load();

        },
        playTo:function(t){
            this.audio.currentTime = t;
        }
    }
var audioManager = new AudioManager();
var duration,frameId,startTime,lastPer = 0;
    function renderAllTime(allTime){
        duration = allTime;
        var time = formTime(allTime);
        $('.all-time').html(time);
    }
    function formTime(t){
        t = Math.round(t);
        var m = Math.floor(t/60);
        var s = t - m * 60;
        m < 10 ? m = '0' + m : m;
        s < 10 ? s = '0' + s : s;
        return m + ':' + s;
    }
    //进度条开始运动
    function start(p){
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();
        lastPer = p == undefined ? 0 : p;
        function frame(){
            var curTime = new Date().getTime();
            var per = lastPer + (curTime - startTime) / (duration * 1000);
            if(per <= 1){
                update(per);
            }else{
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }
    function update(per){
        var time = formTime(per * duration);
        $('.cur-time').html(time);
        var x = (per - 1) * 100;
        $('.pro-top').css({
            transform:'translateX(' + x + '%)'
        })
    }
    function stop(){
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (duration * 1000);
    }

function bindEvent(){
    $('body').on('play:change',function(e,index){
        
        audio.getAudio(dataList[index].audio);
        render(dataList[index]);
        renderAllTime(dataList[index].duration);
        if(audio.status == 'play'){
            audio.play();
            rotated(0);
        }
        $('.img-box').attr('data-deg',0);
        $('.img-box').css({
            'transform':'rotateZ(0deg)',
            'transition':'none'
        })
    })
    $('.prev').on('click',function(){
        if(nowIndex == 0){
            nowIndex = len - 1;
        }else{
            nowIndex --;
        }
        
        $('body').trigger('play:change',nowIndex);
        start(0);
        if(audio.status == 'pause'){
            stop();
        }
    });
    $('.next').on('click',function(){
        if(nowIndex == len - 1){
            nowIndex = 0;
        }else{
            nowIndex ++;
        }
        $('body').trigger('play:change',nowIndex);
        start(0);
        if(audio.status == 'pause'){
            stop();
        }
    })
    $('.play').on('click',function(){
        
        if(audio.status == 'pause'){
            audio.play();
            start();
            var deg = $('.img-box').attr('data-deg')
            rotated(deg);
        }else{
            audio.pause();
            stop();
            clearInterval(timer);
        }
        $('.play').toggleClass('playing');
    })
}
function bindTouch(){
    var bottom = $('.pro-bottom').offset();
    var l = bottom.left;
    var w = bottom.width;
    $('.spot').on('touchstart',function(){
        stop();
    }).on('touchmove',function(e){
        
        var x = e.changedTouches[0].clientX;
        var per = (x - 1) / w;
        if(per >= 0 && per <=1){
            update(per);
        }
        
    }).on('touchend',function(e){
        var x = e.changedTouches[0].clientX;

        var per = (x - 1) / w;
        if(per >= 0 && per <= 1){
            var time = per * dataList[nowIndex].duration;
            start(per);
            audio.playTo(time);
            audio.play();
            audio.status = 'play';
            $('.play').addClass('playing');
        }

    });
}
function rotated(deg){
    clearInterval(timer);
    deg = +deg;
    timer = setInterval(function(){
        
        deg ++;
        $('.img-box').attr('data-deg',deg);
        $('.img-box').css({
            'transform':'rotateZ(' + deg + 'deg)',
            'transition':'all 1s linear'
        })
    },100);
}
getData('../music/mock/data.json');
