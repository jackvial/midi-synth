WebAudioModule.service('LFOAMP', function() {
    var self;

    function LFOGain(ctx) {
        self = this;
        self.gain = ctx.createGain();

        return self;
    }

    LFOGain.prototype.setVolume = function(volume) {
        self.gain.gain.value = volume
    }

    LFOGain.prototype.connect = function(i) {
        self.gain.connect(i);
    }

    LFOGain.prototype.cancel = function() {
        self.gain.gain.cancelScheduledValues(0);
    }

    LFOGain.prototype.disconnect = function() {
        self.gain.disconnect(0);
    }

    return LFOGain;
});