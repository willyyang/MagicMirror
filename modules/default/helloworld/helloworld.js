/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register('helloworld', {
    // Default module config.
    defaults: {
        text: 'Hello World!',
        updateInterval: 60 * 100, // every 10 seconds
    },

    getScripts: function() {
        return [
            this.file('jquery-3.1.1.min.js'), // this file will be loaded straight from the module folder.
        ];
    },

    // Define start sequence.
    start: function() {
        Log.log('Start module: ' + this.name);
        var self = this;
        this.timeStrings = [];

        setTimeout(function() {
            self.sendSocketNotification('START GETTING SUBWAY DATA');
        }, self.config.updateInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        Log.log('socket received from Node Helper');
        if (notification == 'TTC_SUBWAY_RESULT') {
            var json = payload;
            Log.log(payload);
            this.processSubwayData(payload);

            this.updateDom();
        }
    },

    processSubwayData: function(data) {
        if (!data) {
            Log.error(this.name + ': No subway data');
            return;
        }

        this.timeStrings = data.ntasData
            .filter(x => x.trainDirection === 'North')
            .map(x => x.timeString);

        this.sendNotification('SHOW_ALERT', {
            type: 'notification',
            title: 'Best Route',
            message: 'Take Subway',
        });
    },

    // Present data UI
    getDom: function() {
        var wrap = document.createElement('div');
        return wrap;
    },

    // getTemplate: function() {
    //     return 'helloworld.njk';
    // },

    // getTemplateData: function() {
    //     return this.config;
    // },
});
