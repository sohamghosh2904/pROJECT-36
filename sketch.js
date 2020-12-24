var dogImg;
var happyDogImg;
var dog;
var database;
var foodS;
var foodStock;
var lastFed;
var fedTime;
var foodObj;
var feed;
var addFood;
var food1;
var foodCount;
var input;
var milk;
var milkImg;
var bedroomImg;
var washroomImg;
var gardenImg;
var readState;
var gameState;


function preload() {
  dogImg = loadImage('images/dogImg.png');
  happyDogImg = loadImage('images/dogImg1.png');
  milkImg = loadImage("Milk.png");
  bedroomImg=loadImage("virtualPetImages/Bed Room.png");
  washroomImg=loadImage("virtualPetImages/Wash Room.png");
  gardenImg=loadImage("virtualPetImages/Garden.png");
  sadDog=loadImage("virtualPetImages/Dog.png");

}

function setup() {
  database = firebase.database();
  canvas = createCanvas(800, 500);

  dog = createSprite(200, 400,150,150);
  dog.scale = 0.3;
  dog.addImage(dogImg);

  
  
  foodObj= new Food();
  
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed=data.val();
  })

  addFood = createButton("Add food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

 

  feed = createButton("Feed your Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  

  readState=database.ref('gameState');
  readState.on("value",function(data){
  gameState=data.val();
  })


}

function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
  update("Sleeping");

  foodObj.bedroom();

  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
  }else{

  update("Hungry")
  foodObj.display();

  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();

  }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);

  }

  

  drawSprites();
}


function readStock(data){

  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog() {
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
  Food:foodObj.getFoodStock(),
   FeedTime:hour(),
    gameState:"Hungry"

  })
 
}

function addFoods() {
 foodS++;
 database.ref('/').update({
  Food:foodS
 })
}

function update(state){
database.ref('/').update({
gameState:state
})
}