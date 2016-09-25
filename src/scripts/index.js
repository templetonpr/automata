import 'babel-polyfill';
import CellGrid from './CellGrid.js';

const seedInput = document.getElementById('seed');
const ruleInput = document.getElementById('ruleNum');
const cellSizeInput = document.getElementById('cellSize');
const canvasSizeInput = document.getElementById('canvasSize');
const canvas = document.getElementById('canvas');
const genButton = document.getElementById('generate');
const ctx = canvas.getContext("2d");

let options = {};

genButton.addEventListener('click', (e) => {

  // set up options object
  options.seedString = seedInput.value || "a";
  options.ruleNum = ruleInput.value || "90";
  options.cellSize = cellSizeInput.value || "2";
  options.canvasSize = canvasSizeInput.value || "500";
  options.canvasColors = {empty: "#eeeeee", filled: "green"};

  let grid = new CellGrid(options);
  grid.drawGrid(canvas, ctx);

  return false;
});
