import {
    COLOR_PALETTE,
    DefaultMaterial,
    CarMaterial,
    LightMaterial,
    WheelMaterial,
    MountainMaterial,
    RoadMaterial,
    RoadMaterial2,
    SunMaterial,
    BuildingMaterialA,
    BuildingMaterialB,
    BuildingMaterialC,
    BuildingMaterialD
} from './material.js';

function isMobile() {
    let check = false;

    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);

    return check;
}

const IS_MOBILE_DEVICE = isMobile();

export const FLAGS = Object.freeze({
    ENABLE_SHADOWS: !IS_MOBILE_DEVICE,
    ENABLE_BLOOM: !IS_MOBILE_DEVICE,
    ENABLE_NOISE: !IS_MOBILE_DEVICE
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class MaterialsLibrary {
    static default = new DefaultMaterial();
    static road = new RoadMaterial();
    static road2 = new RoadMaterial2();
    static sun = new SunMaterial();
    static mountain = new MountainMaterial();
    static car = new CarMaterial();
    static wheel = new WheelMaterial();
    static light = new LightMaterial();
    static buildingA = new BuildingMaterialA();
    static buildingB = new BuildingMaterialB();
    static buildingC = new BuildingMaterialC();
    static buildingD = new BuildingMaterialD();
}

class Road extends THREE.Group {
    constructor(material) {
        super();

        const geometry = new THREE.PlaneGeometry();
        const road = new THREE.Mesh(geometry, material);

        road.scale.set(200, 200, 1);
        road.rotation.set(-Math.PI / 2, 0, 0);

        if (FLAGS.ENABLE_SHADOWS) {
            road.receiveShadow = true;
        }

        this.add(road);

        const reflector = new THREE.Reflector(new THREE.PlaneGeometry(10, 10), {
            color: new THREE.Color(0x7f7f7f),
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio
        });

        reflector.position.set(0, -0.1, 0);
        reflector.scale.set(200, 200, 1);
        reflector.rotation.set(-Math.PI / 2, 0, 0);

        this.add(reflector);
    }
}

class Sun extends THREE.Group {
    constructor() {
        super();

        const geometry = new THREE.PlaneGeometry();
        const material = MaterialsLibrary.sun;
        const sun = new THREE.Mesh(geometry, material);

        sun.scale.set(50, 50, 1);

        this.add(sun);
    }
}

class Mountain extends THREE.Group {
    constructor() {
        super();

        const material = MaterialsLibrary.mountain;
        const shape = new THREE.Shape();

        shape.moveTo(0, 0);
        shape.lineTo(100, 0);
        shape.lineTo(100, 50);
        shape.lineTo(50, 10);
        shape.lineTo(20, 15);
        shape.lineTo(15, 5);
        shape.lineTo(10, 10);
        shape.lineTo(0, 0);
        shape.lineTo(-5, 3);
        shape.lineTo(-10, 10);
        shape.lineTo(-12, 8);
        shape.lineTo(-100, 50);
        shape.lineTo(-100, 0);
        shape.lineTo(0, 0);

        const geometry = new THREE.ExtrudeGeometry(shape);
        const mountain = new THREE.Mesh(geometry, material);

        this.add(mountain);
    }
}

class Car extends THREE.Group {
    constructor(color) {
        super();

        {
            const material = new CarMaterial(color);
            const shape = new THREE.Shape();

            shape.moveTo(0, 0);
            shape.lineTo(4, 0);
            shape.lineTo(3.8, 0.3);
            shape.lineTo(-0.1, 0.7);
            shape.lineTo(0, 0);

            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 1.5,
                bevelThickness: 0.2
            });

            const body = new THREE.Mesh(geometry, material);

            body.position.set(0, 0.3, 0);

            this.add(body);
        }

        {
            const material = new CarMaterial(color);
            const geometry = new THREE.CylinderGeometry(0.6, 1.2, 0.5, 4);
            const roof = new THREE.Mesh(geometry, material);

            roof.position.set(1.5, 1, 0.8);
            roof.rotation.set(0, Math.PI / 4, 0);

            this.add(roof);
        }

        {
            const material = MaterialsLibrary.light;
            const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 12);
            const light1 = new THREE.Mesh(geometry, material);

            light1.position.set(-0.2, 0.9, 0);
            light1.rotation.set(0, 0, Math.PI / 2);

            this.add(light1);

            const light2 = new THREE.Mesh(geometry, material);

            light2.position.set(-0.2, 0.9, 0.3);
            light2.rotation.set(0, 0, Math.PI / 2);

            this.add(light2);

            const light3 = new THREE.Mesh(geometry, material);

            light3.position.set(-0.2, 0.9, 1.2);
            light3.rotation.set(0, 0, Math.PI / 2);

            this.add(light3);

            const light4 = new THREE.Mesh(geometry, material);

            light4.position.set(-0.2, 0.9, 1.5);
            light4.rotation.set(0, 0, Math.PI / 2);

            this.add(light4);
        }

        {
            const material = MaterialsLibrary.wheel;

            const geometry = new THREE.CylinderGeometry(1, 1, 1, 12);
            const wheel1 = new THREE.Mesh(geometry, material);

            wheel1.scale.set(0.33, 2, 0.33);
            wheel1.position.set(3, 0.33, 0.75);
            wheel1.rotation.set(Math.PI / 2, 0, 0);

            this.add(wheel1);

            const wheel2 = new THREE.Mesh(geometry, material);

            wheel2.scale.set(0.33, 2, 0.33);
            wheel2.position.set(0.7, 0.33, 0.75);
            wheel2.rotation.set(Math.PI / 2, 0, 0);

            this.add(wheel2);
        }
    }
}

class BuildingA extends THREE.Group {
    constructor() {
        super();

        const material = MaterialsLibrary.buildingA;
        const geometry = new THREE.BoxGeometry();
        const building = new THREE.Mesh(geometry, material);

        building.scale.set(10, 15, 10);
        building.position.set(0, -3, 0);

        if (FLAGS.ENABLE_SHADOWS) {
            building.castShadow = true;
        }

        this.add(building);

        const roofGeometry = new THREE.ConeGeometry(5, 15, 7);
        const roof = new THREE.Mesh(roofGeometry, material);

        roof.position.set(0, 5, 0);

        this.add(roof);
    }
}

class BuildingB extends THREE.Group {
    constructor() {
        super();

        const material = MaterialsLibrary.buildingB;
        const geometry = new THREE.CylinderGeometry();
        const building = new THREE.Mesh(geometry, material);

        building.scale.set(5, 15, 5);
        building.position.set(0, -3, 0);

        if (FLAGS.ENABLE_SHADOWS) {
            building.castShadow = true;
        }

        this.add(building);

        const roofGeometry = new THREE.SphereGeometry(7);
        const roof = new THREE.Mesh(roofGeometry, material);

        roof.position.set(0, 2, 0);
        roof.rotation.set(0, 0.3, 0);

        this.add(roof);
    }
}

class BuildingC extends THREE.Group {
    constructor() {
        super();

        const material = MaterialsLibrary.buildingC;
        const geometry = new THREE.BoxGeometry();
        const building = new THREE.Mesh(geometry, material);

        building.scale.set(5, 5, 5);
        building.position.set(0, -8, 0);

        if (FLAGS.ENABLE_SHADOWS) {
            building.castShadow = true;
        }

        this.add(building);
    }
}

class BuildingD extends THREE.Group {
    constructor() {
        super();

        const material = MaterialsLibrary.buildingD;
        const geometry = new THREE.ConeGeometry(1, 1, 3);
        const building = new THREE.Mesh(geometry, material);

        building.scale.set(5, 20, 5);
        building.rotation.set(0, 1, 0);

        if (FLAGS.ENABLE_SHADOWS) {
            building.castShadow = true;
        }

        this.add(building);
    }
}

class City extends THREE.Group {
    static #getRandomBuilding() {
        const choice = Math.random();

        if (choice < 0.2) {
            return new BuildingA();
        }

        if (choice < 0.3) {
            return new BuildingB();
        }

        if (choice < 0.9) {
            return new BuildingC();
        }

        return new BuildingD();
    }

    constructor() {
        super();

        for (let z = 0; z < 200; z += 20) {
            for (let x = 70; x >= 10; x -= 20) {
                this.#initBuilding(x, z);
            }

            for (let x = 120; x <= 180; x += 20) {
                this.#initBuilding(x, z);
            }
        }
    }

    #initBuilding(x, z) {
        const building = City.#getRandomBuilding();

        building.position.set(x, 20 / 2, z);

        this.add(building);
    }

    update() {
        this.children.forEach((building) => {
            const { x, z } = building.position;

            let newZ = z - 0.5;

            if (newZ < 0) {
                newZ = 200;
            }

            const y = newZ <= 150 ? 10 : 10 + 20 * ((150 - newZ) / 50);

            building.position.set(x, y, newZ);
        });
    }
}

class Stars extends THREE.Group {
    constructor() {
        super();

        const geometry = new THREE.SphereGeometry();
        const material = MaterialsLibrary.light;

        for (let x = -900; x < 900; x += 30) {
            for (let y = 0; y < 400; y += 30) {
                const star = new THREE.Mesh(geometry, material);

                const dx = 25 * Math.random();
                const dy = 25 * Math.random();
                const s = Math.random();

                star.scale.set(s, s, s);
                star.position.set(x + dx, y + dy, 0);

                this.add(star);
            }
        }
    }
}

class ObjectsLibrary {
    static road = new Road(MaterialsLibrary.road);
    static road2 = new Road(MaterialsLibrary.road2);
    static sun = new Sun();
    static mountain = new Mountain();
    static car = new Car(COLOR_PALETTE.black);
    static enemyCar = shuffleArray([
        new Car(COLOR_PALETTE.purple),
        new Car(COLOR_PALETTE.red),
        new Car(COLOR_PALETTE.pink),
        new Car(COLOR_PALETTE.pink1),
        new Car(COLOR_PALETTE.blue),
        new Car(COLOR_PALETTE.grey),
    ]);
    static city = new City();
    static stars = new Stars();
}

export class SandboxWorld extends THREE.Group {
    #savedObjects;
    #currentLane;
    #lanes;
    #gameOver;
    #moveSpeed;
    #enemyCars; // Array to store enemy cars
    #lastSpawnTime; // Time of the last enemy car spawn

    constructor() {
        super();
        this.#initLanes();
        this.#initObjects();
        this.#initLights();
        this.#enemyCars = [];
        this.#lastSpawnTime = 0;
        this.#initEnemyCars();
        this.crashSound = new Audio('./crash.mp3');
        this.driftSound = new Audio('./brake.m4a');
        this.isDriftSoundPlaying = false;
        this.crashSound.volume = 0.8;
        this.driftSound.volume = 0.08;
    }

    #initLanes() {
        this.#lanes = [-3, 1, 4];
        this.#currentLane = 1; // Start in the middle lane
        this.#moveSpeed = 1; // Adjust this value to change lane change speed
    }

    #initObjects() {
        const { road, road2, car, sun, city, mountain, stars } = ObjectsLibrary;
        road.position.set(0, 0, 100);
        sun.position.set(0, 10, 200);
        sun.rotation.set(-Math.PI, 0, 0);
        city.position.set(-100, 0, 0);
        mountain.position.set(0, 0, 200);
        car.position.set(this.#lanes[this.#currentLane], 0, 10);
        car.rotation.set(0, -Math.PI / 2, 0);
        stars.position.set(0, 0, 250);

        this.add(road);
        this.add(sun);
        this.add(car);
        this.add(city);
        this.add(mountain);
        this.add(stars);

        window.addEventListener('crash', () => {
            this.crashSound.play();
            this.remove(road);
            road2.position.set(0, 0, 100);

            const rotationAngle = car.position.x < 1 ? -3 * Math.PI / 4 : -Math.PI / 4;
            car.rotation.set(0, rotationAngle, 0);

            car.position.z = 12;
            if (car.position.x < 0) {
                car.position.x = -1;
            } else if (car.position.x < 1.5) {
                car.position.x = -0.5;
            } else {
                car.position.x = 2;
            }

            this.add(road2);
        });

        this.#savedObjects = { car, city };
    }

    #initLights() {
        const ambient = new THREE.AmbientLight({
            color: COLOR_PALETTE.color3,
            intensity: 0.1
        });
        this.add(ambient);

        const point = new THREE.PointLight({
            color: COLOR_PALETTE.color1,
            intensity: 5,
            decay: 0.5,
            distance: 300
        });
        point.position.set(100, 30, 180);
        if (FLAGS.ENABLE_SHADOWS) {
            point.castShadow = true;
        }
        this.add(point);
        const point2 = new THREE.PointLight({
            color: COLOR_PALETTE.color1,
            intensity: 5,
            decay: 0.5,
            distance: 300
        });
        point2.position.set(-300, 30, 180);
        if (FLAGS.ENABLE_SHADOWS) {
            point2.castShadow = true;
        }
        this.add(point2);
    }

    playDriftSound() {
        if (!this.isDriftSoundPlaying) {
            this.isDriftSoundPlaying = true;
            this.driftSound.currentTime = 0; // Reset to start
            this.driftSound.play();
            setTimeout(() => {
                this.driftSound.pause();
                this.isDriftSoundPlaying = false;
            }, 420); // Pause after 1 second
        }
    }

    changeLane(direction) {
        const newLane = this.#currentLane + direction;
        if (newLane >= 0 && newLane < this.#lanes.length && newLane !== this.#currentLane) {
            this.#currentLane = newLane;
            this.playDriftSound();
        }
    }

    setLane(lane) {
        if (lane >= 0 && lane < this.#lanes.length && lane !== this.#currentLane) {
            this.#currentLane = lane;
            this.playDriftSound();
        }
    }

    #initEnemyCars() {
        const { enemyCar } = ObjectsLibrary;

        for (let i = 0; i < 6; i++) {
            const lane = this.#lanes[Math.floor(Math.random() * this.#lanes.length)];
            const newEnemyCar = enemyCar[i];
            newEnemyCar.position.set(lane, 0, -40 * (i + 1));
            newEnemyCar.rotation.set(0, -Math.PI / 2, 0);
            this.add(newEnemyCar);
            this.#enemyCars.push(newEnemyCar);
        }
    }

    update() {
        if (this.#gameOver) {
            return;
        }
        const t = performance.now() / 1000;
        // Update player car position
        const targetX = this.#lanes[this.#currentLane];
        const currentX = this.#savedObjects.car.position.x;
        const newX = THREE.MathUtils.lerp(currentX, targetX, 0.1);

        this.#savedObjects.car.position.set(newX, 0, 10);
        this.#savedObjects.city.update();

        // Move enemy cars and reuse them
        this.#enemyCars.forEach((enemyCar) => {
            enemyCar.position.z += 0.1; // Move forward
            if (enemyCar.position.z > 150) { // Reposition if it passes the player
                const lane = this.#lanes[Math.floor(Math.random() * this.#lanes.length)];
                enemyCar.position.set(lane, 0, -50); // Reset position behind the camera
            }
        });

        this.checkCollisions();
    }

    checkCollisions() {
        const playerCar = this.#savedObjects.car;
        const playerPosition = playerCar.position;


        this.#enemyCars.forEach((enemyCar) => {
            const enemyPosition = enemyCar.position;
            const distance = playerPosition.distanceTo(enemyPosition);

            if (distance < 1) {
                this.#gameOver = true;
                var evt = new CustomEvent('crash', { detail: true });
                window.dispatchEvent(evt);

                setTimeout(() => {
                    var evt = new CustomEvent('gameover', { detail: true });
                    window.dispatchEvent(evt);
                }, 1500);
            }
        });
    }
}
