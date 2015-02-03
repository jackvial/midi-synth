WebAudioModule.service('LFO', function() {
    var self;

    // Pass in the reference to the audio context
    // so we can create audo nodes
    function LFO(ctx){
        self = this;
        self.sineLFO = ctx.createOscillator();
        //self.sineLFOGain = ctx.createGainNode();

        return self;
    }

    LFO.prototype.setOscType = function(type) {
        if(type) {
            self.sineLFO.type = type
        }
    }

    LFO.prototype.setFrequency = function(freq) {
        console.log(freq);
        self.sineLFO.frequency.value = freq;
    };

    LFO.prototype.start = function(pos) {
        self.sineLFO.start(pos);
    }

    LFO.prototype.stop = function(pos) {
        self.sineLFO.stop(pos);
    }

    LFO.prototype.connect = function(i) {
        self.sineLFO.connect(i);
    }

    LFO.prototype.disconnect = function() {
        self.sineLFO.disconnect(0);
    }

    LFO.prototype.cancel = function() {
        self.sineLFO.frequency.cancelScheduledValues(0);
    }        

    // Return the function reference in the callback
    // when the LFO service is injected into the AudioEngine Factory
    return LFO;
});