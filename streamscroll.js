(function ($, count, window) {
    "use strict";
    /*global jQuery*/
    
    $.streamScroll = {
        author: 'Luke Madhanga',
        version: '0.0.1',
        SCROLL_BOTH: 1,
        SCROLL_X: 2,
        SCROLL_Y: 3
    };
    var ef = function () {return;},
    methods = {
        init: function (opts) {
            var T = this,
            data;
            if (T.length > 1) {
                T.each(function () {
                    return $(this).streamScroll(opts);
                });
                return T;
            } else if (!T.length || T.data('streamscroll')) {
                // Plugin has been initialized or is zero length
                return T;
            }
            data = {
                instanceid: ++count,
                /**
                 * The last scroll position, either of the Y or X axis, with the Y axis taking precedence
                 */
                last: 0,
                s: $.extend({
                    axis: $.streamScroll.SCROLL_Y,
                    offsetX: 0,
                    offsetY: 0,
                    onScroll: ef,
                    onScrollBegin: ef,
                    onScrollEnd: ef
                }, opts)
            };
            bindEvents.call(T);
            T.data({streamscroll: data});
            return T;
        }
    };
    
    /**
     * Bind DOM events
     */
    function bindEvents() {
        
        var T = this;
        
        T.unbind('mousewheel.streamscroll').on('mousewheel.streamscroll', function (e) {
            var data = T.data('streamscroll');
            var deltaY = e.originalEvent.wheelDeltaY || e.originalEvent.wheelDelta || 0;
            var deltaX = e.originalEvent.wheelDeltaX || e.originalEvent.wheelDelta || 0;
            if (data.last === 0 && (deltaY !== 0 || deltaX !== 0)) {
                // Callback to say scrolling has begun
                data.s.onScrollBegin.call(T[0], {originalEvent: e.originalEvent});
            }
            // Call the onScroll event
            data.s.onScroll.call(T[0], {originalEvent: e.originalEvent});
            if (+data.s.axis === $.streamScroll.SCROLL_Y || +data.s.axis === $.streamScroll.SCROLL_BOTH) {
                // If the caller wants to scroll the Y axis, do so
                T.scrollTop((T.scrollTop() + data.s.offsetX) - deltaY);
            }
            if (+data.s.axis === $.streamScroll.SCROLL_X || +data.s.axis === $.streamScroll.SCROLL_BOTH) {
                // If the caller wants to scroll the X axis, do so
                T.scrollTop((T.scrollLeft() + data.s.offsetY) - deltaX);
            }
            if (data.last !== 0 && (deltaY === 0 && deltaX === 0)) {
                // Scrolling has ended
                data.s.onScrollEnd.call(T[0], {originalEvent: e.originalEvent});
            }
            data.last = deltaY || deltaX;
            return false;
        });
        
    }
    
    /**
     * Add the streamScroll plugin to the jQuery object
     * @param {mixed} methodOrOpts The name of a method to call (optionally followed by arguments) or an object of options if only
     *  initialising
     * @returns {jQuery}
     */
    $.fn.streamScroll = function (methodOrOpts) {
        if (methods[methodOrOpts]) {
            // The first option passed is a method, therefore call this method
            return methods[methodOrOpts].apply(this, Array.prototype.slice.call(arguments, 1));
        } 
        if (Object.prototype.toString.call(methodOrOpts) === '[object Object]' || !methodOrOpts) {
            // The default action is to call the init function
            return methods.init.apply(this, arguments);
        }
        // The user has passed us something dodgy, throw an error
        $.error(['The method ', methodOrOpts, ' does not exist'].join(''));
    };
    
}(jQuery, 0, this));
