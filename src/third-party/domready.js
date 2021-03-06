/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
(function(scope, definition) {
    if (!scope.initialized) {
        // usage: MTVNPlayer.module("domready").on(callback);
        scope.on = definition();
    }
    scope.initialized = true;
})(window.MTVNPlayer.module("domready"), function(ready) {

    var fns = [],
        fn, f = false,
        doc = document,
        testEl = doc.documentElement,
        hack = testEl.doScroll,
        domContentLoaded = 'DOMContentLoaded',
        addEventListener = 'addEventListener',
        onreadystatechange = 'onreadystatechange',
        readyState = 'readyState',
        loaded = /^loade|c/.test(doc[readyState])

        function flush(f) {
            loaded = 1
            while (f = fns.shift()) f()
        }

    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function() {
        doc.removeEventListener(domContentLoaded, fn, f)
        flush()
    }, f)


    hack && doc.attachEvent(onreadystatechange, fn = function() {
        if (/^c/.test(doc[readyState])) {
            doc.detachEvent(onreadystatechange, fn)
            flush()
        }
    })

    return (ready = hack ?
    function(fn) {
        self != top ? loaded ? fn() : fns.push(fn) : function() {
            try {
                testEl.doScroll('left')
            } catch (e) {
                return setTimeout(function() {
                    ready(fn)
                }, 50)
            }
            fn()
        }()
    } : function(fn) {
        loaded ? fn() : fns.push(fn)
    })
});