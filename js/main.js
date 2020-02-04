let Game;

// Function to Select Level
function selectLevel() {
    document.getElementById('start-game-area').classList.add("d-none");
    document.getElementById('gameSpace-container').classList.add("d-none");
    document.getElementById('game-modal').classList.add("d-none");
    document.getElementById('select-level-area').classList.remove("d-none");

}

// Function to Initialize a New Game
function newGame() {
    document.getElementById('select-level-area').classList.add("d-none");
    Game = new game(document.getElementById('select-level').value);
}


// Definition of Game Class
class game {

    constructor(level) {
        this.level = level; // Order of Grid
        this.clearSpace(); // clear the DOM for New Game
        this.createTiles(); // Generate the Tiles with correct position
        this.emptyTile = (this.level * this.level) - 1; // Index of last tile
        this.setEmptyTile(); // Setting last Tile as Empty
        this.setMoveAbleTiles(); // set moveable tiles
        this.randomizeTiles(); // shuffling of tiles randomly before user put his first move
    }


    // Function to clear the DOM for new game
    clearSpace() {
        document.getElementById('gameSpace').innerHTML = "";
        document.getElementById("gameSpace-container").classList.remove("d-none");
    }

    /*Function to Generate the Tiles for the first time,
    tiles will be in correct position.
    will be of order N x N
     */
    createTiles() {
        let tiles = `<div class="tiles-space">`;
        let tileNo = 0;
        for (let i = 0; i < this.level; i++) {
            let tilerow = `<div class="a-tile-row">`;
            for (let j = 0; j < this.level; j++) {
                let no = tileNo < this.level * this.level - 1 ? tileNo + 1 : '';
                tilerow = tilerow + `<div class="a-tile">
                                    <div class="a-tile-inner a-tile-in-correct-position " data-id="${no}" onclick="Game.move(${no},${tileNo},false)" id = "tile-${tileNo}">
                                    ${no}
                                    </div>
                                </div>`;
                tileNo++;
            }
            tilerow = tilerow + `</div>`;
            tiles = tiles + tilerow;
        }
        tiles = tiles + `</div>`;
        document.getElementById("gameSpace").innerHTML = tiles;
    }

    // Function to empty a Tile
    setEmptyTile() {
        document.getElementById(`tile-${this.emptyTile}`).classList.remove("a-tile-inner-notmoveable");
        document.getElementById(`tile-${this.emptyTile}`).classList.remove("a-tile-inner-moveable");
        document.getElementById(`tile-${this.emptyTile}`).classList.remove("a-tile-in-correct-position");
        document.getElementById(`tile-${this.emptyTile}`).innerHTML = "";
    }


    // Function to set tiles which are moveables to Empty Tile Space.
    setMoveAbleTiles() {

        // immediate upper Tile of empty tile is moveable
        this.setATileMoveable(this.emptyTile - this.level);

        // immediate lower Tile of empty tile is moveable
        this.setATileMoveable(this.emptyTile / 1 + this.level / 1);
        
        // If empty tile is rightmost tile
        if ((this.emptyTile + 1) % this.level == 0) {
            // only left tile of empty tile is moveable
            this.setATileMoveable(this.emptyTile - 1);
        } 
        // If empty tile is leftmost tile
        else if ((this.emptyTile) % this.level == 0) {
            // only right tile of empty tile is moveable
            this.setATileMoveable(this.emptyTile + 1);
        } 
        else {
            // otherwise both right and left tile of empty tile are moveable
            this.setATileMoveable(this.emptyTile + 1);
            this.setATileMoveable(this.emptyTile - 1);
        }
    }


    // Function to set hover color Blue to a moveable Tile.
    setATileMoveable(tileNo) {

        try {
            document.getElementById(`tile-${tileNo}`).classList.remove("a-tile-inner-notmoveable");
            document.getElementById(`tile-${tileNo}`).classList.add("a-tile-inner-moveable");
        } catch (er) {

        }

    }


    // Function to set all tiles to "not moveable", set hover color to "red"
    setAllNotMoveable() {
        let tiles = document.getElementsByClassName("a-tile-inner");
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].classList.remove("a-tile-inner-moveable");
            tiles[i].classList.add("a-tile-inner-notmoveable");
        }
    }


    // Function to move a Tile if it found moveable
    move(num, tileno, shufffling) {
        if (this.emptyTile - this.level == tileno ||
            this.emptyTile / 1 + this.level / 1 == tileno ||
            this.emptyTile + 1 == tileno && (this.emptyTile + 1) % this.level != 0 ||
            this.emptyTile - 1 == tileno && (this.emptyTile) % this.level != 0) {
            this.setAllNotMoveable();
            if (num == this.emptyTile + 1) {

                document.getElementById(`tile-${this.emptyTile}`).classList.add("a-tile-in-correct-position");
            }

            document.getElementById(`tile-${this.emptyTile}`).innerHTML = num;
            document.getElementById(`tile-${this.emptyTile}`).setAttribute("onclick", `Game.move(${num},${this.emptyTile},false)`);
            this.emptyTile = tileno;
            this.setEmptyTile();
            this.setMoveAbleTiles();

        }

        // Checks if Tiles are placed correctly
        if (this.checkAllTilesAreInCorrectPosition() && !shufffling) {
            document.getElementById('game-modal').classList.remove("d-none");
        }
    }

    

    /*Function to Shuffle Tiles to randomly set the empty tile,
    i.e shufffling the correctly position tiles by moving moveable tiles randomly*/
    randomizeTiles() {
        let n = this.level * this.level; // No. of time shuffling of tiles will occur is (Order of grid) x (Order of grid)
        while (n--) {
            let ch = Math.floor(Math.random() * 4) + 1;
            console.log(ch)
            switch (ch) {
                // move upper tile if possible
                case 1:
                    try {
                        this.move(document.getElementById(`tile-${this.emptyTile-this.level}`).innerText, this.emptyTile - this.level);
                    } catch (err) {

                    }

                    break;
                    // move lower tile if possible
                case 2:
                    try {
                        this.move(document.getElementById(`tile-${this.emptyTile/1+this.level/1}`).innerText, this.emptyTile / 1 + this.level / 1, true);
                    } catch (err) {

                    }

                    break;
                    // move right tile if possible
                case 3:
                    try {
                        this.move(document.getElementById(`tile-${this.emptyTile+1}`).innerText, this.emptyTile + 1, true);
                    } catch (err) {

                    }

                    break;
                    // move left tile if possible
                default:
                    try {
                        this.move(document.getElementById(`tile-${this.emptyTile-1}`).innerText, this.emptyTile - 1, true);
                    } catch (err) {

                    }

            }
        }
    }

  /*  Function to check if all tiles are placed correctly, 
    this function will get called on each shift of a tile.*/
    checkAllTilesAreInCorrectPosition() {
        let tiles = document.getElementsByClassName("a-tile-inner");
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].innerText != tiles[i].getAttribute('data-id')) {
                return false;
            }

        }
        return true;
    }

    

    
}