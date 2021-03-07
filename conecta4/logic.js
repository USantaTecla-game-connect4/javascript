function Connect4() {
    this.board = new Board();
    this.players = [];
    for(let disk of ["x", "*"]) {
      this.players.push(new Player(disk));
    }
    this.turn = Math.round(Math.random());
    this.tie = false;
    this.victory = false;

    this.play = function() {
      this.board.print();
      do {
        this.players[this.turn].putDisk(this.board);
        this.victory = this.board.isConnect4(this.players[this.turn].disk);
        this.tie = this.board.isFull();
        if(!this.victory || !this.tie) {
          this.changeTurn();
        }
      } while(!this.victory || !this.tie);
      if(this.victory) {
        alert("¡Ha ganado el jugador " + this.players[this.turn].disk + "!");
      } else if(this.tie) {
        alert("Ha habido un empate.");
      }
      alert("Fin del juego.");
    }

    this.changeTurn = function() {
      this.turn = (this.turn + 1) % 2;
    }
  }

  function Board() {
    this.EMPTY = "o";
    this.LIMITS = Coordinate.LIMITS;

    this.board = [];
    for(let i = this.LIMITS[0].row; i < this.LIMITS[1].row; i++) {
      this.board[i] = [];
      for(let j = this.LIMITS[0].col; j < this.LIMITS[1].col; j++) {
        this.board[i].push(this.EMPTY);
      }
    }

    this.columnHeight = [];
    for(let i = this.LIMITS[0].col; i < this.LIMITS[1].col; i++) {
      this.columnHeight.push(this.LIMITS[1].row - 1);
    }

    this.DIRECTIONS = [
      new Coordinate(1,0),
      new Coordinate(0,1),
      new Coordinate(1,1),
      new Coordinate(1,-1)
    ];

    this.isConnect4 = function(disk) {
      for (let i = 0; i < this.ROWS; i++) {
        for (let j = 0; j < this.COLS; j++) {
          let coordinate = new Coordinate(i, j);
          if (this.getDisk(coordinate) == disk) {
            return this.checkInAllDirections(coordinate);
          }
        }
      }
      return false;
    }

    this.checkInAllDirections = function(coordinate) {
      for(let i = 0; i < this.DIRECTIONS.length; i++) {
        let coordinates = coordinate.getConsecutiveCoordinates(this.DIRECTIONS[i]);
        if(coordinates.length == Coordinate.CONSECUTIVE_DISKS) {
          return this.areDisksEqual(coordinates);
        }
      }
      return false;
    }

    this.areDisksEqual = function(coordinates) {
      let counter = 1;
      for(let i = 1; i < coordinates.length; i++) {
        if(this.getDisk(coordinates[0]) == this.getDisk(coordinates[i])) {
          counter++;
        }
      }
      return counter == Coordinate.CONSECUTIVE_DISKS;
    }

    this.getDisk = function(coordinate) {
      return this.board[coordinate.row][coordinate.col];
    }

    this.setDisk = function(coordinate, disk) {
      this.board[coordinate.row][coordinate.col] = disk;
      this.columnHeight[coordinate.col]--;
    }

    this.isFull = function() {
      for(let i = 0; i < this.columnHeight.length; i++) {
        if(this.columnHeight[i] != 0) {
          return false;
        }
      }
      return true;
    }

    this.print = function() {
      let board = "";
      for(let i = 0; i < this.board.length; i++) {
        for(let j = 0; j < this.board[i].length; j++) {
          board += this.board[i][j];
        }
        board += "\n";
      }
      console.log(board);
    }
  }

  function Player(disk) {
    this.disk = disk;

    this.putDisk = function(board) {
      let error = true;
      let choice;
      let coordinate;
      alert("Es el turno de " + disk + ":");
      do {
        choice = parseInt(prompt("Indica el número de columna donde quieres introducir el disco (1/" + board.LIMITS[1].col +"):")) - 1;
        coordinate = new Coordinate(board.columnHeight[choice],choice);
        error = !coordinate.isInside(board);
        if(error) {
          alert("Movimiento no permitido.");
        }
      } while(error);
      board.setDisk(coordinate, this.disk);
      board.print();
    }
  }

  function Coordinate(row, col) {
    this.row = row;
    this.col = col;
    this.BOARD_ROWS = 6;
    this.BOARD_COLS = 7;
    this.LIMITS = [
      new Coordinate(0,0),
      new Coordinate(this.BOARD_ROWS, this.BOARD_COLS)
    ];
    this.CONSECUTIVE_DISKS = 4;

    this.getConsecutiveCoordinates = function(direction) {
      let coordinates = [];
      let consecutive = this;
      let lastCoordinate = this;
      while(consecutive.isInsideLimits() && coordinates.length < this.CONSECUTIVE_DISKS) {
        consecutive = lastCoordinate.cloneWithOffset(direction);
        coordinates.push(consecutive);
        lastCoordinate = consecutive;
      }
      return coordinates;
    }

    this.isInsideLimits = function() {
      return this.col >= this.LIMITS[0].col &&
        this.col <= this.LIMITS[1].col &&
        this.row >= this.LIMITS[0].row &&
        this.row <= this.LIMITS[1].row;
    }

    this.cloneWithOffset = function(coordinate) {
      return new Coordinate(this.row + coordinate.row, this.col + coordinate.col);
    }
  }

  (function() {
    new Connect4().play();
  }());
  