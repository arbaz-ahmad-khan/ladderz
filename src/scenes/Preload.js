
// You can write more code here

/* START OF COMPILED CODE */

class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorPreload() {

		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// preloadBg
		const preloadBg = this.add.image(540, 960, "preloadBg");
		preloadBg.alpha = 0.5;
		preloadBg.alphaTopLeft = 0.5;
		preloadBg.alphaTopRight = 0.5;
		preloadBg.alphaBottomLeft = 0.5;
		preloadBg.alphaBottomRight = 0.5;

		// preloadLogo
		this.add.image(540, 400, "preloadLogo");

		// playBtn
		const playBtn = this.add.image(540, 1600, "play");
		playBtn.visible = false;

		// player
		const player = this.add.sprite(600, 380, "hero1");
		player.flipX = true;

		this.playBtn = playBtn;
		this.player = player;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	playBtn;
	/** @type {Phaser.GameObjects.Sprite} */
	player;

	/* START-USER-CODE */

	// Write your code here

	preload() {

		this.editorCreate();
		this.editorPreload();
		this.loadingBar();
		this.pointerOverAndOut();

		this.playBtn.setInteractive().on('pointerdown', () => {
			this.tweens.add({
				targets: this.playBtn,
				scaleX: 0.9,
				scaleY: 0.9,
				duration: 80,
				yoyo: true,
				onComplete: () => {
					this.scene.start("Level");
				}
			});
		});
	}

	loadingBar() {
		this.outerBar = this.add.sprite(540, 1600, "outer-bar");
		this.outerBar.setOrigin(0.5);

		this.innerBar = this.add.sprite(
			this.outerBar.x - this.outerBar.displayWidth / 2 + 5,
			this.outerBar.y,
			"inner-bar"
		);
		this.innerBar.setOrigin(0, 0.5);
		this.innerBar.setVisible(false);

		this.innerBarWidth = this.innerBar.displayWidth;

		this.maskGraphics = this.make.graphics();
		this.maskGraphics.fillStyle(0xffffff);
		this.maskGraphics.fillRect(
			this.innerBar.x,
			this.innerBar.y - this.innerBar.displayHeight / 2,
			this.innerBar.displayWidth,
			this.innerBar.displayHeight
		);

		this.innerBar.setMask(this.maskGraphics.createGeometryMask());

		const loadingDuration = 3000;
		const intervalDuration = 30;
		const numIntervals = loadingDuration / intervalDuration;
		let currentInterval = 0;
		const progressIncrement = 1 / numIntervals;

		const updateProgressBar = () => {
			this.innerBar.setVisible(true);
			const currentProgress = currentInterval * progressIncrement;
			this.maskGraphics.clear();
			this.maskGraphics.fillStyle(0xffffff);
			this.maskGraphics.fillRect(
				this.innerBar.x,
				this.innerBar.y - this.innerBar.displayHeight / 2,
				this.innerBarWidth * currentProgress,
				this.innerBar.displayHeight
			);

			currentInterval++;

			if (currentProgress >= 1) {
				clearInterval(progressInterval);
				this.innerBar.setVisible(false);
				this.outerBar.setVisible(false);
				this.playTween1();
				setTimeout(() => {
					this.playBtn.setVisible(true);
				}, 100);
			}
		};

		const progressInterval = setInterval(updateProgressBar, intervalDuration);
	}

	pointerOverAndOut() {
		this.pointerOver = (aBtn, scale) => {
			this.input.setDefaultCursor('pointer');
			this.tweens.add({
				targets: aBtn,
				scaleX: scale + 0.05,
				scaleY: scale + 0.05,
				duration: 50
			})
		}
		this.pointerOut = (aBtn, scale) => {
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
		this.playBtn.on('pointerover', () => this.pointerOver([this.playBtn], 1));
		this.playBtn.on('pointerout', () => this.pointerOut([this.playBtn], 1));
	}

	playTween1() {
		this.tween1 = this.tweens.add({
			targets: this.player,
			x: 470,
			duration: 1000,
			ease: 'Linear',
			onStart: () => {
				this.player.anims.play('runAnimation');
			},
			onComplete: () => {
				this.player.anims.stop('runAnimation');
				this.playTween2();
			},
		});
	}

	playTween2() {
		this.player.anims.play('climbAnimation');
		this.tween2 = this.tweens.add({
			targets: this.player,
			x: 510,
			y: 190,
			duration: 1500,
			ease: 'Linear',
			onComplete: () => {
				this.player.anims.stop('climbAnimation');
				this.playTween3();
			},

		});
	}

	playTween3() {
		this.player.anims.play('runAnimation');
		this.tween3 = this.tweens.add({
			targets: this.player,
			x: 950,
			duration: 2000,
			ease: 'Linear',
			onComplete: () => {
				this.player.flipX = true;
				this.playTween4();
			},
			onStart: () => {
				this.player.flipX = false;
			}
		});
	}

	playTween4() {
		this.player.anims.play('runAnimation');
		this.tween4 = this.tweens.add({
			targets: this.player,
			x: 280,
			duration: 4000,
			ease: 'Linear',
			onComplete: () => {
				this.playTween5();
			},
			onStart: () => {
			}
		});
	}

	playTween5() {
		this.player.anims.play('runAnimation');
		this.tween4 = this.tweens.add({
			targets: this.player,
			x: 950,
			duration: 4000,
			ease: 'Linear',
			onComplete: () => {
				this.player.flipX = true;
				this.playTween4();
			},
			onStart: () => {
				this.player.flipX = false;
			}
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
