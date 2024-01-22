
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// dark_background_1
		const dark_background_1 = this.add.image(540, 960, "dark-background");
		dark_background_1.alpha = 0.5;
		dark_background_1.alphaTopLeft = 0.5;
		dark_background_1.alphaTopRight = 0.5;
		dark_background_1.alphaBottomLeft = 0.5;
		dark_background_1.alphaBottomRight = 0.5;

		// gameContainer
		const gameContainer = this.add.container(0, 0);

		// overlayContainer
		const overlayContainer = this.add.container(0, 0);

		// score_board
		const score_board = this.add.image(174, 88, "score-board");
		overlayContainer.add(score_board);

		// high_score
		const high_score = this.add.image(862, 88, "high-score");
		overlayContainer.add(high_score);

		// txtHighScore
		const txtHighScore = this.add.text(964, 78, "", {});
		txtHighScore.setOrigin(0, 0.5);
		txtHighScore.text = "0";
		txtHighScore.setStyle({ "color": "#FFEC56", "fontFamily": "CCKillJoy Regular", "fontSize": "35px", "shadow.offsetX":2,"shadow.offsetY":2,"shadow.stroke":true,"shadow.fill":true});
		overlayContainer.add(txtHighScore);

		// txtCurrentScore
		const txtCurrentScore = this.add.text(220, 78, "", {});
		txtCurrentScore.setOrigin(0, 0.5);
		txtCurrentScore.text = "0";
		txtCurrentScore.setStyle({ "color": "#FFEC56", "fontFamily": "CCKillJoy Regular", "fontSize": "35px", "shadow.offsetX":2,"shadow.offsetY":2,"shadow.blur":2,"shadow.stroke":true,"shadow.fill":true});
		overlayContainer.add(txtCurrentScore);

		// gameOverContainer
		const gameOverContainer = this.add.container(0, 0);
		gameOverContainer.visible = false;

		// dark_background
		const dark_background = this.add.image(540, 960, "dark-background");
		gameOverContainer.add(dark_background);

		// gameOverPopUp
		const gameOverPopUp = this.add.container(540, 960);
		gameOverContainer.add(gameOverPopUp);

		// diamond
		const diamond = this.add.image(14, 0, "popup");
		diamond.alpha = 0.9;
		diamond.alphaTopLeft = 0.9;
		diamond.alphaTopRight = 0.9;
		diamond.alphaBottomLeft = 0.9;
		diamond.alphaBottomRight = 0.9;
		gameOverPopUp.add(diamond);

		// txtGameOverScore
		const txtGameOverScore = this.add.text(0, 44, "", {});
		txtGameOverScore.setOrigin(0.5, 0.5);
		txtGameOverScore.text = "01";
		txtGameOverScore.setStyle({ "fontFamily": "CCKillJoy Regular", "fontSize": "50px" });
		gameOverPopUp.add(txtGameOverScore);

		// btnReplay
		const btnReplay = this.add.image(0, 206, "replay-game");
		btnReplay.scaleX = 0.8;
		btnReplay.scaleY = 0.8;
		gameOverPopUp.add(btnReplay);

		// menuContainer
		const menuContainer = this.add.container(0, 0);

		this.gameContainer = gameContainer;
		this.txtHighScore = txtHighScore;
		this.txtCurrentScore = txtCurrentScore;
		this.overlayContainer = overlayContainer;
		this.txtGameOverScore = txtGameOverScore;
		this.btnReplay = btnReplay;
		this.gameOverPopUp = gameOverPopUp;
		this.gameOverContainer = gameOverContainer;
		this.menuContainer = menuContainer;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Container} */
	gameContainer;
	/** @type {Phaser.GameObjects.Text} */
	txtHighScore;
	/** @type {Phaser.GameObjects.Text} */
	txtCurrentScore;
	/** @type {Phaser.GameObjects.Container} */
	overlayContainer;
	/** @type {Phaser.GameObjects.Text} */
	txtGameOverScore;
	/** @type {Phaser.GameObjects.Image} */
	btnReplay;
	/** @type {Phaser.GameObjects.Container} */
	gameOverPopUp;
	/** @type {Phaser.GameObjects.Container} */
	gameOverContainer;
	/** @type {Phaser.GameObjects.Container} */
	menuContainer;

	/* START-USER-CODE */

	// Write more your code here

	create() {

		this.editorCreate();

		this.isGameStart = false;
		this.pointerOverAndOut();
		this.randomFloor = ['floor-1', 'floor-2', 'floor-3', 'floor-4', 'floor-5'];

		this.gameOptions = {
			// gameWidth: 800,
			floorStart: 720,
			floorGap: 250,
			playerGravity: 10000,
			playerSpeed: 450,  //500
			climbSpeed: 400,   //450
			playerJump: 1800,
			// diamondRatio: 2,
			// doubleSpikeRatio: 1,
			// skyColor: 0xaaeaff,
			safeRadius: 180,
			localStorageName: "climbgame",
		}

		this.savedData = localStorage.getItem(this.gameOptions.localStorageName) == null ? { score: 0 } : JSON.parse(localStorage.getItem(this.gameOptions.localStorageName));
		this.txtCurrentScore.setText('0');
		this.txtHighScore.setText(this.savedData.score);

		this.gameOver = false;
		this.reachedFloor = 0;
		this.canJump = true;
		this.isClimbing = false;
		this.collectedDiamonds = 0;
		this.initialPosition = 0;
		this.isHeroKill = false

		this.input.on('pointerdown', this.handleTap, this);

		this.createMenu();
		this.defineGroups();
		this.drawLevel();

		this.btnReplay.setInteractive().on('pointerdown', () => {
			this.scene.stop('Level')
			this.scene.start('Level')
		})

	}

	defineGroups() {
		this.floorContainer = this.add.container();
		this.ladderContainer = this.add.container();
		this.diamondContainer = this.add.container();
		this.spikeContainer = this.add.container();
		this.heroContainer = this.add.container();
		this.particleContainer = this.add.container();

		this.gameContainer.name = 'gameContainer';
		this.floorContainer.name = 'floorContainer';
		this.ladderContainer.name = 'ladderContainer';
		this.diamondContainer.name = 'diamondContainer';
		this.spikeContainer.name = 'spikeContainer';
		this.heroContainer.name = 'heroContainer';
		this.particleContainer.name = 'particleContainer';

		this.gameContainer.add(this.floorContainer);
		this.gameContainer.add(this.heroContainer);
		this.gameContainer.add(this.ladderContainer);
		this.gameContainer.add(this.diamondContainer);
		this.gameContainer.add(this.spikeContainer);
		this.gameContainer.add(this.particleContainer);
	}

	createMenu() {
		let tap = this.add.sprite(1080 / 2, 1920 - 400, "tap");
		tap.setOrigin(0.5);
		this.menuContainer.add(tap);

		let tapTween = this.tweens.add({
			targets: tap,
			alpha: 0,
			duration: 200,
			ease: 'Cubic.InOut',
			yoyo: true,
			repeat: -1
		});

		let tapText = this.add.image(1080 / 2, tap.y + 150, "tap-to-jump").setScale(0.8);
		tapText.setOrigin(0.5);
		this.menuContainer.add(tapText);

	}

	drawLevel() {
		this.currentLevel = 0;
		this.highestFloorY = 1920 - this.gameOptions.floorStart;
		this.floorArr = [];
		this.ladderArr = [];
		this.diamondArr = [];
		this.spikeArr = [];

		while (this.highestFloorY > - 2 * this.gameOptions.floorGap) {
			this.addFloor();
			if (this.currentLevel > 0) {
				this.addDiamond();
				this.addLadder();
				this.addSpike();
			}
			this.highestFloorY -= this.gameOptions.floorGap;
			this.currentLevel++;
		}

		this.addHero();
	}

	addFloor() {
		let randomIndex = Phaser.Math.RND.integerInRange(0, this.randomFloor.length - 1);
		let randomFloorTexture = this.randomFloor[randomIndex];

		let floor = this.physics.add.sprite(0, this.highestFloorY - 45, randomFloorTexture).setSize(1080, 80);
		floor.setOrigin(0, 0);
		// floor.scaleX = 1.35;
		floor.body.setImmovable(true);
		floor.body.checkCollision.down = false;
		this.floorContainer.add(floor);
		this.floorArr.push(floor);
	}

	addLadder() {
		let ladderXPosition = Phaser.Math.Between(50, 1080 - 50);
		let ladder = this.physics.add.sprite(ladderXPosition, this.highestFloorY, 'ladder');
		ladder.setOrigin(0.5, 0);
		ladder.setImmovable(true);

		this.ladderContainer.add(ladder);
		this.ladderArr.push(ladder);
		this.safePosition = {
			start: ladderXPosition - this.gameOptions.safeRadius,
			end: ladderXPosition + this.gameOptions.safeRadius
		}
	}

	addDiamond() {
		let diamond = this.physics.add.sprite(Phaser.Math.Between(50, 1080 - 50), this.highestFloorY - this.gameOptions.floorGap / 2, 'diamond').setSize(40, 40);
		diamond.setOrigin(0.5);
		diamond.setImmovable(true);
		this.diamondContainer.add(diamond);
		this.diamondArr.push(diamond);
	}

	addSpike() {
		let spikeXPosition = this.findSpikePosition();

		// let spike = this.physics.add.image(spikeXPosition, this.highestFloorY - 50, 'spike').setScale(0.85);
		let spike = this.physics.add.image(spikeXPosition, this.highestFloorY - 40, 'spike').setScale(0.7);
		spike.setOrigin(0.5, 0);
		spike.setImmovable(true);
		this.spikeContainer.add(spike);
	}

	findSpikePosition() {
		let randomNum;
		do {
			randomNum = Phaser.Math.Between(125, 955);
		} while (randomNum >= this.safePosition.start && randomNum <= this.safePosition.end);
		return randomNum;
	}

	addHero() {
		this.hero = this.physics.add.sprite(540, 1920 - this.gameOptions.floorStart - 85, 'hero');
		this.hero.setOrigin(0.5);
		this.heroContainer.add(this.hero);

		this.hero.anims.play('runAnimation')
		this.hero.body.setSize(50, 80);

		this.hero.setCollideWorldBounds(true);
		this.hero.body.gravity.y = this.gameOptions.playerGravity;
		this.hero.body.setVelocityX(this.gameOptions.playerSpeed);

		// Handle world bounds collisions
		this.hero.body.onWorldBounds = true;
		this.physics.world.on('worldbounds', (body, up, down, left, right) => {
			if (left) {
				this.hero.body.setVelocityX(this.gameOptions.playerSpeed);
				this.hero.setScale(1, 1);
			}
			if (right) {
				this.hero.setOrigin(0.5, 0.5)
				this.hero.setScale(-1, 1);
				this.hero.body.setVelocityX(-this.gameOptions.playerSpeed);
			}
			if (down) {
				if (!this.isHeroKill) {
					this.isHeroKill = true;
					localStorage.setItem(this.gameOptions.localStorageName, JSON.stringify({
						score: Math.max(this.collectedDiamonds, this.savedData.score),
					}));
					this.hero.setVisible(false);
					this.txtGameOverScore.setText('Score : ' + this.collectedDiamonds);
					this.heroBlastParticle(this.hero)
					this.showPopUp();
				}
			}
		});

	}

	handleTap() {
		if (this.menuContainer !== null) {
			this.menuContainer.getAll().forEach(item => {
				item.destroy();
				this.isGameStart = true;
			})
		}
		if (this.canJump && !this.isClimbing && !this.gameOver) {
			this.hero.body.velocity.y = - this.gameOptions.playerJump;
			this.canJump = false;
		}
	}

	defineTweens() {
		this.initialPosition += this.gameOptions.floorGap
		this.scrollTween = this.tweens.add({
			targets: this.gameContainer,
			y: this.initialPosition,
			duration: 1000,
			onComplete: () => {
				
				this.addFloor();
				this.addLadder();
				this.addDiamond();
				this.addSpike();
				this.highestFloorY -= this.gameOptions.floorGap;

				if (this.gameContainer.y > 1000) {
					this.killFloor();
					this.killLadder();
					this.killDiamond();
					this.killSpike();
				}
			}
		})
	}

	showPopUp() {
		this.gameOverContainer.setVisible(true);
		this.overlayContainer.setVisible(false);
		this.tweenPopUp = this.tweens.add({
			targets: this.gameOverPopUp,
			scaleX: { from: 0, to: 1 },
			scaleY: { from: 0, to: 1 },
			ease: 'Bounce.Out',
			duration: 200,
		})
	}

	update() {
		if (!this.gameOver) {
			this.checkFloorCollision();
			this.checkLadderCollision();
			this.checkDiamondCollision();
			this.checkSpikeCollision();
		}
	}

	checkFloorCollision() {
		this.physics.world.collide(this.hero, this.floorContainer.getAll(), () => {
			this.canJump = true;
		}, null, this);
	}

	checkLadderCollision() {
		if (this.isGameStart) {
			if (!this.isClimbing) {
				this.physics.world.overlap(this.hero, this.ladderContainer.getAll(), (player, ladder) => {
					if (Math.abs(player.x - ladder.x) < 10) {
						this.hero.anims.play('climbAnimation');
						this.ladderToClimb = ladder;
						this.hero.body.velocity.x = 0;
						this.hero.body.velocity.y = - this.gameOptions.climbSpeed;
						this.hero.body.gravity.y = 0;
						this.isClimbing = true;
					}
				}, null, this);
			} else {
				// this.hero.anims.stop('climbAnimation');
				if (this.hero.y < this.ladderToClimb.y - 40) {
					this.hero.anims.play('runAnimation');
					this.hero.body.gravity.y = this.gameOptions.playerGravity;
					this.hero.body.velocity.x = this.gameOptions.playerSpeed * this.hero.scaleX;
					this.hero.body.velocity.y = 0;
					this.isClimbing = false;
					this.reachedFloor++;
					this.defineTweens();
					// this.txtCurrentScore.setText((this.collectedDiamonds * this.reachedFloor).toString());
				}
			}
		}
	}

	checkDiamondCollision() {
		this.physics.world.overlap(this.hero, this.diamondContainer.getAll(), (player, diamond) => {
			this.blastParticle(diamond);
			// this.emitter.setPosition(diamond.x, diamond.y);
			// this.emitter.explode(20, diamond.x, diamond.y);
			this.collectedDiamonds++;
			// this.setLevel(this.collectedDiamonds);
			diamond.setVisible(false);
			diamond.body.destroy();
			this.txtCurrentScore.setText(this.collectedDiamonds.toString());
		}, null, this);
	}

	checkSpikeCollision() {
		this.physics.world.overlap(this.hero, this.spikeContainer.getAll(), () => {
			this.gameOver = true;
			this.hero.body.setVelocityX(0);
			this.hero.body.setVelocityY(-this.gameOptions.playerJump);
			this.hero.body.setGravityY(this.gameOptions.playerGravity);
		}, null, this);
	}

	blastParticle(diamond) {
		let particles = this.add.particles('diamondparticle');
		this.particleContainer.add(particles);

		let emitter = particles.createEmitter({
			speed: { min: 200, max: 10 },
			angle: { min: 360, max: 0 },
			gravityY: 10,
			lifespan: { min: 250, max: 400 },
			scale: { start: 0.5, end: 0 },
			quantity: 100,
			on: false
		});
		// emitter.stop();

		setTimeout(() => {
			particles.destroy()
		}, 800)

		emitter.setPosition(diamond.x, diamond.y);
		emitter.explode(100, diamond.x, diamond.y);
	}

	heroBlastParticle(hero) {
		let particles = this.add.particles('diamondparticle');
		this.particleContainer.add(particles);

		let emitter = particles.createEmitter({
			speed: { min: 10, max: 2500 },
			angle: { min: 360, max: 0 },
			gravityY: 10,
			lifespan: { min: 700, max: 800 },
			scale: { start: 0.8, end: 0 },
			quantity: 100,
			tint: 0x000000,
			on: false
		});
		emitter.stop();

		emitter.setPosition(hero.x, hero.y);
		emitter.explode(100, hero.x, hero.y);
	}

	setLevel(score) {
		if (score > 5 && score <= 10) {
			this.gameOptions.playerSpeed = 550
			this.gameOptions.playerJump = 1600
		}
		else if (score > 10 && score <= 15) {
			this.gameOptions.playerSpeed = 600
			this.gameOptions.playerJump = 1500
		}
		else if (score > 15) {
			this.gameOptions.playerSpeed = 700
			this.gameOptions.playerJump = 1500
		}
	}

	killFloor() {
		this.floorContainer.getAll()[0].destroy();
		this.floorArr.shift();
	}

	killLadder() {
		this.ladderContainer.getAll()[0].destroy();
		this.ladderArr.shift();
	}

	killDiamond() {
		this.diamondContainer.getAll()[0].destroy();
		this.diamondArr.shift();
	}

	killSpike() {
		this.spikeContainer.getAll()[0].destroy();
		this.spikeArr.shift();
	}

	pointerOverAndOut(){
		this.pointerOver = (aBtn,scale) => {
			this.input.setDefaultCursor('pointer');
			this.tweens.add({
				targets: aBtn,
				scaleX: scale + 0.05,
				scaleY: scale + 0.05,
				duration: 50
			})
		}
		this.pointerOut = (aBtn,scale) => {
			this.input.setDefaultCursor('default');
			this.tweens.add({
				targets: aBtn,
				scaleX: scale,
				scaleY: scale,
				duration: 50,
				onComplete: () => {
					aBtn.forEach((btn) => {
						btn.setScale(scale);
					});
				}
			})
		}
		this.btnReplay.on('pointerover', () => this.pointerOver([this.btnReplay],0.8));
		this.btnReplay.on('pointerout', () => this.pointerOut([this.btnReplay],0.8));
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
