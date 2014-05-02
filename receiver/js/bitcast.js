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
        subtitle.innerHTML = 'USD / mBTC on Bitstamp';

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
            var finalValue = (parseFloat(data['price']) / 1000.0).toFixed(2);
            console.log('Price: ' + data['price'] + ' -> ' + finalValue);

            price.innerHTML = finalValue;
            localStorage['lp'] = finalValue;
            localStorage['lt'] = new Date().toString("hh:mm:ss tt");

            subtitle.innerHTML = 'USD / mBTC on Bitstamp';
            lastTrade.innerHTML = localStorage['lt'];

            if (!animating) {
                animating = true;
                value.css('color', 'white');
                value.animate({ color: '#2a3236' }, 300, function() {
                    animating = false;
                });
            }
        }
    });
}