'use strict';

angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService, $cookieStore) {

	this.getHighScore = function() {
		return parseInt($cookieStore.get('highScore')) || 0;
	};

	this.grid = GridService.grid;
	this.tiles = GridService.tiles;
	this.gameSize = GridService.getSize();

	this.winningValue = 2048;

	this.reinit = function() {
		this.gameOver = false;
		this.win = false;
		this.currentScore = 0;
		this.highScore = this.getHighScore();
	};
	this.reinit();

	// Create a new game
	this.newGame = function() {
		GridService.buildEmptyGameBoard();
		GridService.buildStartingPosition();
		this.reinit();
	};

	/*
	 * The game loop!
	 *
	 * Inside this loop we'll run all the cool events, meaning those listed in the
	 * Keyboard service.
	*/
	this.move = function(key) {
		var self = this; // Hold a reference to the GameManager

		var f = function() {
			if ( self.win ) { return false; }
			var positions = GridService.traversalDirections(key);
			var hasMoved  = false;
			var hasWon 	  = false;

			// Update Grid
			GridService.prepareTiles();

			positions.x.forEach(function(x) {
				positions.y.forEach(function(y) {
					// first save original position
					var originalPosition = {x:x,y:y};
					var tile = GridService.getCellAt(originalPosition);

					if ( tile ) {
						var cell = GridService.calculateNextPosition(tile, key),
							next = cell.next;

						if ( next && next.value === tile.value && !next.merged ) {
							// merging cells here

							var newValue = tile.value * 2;
							// Create a new tile
							var mergedTile = GridService.newTile(tile, newValue);
							mergedTile.merged = [tile, cell.next];

							// Insert the new tile
							GridService.insertTile(mergedTile);

							// Remove old one
							GridService.removeTile(tile);

							// Move the location of the mergedTile into the next position
							GridService.moveTile(mergedTile, next);

							// Update the score of the game
							self.updateScore(self.currentScore + newValue);

							// Check for the winning value
							if ( mergedTile.value >= self.winningValue ) {
								hasWon = true;
							}

							hasMoved = true;
						} else {
							// no cells to merge, so move tile into new position 
							GridService.moveTile(tile, cell.newPosition);
						}
						
						if (!GridService.samePosition(originalPosition, cell.newPosition)) {
							hasMoved = true;
						}
					}
				});
			});

			if ( hasWon && !self.win ) {
				self.win = true;
			}

			if ( hasMoved ) {
				GridService.randomlyInsertNewTile();

				if ( self.win || !self.movesAvailable() ) {
					self.gameOver = true;
				}
			}
		};
		return $q.when(f());
	};

	// Are there moves left?
	this.movesAvailable = function() {
		return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
	};

	// Update the score
	this.updateScore = function(newScore) {
		this.currentScore = newScore;
		if ( this.currentScore > this.getHighScore() ) {
			this.highScore = newScore;

			// update cookie
			$cookieStore.put('highScore', newScore);
		}
	};
});