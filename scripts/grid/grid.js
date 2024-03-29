'use strict';

angular.module('Grid', [])
.factory('GenerateUniqueId', function() {
	var generateUid = function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
		});
		return uuid;
	};
	return {
		next: function() { return generateUid(); }
	}
})
.factory('TileModel', function(GenerateUniqueId) {
	var Tile = function(pos, val) {
		this.x 		= pos.x;
		this.y 		= pos.y
		this.value  = val || 2;

		this.id 	= GenerateUniqueId.next();
		this.merged = null;
	};

	Tile.prototype.savePosition = function() {
		this.originalX = this.x;
		this.originalY = this.y;
	};

	Tile.prototype.reset = function() {
		this.merged = null;
	};

	Tile.prototype.setMergedBy = function(arr) {
		var self = this;
		arr.forEach(function(tile) {
			tile.merged = true;
			tile.updatePosition(self.getPosition());
		});
	};

	Tile.prototype.updateValue = function(newVal) {
		this.value = newVal;
	};

	Tile.prototype.updatePosition = function(newPosition) {
		this.x = newPosition.x;
		this.y = newPosition.y;
	};

	Tile.prototype.getPosition = function() {
		return {
			x: this.x,
			y: this.y
		};
	};

	return Tile;
})
.provider('GridService', function() {
	this.size = 4; // default grid size
	this.startingTileNumber = 2; // default number of starting tiles

	this.setSize = function(sz) {
		this.size = sz ? sz : 0;
	}

	this.setStartingTiles = function(num) {
		this.startingTileNumber = num;
	}

	var service = this;

	this.$get = function(TileModel) {
		// Define grid and tile arrays
		this.grid 	= [];
		this.tiles 	= [];

		// private vectors
	    var vectors = {
	      'left': { x: -1, y: 0 },
	      'right': { x: 1, y: 0 },
	      'up': { x: 0, y: -1 },
	      'down': { x: 0, y: 1 }
		};

		this.getSize = function() {
			return service.size;
		}

		// Build gaming board
		this.buildEmptyGameBoard = function() {
			var self = this;

			// Initialize grid
			for ( var x = 0; x < service.size * service.size; x++ ) {
				this.grid[x] = null;
			}

			// Initial tile array with null objects
			this.forEach(function(x,y) {
				self.setCellAt({x:x, y:y}, null);
			});
		};

		this.prepareTiles = function() {
			this.forEach(function(x,y,tile) {
				if (tile) {
					tile.savePosition();
					tile.reset();
				}
			});
		};

		this.traversalDirections = function(key) {
			var vector = vectors[key];
			var positions = { x:[], y:[] };
			for ( var x = 0; x < this.size; x++ ) {
				positions.x.push(x);
				positions.y.push(x);
			}

			// Reorder if going right
			if ( vector.x > 0 ) {
				positions.x = positions.x.reverse();
			}

			// Reorder y positions if going down
			if ( vector.y > 0 ) {
				positions.y = positions.y.reverse();
			}

			return positions;
		};

		this.calculateNextPosition = function(cell, key) {
			var vector = vectors[key];
			var previous;

			do {
				previous = cell;
				cell = {
					x: previous.x + vector.x,
					y: previous.y + vector.y
				};
			} while (this.withinGrid(cell) && this.cellAvailable(cell));

			return {
				newPosition: previous,
				next: this.getCellAt(cell)
			};
		};

		// is position within the boundaries of our grid?
		this.withinGrid = function(cell) {
	  		return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size;
		};

		// Is a cell available at a given position?
		this.cellAvailable = function(cell) {
			if ( this.withinGrid(cell) ) {
				return !this.getCellAt(cell);
			} else {
				return null;
			}
		};

		// Randomize starting positions
		this.buildStartingPosition = function() {
			for ( var x = 0; x < this.startingTileNumber; x++ ) {
				this.randomlyInsertNewTile();
			}
		};

		this.tileMatchesAvailable = function() {
			var totalSize = service.size * service.size;
			for ( var i = 0; i < totalSize; i++ ) {
				var pos = this._positionToCoordinates(i);
				var tile = this.tiles[i];

				if ( tile ) {
					// Check all the vectors
					for ( var vectorName in vectors ) {
						var vector = vectors[vectorName];
						var cell = { x: pos.x + vector.x, y: pos.y + vector.y };
						var other = this.getCellAt(cell);
						if ( other && other.value === tile.value ) {
							return true;
						}
					}
				}
			}
			return false;
		};

		// grab cell at given position
		this.getCellAt = function(pos) {
			if ( this.withinGrid(pos) ) {
				var x = this._coordinatesToPosition(pos);
				return this.tiles[x];
			} else {
				return null;
			}
		};

		// set cell to a given position
		this.setCellAt = function(pos, tile) {
			if ( this.withinGrid(pos) ) {
				var xPos = this._coordinatesToPosition(pos);
				this.tiles[xPos] = tile;
			}
		};

		this.moveTile = function(tile, newPosition) {
			var oldPos = {
				x: tile.x,
				y: tile.y
			};

			// update array location
			this.setCellAt(oldPos, null);
			this.setCellAt(newPosition, tile);

			// update tile model
			tile.updatePosition(newPosition);
		};

		// run a method for each element in tiles array
		this.forEach = function(cb) {
			var totalSize = this.size * this.size;
			for ( var i = 0; i < totalSize; i++ ) {
				var pos = this._positionToCoordinates(i);
				cb(pos.x, pos.y, this.tiles[i]);
			}
		};

		// Convert x (single dimension position) to x,y (regular coordinates)
		this._positionToCoordinates = function(i) {
			var x = i % service.size,
				y = (i - x) / service.size;

			return {
				x: x,
				y: y
			};
		};

		// convert coordinates to single dimension position
		this._coordinatesToPosition = function(pos) {
			return (pos.y * service.size) + pos.x;
		};

		// add a tile to the global array we created above
		this.insertTile = function(tile) {
			var pos = this._coordinatesToPosition(tile);
			this.tiles[pos] = tile;
		};

		this.newTile = function(pos, value) {
			return new TileModel(pos, value);
		};

		// remove a tile from the array we created above
		this.removeTile = function(pos) {
			pos = this._coordinatesToPosition(pos);
			delete this.tiles[pos];
		};

		this.samePosition = function(a, b) {
			return a.x === b.x && a.y === b.y;
		};

		// get all available cells for initial play
		this.availableCells = function() {
			var cells = [],
				self = this;

			this.forEach(function(x,y) {
				var foundTile = self.getCellAt({x:x, y:y});
				if (!foundTile) {
					cells.push({x:x,y:y});
				}
			});

			return cells;
		};

		this.randomlyInsertNewTile = function() {
			var cell = this.randomAvailableCell(),
				tile = this.newTile(cell, 2);

			this.insertTile(tile);
		};

		// randomly grab a cell, notice random num times array length - clever
		this.randomAvailableCell = function() {
			var cells = this.availableCells();

			if ( cells.length > 0 ) {
				return cells[Math.floor(Math.random() * cells.length)];
			}
		};

		// check to see if there are any cells available
		this.anyCellsAvailable = function() {
			return this.availableCells().length > 0;
		};

		return this;
	};
});