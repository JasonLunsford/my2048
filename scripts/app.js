'use strict';

angular
.module('twentyfourtyeightApp', [
	'ui.router',
	'ngAnimate',
	'ngCookies',
	'Game',
	'Grid',
	'Keyboard'
])
.config(function (GridServiceProvider, $urlRouterProvider, $locationProvider, $stateProvider) {
	GridServiceProvider.setSize(4);

	$urlRouterProvider
	.rule(function ($injector, $location) {
		var path = $location.path();
		var normalized = path.toLowerCase();

		if (path != normalized) {
			$location.replace().path(normalized);
		}
	})
	.otherwise("/404");

	$stateProvider
	.state('myGame', {
		url: '/',
		views: {
			'myGameView':{
				templateUrl: 'views/main.html'
			}
		}
    });

    $locationProvider.html5Mode(true);
})
.controller('GameController', function(GameManager, KeyboardService) {
	this.game = GameManager;

	// creates a new game
	this.newGame = function() {
		KeyboardService.init();
		this.game.newGame();
		this.startGame();
	};

	this.startGame = function() {
		var self = this;
		KeyboardService.on(function(key) {
			self.game.move(key);
		});
	};

	// start the new game on boot up
	this.newGame();
});