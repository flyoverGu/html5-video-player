function Fvideo(conf) {
    this.conf = conf;
    this.$el = $(conf.container);
    this.video = this.$el.find('video')[0];
    this.init();
}

Fvideo.fn = Fvideo.prototype;

Fvideo.fn.init = function() {
    this.render();
    this.listenEvent();
    this.initProgress();
    this.initVolume();
}

Fvideo.fn.render = function() {
    var opt = {
        isShowControls: true
    };
}

Fvideo.fn.listenEvent = function() {
    this.$el.on('click', '.f-play', this.togglePlay.bind(this))
        .on('click', '.f-fullscreen', this.toggleFullscreen.bind(this))
        .on('click', '.f-volume-control', this.toggleVolume.bind(this));
    this.video.addEventListener('timeupdate', this.syncProgress.bind(this));
}

Fvideo.fn.toggleVolume = function(e) {
    var $d = this.$el.find('.f-volume-control');
    if ($d.hasClass('f-small-volume')) {
        this.video.volume = this._volume;
        this.switchIcon($d, 1);
    } else {
        this.video.volume = 0;
        this.switchIcon($d, 2);
        this.$el.find('.f-volume-move').css('left', 0 + 'px');
    }
    $d.toggleClass('f-small-volume');
}

Fvideo.fn.toggleFullscreen = function(e) {
    this.$el.toggleClass('f-like-fullscreen');
    var $d = this.$el.find('.f-fullscreen');
    if (this.$el.hasClass('f-like-fullscreen')) {
        this.switchIcon($d, 2);
    } else {
        this.switchIcon($d, 1);
    }
}

Fvideo.fn.togglePlay = function(e) {
    var $d = this.$el.find('.f-play');
    if ($d.hasClass('f-pause')) {
        this.video.play();
        this.switchIcon($d, 2);
    } else {
        this.video.pause();
        this.switchIcon($d, 1);
    }
    $d.toggleClass('f-pause');
}

Fvideo.fn.switchIcon = function($d, n) {
    $d.find('.switch-icon')
        .removeClass('icon-' + (n == 1 ? 2 : 1))
        .addClass('icon-' + n);
};

Fvideo.fn.initVolume = function() {
    var f = this.moveVolume.bind(this);
    var progressLength = this.$el.find('.f-volume').outerWidth() - 8;
    this.$el.find('.f-volume-move').css('left', progressLength + 'px');
    this._volume = 1;
    this.$el.on('mousedown', '.f-volume-move', function() {
        $('body').on('mousemove', f)
            .on('mouseup', function() {
                $('body').off('mousemove', f);
            });
    });
}

Fvideo.fn.moveVolume = function(e) {
    var left = this.$el.find('.f-volume').offset().left;
    var progressLength = this.$el.find('.f-volume').outerWidth() - 8;
    var to = e.clientX - left - 4;
    to = Math.max(0, Math.min(to, progressLength - 4));
    this.$el.find('.f-volume-move').css('left', to + 'px');
    this.setVolume(to / progressLength);
}

Fvideo.fn.setVolume = function(v) {
    this.video.volume = v;
    this._volume = v;
}

Fvideo.fn.initProgress = function() {
    var f = this.moveProgress.bind(this);
    this.$el.on('mousedown', '.f-progress-move', function() {
        $('body').on('mousemove', f)
            .on('mouseup', function() {
                $('body').off('mousemove', f);
            });
    });
}

Fvideo.fn.syncProgress = function() {
    var allTime = this.video.duration;
    var to = this.video.currentTime / this.video.duration * this.$el.find('.f-progress').outerWidth();
    this.dargTo(to);
    this.updateDisplayTime();
}

Fvideo.fn.moveProgress = function(e) {
    var left = this.$el.find('.f-progress').offset().left;
    var progressLength = this.$el.find('.f-progress').outerWidth() - 8;
    var to = e.clientX - left - 4;
    to = Math.max(0, Math.min(to, progressLength - 4));
    this.dargTo(to);
    this.setCurrentTime(to);
}

Fvideo.fn.setCurrentTime = function(to) {
    // 设置视频播放时间
    var length = this.$el.find('.f-progress').outerWidth();
    var over = to / length;
    var s = over * this.video.duration;
    this.video.currentTime = s;
    this.video.play();
}

Fvideo.fn.dargTo = function(to) {
    // 设置移动距离
    this.$el.find('.f-progress-move').css('left', to + 'px');
}

Fvideo.fn.updateDisplayTime = function() {
    var currentTime = this.video.currentTime;
    var format = 'mm:ss';
    var s = parseInt(currentTime % 60);
    var m = parseInt(currentTime / 60);
    var displayTime = format.replace('mm', m).replace('ss', s);
    this.$el.find('.f-display-time').html(displayTime);
}
