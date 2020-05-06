//import items from '../layout/script.js'
//import createMenu from '../layout/menu.js'
//import createModel, { MMItem } from './Model.js';
import template from '../layout/menu.pug'
import {pushTextToBlade} from '../Drivers/VuzixBladeDriver'

function degToRad(degrees) {
    var result = Math.PI / 180 * degrees;
    return result;
}

// setup of the canvas

var canvas = document.querySelector('canvas');
// console.log('canvas', canvas)
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height / 2;
let Tracktimer = new Timer();

const RADIUS = x / 10;
const maxLayer = 2;

/**
 * @param  {string} str - A valid html fragment that could be contained in a
 *                      <div>.
 * @param  {Document} [doc=document] - The document to use.
 * @return {HTMLCollection} - The html fragment parsed as an HTML collection.
 *
 * Warning: any content that cannot be directly contained in a div, e.g. <td />
 * will fail.
 */
const strToHTML = (str, doc = document) => {
  const div = doc.createElement('div');
  div.innerHTML = str;
  return div.children;
};


function canvasDraw() {
    // ctx.fillStyle = "rgba(102, 204, 255, 0.1)";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "rgba(204, 204, 255, 0.1)";
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
    // ctx.fill();
}
canvasDraw();

canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock;

canvas.onclick = function () {
    canvas.requestPointerLock();
};

// pointer lock event listener

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
document.addEventListener('click', showMenu , false);

function showMenu(){
  const children = [
    new MMItem('sub1', 'child1', 180),
    new MMItem('sub2', 'child2', 90),
    new MMItem('sub2', 'child2', 100) // This should not be allowed
  ];
  const mi = new MMItem('a', 'name', 10, { children });
   // Create the DOM.
  const main = strToHTML(template({ items: mi, center:[10,20] }), document)[0];
  //parent.appendChild(main);

  // Clear any  active items.
  const clearActiveItems = () => {
    Array.from(main.querySelectorAll('.active')).forEach(itemDom =>
      itemDom.classList.remove('active')
    );
  };

  // Return an item DOM element from its id.
  const getItemDom = itemId =>
    main.querySelector(`.marking-menu-item[data-item-id="${itemId}"]`);

  clearActiveItems();

  // Set the active class.
  if (itemId || itemId === 0) {
    getItemDom(itemId).classList.add('active');
  }

  // Function to remove the menu.
  const remove = () => parent.removeChild(main);
  
} 

function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      console.log('The pointer lock status is now locked');
      Tracktimer.start({ precision: 'secondTenths' , countdown: true, startValues: { secondTenths: 1 }})
      document.addEventListener("mousemove", updatePosition, false);
      document.addEventListener("click", displayMenu, false);
      //console.log('timer start');
      //document.addEventListener("mousemove", updatePointerPosition, false);
    } else {
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", updatePosition, false);
    }
}

var tracker = document.getElementById('tracker');

let isPointerMode = true;
let THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION = 100;

let positionXArray = [];
let positionYArray = [];
let menu = []; // marking menu
let rawPosX = x;
let columnPosY = y;
let isSub = true;
let currentLayer = 0;

let COMBINE_EVENTS_TIME_WINDOW = 1;   // 100ms

var animation;

/*Tracktimer.addEventListener('secondTenthsUpdated',function (e){

});*/
Tracktimer.addEventListener('targetAchieved', function (e){
  Tracktimer.stop();
  console.log('target achieve');
  console.log('positionX array', positionXArray);
  console.log('positionY array', positionYArray);
  classifyPointerMovement();
  if(currentLayer > maxLayer-1){
    console.log(menu);
    classify.textContent = menu;
    currentLayer = 0;
    menu = [];
  }
  positionXArray = [];
  positionYArray = [];
  rawPosX = x;
  columnPosY = y;
})

// function displayMenu(e){

// }

function updatePosition(e) {
  /*if (!isPointerMode) {
    isPointerMode = true;
    toggleControllerMode();
    console.log('####### Switched to Pointer Mode #######')
}*/
  x += e.movementX;
  y += e.movementY;
  if (x > canvas.width + RADIUS) {
    x = -RADIUS;
  }
  if (y > canvas.height + RADIUS) {
    y = -RADIUS;
  }  
  if (x < -RADIUS) {
    x = canvas.width + RADIUS;
  }
  if (y < -RADIUS) {
    y = canvas.height + RADIUS;
  }
  tracker.textContent = "X position: " + x + ", Y position: " + y;
  Tracktimer.reset();
  console.log("reset");
  rawPosX += e.movementX;
  columnPosY += e.movementY;
  positionXArray.push(rawPosX)
  positionYArray.push(columnPosY)

  if (!animation) {
    animation = requestAnimationFrame(function() {
      animation = null;
      canvasDraw();
    });
  }
}

/*function canvasDraw() {
    //ctx.fillStyle = "black";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
    //ctx.fill();
  }*/

var classify = document.getElementById('classify');
var toast = document.getElementById('toast');

const classifyPointerMovement = () => {
    let deltaXMovement = positionXArray[positionXArray.length - 1] - positionXArray[0]
    let deltaYMovement = positionYArray[positionYArray.length - 1] - positionYArray[0]
    console.log('deltaXMovement', deltaXMovement)
    console.log('deltaYMovement', deltaYMovement)
    //console.log('positionX array', positionXArray)
    //console.log('positionY array', positionYArray)

    var message = "";
    if(currentLayer > 0) message = "sub ";
    if( deltaXMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION && deltaYMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION){
      //classify.textContent = "RightDown";
      message = message + "RightDown";
      menu.push(message);
      console.log(message);
      toast.innerHTML = message;
    }
    else if( deltaXMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION && deltaYMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION){
      //classify.textContent = "RightUp";
      message = message + "RightUp";
      menu.push(message);
      console.log(message);
      toast.innerHTML = message;
    }
    else if( deltaXMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION && deltaYMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION){
      //classify.textContent = "LeftDown";
      message = message + "LeftDown";
      menu.push(message);
      console.log(message);
      toast.innerHTML = message;
    }
    else if( deltaXMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION && deltaYMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION){
      //classify.textContent = "LeftUp";
      message = message + "LeftUp";
      menu.push(message);
      console.log(message);
      toast.innerHTML = message;
    }
    else if ( deltaXMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION ) {
        //console.log('RIGHT', deltaMovement)
        //classify.textContent = "Right";
        message = message + "Right";
        menu.push(message);
        //handleControllerEvent(classifyControllerEvent('TRACK_RIGHT'));
        console.log(message);
        toast.innerHTML = message;
    }
    else if ( deltaXMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION ) {
        //console.log('LEFT', deltaMovement)
        //classify.textContent = "Left";
        message = message + "Left";
        menu.push(message);
        //handleControllerEvent(classifyControllerEvent('TRACK_LEFT'));
        console.log(message);
        toast.innerHTML = message;
    }
    else if ( deltaYMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION ) {
      //classify.textContent = "Down";
      message = message + "Down";
      menu.push(message);
      console.log(message);
      toast.innerHTML = message;
    }
    else if ( deltaYMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION ) {
      //classify.textContent = "Up";
      message = message + "Up";
      menu.push(message);
      console.log(message);
      toast.innerHTML = message;
    }
    else{
      console.log("Invalid");
      toast.innerHTML = "Invalid";
      var timeoutId = null;
      toast.classList.add('shown');
      timeoutId = setTimeout(function() {
        toast.classList.remove('shown');
      }, 1000);
      isSub = false;
      currentLayer = 0; //return to init state
      menu = [];
      return;
    }
    var timeoutId = null;
    toast.classList.add('shown');
    timeoutId = setTimeout(function() {
      toast.classList.remove('shown');
    }, 1000);
    currentLayer ++; //add layer 
}


