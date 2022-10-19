const canvasHeight = 500;
const canvasWidth = 500;
let counter = 0;
let maxCounter = 21;

const timesFailed = window.localStorage.getItem('timesFailed');
const timesSucceeded = window.localStorage.getItem('timesSucceeded');
const countBushes = window.localStorage.getItem('countBushes');

let imgBushF1;
let imgBushF2;
let imgBushM1;
let imgBushM2;
let imgBushM3;
let imgBushM4;
let bushCrash;
let imgChickenLU;
let imgChickenRU;
let imgChickenLD;
let imgChickenRD;
let imgMomLU;
let imgMomRU;
let imgMomLD;
let imgMomRD;
let imgGrass;
let imgWorm;
let imgRainbow;
let soundBush;
let soundBump;
let soundWin;
let soundLose;
let music;

const bushes = [];
let chick;
let mom;
let state = 0;  //start:0,fail:4,success:5 //difficulties:1,2,3
let dragging = null;
let timer = 1;
let required = 5;
let numBumps;


// preload artwork
function preload() {
  imgBushF1 = loadImage("assets/bush1.png", updateCounter);
  imgBushF2 = loadImage("assets/bush2.png", updateCounter);
  imgBushM1  = loadImage("assets/bush3.png", updateCounter);
  imgBushM2 = loadImage("assets/bush4.png", updateCounter);
  imgBushM3 = loadImage("assets/bush5.png", updateCounter);
  imgBushM4 = loadImage("assets/bush6.png", updateCounter);
  imgChickLU = loadImage("assets/chickLU.png", updateCounter);
  imgChickRU = loadImage("assets/chickRU.png", updateCounter);
  imgChickLD = loadImage("assets/chickLD.png", updateCounter);
  imgChickRD = loadImage("assets/chickRD.png", updateCounter);
  imgMomLU  = loadImage("assets/momLU.png", updateCounter);
  imgMomRU  = loadImage("assets/momRU.png", updateCounter);
  imgMomLD  = loadImage("assets/momLD.png", updateCounter);
  imgMomRD  = loadImage("assets/momRD.png", updateCounter);
  imgGrass = loadImage("assets/grass.png", updateCounter);
  imgWorm = loadImage("assets/worms.png", updateCounter);
  imgRainbow = loadImage("assets/rainbow.png", updateCounter);
  soundBush = loadSound("assets/bush.wav", updateCounter);
  soundBump = loadSound("assets/bounce.wav", updateCounter);
  soundWin = loadSound("assets/win.wav", updateCounter);
  soundLose = loadSound("assets/lose.wav", updateCounter);
}

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.id('p5canvas');
  noStroke();
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  fill(0);
  image(imgGrass,0,0);
}


function draw() {
  //detect bump
  image(imgGrass,0,0);
  if (state == 0){
    textSize(50);
    fill(245, 245, 142);
    textStyle(BOLD);
    text("CATCH ME\r\nIF U CAN",250,100);
    textSize(30);
    text("Click to Start!",250,200);
    fill(235, 207, 52, 100);
    rect(32, 260, 135, 80);
    rect(182, 260, 135, 80);
    rect(332, 260, 135, 80);
    if (mouseY < 340 && mouseY > 260){
      fill(235, 207, 52, 200);
      if (mouseX >= 30 && mouseX <= 167){
        rect(32, 260, 135, 80);
      }
      else if (mouseX >= 181 && mouseX <= 316){
        rect(182, 260, 135, 80);
      }
      else if (mouseX >= 332 && mouseX <= 467){
        rect(332, 260, 135, 80);
      }
    }
    textSize(12);
    fill(0);
    textStyle(NORMAL);
    text("Simple Mode\r\n Escape for 30 seconds\r\n and bushes crash after\r\n 10 bumps by mom!",100,300);
    text("Medium Mode\r\n Escape for 60 seconds\r\n and bushes crash after\r\n 7 bumps by mom!",250,300);
    text("Hard Mode\r\n Escape for 90 seconds\r\n and bushes crash after\r\n 5 bumps by mom!",400,300);
  }
  else if (state < 4){
    //do everything here
    for (let i = 0; i < bushes.length; i++){
      if (bushes[i].bumpsLeft <= 0){
        bushes.splice(i,1);
      }
      else{
        bushes[i].display();
      }
    }
    chick.display();
    mom.display();

    chick.move();
    chick.detectBush(bushes);
    mom.moveToward(chick);
    mom.detectBush(bushes);
    fill(255);
    text(`Time elapsed: ${timer}s`,50,10);
    text(`Goal: ${required}s`,470,10);
  }
  else if (state == 5){
    textSize(50);
    fill(255, 255, 92);
    textStyle(BOLD);
    text("You escaped!!!",250,100);
    textSize(30);
    text("Enjoy your afternoon!",250,170);
    imgRainbow.resize(150,150);
    image(imgRainbow,250,300);
    //localStorage
    if (timesSucceeded){
      window.localStorage.setItem('timesSucceeded', parseInt(timesSucceeded)+1);
    }
    else {
      window.localStorage.setItem('timesSucceeded', 1);
    }
    if (countBushes){
      window.localStorage.setItem('countBushes', parseInt(countBushes) + bushes.length);
    }
    else {
      window.localStorage.setItem('countBushes', bushes.length);
    }
  }
  else if (state == 4){
    textSize(50);
    fill(0);
    textStyle(BOLD);
    text("You're caught QwQ",250,100);
    textSize(20);
    text("You spent your afternoon\r\neating disgusting worms",250,170);
    imgWorm.resize(150,150);
    image(imgWorm,250,300);
    //localStorage
    if (timesFailed){
      window.localStorage.setItem('timesFailed', parseInt(timesFailed)+1);
    }
    else {
      window.localStorage.setItem('timesFailed', 1);
    }
  }

}

function mousePressed(){
  //to start game
  if (state == 0){
    //choose difficulty
    if (mouseY < 340 && mouseY > 260){
      if (mouseX >= 30 && mouseX <= 167){
        state = 1;
        numBumps = 10;
        required = 30;
        //set up
        //create objects
        const movBushImg = shuffle([imgBushM1, imgBushM2, imgBushM3, imgBushM4]);
        //[xmin,xmax,ymin,ymax]
        const sections = [[50,220,50,220],[50,220,280,450],[280,450,50,220],[280,450,280,450]];

        bushes.push(new Bush(imgBushF1,random(50, 450),random(50, 220),120, 60,numBumps));
        bushes.push(new Bush(imgBushF2,random(50, 450),random(270, 450),120, 60,numBumps));

        for (let i = 0; i < movBushImg.length; i++){
          let section = sections[i];
          let nextX = random(section[0], section[1]);
          let nextY = random(section[2], section[3]);
          bushes.push(new Bush(movBushImg[i],nextX,nextY,120, 60,numBumps));
        }

        chick = new Chick(250,250,1);
        mom = new Mom(250,50,1,1,1);
        const timer = setInterval(countTime, 1000);
      }
      else if (mouseX >= 181 && mouseX <= 316){
        state = 2;
        numBumps = 7;
        required = 60;
        //set up
        //create objects
        const movBushImg = shuffle([imgBushM1, imgBushM2, imgBushM3, imgBushM4]);
        //[xmin,xmax,ymin,ymax]
        const sections = [[50,220,50,220],[50,220,280,450],[280,450,50,220],[280,450,280,450]];

        bushes.push(new Bush(imgBushF1,random(50, 450),random(50, 220),120, 60,numBumps));
        bushes.push(new Bush(imgBushF2,random(50, 450),random(270, 450),120, 60,numBumps));

        for (let i = 0; i < movBushImg.length; i++){
          let section = sections[i];
          let nextX = random(section[0], section[1]);
          let nextY = random(section[2], section[3]);
          bushes.push(new Bush(movBushImg[i],nextX,nextY,120, 60,numBumps));
        }

        chick = new Chick(250,250,1);
        mom = new Mom(250,50,1,1,1);
        const timer = setInterval(countTime, 1000);
      }
      else if (mouseX >= 332 && mouseX <= 467){
        state = 3;
        numBumps = 5;
        required = 90;
        //set up
        //create objects
        const movBushImg = shuffle([imgBushM1, imgBushM2, imgBushM3, imgBushM4]);
        //[xmin,xmax,ymin,ymax]
        const sections = [[50,220,50,220],[50,220,280,450],[280,450,50,220],[280,450,280,450]];

        bushes.push(new Bush(imgBushF1,random(50, 450),random(50, 220),120, 60,numBumps));
        bushes.push(new Bush(imgBushF2,random(50, 450),random(270, 450),120, 60,numBumps));

        for (let i = 0; i < movBushImg.length; i++){
          let section = sections[i];
          let nextX = random(section[0], section[1]);
          let nextY = random(section[2], section[3]);
          bushes.push(new Bush(movBushImg[i],nextX,nextY,120, 60,numBumps));
        }

        chick = new Chick(250,250,1);
        mom = new Mom(250,50,0,0,1);
        const timer = setInterval(countTime, 1000);
      }
    }

  }

  if (state == 1 || state == 2 || state == 3) {
    //to drag bushes
      for (let i = 2; i < bushes.length; i++){
        let bush = bushes[i];
        if ( mouseX > bush.borderLeft && mouseX < bush.borderRight && mouseY < bush.borderBottom && mouseY > bush.borderTop){
          dragging = i;
          break;
        }
      }

  }

}

function mouseDragged(){

    if (dragging != null){
      bushes[dragging].move(mouseX,mouseY);
    }
}

function mouseReleased(){
  dragging = null;
  soundBush.pause();
}


class Bush{

  constructor(picture,x,y,width,height,bumps){
    this.picture = picture;
    this.bumpsAllowed = bumps;
    this.bumpsLeft = bumps;
    this.x = x;
    this.y = y;
    this.picture.resize(width,height);
    this.width = width;
    this.height = height;
    this.borderTop = y - height/3;
    this.borderBottom = y + height/3;
    this.borderLeft = x - width/2;
    this.borderRight = x + width/2;
  }

  bumped(){
    this.bumpsLeft --;
    if (!soundBump.isPlaying()){
      soundBump.play();
    }
  }

  display(){
      tint(255, 255*(this.bumpsLeft/this.bumpsAllowed));
      image(this.picture, this.x, this.y);
      tint(255);
  }

  move(x,y){
      this.x = x;
      this.y = y;
      //update boundaries
      this.borderTop = y - this.height/3;
      this.borderBottom = y + this.height/3;
      this.borderLeft = x - this.width/2;
      this.borderRight = x + this.width/2;
      if (!soundBush.isPlaying()){
        soundBush.play();
      }
  }
}

class Chick{
  constructor(x,y,speed){
    this.picture = imgChickLD;
    this.x = x;
    this.y = y;
    this.picture.resize(50,50);
    this.radius = 25;
    this.speed = speed;
    this.direction = false;
  }
  display(){
    image(this.picture, this.x, this.y);
  }

  move(){
    //left
    if (keyIsDown(65) && this.x > 25) {
      this.x -= this.speed;
      if (this.picture == imgChickLD || this.picture == imgChickRD){
        this.picture = imgChickLD;
      }
      else{
        this.picture = imgChickLU;
      }
      this.picture.resize(50,50);
      this.direction = 'left';
    }
    //right
    if (keyIsDown(68) && this.x < 475) {
      this.x += this.speed;
      if (this.picture == imgChickRD || this.picture == imgChickLD){
        this.picture = imgChickRD;
      }
      else{
        this.picture = imgChickRU;
      }
      this.picture.resize(50,50);
      this.direction = 'right';
    }
    //up
    if (keyIsDown(87) && this.y > 25) {
      this.y -= this.speed;
      if (this.picture == imgChickRD || this.picture == imgChickRU){
        this.picture = imgChickRU;
      }
      else{
        this.picture = imgChickLU;
      }
      this.picture.resize(50,50);
      this.direction = 'up';
    }
    //down
    if (keyIsDown(83) && this.y < 475) {
      this.y += this.speed;
      if (this.picture == imgChickLD || this.picture == imgChickLU){
        this.picture = imgChickLD;
      }
      else{
        this.picture = imgChickRD;
      }
      this.picture.resize(50,50);
      this.direction = 'down';
    }
  }

  detectBush(bushes){
    for (let i = 0; i < bushes.length; i++){
      //collisions from top/bottom
      if (this.x > bushes[i].borderLeft && this.x < bushes[i].borderRight) {
        //collides bush top
        if (this.direction == 'down' && this.y < bushes[i].borderTop && this.y + this.radius > bushes[i].borderTop && this.y - this.radius < bushes[i].borderBottom){
          //send chick back to outside the bush
          this.y = bushes[i].borderTop - this.radius;
        }
        //collides bush bottom
        else if (this.direction == 'up' && this.y > bushes[i].borderBottom && this.y - this.radius < bushes[i].borderBottom && this.y + this.radius > bushes[i].borderTop){
          this.y = bushes[i].borderBottom + this.radius;
        }
      }
      //collisions from left/right
      else if (this.y > bushes[i].borderTop && this.y < bushes[i].borderBottom) {
        //collides bush left
        if (this.direction == 'right' && this.x + this.radius > bushes[i].borderLeft && this.x - this.radius < bushes[i].borderRight){
          //send chick back to outside the bush
          this.x = bushes[i].borderLeft - this.radius;
        }
        //collides bush right
        else if (this.direction == 'left' && this.x - this.radius < bushes[i].borderRight && this.x + this.radius > bushes[i].borderLeft){
          this.x = bushes[i].borderRight + this.radius;
        }
      }
    }
  }
}

class Mom{
  constructor(x,y,speedX,speedY,speedMax){
    this.picture = imgMomLD;
    this.x = x;
    this.y = y;
    this.picture.resize(80,80);
    this.radius = 40;
    this.speedX = speedX;
    this.speedY = speedY;
    this.acceleration = 0.05;
    this.speedMax = speedMax;
    this.directionX = false;
    this.directionY = false;
  }
  display(){
    image(this.picture, this.x, this.y);
  }
  moveToward(chick){
    if (this.speedX < this.speedMax){
      this.speedX += this.acceleration;
    }
    if (this.speedY < this.speedMax){
      this.speedY += this.acceleration;
    }
    if (chick.x > this.x){
      this.x += this.speedX;
      if (this.picture == imgMomRD || this.picture == imgMomLD){
        this.picture = imgMomRD;
      }
      else{
        this.picture = imgMomRU;
      }
      this.picture.resize(80,80);
      this.directionX = "right";
    }
    if (chick.x < this.x){
      this.x -= this.speedX;
      if (this.picture == imgMomLD || this.picture == imgMomRD){
        this.picture = imgMomLD;
      }
      else{
        this.picture = imgMomLU;
      }
      this.picture.resize(80,80);
      this.directionX = "left";
    }
    if (chick.y > this.y){
      this.y += this.speedY;
      if (this.picture == imgMomLD || this.picture == imgMomLU){
        this.picture = imgMomLD;
      }
      else{
        this.picture = imgMomRD;
      }
      this.picture.resize(80,80);
      this.directionY = "down";
    }
    if (chick.y < this.y){
      this.y -= this.speedY;
      if (this.picture == imgMomRD || this.picture == imgMomRU){
        this.picture = imgMomRU;
      }
      else{
        this.picture = imgMomLU;
      }
      this.picture.resize(80,80);
      this.directionY = "up";
    }
    if (dist(this.x,this.y,chick.x,chick.y) < this.radius+chick.radius){
      state = 4;
      soundLose.play();
    }
  }

  detectBush(bushes){
    for (let i = 0; i < bushes.length; i++){
      //collisions from top/bottom
      if (this.x > bushes[i].borderLeft && this.x < bushes[i].borderRight) {
        //collides bush top
        if (this.directionY == 'down' && this.y < bushes[i].borderTop && this.y + this.radius > bushes[i].borderTop && this.y - this.radius < bushes[i].borderBottom){
          //send chick back to outside the bush
          this.speedY = -2;
          bushes[i].bumped();
        }
        //collides bush bottom
        else if (this.directionY == 'up' && this.y > bushes[i].borderBottom && this.y - this.radius < bushes[i].borderBottom && this.y + this.radius > bushes[i].borderTop){
          this.speedY = -2;
          bushes[i].bumped();
        }
      }
      //collisions from left/right
      else if (this.y > bushes[i].borderTop && this.y < bushes[i].borderBottom) {
        //collides bush left
        if (this.directionX == 'right' && this.x + this.radius > bushes[i].borderLeft && this.x - this.radius < bushes[i].borderRight){
          this.speedX = -2;
          bushes[i].bumped();
        }
        //collides bush right
        else if (this.directionX == 'left' && this.x - this.radius < bushes[i].borderRight && this.x + this.radius > bushes[i].borderLeft){
          this.speedX = -2;
          bushes[i].bumped();
        }
      }
    }
  }
}

function cheat(mom){
  mom.speedX = -5;
  mom.speedY = -5;
}
function countTime(){
    timer ++;
    if (timer >= required){
      if (state < 4){
        soundWin.play();
      }
      state = 5;
    }
  }

// this function is called when a load request finishes
function updateCounter() {
  // increase our counter
  counter++;
  // use the counter to set the style on the '#progress_bar' div
  let progress_bar = document.querySelector('#progress_bar');
  progress_bar.style.width = int(counter/maxCounter*100) + "%";
}
