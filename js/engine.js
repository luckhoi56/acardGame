/*jshint esversion: 6 */

// main game logic
class Engine{

    constructor(){

        // preparing canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // stores elements
        this.result = document.querySelector('div.result');
        this.message = document.querySelector('span.result');

        // game variables
        this.lastTime = 0;
        this.animate = true;

        // sound player
        this.soundPlayer = new SoundPlayer();

        // init characters
        Resources.onReady(()=>{
            this.init();
            this.defineCallback();
        });

        // load resources
        Resources.load([
            'images/stone-block.png',
            'images/water-block.png',
            'images/grass-block.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-boy.png'
        ]);
    }

    // interaction
    defineCallback(){

        // reacts to key events
        document.addEventListener('keyup', (e)=> {
            const allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };
            this.player.handleInput(allowedKeys[e.keyCode]);
        });

        // reacts to restart button click
        document.querySelector('.restart').addEventListener('click', (e)=>{
            this.init();
        });
    }

    // initialization
    init() {
        this.soundPlayer.stop('won');
        this.soundPlayer.stop('lost');
        this.soundPlayer.play('bgm');
        this.animate = true;
        this.result.classList.remove('show');
        this.initEntities();
        this.lastTime = Date.now();
        this.loop();
    }

    // instantiates characters
    initEntities(){
        this.player = new Player(HORIZONTAL_STEP * 1, VERTICAL_STEP *  5 + VERTICAL_OFFSET );
        this.princess = new Princess(HORIZONTAL_STEP * 2, VERTICAL_OFFSET);
        this.ladyCat = new Rival(HORIZONTAL_STEP * 3, VERTICAL_STEP *  5 + VERTICAL_OFFSET); 
        this.allEnemies = [
            this.ladyCat,
            new Footman(HORIZONTAL_STEP * 1, VERTICAL_OFFSET),
            new Footman(HORIZONTAL_STEP * 3, VERTICAL_OFFSET),
            new HouseKeeper(0, VERTICAL_STEP * 3 + VERTICAL_OFFSET),
            new HouseKeeper(HORIZONTAL_STEP * 4, VERTICAL_STEP + VERTICAL_OFFSET)];
    }

    // main game loop
    loop() {
        if(!this.animate) return;
        var now = Date.now(),
        dt = (now - this.lastTime) / 1000.0;
        this.update(dt);
        this.render();
        this.lastTime = now;
        window.requestAnimationFrame(()=>{
            this.loop();
        });
    }

    // update the position of entities and check collisions
    update(dt) {
        this.updateEntities(dt);
        this.checkCollisions();
    }

    // update the position of entities
    updateEntities(dt) {
        for(const enemy of this.allEnemies){
            enemy.update(dt);
        }
    }

    // check collisions between entities
    checkCollisions() {
        for(const enemy of this.allEnemies){
            if(enemy.checkCollision(this.player)) {
                this.showResult(false);
                return;
            }
        }
        if(this.princess.checkCollision(this.player)){
                this.showResult(true);
                return;
        }
        if(this.princess.checkCollision(this.ladyCat)){
                this.showResult(false);
                return;
        }
    }

    // if a collision is found start the music and show the game result 1 second later
    // we need to give the player time to confirm the collision
    showResult(success){
        this.animate = false;
        this.soundPlayer.stop('bgm');
        this.soundPlayer.play( success ? 'won' : 'lost');
        this.message.innerHTML = success ? 'accomplished' : 'failed';
        setTimeout(()=>{
            this.result.classList.add('show');
        }, 1000);
    }

    // render all assets
    render() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.renderBackground();
        this.renderEntities();
    }

    // render background images
    renderBackground(){
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                this.ctx.drawImage(Resources.get(ROW_IMAGES[row]), col * HORIZONTAL_STEP, row * VERTICAL_STEP);
            }
        }
    }

    // render entities
    renderEntities() {
        this.princess.render(this.ctx);
        for(const enemy of this.allEnemies){
            enemy.render(this.ctx);
        }
        this.player.render(this.ctx);
    }

}