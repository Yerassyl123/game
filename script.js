function generateSudoku() {
    const grid = new Array(9).fill().map(() => new Array(9).fill(0));
  
    solveSudoku(grid, 0, 0);
  
    const sudokuStr = grid.flat().join('');
  
    return sudokuStr;
  }
  
  function solveSudoku(grid, row, col) {
    if (row === 9) {
      return true;
    }
  
    const [nextRow, nextCol] = col < 8 ? [row, col + 1] : [row + 1, 0];
  
    const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const value of values) {
      if (isValid(grid, row, col, value)) {
        grid[row][col] = value;
        if (solveSudoku(grid, nextRow, nextCol)) {
          return true;
        }
        grid[row][col] = 0;
      }
    }
    if (grid[row][col] !== 0) {
      return solveSudoku(grid, nextRow, nextCol);
    }
  
    
  
    return false;
  }
  
  function isValid(grid, row, col, value) {
    if (grid[row].includes(value) || grid.some(rowValues => rowValues[col] === value)) {
      return false;
    }
  
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === value) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  
  function hideRandomDigits(inputString, numToHide) {
    const digitPositions = [];
    for (let i = 0; i < inputString.length; i++) {
      if (/\d/.test(inputString[i])) {
        digitPositions.push(i);
      }
    }
  
    const digitsToHide = [];
    for (let i = 0; i < Math.min(numToHide, digitPositions.length); i++) {
      const randomIndex = Math.floor(Math.random() * digitPositions.length);
      digitsToHide.push(digitPositions.splice(randomIndex, 1)[0]);
    }
  
    let outputString = '';
    for (let i = 0; i < inputString.length; i++) {
      if (digitsToHide.includes(i)) {
        outputString += '-';
      } else {
        outputString += inputString[i];
      }
    }
  
    return outputString;
  }
  
  const EASY_LABEL = '30';
  const MEDIUM_LABEL = '40';
  const HARD_LABEL = '50';
  
  const GENERATED_SODOKU = generateSudoku();
  const easyProbSol = {
    solution: GENERATED_SODOKU,
    problem: hideRandomDigits(GENERATED_SODOKU, EASY_LABEL)
  };
  
  const mediumProbSol = {
    solution: GENERATED_SODOKU,
    problem: hideRandomDigits(GENERATED_SODOKU, MEDIUM_LABEL)
  };
  
  const hardProbSol = {
    solution: GENERATED_SODOKU,
    problem: hideRandomDigits(GENERATED_SODOKU, HARD_LABEL)
  };
  
  const easy = [
    easyProbSol.problem,
    easyProbSol.solution
  ];
  const medium = [
    mediumProbSol.problem,
    mediumProbSol.solution
  ];
  const hard = [
    hardProbSol.problem,
    hardProbSol.solution
  ];
  
  var timer;
  var timeRemaining;
  var lives;
  var selectedTile;
  var disableSelect;
  var selectedNum;
  
  window.onload = function () {
    id("start-btn").addEventListener("click", startGame);
  
    for(let i=0;i<id("number-container").children.length;i++){
      id("number-container").children[i].addEventListener("click",function(){
        if(!disableSelect) {
          if(this.classList.contains("selected")){
            this.classList.remove("selected");
            selectedNum=null;
          }
          else{
            for(let i=0;i<9;i++){
              id("number-container").children[i].classList.remove("selected");
            }
            this.classList.add("selected");
            selectedNum=this;
            updateMove();
          }
        }
      });
    }
  };
  
  function startGame() {
    let board;
    if (id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];
  
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Оставшиеся Жизни: 3";
  
    generateBoard(board);
  
    startTimer();
  
    if (id("theme-1").checked) {
      qs("body").classList.remove("dark");
    } else {
      qs("body").classList.add("dark");
    }
  
    id("number-container").classList.remove("hidden");
  }
  function generateBoard(board) {
    clearPrevious();
  
    let idCount = 0;
  
    for (let i = 0; i < 81; i++) {
      let tile = document.createElement("p");
      if (board.charAt(i) != "-") {
        tile.textContent = board.charAt(i);
      } else {
        tile.addEventListener("click",function(){
          if(!disableSelect){
            if(tile.classList.contains("selected")){
              tile.classList.remove("selected");
              selectedTile=null;
            }
            else{
              for(let i=0;i<81;i++){
                qsa(".tile")[i].classList.remove("selected");
              }
              tile.classList.add("selected");
              selectedTile=tile;
              updateMove();
            }
          }
        });
      }
      tile.id = idCount;
      idCount++;
      tile.classList.add("tile");
      if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
        tile.classList.add("bottomBorder");
      }
      if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
        tile.classList.add("rightBorder");
      }
      id("board").appendChild(tile);
    }
  }
  
  function updateMove(){
    if(selectedTile && selectedNum){
      selectedTile.textContent=selectedNum.textContent;
      if(checkCorrect(selectedTile)){
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        selectedNum=null;
        selectedTile=null;  
        if(checkDone()) endGame();
      }
      else{
        disableSelect=true;
        selectedTile.classList.add("incorrect");
        setTimeout(function(){
          lives--;
          if(lives===0) endGame();
          else{
            id("lives").textContent="Оставшиеся Жизни: "+lives;
            disableSelect=false;
          }
          selectedTile.classList.remove("incorrect");
          selectedTile.classList.remove("selected");
          selectedNum.classList.remove("selected");
          selectedTile.textContent="";
          selectedTile=null;
          selectedNum=null;
      },1000)
      }
    }
  }
  
  function endGame(){
    disableSelect=true;
    clearTimeout(timer);
    if(lives===0 || timeRemaining===0){
      id("lives").textContent="Ты проиграл!!";
    }
    else{
      id("lives").textContent="Ты победил!!";
    }
  }
  
  function checkDone(){
    let tiles=qsa(".tile");
    for(let i=0;i<81;i++){
      if(tiles[i].textContent==="") return false;
    }
    return true;
  }
  
  function checkCorrect(tile){
    let sol;
    if (id("diff-1").checked) sol = easy[1];
    else if (id("diff-2").checked) sol = medium[1];
    else sol = hard[1];
    if(sol.charAt(tile.id)===tile.textContent) return true;
    else return false;
  }
  
  function clearPrevious() {
    let tiles = qsa(".tile");
  
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].remove();
    }
    if (timer) clearTimeout(timer);
  
    for (let i = 0; i < id("number-container").children.length; i++) {
      id("number-container").children[i].classList.remove("selected");
    }
  
    selectedTile = null;
    selectedNum = null;
  }
  
  function startTimer() {
    if (id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
  
    id("timer").textContent = timeConversion(timeRemaining);
  
    timer = setInterval(function () {
      timeRemaining--;
  
      if (timeRemaining === 0) endGame(); 
      id("timer").textContent= timeConversion(timeRemaining);
    }, 1000);
  }
  
  function timeConversion(time) {
    let min = Math.floor(time / 60);
    if (min < 10) min = "0" + min;
    let sec = time % 60;
    if (sec < 10) sec = "0" + sec;
    return min + ":" + sec;
  }
  
  function qs(selector) {
    return document.querySelector(selector);
  }
  
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
  
  function id(id) {
    return document.getElementById(id);
  }
  