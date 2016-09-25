class CellGrid {
  constructor(options) {
    this.options = options;
  }

  get cEmpty () {
    return this.options.canvasColors.empty;
  }

  get cFilled () {
    return this.options.canvasColors.filled;
  }

  get canvasSize () {
    return parseInt(this.options.canvasSize);
  }

  get cellSize () {
    return parseInt(this.options.cellSize);
  }

  get numCells () {
    return Math.floor(this.canvasSize / this.cellSize);
  }

  get ruleset () {
    // create a lookup table from the provided rule number
    // @TODO: Handle ruleNum > 256;

    const ruleNum = parseInt(this.options.ruleNum);

    // convert to base2 and split each digit
    const ruleset = ruleNum.toString(2).split("");

    // left pad to make sure it's the correct length
    while (ruleset.length < 8) {
      ruleset.unshift('0');
    }

    return {
      '111': (ruleset[0] == '1') ? true : false,
      '110': (ruleset[1] == '1') ? true : false,
      '101': (ruleset[2] == '1') ? true : false,
      '100': (ruleset[3] == '1') ? true : false,
      '011': (ruleset[4] == '1') ? true : false,
      '010': (ruleset[5] == '1') ? true : false,
      '001': (ruleset[6] == '1') ? true : false,
      '000': (ruleset[7] == '1') ? true : false,
    }
  }

  get firstRow () {
    // transform the provided seed string into a binary array to use as the first row
    // @TODO Redo this with an actual hash or something so it looks better
    //
    let seedString = this.options.seedString;

    // generate an array of boolean values from a string
    let boolArray = seedString
      .split("") // ----------------------- // split the string
      .map(x => x.charCodeAt(0)) // ------- // transform each char into it's charCode
      .reduce((a, b) => a + b) // --------- // sum the charCodes
      .toString(2) // --------------------- // convert to base2
      .split("") // ----------------------- // split the digits into an array
      .map(x => (x == "1") ? true : false); // transform the bin vals to booleans

    // left and right pad binArray to make it the correct length
    while (boolArray.length < this.numCells) {
      boolArray.push(false);
    }

    // if it's too big, make it smaller
    while (boolArray.length > this.numCells) {
        boolArray.pop();
    }

    return boolArray;
  }

  createGrid() {
    // generate grid array

    let ruleset = this.ruleset;
    let firstRow = this.firstRow;
    let grid = [];

    while (grid.length < firstRow.length) {
      // generate rows and push them to grid until length == width
      let prevState = (grid.length) ? grid[grid.length - 1] : firstRow;
      let nextState = this._createRow(prevState, ruleset);
      grid.push(nextState);
    }

    return grid;
  }

  drawGrid(canvas, ctx) {
    // display grid on canvas
    this.clearCanvas(canvas, ctx); // first, clear the canvas

    let grid = this.createGrid();

    // initialize a cursor at 0, 0
    let cursor = {
      x: 0,
      y: 0,
    };

    for (let i = 0; i < grid.length; i++) { // traverse rows
      for (let j = 0; j < grid[i].length; j++) { //traverse cols
        let shouldFill = grid[i][j];

        ctx.fillStyle = (shouldFill) ? this.cFilled : this.cEmpty;
        ctx.fillRect(cursor.x, cursor.y, this.cellSize, this.cellSize);
        cursor.x += this.cellSize;
      }
      cursor.x = 0;
      cursor.y += this.cellSize;
    }
  }

  clearCanvas(canvas, ctx) {
    ctx.fillStyle = this.canvasEmpty;
    canvas.height = this.canvasSize;
    canvas.width = this.canvasSize;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  _createRow (inputState, ruleset) {
    // called by createGrid to generate each new row from an input and ruleset

    return inputState.map((center, i, arr) => {
      let left = null;
      let right = null;

      // wrap arr around to handle first and last elements
      if (i == 0) { // first element
        left = arr[arr.length - 1];
        right = arr[i + 1];
      } else if (i == arr.length - 1) { // last element
        left = arr[i - 1];
        right = arr[0];
      } else { // not first or last
        left = arr[i - 1];
        right = arr[i + 1];
      }

      let rule = [
        (left) ? "1" : "0",
        (right) ? "1" : "0",
        (center) ? "1" : "0",
      ].join("");

      return ruleset[rule];
    });
  }
}

export default CellGrid;
