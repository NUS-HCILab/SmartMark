import {getHtmlMenu, getHtmlNoviceMessage} from './javascripts/Utils/changeToHtml.js'
import {pushTextToBlade} from './javascripts/Drivers/VuzixBladeDriver.js'

function degToRad(degrees) {
    var result = Math.PI / 180 * degrees;
    return result;
}


var canvas = document.querySelector('canvas');
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
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
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


function showMenu(str){
  str = str + "markingmenu";
  var mm = document.getElementById(str);
  mm.classList.add('shown');
} 

function setNoviceMode(){
    isNovice = true;
    showMenu(currentMenu);
    pushNoviceMenu(currentMenu);
    console.log("setNoviceMode");
}

function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      console.log('The pointer lock status is now locked');
      Tracktimer.start({ precision: 'secondTenths' , countdown: true, startValues: { secondTenths: 1 }})
      document.addEventListener("mousemove", updatePosition, false);
      document.addEventListener("click", setNoviceMode, false);
    } else {
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", updatePosition, false);
      document.removeEventListener("click", setNoviceMode, false);
    }
}

let THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION = 100;

let positionXArray = [];
let positionYArray = [];
let rawPosX = x;
let columnPosY = y;
let currentLayer = 0;
let currentMenu = "";//Sub1,Sub2,Sub3,Sub4
let isNovice = false; 
const totalLayer = 1;

var animation;

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


function updatePosition(e) {
  
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


var classify = document.getElementById('classify');
var toast = document.getElementById('toast');

const classifyPointerMovement = () => {
    let deltaXMovement = positionXArray[positionXArray.length - 1] - positionXArray[0]
    let deltaYMovement = positionYArray[positionYArray.length - 1] - positionYArray[0]
    console.log('deltaXMovement', deltaXMovement)
    console.log('deltaYMovement', deltaYMovement)

    var message = "";  //store current movement, can show current choice corresponding with currentMenu
    if( deltaXMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION && deltaYMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION){
      message = message + "RightDown";
      console.log(message);
    }
    else if( deltaXMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION && deltaYMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION){

      message = message + "RightUp";
      console.log(message);
    }
    else if( deltaXMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION && deltaYMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION){

      message = message + "LeftDown";
      console.log(message);
    }
    else if( deltaXMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION && deltaYMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION){

      message = message + "LeftUp";
      console.log(message);
    }
    else if ( deltaXMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION ) {
        message = message + "Right";
        console.log(message);
    }
    else if ( deltaXMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION ) {
        message = message + "Left";
        console.log(message);
    }
    else if ( deltaYMovement > THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION ) {
      message = message + "Down";
      console.log(message);
    }
    else if ( deltaYMovement < -THRESHOLD_FOR_POINTER_MOVEMENT_CLASSIFICATION ) {
      message = message + "Up";
      console.log(message);
    }
    else{
      if(deltaXMovement > 1 && deltaYMovement > 1){//if there's a click, don't display "invalid"
        console.log("Invalid");
        toast.innerHTML = "Invalid";
        var timeoutId = null;
        toast.classList.add('shown');
        timeoutId = setTimeout(function() {
          toast.classList.remove('shown');
        }, 1000);
      }
      return;
  }
    console.log("Message: "+message);
    const getItemDom = itemId =>
    document.querySelector(`.marking-menu-item[data-item-id="${itemId}"]`);
    if(document.querySelector(`.marking-menu-item[data-item-id="${currentMenu + message}"]`)){
      var timeoutId = null;
      console.log(isNovice);
      if(isNovice == true){
        getItemDom(currentMenu + message).classList.add('active');
        pushNoviceMessage(currentMenu , message);
        console.log("push" + message);
        timeoutId = setTimeout(function() {
          var mm = document.getElementById(currentMenu + "markingmenu");
          mm.classList.remove('shown');
          getItemDom(currentMenu + message).classList.remove('active');
          currentLayer ++; //add layer 
          if(currentLayer > totalLayer){
            currentLayer = 0;
            currentMenu = "";
            isNovice = false;
            pushEmpty();
          }
          else{
            setCurrentMenu(message);
            if(isNovice == true) {
              showMenu(currentMenu);
              pushNoviceMenu(currentMenu);
            }
          }
        }, 400);
      }
      else{
        toast.innerHTML = currentMenu + message;
        toast.classList.add('shown');
        timeoutId = setTimeout(function() {
          toast.classList.remove('shown');
          pushEmpty();
        }, 1000);
        pushExpertMessage(currentMenu+message);
        currentLayer ++; //add layer 
          if(currentLayer > totalLayer){
            currentLayer = 0;
            currentMenu = "";
            isNovice = false;
          }
          else{
            setCurrentMenu(message);
            if(isNovice == true){
              showMenu(currentMenu);
              pushNoviceMenu(currentMenu);
            } 
          }
      }
    } 
    else {
      toast.innerHTML = message + "Invalid";
      var timeoutId = null;
      toast.classList.add('shown');
      pushTextToBlade(message + "Invalid");
      timeoutId = setTimeout(function() {
        toast.classList.remove('shown');
      }, 1000);
      message = "";
    }
    
}

function setCurrentMenu(message){
  if(message == "Right") currentMenu = currentMenu + "Sub1";
  else if(message == "Down") currentMenu = currentMenu + "Sub2";
  else if(message == "Left") currentMenu = currentMenu + "Sub3";
  else if(message == "Up") currentMenu = currentMenu + "Sub4";//leave a problem of options more than four
}

function pushExpertMessage(text){
  pushTextToBlade(text);
}

function pushNoviceMessage(menu , text){
  pushTextToBlade(getHtmlNoviceMessage(menu , text));
}

function pushNoviceMenu(menu){
  pushTextToBlade(getHtmlMenu(menu));
}

function pushEmpty(){
  pushTextToBlade();
}