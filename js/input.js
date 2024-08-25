export class InputHandler {
    constructor(gameEngine, sandboxWorld) {
        this.gameEngine = gameEngine;
        this.sandboxWorld = sandboxWorld;
        this.touchStartY = null;
        this.touchStartX = null;

        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        window.addEventListener('crash', this.cleanup.bind(this));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.gameEngine.increaseFov();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.gameEngine.decreaseFov();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.sandboxWorld.changeLane(1);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.sandboxWorld.changeLane(-1);
                break;
        }
    }

    handleTouchStart(event) {
        this.touchStartY = event.touches[0].clientY;
        this.touchStartX = event.touches[0].clientX;
    }

    handleTouchMove(event) {
        if (this.touchStartY !== null) {
            const touchEndY = event.touches[0].clientY;
            const touchDiffY = this.touchStartY - touchEndY;

            if (touchDiffY > 0) {
                this.gameEngine.increaseFov();
            } else {
                this.gameEngine.decreaseFov();
            }

            this.touchStartY = null;
        }

        if (this.touchStartX !== null) {
            const touchEndX = event.touches[0].clientX;
            const touchDiffX = this.touchStartX - touchEndX;

            if (touchDiffX > 0) {
                this.sandboxWorld.changeLane(1);
            } else {
                this.sandboxWorld.changeLane(-1);
            }

            this.touchStartX = null;
        }
    }

    updateHandPosition(landmarks) {
        let open = {
            thumb: false,
            index: false,
            middle: false,
            ring: false,
            pinky: false
        }
        let finger = 0;
        try {
            if (landmarks[4].y < landmarks[3].y && landmarks[4].y < landmarks[2].y && landmarks[5].x < landmarks[4].x) {
                finger++;
                open.thumb = true;
            }
            if (landmarks[8].y < landmarks[6].y && landmarks[8].y < landmarks[7].y) {
                finger++;
                open.index = true;
            }
            if (landmarks[12].y < landmarks[10].y && landmarks[12].y < landmarks[11].y) {
                finger++;
                open.middle = true;
            }
            if (landmarks[16].y < landmarks[14].y && landmarks[16].y < landmarks[15].y) {
                finger++;
                open.ring = true;
            }
            if (landmarks[20].y < landmarks[18].y && landmarks[20].y < landmarks[19].y) {
                finger++;
                open.pinky = true;
            }
            if (finger === 0) {
                this.gameEngine.decreaseFov();
            } else if (finger === 5) {
                this.gameEngine.increaseFov();
            }
            const wrist = landmarks[0];
            const middleFingerTip = landmarks[12];

            // Calculate the angle in radians
            const deltaX = middleFingerTip.x - wrist.x;
            const deltaY = middleFingerTip.y - wrist.y;

            // Convert the angle to degrees
            const angleDegrees = -Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            // Determine the tilt direction based on the angle
            if (angleDegrees < 70) {
                this.sandboxWorld.setLane(2); // Tilt left
            } else if (angleDegrees >= 80 && angleDegrees <= 110) {
                this.sandboxWorld.setLane(1); // Neutral
            } else if (angleDegrees > 110) {
                this.sandboxWorld.setLane(0); // Tilt right
            }
        } catch (e) {
            console.error(e);
        }
    }

    cleanup() {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        let count = 0;
        const interval = setInterval(() => {
            if (count < 50) {
                this.gameEngine.decreaseFov();
                count++;
            } else {
                clearInterval(interval);
            }
        }, 15);
        this.gameEngine.stop();
    }
}