const { THREE } = window;
import { InputHandler } from "./input.js";
import { GameEngine } from "./game.js";

async function main() {
    const root = document.getElementById('root');
    const startButton = document.getElementById('startButton');
    const videoElement = document.getElementById('inputVideo');
    const handCanvas = document.getElementById('handCanvas');
    const loadingMessage = document.getElementById('loadingMessage');
    const canvasCtx = handCanvas.getContext('2d');
    const startScreen = document.getElementById('startScreen');
    const footer = document.getElementById('footer');
    const gameoverDiv = document.getElementById('gameover');
    const homeButton = document.getElementById('homeButton');
    const restartButton = document.getElementById('restartButton');

    let gameEngine, inputHandler, camera;

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    startButton.addEventListener('click', async () => {
        startButton.disabled = true;
        startButton.style.display = 'none';
        loadingMessage.style.display = 'block';

        try {
            // Request camera permission
            await navigator.mediaDevices.getUserMedia({ video: true });

            // Load the hand tracking model
            await hands.initialize();

            // Initialize game components
            gameEngine = new GameEngine(root);
            inputHandler = new InputHandler(gameEngine, gameEngine.world);

            // Initialize Camera
            camera = new Camera(videoElement, {
                onFrame: async () => {
                    await hands.send({ image: videoElement });
                },
                width: 640,
                height: 480
            });

            // Start the game and camera
            gameEngine.start();
            camera.start();

            // Hide loading message and show hand canvas
            loadingMessage.style.display = 'none';
            handCanvas.style.display = 'block';
            startScreen.style.display = 'none';
            footer.style.display = 'none';

        } catch (error) {
            console.error('Error setting up the game:', error);
            loadingMessage.textContent = 'Error setting up the game. Please try again.';
        }
    });

    function onResults(results) {
        // Clear the canvas
        canvasCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);

        // Save the current canvas state
    canvasCtx.save();

    // Translate to the right edge of the canvas
    canvasCtx.translate(handCanvas.width, 0);

    // Scale horizontally by -1 to flip the canvas
    canvasCtx.scale(-1, 1);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Draw hand landmarks
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

        if (gameEngine && inputHandler) {
            inputHandler.updateHandPosition(landmarks);
        }
    }

    // Restore the canvas state
    canvasCtx.restore();
}

    // Simulate loading process
    window.addEventListener('load', () => {
        startButton.disabled = false;
    });

    window.addEventListener('crash', () => {
        if (camera) {
            camera.stop();
        }
        handCanvas.style.display = 'none';
    });
    window.addEventListener('gameover', () => {
        gameoverDiv.style.display = 'block';
        footer.style.display = 'block';
    });

    homeButton.addEventListener('click', () => {
        if (gameEngine) {
            gameEngine.destroy();
        }
        handCanvas.style.display = 'none';
        gameoverDiv.style.display = 'none';
        startScreen.style.display = 'block';
        startButton.style.display = 'block';
        startButton.disabled = false;
    });

    restartButton.addEventListener('click', async () => {
        if (gameEngine) {
            gameEngine.destroy();
        }
        handCanvas.style.display = 'none';
        gameoverDiv.style.display = 'none';
        startScreen.style.display = 'block';
        startButton.disabled = false;
        startButton.click();
    });
}

document.addEventListener("DOMContentLoaded", main);