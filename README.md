# Flow Driving

Flow Driving is an interactive 3D driving game you control with your bare hand. Steer, accelerate, and brake using hand gestures captured by your webcam — or fall back to the arrow keys. It's built with Three.js for 3D rendering and MediaPipe for real-time hand gesture recognition.

**🎮 Play it live: [flow-driving.vercel.app](https://flow-driving.vercel.app)**

https://github.com/user-attachments/assets/745385ff-eba7-4852-86c4-a394e7ccd82b

## Controls

The game tracks your **right hand** through the webcam. (Only the right hand is supported.)

| Gesture | Action |
| --- | --- |
| ✋ Open your hand — stretch out all five fingers | Speed up |
| ✊ Close your hand — curl all fingers into a fist, bringing them close together | Slow down |
| 👈 Tilt your hand to the **left** | Move left |
| 👉 Tilt your hand to the **right** | Move right |

Prefer a keyboard? The **arrow keys** work too.

## Features

- Control the car with right-hand gestures or the arrow keys.
- Realistic 3D graphics powered by Three.js.
- Real-time hand gesture recognition using MediaPipe.
- Start screen with game instructions.
- Game over screen with options to restart or return home.
- Responsive design for different screen sizes.

## Getting Started

1. Clone the repository:
    ```sh
    git clone https://github.com/Anirban-Majumder/Flow-Driving.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Flow-Driving
    ```
3. Install the dependencies:
    ```sh
    pnpm install
    ```
4. Start the development server using Vite:
    ```sh
    pnpm dev
    ```
5. Open your web browser and go to the URL provided by Vite (usually `https://localhost:5173`).

> The dev server runs over HTTPS so the browser will grant webcam access for hand tracking. Allow camera permissions when prompted.

## Technologies Used

- **Three.js**: For 3D rendering.
    - [Three.js](https://threejs.org/)
- **MediaPipe**: For hand gesture recognition.
    - [MediaPipe Hands](https://github.com/google-ai-edge/mediapipe/)
- **Vite**: For development and bundling.
- **HTML5**: For structuring the web page.
- **CSS3**: For styling the web page.
- **JavaScript**: For game logic and interactivity.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m "Add your message here"
    ```
4. Push to the branch:
    ```sh
    git push origin feature/your-feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Three.js](https://threejs.org/) for the amazing 3D library.
- [MediaPipe](https://github.com/google-ai-edge/mediapipe/) for the hand gesture recognition solution.
- Fonts by [Google Fonts](https://fonts.google.com/).
