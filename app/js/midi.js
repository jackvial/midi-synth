////////
// This sample is published as part of the blog article at www.toptal.com/blog
// Visit www.toptal.com/blog and subscribe to our newsletter to read great posts
////////

angular
    .module('WebMIDI', [])
    // Angular factory returns a sinlgeton
    // $window is a reference to the browser window, this creates a closure
    // $q is a library for working with promises
    .factory('Devices', ['$window', '$q', function($window, $q) {

        // Check if web midi api is available
        function _test() {
            return ($window.navigator && $window.navigator.requestMIDIAccess) ? true : false;
        }

        function _connect() {
            var d = $q.defer(),
            p = d.promise
            a = null;

            if(_test()) {
                $window
                    .navigator
                    .requestMIDIAccess()
                    
                    // resolve d if the request was succesful
                    // or reject and throw an error
                    .then(d.resolve, d.reject);
            } else {
                d.reject(new Error('No Web MIDI support'));
            }

            return p;
        }

        // Return a connection object
        return {
            connect: _connect
        };
    }]);
