/*jshint esversion: 6 */

// simple bgm player
class SoundPlayer{

	// store the element
	constructor(){
		this.soundbank = {
			bgm : document.querySelector('.bgm'),
			lost : document.querySelector('.lost'),
			won : document.querySelector('.won')
		};
	}

	// start playing song
	play(song){
		this.soundbank[song].play();
	}

	// stop the specified song and rewind
	stop(song){
		this.soundbank[song].pause();
		this.soundbank[song].currentTime = 0;
	}
	
}