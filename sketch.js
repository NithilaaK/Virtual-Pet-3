var dog, dogImg1, dogImg2, database, foodS, foodStoc;
var fedTime, lastFed, currentTime;
var form, food;
var dogName, dogNameRef;
var gameState, gameStateRef;

function preload() {
  dogImg1 = loadImage("images/dogImg.png");
  dogImg2 = loadImage("images/dogImg1.png");
  sadDogImg = loadImage("images/SadDog.png");
  bedRoomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
  database = firebase.database();

  createCanvas(1175, 505);

  ground = createSprite(displayWidth / 2, 460, 1300, 200);
  ground.shapeColor = color(255,165,79);  
  
  dog = createSprite(1050, 250, 100, 100);
  dog.addImage(dogImg1);
  dog.scale = 0.5;

  currentTime = hour();

  foodStock = database.ref("food");
  foodStock.on("value", function(data){
    foodS = data.val();
  });

  dogName = database.ref('dogName');
  dogName.on("value", function(data){
    dogNameRef = data.val();
  })

  gameState = database.ref('gameState');
  gameState.on("value", function(data){
    gameStateRef = data.val();
  })

  food = new Food();
  food.getFoodStock();

  form = new Form();
}

function draw() {  
  if (gameStateRef === "nameDog") {
    form.display();
    database.ref('/').update({
      'food': 0
    });
  } else if (gameStateRef === "hungry") {
    form.hide();

    showButtons();

    background(46, 139, 87);

    drawSprites();

    if (this.foodStock !== 0) {
      for (var i = 0; i < foodS; i++) {
        if (i % 10 === 0) {
          food.display(); 
        }
      }
    }

    fedTime = database.ref("feedTime");
    fedTime.on("value", function(data){
      lastFed = data.val();
    })

    textSize(30);
    fill("white");
    text('Press the buttons to make food and feed it to ' + dogNameRef + ' the dog!', 6, 30);


    textSize(40);
    fill(255, 255, 254);
    if (lastFed >= 12) {
      text('Last Fed: ' + lastFed % 12 + ' pm', 150, 85);
    } else if (lastFed === 12) {
      text('Last Fed: 12 am', 150, 85)
    } else {
      text('Last Fed: ' + lastFed + ' am', 150, 85)
    }

      if (currentTime === lastFed + 1) {
        garden();
        updateState("playing");
        dog.remove();
        ground.remove();
        hideButtons();
      } else if (currentTime > lastFed + 2 && currentTime <= lastFed + 4) {
        washroom();
        updateState("bathing");
        dog.remove();
        ground.remove();
        hideButtons();
      } else if (currentTime === lastFed + 2) {
        bedroom();
        updateState("sleeping");
        dog.remove();
        ground.remove();
        hideButtons();
      } else {
        updateState("hungry");
        food.display();
      }
  }
}

function addFood() {
  if (foodS >= 20) {
    foodS = 20;
  } else {
    foodS = foodS + 1;
  }
  database.ref('/').update({
    "food": foodS
  });
  dog.addImage(dogImg1);
  dog.x = 1050;
}

function feedFood() {
  if (foodS <= 0) {
    foodS = 0;
  } else {
    foodS = foodS - 1;
  }
  database.ref('/').update({
    "food": foodS,
    "feedTime": hour()
  });
  dog.addImage(dogImg2);  
  dog.x = 650;
}

function showButtons() {
  feedButton = createButton('Feed ' + dogNameRef);
  feedButton.position(80, 140);
  feedButton.mousePressed(() => {
    feedFood();
  })

  addButton = createButton('Add Food');
  addButton.position(80, 110);
  addButton.mousePressed(() => {
    addFood();
  })
}

function hideButtons() {
  feedButton.hide();
  addButton.hide();
}

function updateState(state) {
  database.ref('/').update({
    'gameState': state
  });
}

function washroom() {
  background(washroomImg);
}

function garden() {
  background(gardenImg);
}

function bedroom() {
  background(bedRoomImg);
}