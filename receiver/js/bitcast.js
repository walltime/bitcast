function justLoaded() {
    var appConfig = new cast.receiver.CastReceiverManager.Config();
    appConfig.statusText = 'Bitcast';
    appConfig.maxInactivity = 2600000; // 30 days

    window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
    window.castReceiverManager.start(appConfig);

    start();
}

function justUnloaded() {

}

var SUBTITLE = 'USD / BTC on Bitstamp';

function start() {
    var price = document.getElementById('price');
    var subtitle = document.getElementById('subtitle');
    var realTime = document.getElementById('time1');
    var lastTrade = document.getElementById('time2');
    var lastPrice = localStorage['lp'];
    var lastTradeValue = localStorage['lt'];
    var value = $('#value');
    var animating = false;

    if (lastPrice) {
        price.innerHTML = lastPrice;
        subtitle.innerHTML = SUBTITLE;

        if (!animating) {
            animating = true;
            value.css('color', 'white');
            value.animate({ color: '#2a3236' }, 300, function() {
                animating = false;
            });
        }
    }

    if (lastTradeValue) {
        lastTrade.innerHTML = lastTradeValue;
    }

    var pusher = new Pusher('de504dc5763aeef9ff52');
    var trades_channel = pusher.subscribe('live_trades');

    var updateDate = function() {
        realTime.innerHTML = new Date().toString("hh:mm:ss tt");
    };

    updateDate();
    setInterval(updateDate, 300);

    trades_channel.bind('trade', function(data) {
        if (data && data['price']) {
            var finalValue = (parseFloat(data['price'])).toFixed(2);
            console.log('Price: ' + data['price'] + ' -> ' + finalValue);

            price.innerHTML = finalValue;
            var color;
            var color2;

            var newValue = parseFloat(finalValue);
            var oldValue = parseFloat(localStorage['lp']);

            if (newValue < oldValue) {
                color = '#ff0000';
                color2 = '#3a3236';
            } else if (newValue > oldValue) {
                color = '#00ff00';
                color2 = '#2a3836';
            } else {
                color = 'white';
                color2 = '#2a3236';
            }

            localStorage['lp'] = finalValue;
            localStorage['lt'] = new Date().toString("hh:mm:ss tt");

            subtitle.innerHTML = SUBTITLE;
            lastTrade.innerHTML = localStorage['lt'];

            if (!animating) {
                animating = true;
                value.css('color', color);
                value.animate({ color: color2 }, 300, function() {
                    animating = false;
                });
            }
        }
    });
}