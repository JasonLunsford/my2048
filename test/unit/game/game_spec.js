describe('Game', function() {
	describe('GameManager', function() {

		// Inject the Game module into this test
		beforeEach(module('Game'));

		var gameManager, // instance of GameManager
			_gridService,
			_cookieStore,
			provide,
			$rootScope;

		beforeEach(module(function($provide) {
			_gridService = {
				anyCellsAvailable: angular.noop,
				tileMatchesAvailable: angular.noop
			};

			// Switch our the real GridService for our
			// fake version
			$provide.value('GridService', _gridService);
			provide = $provide;
		}));

		beforeEach(inject(function(GameManager) {
			gameManager = GameManager;
		}));

		describe('.movesAvailable', function() {
			it('should report true if there are cells available', function() {
				spyOn(_gridService, 'anyCellsAvailable').andReturn(true);
				expect(gameManager.movesAvailable()).toBeTruthy();
			});
			it('should report true if there are matches available', function() {
				spyOn(_gridService, 'anyCellsAvailable').andReturn(false);
				spyOn(_gridService, 'tileMatchesAvailable').andReturn(true);
				expect(gameManager.movesAvailable()).toBeTruthy();
			});
			it('should report false if there are no cells nor matches available', function() {
				spyOn(_gridService, 'anyCellsAvailable').andReturn(false);
				spyOn(_gridService, 'tileMatchesAvailable').andReturn(false);
				expect(gameManager.movesAvailable()).toBeFalsy();
			});
		});
	});
});