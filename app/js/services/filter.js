WebAudioModule.service('FTR', function() {
    var self;

    function Filter(ctx) {
        self = this;

        self.filter = ctx.createBiquadFilter();

        return self;
    }

    Filter.prototype.setFilterType = function(type) {
        if(type) {
            self.filter.type = type;
        }
    }

    Filter.prototype.setFilterFrequency = function(freq) {
        if(freq) {
            self.filter.frequency.value = freq;
        }
    }

    Filter.prototype.setFilterResonance = function(res) {
        if(res) {
            self.filter.Q.value = res;
        }
    }

    Filter.prototype.connect = function(i) {
        self.filter.connect(i);
    }

    Filter.prototype.disconnect = function() {
        self.filter.disconnect(0);
    }

    return Filter;
});