var WebAudioModule = angular.module('WebAudio', []);

WebAudioModule.service('AMP', function() {
    var self;

    function Gain(ctx) {
        self = this;

        self.gain = ctx.createGain();

        return self;
    }

    Gain.prototype.setVolume = function(volume, time) {
        self.gain.gain.setTargetAtTime(volume, 0, time);
    }

    Gain.prototype.connect = function(i) {
        self.gain.connect(i);
    }

    Gain.prototype.cancel = function() {
        self.gain.gain.cancelScheduledValues(0);
    }

    Gain.prototype.disconnect = function() {
        self.gain.disconnect(0);
    }

    return Gain;
});