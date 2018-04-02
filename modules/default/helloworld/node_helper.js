var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
    // Subclass start method.
    start: function() {
        console.log('Started node_helper.js for ');
    },

    socketNotificationReceived: function(notification, _) {
        console.log(
            this.name +
                ' node helper received a socket notification: ' +
                notification +
                ' - Payload: '
        );
        this.ttcSubwayRequest();
    },

    ttcSubwayRequest: function() {
        var self = this;
        var uri =
            'https://www.ttc.ca/Subway/loadNtas.action?subwayLine=1&stationId=20&searchCriteria=&_=1522029126912';

        request({ url: uri, method: 'GET' }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('Retrieved subway data');
                console.log(body);
                var result = JSON.parse(body);
                self.sendSocketNotification('TTC_SUBWAY_RESULT', result);
            } else {
                console.log('Failed to retrieve data');
            }
        });
    },
});
