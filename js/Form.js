class Form {
    constructor() {
      this.input = createInput("");
      this.button = createButton('Continue');
      this.title = createElement('h1');
      this.intro = createElement('h2');
    }
    
    hide(){
      this.button.hide();
      this.input.hide();
      this.intro.hide();
    }
  
    display(){
        this.title.html("My Virtual Pet!");
        this.intro.html("Please type in the chosen name of your dog:");
        this.title.position(60, 30);
        this.intro.position(60, 80);
        this.input.position(60, 140);
        this.button.position(60, 180);
    
        this.button.mousePressed(() => {
            this.title.hide();
            this.input.hide();
            this.button.hide();
            dogNameRef = this.input.value();
            database.ref('/').update({
                'dogName': dogNameRef
            });
            updateState("hungry");
        });
    }
  }