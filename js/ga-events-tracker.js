"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var gaEvents = window.gaEvents || {};

$.extend(window.gaEvents, {
	AnalyticsService: function AnalyticsService() {},
	defaults: {
		gaObjectName: "ga",
		whitelist: [],
		queryStringKey: "debug",
		queryStringValue: "true",
		defaultEvent: "click"
	},
	settings: {},
	isInWhiteList: function isInWhiteList() {
		var url = window.location.hostname;
		if (settings.whitelist.length > 0) {
			for (var domain in settings.whitelist) {
				if (url.indexOf(domain) > -1) {
					console.log('You are on a white-listed GA Debug server!');
					return true;
				} else {
					continue;
				}
			}
		} else {
			// no whitelist set; allow on any domain
			return true;
		}
	},
	debugMode: false,
	getQueryVariable: function getQueryVariable(key, value) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) === key && decodeURIComponent(pair[1]) === value) {
				return true;
			}
		}
	},
	displayDebugInfo: function displayDebugInfo(which, content) {
		$('#ga-debug-message #debug-' + which).html(content);
	},
	clearDebugInfo: function clearDebugInfo(which) {
		$('#ga-debug-message #debug-' + which).html('');
	},
	getParentLabel: function getParentLabel($el, whichLabel) {
		var returnVal = '',
		    label = $el.closest('[data-ga-' + whichLabel + '-label]').attr('data-ga-' + whichLabel + '-label');
		if (_typeof(label != "undefined") && label.length > 0) {
			returnVal = label + '_';
		}
		return returnVal;
	},
	getLabel: function getLabel($el) {
		var pageLabel = gaEvents.getParentLabel($el, 'page'),
		    sectionLabel = gaEvents.getParentLabel($el, 'section'),
		    thisElLabel = $el.data('gaLabel');
		if (thisElLabel.length > 0) {
			return pageLabel + sectionLabel + thisElLabel;
		} else {
			console.log('Missing required data attribute: data-ga-label');
			return false;
		}
	},
	getValue: function getValue($el) {
		return $el.data('gaValue');
	},
	getEvent: function getEvent($el) {
		return $el.data('gaEvent');
	},
	getAction: function getAction($el) {
		return $el.data('gaAction');
	},
	getCategory: function getCategory($el) {
		var cat = $el.data('gaCategory') ? $el.data('gaCategory') : $el.closest('data-ga-category').data('gaCategory');
		return cat;
	},
	template: "\n\t<div id=\"ga-debug-message\">\n\t\t<div>Category: <span id=\"debug-category\"></span></div>\n\t\t<div>\n\t\t\t<div style=\"display: none;\" id=\"debug-label-page\">Label - Page: <span></span></div>\n\t\t\t<div style=\"display: none;\" id=\"debug=label-section\">Label - Section: <span></span></div>\n\t\t\tLabel: <span id=\"debug-label\"></span>\n\t\t</div>\n\t\t<div>Event: <span id=\"debug-event\"></span></div>\n\t</div>"
});

gaEvents.AnalyticsService.prototype = {
	trackEvent: function trackEvent(category, action, label, value) {
		ga('send', 'event', category, action, label, value);
	}
};
// initialize instance of SocialService object
var analyticsService = new gaEvents.AnalyticsService();

(function ($) {
	// default settings
	gaEvents.settings = $.extend(gaEvents.settings, gaEvents.defaults);

	// adds a generic initalizer, although it's not needed, to set options.
	$.fn.gaEventTracker = function (options) {
		gaEvents.settings = $.extend({}, gaEvents.defaults, options);
	};

	$(function () {

		// default
		$('[data-ga-label]').on('click', function () {
			var $this = $(this),
			    category = gaEvents.getCategory($this),
			    action = gaEvents.getAction($this),
			    theAction = action ? action : gaEvents.settings.defaultEvent,
			    label = gaEvents.getLabel($this),
			    value = "";

			if (typeof category !== "undefined") {
				analyticsService.trackEvent(category, theAction, label, value);
			}
		});

		// hover
		$('[data-ga-action="hover"]').on('mouseenter', function () {
			var $this = $(this),
			    category = gaEvents.getCategory($this),
			    action = gaEvents.getAction($this),
			    theAction = action ? action : 'hover',
			    label = gaEvents.getLabel($this),
			    value = "";
			if (category) {
				analyticsService.trackEvent(category, theAction, label, value);
			}
		});

		// hover
		$('[data-ga-action="hoverout"]').on('mouseexit', function () {
			var $this = $(this),
			    action = gaEvents.getAction($this),
			    theAction = action ? action : 'hoverout',
			    category = gaEvents.getCategory($this),
			    label = gaEvents.getLabel($this),
			    value = "";
			if (category) {
				analyticsService.trackEvent(category, theAction, label, value);
			}
		});
		// debugging

		if (gaEvents.getQueryVariable(gaEvents.settings.queryStringKey, gaEvents.settings.queryStringValue)) {

			gaEvents.debugMode = true;

			// add new element for debugging output
			$('body').append(gaEvents.template);

			// debug event sections
			$('[data-ga-event]').on('mouseover', function () {
				gaEvents.displayDebugInfo('event', $(this).data('gaEvent'));
			});

			$('[data-ga-page-label]').on('mouseover', function () {
				var $this = $(this),
				    $debug = $('#debug-label-page'),
				    $span = $debug.find('span');

				$this.css({ 'border': '1px solid red' });

				$debug.removeAttr('css');
				$span.html($this.attr('data-ga-page-label'));
			});

			// label
			$('[data-ga-label]').on('mouseover', function () {
				var label = gaEvents.getLabel($(this));
				gaEvents.displayDebugInfo('label', label);
			});

			// debug categories
			$('[data-ga-category]').on('mouseover', function () {
				gaEvents.displayDebugInfo('category', $(this).data('gaCategory'));
			});

			// debug tracking info
			$('[data-tracking-info]').on('mouseover', function () {

				$('[data-tracking-info]').removeClass('debug-highlight-event');
				$(this).addClass('debug-highlight-event');
				gaEvents.displayDebugInfo('event', $(this).data('trackingInfo'));
			});

			// debug tracking info
			$('[data*=ga-]').on('mouseout', function () {
				gaEvents.clearDebugInfo('event');
				gaEvents.clearDebugInfo('category');
			});
		}
	});
})(jQuery);