// global vars 
var n, s, r, pos = new Array();

function init() {
  var sb, nsb, ns, ss;
  
  sb = document.querySelector('#sol-btn');
  nsb = document.querySelector('#next-sol-btn');
  ns = document.querySelector('#num_sq');
  ss = document.querySelector('#size_sq');
  
  sb.addEventListener('click', generateChessBoard);
  nsb.addEventListener('mousedown', solve);
  ns.addEventListener('input', calculateBoardSize);
  ns.value = '4';
  calculateBoardSize();
  sb.style.borderRadius = sb.offsetHeight/2 + "px";
  nsb.style.borderRadius = nsb.offsetHeight/2 + "px";
  
  if(window.innerHeight>window.innerWidth) {
    sb.style.width = nsb.style.width = ns.style.width = ss.style.width = '20%';
    sb.style.margin = nsb.style.margin = ns.style.margin = ss.style.margin = '0.5%';
    nsb.innerHTML = 'Next<i class="fas fa-step-forward"></i>';
  }
  
  return;
}


function calculateBoardSize() {
  
  var num, size;
  num = parseInt(document.querySelector('#num_sq').value);
  
  if(window.innerHeight<window.innerWidth){
      size = Math.round(window.innerHeight / num * 0.7);
    } else {
      size = Math.round(window.innerWidth / num * 0.85);
    }
    document.querySelector('#size_sq').value = size;
  
  return size;
  
}

function generateChessBoard() {
  
  n = parseInt(document.querySelector('#num_sq').value);
  s = parseInt(document.querySelector('#size_sq').value);
  
  if(!n || n<4)
  {
    alert("Number of queens should be at least 4.");
    document.querySelector('#num_sq').focus();
    return;
  }
  
  if(!s || isNaN(s)) {
    s = calculateBoardSize();
  }
  
  r = document.querySelector('#sol-num');
  r.textContent = '0';
  var d = document.querySelector('#chessboard');
  d.innerHTML = '<svg id="cnvs" width="' + n*s + '" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>';
  var c = document.querySelector('#cnvs');
  var clrs = ['#FFFFFF', '#000000'];
  
  d.style.border = '5px solid black';
  d.style.height = n*s + "px";
  d.style.width = n*s + "px";
  
  // draw squares
  for(var i=0; i<n; i++){
    for(var j=0; j<n*s; j+=2*s){
      c.innerHTML += '<rect x="' + j + '" y="' + i*s + '" width="' + s + '" height="' + s + '" fill="' + clrs[i%2] + '" />';
      c.innerHTML += '<rect x="' + (j+s) + '" y="' + i*s + '" width="' + s + '" height="' + s + '" fill="' + clrs[1-i%2] + '" />';
    }
  }
  
  // add Queens
  for(var i=0; i<n; i++){
    d.insertAdjacentHTML('beforeend', '<img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg" height="' + s + '" id="q' + i + '" style="left: 0px; top: ' + i*s + 'px;"/>');
  }
  
  // initialize positions array
  // pos = pos.fill(0, 0, n);
  for(var i=0; i<n-1; i++){
    pos[i] = 0;
  }
  // required to find 'next solution'
  pos[n-1] = -1;
  
  // find a solution
  solve();

}

function solve(){
  
  // display loading spinner
  // startLoad();
  
  // required to find the next solution
  pos[n-1]++;
  
  // calculate the solution and store in the array
  for(var i=0; i<n; i++){
    
    // find safe position in the current row, then move to next row
    for(var j=pos[i]; j<n; j++){
      if(isSafe(i, j)) {
        pos[i] = j;
        break;
      }
    }
    
    // if entire row was unsafe, reset current row's pos to zero, continue with the next position of previous row
    if(j===n) {
      if(i==0){
        // reset the solution counter to zero
        r.textContent = '0';
      }
      pos[i] = 0;
      if(i>0){
        pos[i-1]++;
        i--;
      }
      i--;
    }
    
  }
  
  // reposition the queens
  for(var i=0; i<n; i++){
    document.querySelector('#q' + i).style.left = pos[i]*s + 'px';
  }
  
  // update the solution counter
  r.textContent = (r.textContent-0+1).toString(10);
  
  // hide the loading spinner
  // stopLoad();
  
}

function isSafe(i, j){
  
  // any cell of the first row will always be safe
  if(i===0) return true;
  
  for(var k=i-1; k>=0; k--){
    if(pos[k]===j || Math.abs(pos[k]-j)===i-k) return false;
  }
  
  return true;
}

init();
