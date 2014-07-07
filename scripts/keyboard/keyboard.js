'use strict';

angular.module('Keyboard', [])
.service('KeyboardService', function($document) {

	var UP 		= 'up',
		RIGHT 	= 'right',
		DOWN 	= 'down',
		LEFT 	= 'left';

	var keyboardMap = {
		65: LEFT,
		87: UP,
		68: RIGHT,
		83: DOWN
	};

	// Initialize the keyboard event binding
	this.init = function() {
		var self = this;
		this.keyEventHandlers = [];
		$document.bind('keydown', function(evt) {
			var key = keyboardMap[evt.which];

			if ( key ) {
				evt.preventDefault();
				self._handleKeyEvent(key, evt);
			}
		});
	};

	// Bind event handlers to get called when an event is fired
	this.keyEventHandlers = [];
	this.on = function(cb) {
		this.keyEventHandlers.push(cb);
	};

	this._handleKeyEvent = function(key, evt) {
		var callbacks = this.keyEventHandlers;
		if ( !callbacks ) {
			return;
		}

		evt.preventDefault();

		if ( callbacks ) {
			for ( var x = 0; x < callbacks.length; x++ ) {
				var cb = callbacks[x];
				cb(key, evt);
			}
		}
	};
});