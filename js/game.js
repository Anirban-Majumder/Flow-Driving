import { SandboxWorld, FLAGS } from "./objects.js";
import { COLOR_PALETTE } from "./material.js";
import Stats from "stats.js";

export class GameEngine {
    static CSS_ROOT = "game";
    static CSS_ROOT_LOADED_VARIANT = "-loaded";

    #root;
    #frameRequestId;
    #scene;
    world;
    #camera;
    #cameraData;
    #renderer;
    #composer;
    #stats;
    #audio;

    constructor(root) {
        this.#root = root;
        this.#root.classList.add(GameEngine.CSS_ROOT);
        this.#initScene();
        this.#initObjects();
        this.#initCamera();
        this.#initRenderer();
        this.#initComposer();
        this.#initEventListeners();
        this.#onWindowResize();
        this.#initStats();
        this.#initAudio();
        this.#root.classList.add(GameEngine.CSS_ROOT_LOADED_VARIANT);
        this.#render();
    }

    #initAudio() {
        this.#audio = new Audio('./song.mp3');
        this.#audio.loop = true;
        this.#audio.volume = 0.1;
        this.#audio.play();
    }

    #initScene() {
        this.#scene = new THREE.Scene();
    }

    #initObjects() {
        this.world = new SandboxWorld();

        this.#scene.add(this.world);
    }

    #initCamera() {
        const fov = 50;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 1;
        const far = 1000;

        this.#camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.#camera.position.set(0, 2, 1);
        this.#camera.lookAt(0, 0, 200);
        this.#camera.updateProjectionMatrix();

        this.#cameraData = {
            positionX: 0,
            positionY: 2
        };
    }

    #initRenderer() {
        const clearColor = COLOR_PALETTE.black;
        const clearColorAlpha = 1;

        this.#renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            alpha: true,
            logarithmicDepthBuffer: true
        });
        this.#renderer.setClearColor(clearColor, clearColorAlpha);
        this.#renderer.setPixelRatio(window.devicePixelRatio);

        if (FLAGS.ENABLE_SHADOWS) {
            this.#renderer.shadowMap.enabled = true;
            this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        this.#root.appendChild(this.#renderer.domElement);
    }

    #initComposer() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.#composer = new THREE.EffectComposer(this.#renderer);
        this.#composer.setSize(width, height);
        this.#initRenderPass();

        if (FLAGS.ENABLE_BLOOM) {
            this.#initBloomPass();
        }

        if (FLAGS.ENABLE_NOISE) {
            this.#initShaderPass();
        }
    }

    #initRenderPass() {
        const renderPass = new THREE.RenderPass(this.#scene, this.#camera);

        this.#composer.addPass(renderPass);
    }

    #initBloomPass() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const resolution = new THREE.Vector2(width, height);
        const strength = 0.8;
        const radius = 0.5;
        const threshold = 0.1;

        const bloomPass = new THREE.UnrealBloomPass(
            resolution,
            strength,
            radius,
            threshold
        );

        this.#composer.addPass(bloomPass);
    }

    #initShaderPass() {
        const pass = new THREE.ShaderPass({
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: null
                },
                uTime: {
                    value: 1
                }
            },
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: `
                uniform float uTime;
                uniform sampler2D tDiffuse;

                varying vec2 vUv;

                float rand(vec2 seed);
                float noise(vec2 position);

                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);

                    float d = 0.05 * noise(50.0 * (100.0 * uTime + vec2(vUv.x, 20.0 * vUv.y)));

                    color = vec4(color.r - d, color.g - d, color.b - d, 1.0);

                    gl_FragColor = color;
                }

                float rand(vec2 seed) {
                    return fract(sin(dot(seed, vec2(12.9898,78.233))) * 43758.5453123);
                }

                float noise(vec2 position) {
                    vec2 blockPosition = floor(position);

                    float topLeftValue     = rand(blockPosition);
                    float topRightValue    = rand(blockPosition + vec2(1.0, 0.0));
                    float bottomLeftValue  = rand(blockPosition + vec2(0.0, 1.0));
                    float bottomRightValue = rand(blockPosition + vec2(1.0, 1.0));

                    vec2 computedValue = smoothstep(0.0, 1.0, fract(position));

                    return mix(topLeftValue, topRightValue, computedValue.x)
                        + (bottomLeftValue  - topLeftValue)  * computedValue.y * (1.0 - computedValue.x)
                        + (bottomRightValue - topRightValue) * computedValue.x * computedValue.y;
                }
            `
        });

        pass.renderToScreen = true;

        this.#composer.addPass(pass);
    }

    increaseFov() {
        if (this.#camera.fov < 120) {
            this.#camera.fov += 1;
            this.#camera.updateProjectionMatrix();
        }
    }

    decreaseFov() {
        if (this.#camera.fov > 45) {
            this.#camera.fov -= 1;
            this.#camera.updateProjectionMatrix();
        }
    }

    #initEventListeners() {
        window.addEventListener("resize", this.#onWindowResize.bind(this));
    }

    #onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.#camera.aspect = width / height;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setSize(width, height);
        this.#composer.setSize(width, height);
    }

    #updateEverything() {
        const t = performance.now() / 1000;

        this.world.update();

        this.#scene.traverse((child) => {
            if (child.isMesh) {
                const { shader } = child.material.userData;

                if (shader) {
                    shader.uniforms.uTime.value = t;
                }
            }
        });

        this.#composer.passes.forEach((pass) => {
            if (pass instanceof THREE.ShaderPass) {
                // eslint-disable-next-line no-param-reassign
                pass.uniforms.uTime.value = t % 10;
            }
        });

        {
            const x =
                this.#cameraData.positionX +
                0.3 * (Math.sin(0.1 * t) + Math.sin(0.05 * t));
            const y = this.#cameraData.positionY + 0.3 * Math.cos(0.3 * t);

            this.#camera.position.set(x, y, 1);
            this.#camera.updateProjectionMatrix();
        }
    }

    #render() {
        this.#stats.begin();
        this.#updateEverything();
        this.#composer.render(this.#scene, this.#camera);
        this.#stats.end();
    }

    #initStats() {
        this.#stats = new Stats();
        this.#stats.showPanel(0);
        document.body.appendChild(this.#stats.dom);
    }

    start() {
        this.#render();
        this.#frameRequestId = requestAnimationFrame(this.start.bind(this));
    }

    stop() {
        cancelAnimationFrame(this.#frameRequestId);
    }
    
    destroy() {
        this.stop();
        this.#audio.pause();
        this.#audio = null;
        this.#root.innerHTML = '';
        document.body.removeChild(this.#stats.dom);
        window.removeEventListener("resize", this.#onWindowResize.bind(this));
    }
}