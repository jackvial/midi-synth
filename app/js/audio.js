////////
// This sample is published as part of the blog article at www.toptal.com/blog
// Visit www.toptal.com/blog and subscribe to our newsletter to read great posts
////////

WebAudioModule
.factory('AudioEngine', ['OSC', 'AMP','LFOAMP', 'FTR', 'LFO', '$window', function(Oscillator, Amp, LFOAmp, Filter, LFO, $window) {
    var self = this;

    self.activeNotes = [];
    self.settings = {
        attack: 0.05,
        release: 0.05,
        portamento: 0.05
    };

    self.detuneAmount = 0;
    self.currentFreq = null;

    function _createContext() {
        self.ctx = new $window.AudioContext();
    }

    function _createAmp() {
        self.amp = new Amp(self.ctx);
    }

    function _createOscillators() {
        //osc types: sine, square, triangle, sawtooth
        // osc1
        self.osc1 = new Oscillator(self.ctx);
        self.osc1.setOscType('sine');
    }

    function _createLFOAmp() {
        self.LFOAmp = new LFOAmp(self.ctx);
    }

    // Create out LFO
    function _createLFO(){
        self.LFO = new LFO(self.ctx);
        self.LFO.setOscType('sine');
    }

    function _setAttack(a) {
        if(a) {
            self.settings.attack = a / 1000;
        }
    }

    function _setRelease(r) {
        if(r) {
            self.settings.release = r / 1000;
        }
    }

    function _createFilters() {
        self.filter1 = new Filter(self.ctx);
        self.filter1.setFilterFrequency(50);
        self.filter1.setFilterResonance(0);
    }

    function _wire(Analyser) {

        // Connect the main osc to the LFO
        self.osc1.connect(self.amp.gain);

        // Check if the analyser exists and connect it
        if(Analyser) {
            self.analyser = Analyser;
            self.analyser.connect(self.ctx, self.amp);
        } else {

            // Connect the soc gain to the speaker
            self.amp.connect(self.ctx.destination);
        }

        // Set the default volume
        self.LFOAmp.setVolume(50);

        // Initialize the lfo oscillator
        self.LFO.start(0);

        self.amp.setVolume(0.0, 0); //mute the sound

        // Start osc1
        self.osc1.start(0); 
    }

    // Use connect and disconnect to remove
    // an audo node from the signal path rather than
    // starting and stoping them
    function _connectLfo() {

        // connect the LFO to the LFO gain
        self.LFO.connect(self.LFOAmp.gain);
        
        // Connect the LFO gain to the main osc
        self.LFOAmp.connect(self.osc1.osc.frequency);
    }

    function _disconnectLfo() {
        self.LFO.disconnect();
        self.LFOAmp.disconnect();
    }

    function _connectFilter() {
        self.amp.disconnect();
        self.amp.connect(self.filter1.filter);
        if(self.analyser) {
            self.analyser.connect(self.ctx, self.filter1);
        } else {
            self.filter1.connect(self.ctx.destination);
        }
    }

    function _disconnectFilter() {
        self.filter1.disconnect();
        self.amp.disconnect();
        if(self.analyser) {
            self.analyser.connect(self.ctx, self.amp);
        } else {
            self.amp.connect(self.ctx.destination);
        }
    }

    function _mtof(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    function _vtov (velocity) {
        return (velocity / 127).toFixed(2);
    }

    function _noteOn(note, velocity) {
        self.activeNotes.push(note);

        self.osc1.cancel();
        self.currentFreq = _mtof(note);
        self.osc1.setFrequency(self.currentFreq + self.detuneAmount, self.settings.portamento);

        self.amp.cancel();

        self.amp.setVolume(_vtov(velocity), self.settings.attack);
    }

    function _noteOff(note) {
        var position = self.activeNotes.indexOf(note);
        if (position !== -1) {
            self.activeNotes.splice(position, 1);
        }

        if (self.activeNotes.length === 0) {
            // shut off the envelope
            self.amp.cancel();
            self.currentFreq = null;
            self.amp.setVolume(0.0, self.settings.release);
        } else {
            // in case another note is pressed, we set that one as the new active note
            self.osc1.cancel();
            self.currentFreq = _mtof(self.activeNotes[self.activeNotes.length - 1]);
            self.osc1.setFrequency(self.currentFreq + self.detuneAmount, self.settings.portamento);
        }
    }

    function _detune(d) {
        if(self.currentFreq) {
            //64 = no detune
            if(64 === d) {
                self.osc1.setFrequency(self.currentFreq, self.settings.portamento);
                self.detuneAmount = 0;
            } else {
                var detuneFreq = Math.pow(2, 1 / 12) * (d - 64);
                self.osc1.setFrequency(self.currentFreq + detuneFreq, self.settings.portamento);
                self.detuneAmount = detuneFreq;
            }
        }
    }

    // public methods
    return {
        init: function() {
            _createContext();

            // Initialize LFO
            _createLFO();
            _createLFOAmp();
            
            // osc1
            _createAmp();
            _createOscillators();
            
            _createFilters();
        },     
        wire: _wire,
        noteOn: _noteOn,
        noteOff: _noteOff,
        detune: _detune,
        setAttack: _setAttack,
        setRelease: _setRelease,
        osc: {
            setType: function(t) {
                if(self.osc1) {
                    self.osc1.setOscType(t);
                }
            }
        },
        filter: {
            setType: function(t) {
                if(self.filter1) {
                    self.filter1.setFilterType(t);
                }
            },
            setFrequency: function(f) {
                if(self.filter1) {
                    self.filter1.setFilterFrequency(f);
                }
            },
            setResonance: function(r) {
                if(self.filter1) {
                    self.filter1.setFilterResonance(r);
                }
            },
            connect: _connectFilter,
            disconnect: _disconnectFilter
        },
        lfo: {
            setFrequency: function(f){
                //console.log(f);
                self.LFO.setFrequency(f);
            },
            connect: _connectLfo,
            disconnect: _disconnectLfo
        }
    };
}]);