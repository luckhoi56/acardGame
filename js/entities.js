/*jshint esversion: 6 */

// base class
class Entity{

	constructor(sprite, x, y){
		this.sprite = sprite;
		this.x = x;
		this.y = y;
	}

	render(ctx){
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

// player class that interprets to key events
class Player extends Entity{

	constructor(x, y){
		super("images/char-horn-girl.png", x, y);
	}

	handleInput(input){

		switch(input){
			case 'left':{
				this.x -= HORIZONTAL_STEP;
				break;
			}
			case 'right':{
				this.x += HORIZONTAL_STEP;
				break;
			}
			case 'up':{
				this.y -= VERTICAL_STEP;
				break;
			}
			case 'down':{
				this.y += VERTICAL_STEP;
				break;
			}
		}

		if(this.x < 0) this.x += HORIZONTAL_STEP;
		if(this.x > HORIZONTAL_STEP * 4) this.x -= HORIZONTAL_STEP;
		if(this.y < -VERTICAL_STEP) this.y += VERTICAL_STEP;
		if(this.y > VERTICAL_STEP * 5) this.y -= VERTICAL_STEP;
	}

}

// collision sensitive entity
class ReactiveEntity extends Entity{

	checkCollision(entity){
		const distX = this.x - entity.x;
		const distY = this.y - entity.y;
		// pythagorean theorem
		const distance = Math.sqrt((distX * distX) + (distY * distY));
		return distance < COLLISION_THRESHOLD;
	}

}

// the rival thief, appraching the princess
class Rival extends ReactiveEntity{

	constructor(x, y){
		super("images/char-cat-girl.png", x, y);
	}

	update(dt) {
		this.x -= 1 * dt;
		this.y -= 4 * dt;
	}

}

// princess. she doesn't move
class Princess extends ReactiveEntity{

	constructor(x, y){
		super("images/char-princess-girl.png", x, y);
	}

}

// foot man moves vertically with a random speed
class Footman extends ReactiveEntity{

	constructor(x, y){
		super("images/char-boy.png", x, y);
		this.randomX();
		this.randomSpeed();
	}

	update(dt) {
		this.y += this.move  * dt;
		if(this.y > (CANVAS_HEIGHT - VERTICAL_STEP)){
			this.randomX();
			this.randomSpeed();
			this.y = 0;
		} 
	}

	randomX(){
		this.x = parseInt(Math.random() * 5) * HORIZONTAL_STEP;
	}

	randomSpeed(){
		this.move = Math.random() * 300 + 300;
	}

}

// they moves horizontally back and forth
class HouseKeeper extends ReactiveEntity{

	constructor(x, y){
		super("images/char-pink-girl.png", x, y);
		this.move = 600;
	}

	update(dt) {
		this.x += this.move  * dt;
		if(this.x > (CANVAS_WIDTH - HORIZONTAL_STEP)){
			this.move = -(Math.random() * 400 + 300);
		} else if( this.x < 0) {
			this.move = Math.random() * 400 + 300;
		}
	}

}
