export const COLOR_PALETTE = Object.freeze({
    grey: 0x101010,
    red: 0x120000,
    purple: 0x170124,
    pink: 0x360326,
    blue: 0x041833,
    pink1: 0x190713,
    black: 0x010101,
    white: 0xeeeeee,
    color1: 0xf72585,
    color2: 0xb5179e,
    color3: 0x7209b7,
    color4: 0x560bad,
    color5: 0x480ca8,
    color6: 0x3a0ca3,
    color7: 0x3f37c9,
    color8: 0x4361ee,
    color9: 0x4895ef,
    color10: 0x4cc9f0
});

export const COLOR_PALETTE_GLSL = Object.freeze({
    black: "vec4(0.04, 0.04, 0.04, 1.0)",
    white: "vec4(0.933, 0.933, 0.933, 1.0)",
    color1: "vec4(0.969, 0.145, 0.522, 1.0)",
    color2: "vec4(0.71, 0.09, 0.62, 1.0)",
    color3: "vec4(0.447, 0.035, 0.718, 1.0)",
    color4: "vec4(0.337, 0.043, 0.678, 1.0)",
    color5: "vec4(0.282, 0.047, 0.659, 1.0)",
    color6: "vec4(0.227, 0.047, 0.639, 1.0)",
    color7: "vec4(0.247, 0.216, 0.788, 1.0)",
    color8: "vec4(0.263, 0.38, 0.933, 1.0)",
    color9: "vec4(0.282, 0.584, 0.937, 1.0)",
    color10: "vec4(0.298, 0.788, 0.941, 1.0)",
});

export class DefaultMaterial extends THREE.MeshStandardMaterial {
    constructor() {
        super({
            color: COLOR_PALETTE.white
        });
    }
}

export class CarMaterial extends THREE.MeshStandardMaterial {
    constructor(color) {
        super({
            color: color
        });
    }
}

export class LightMaterial extends THREE.MeshStandardMaterial {
    constructor() {
        super({
            color: COLOR_PALETTE.color1
        });
    }
}

export class WheelMaterial extends THREE.MeshStandardMaterial {
    constructor() {
        super({
            color: COLOR_PALETTE.black
        });
    }
}

export class MountainMaterial extends THREE.MeshBasicMaterial {
    constructor() {
        super({
            color: COLOR_PALETTE.black
        });
    }
}

export class CustomMaterial extends THREE.MeshStandardMaterial {
    onBeforeCompile(shader) {
        shader.uniforms.uTime = { value: 0.0 };

        shader.vertexShader = shader.vertexShader.replace(
            "#include <uv_pars_vertex>",
            `varying vec2 vUv;
            uniform float uTime;`
        );

        shader.vertexShader = shader.vertexShader.replace(
            "#include <uv_vertex>",
            "vUv = uv;"
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            "varying vec3 vViewPosition;",
            `varying vec3 vViewPosition;
            varying vec2 vUv;
            uniform float uTime;`
        );

        this.userData.shader = shader;
    }
}

export class CustomTransparentMaterial extends CustomMaterial {
    constructor() {
        super({
            transparent: true
        });
    }
}

export class RoadMaterial extends CustomTransparentMaterial {
    onBeforeCompile(shader) {
        super.onBeforeCompile(shader);

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `
            diffuseColor = ${COLOR_PALETTE_GLSL.black};

            float width = 0.06;

            bool isInCenter = abs(0.5 - vUv.x) < (0.01 + width / 2.0);
            bool isInRoad = abs(0.5 - vUv.x) < (width / 2.0);

            if (isInCenter) {
                diffuseColor = ${COLOR_PALETTE_GLSL.color9};
            }

            if (isInRoad) {
                diffuseColor = ${COLOR_PALETTE_GLSL.black};

                diffuseColor.a = 0.8;

                bool isInLine = (abs(0.5 - vUv.x + width / 6.0) < 0.0003)
                                && (sin(100.0 * vUv.y - 10.0 * uTime) > 0.3);
                bool isInDashedLine = (abs(0.5 - vUv.x - width / 6.0) < 0.0003)
                    && (sin(100.0 * vUv.y - 10.0 * uTime) > 0.3);

                if (isInLine || isInDashedLine) {
                    diffuseColor = ${COLOR_PALETTE_GLSL.color10};
                }
            }
            `
        );

        this.userData.shader = shader;
    }
}
export class RoadMaterial2 extends CustomTransparentMaterial {
    onBeforeCompile(shader) {
        super.onBeforeCompile(shader);

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `
            diffuseColor = ${COLOR_PALETTE_GLSL.black};

            float width = 0.06;

            bool isInCenter = abs(0.5 - vUv.x) < (0.01 + width / 2.0);
            bool isInRoad = abs(0.5 - vUv.x) < (width / 2.0);

            if (isInCenter) {
                diffuseColor = ${COLOR_PALETTE_GLSL.color9};
            }

            if (isInRoad) {
                diffuseColor = ${COLOR_PALETTE_GLSL.black};

                diffuseColor.a = 0.8;

                bool isInLine = (abs(0.5 - vUv.x + width / 6.0) < 0.0003)
                                && (mod(vUv.y * 10.0, 2.0) > 1.0);
                bool isInDashedLine = (abs(0.5 - vUv.x - width / 6.0) < 0.0003)
                                        && (mod(vUv.y * 10.0, 2.0) > 1.0);

                if (isInLine || isInDashedLine) {
                    diffuseColor = ${COLOR_PALETTE_GLSL.color10};
                }
            }
            `
        );

        this.userData.shader = shader;
    }
}

export class SunMaterial extends CustomTransparentMaterial {
    onBeforeCompile(shader) {
        super.onBeforeCompile(shader);

        // eslint-disable-next-line no-param-reassign
        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `
            diffuseColor = vec4(0.0);

            bool isInSun = distance(vUv.xy, vec2(0.5, 0.5)) < 0.5;

            if (isInSun) {
                diffuseColor = ${COLOR_PALETTE_GLSL.color1};

                float delta = 0.2 * (1.0 - vUv.y);

                diffuseColor += vec4(delta, delta, 0.0, 0.0);

                bool isInLine = sin(100.0 * vUv.y) * vUv.y > 0.3;

                if (isInLine) {
                    diffuseColor = ${COLOR_PALETTE_GLSL.color3};
                }
            }
            `
        );

        this.userData.shader = shader;
    }
}

export class BuildingMaterialA extends CustomMaterial {
    onBeforeCompile(shader) {
        super.onBeforeCompile(shader);

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `
            diffuseColor = ${COLOR_PALETTE_GLSL.black};

            bool isInWindow = vUv.y > 0.09
                && (sin(31.415 * (vUv.x - 0.05)) > 0.5)
                && (sin(100.0 * vUv.y) > 0.5);

            if (isInWindow) {
                diffuseColor = ${COLOR_PALETTE_GLSL.color7};

                if (vUv.x > 0.4 && vUv.x < 0.6) {
                    diffuseColor = ${COLOR_PALETTE_GLSL.color10};
                }
            }
            `
        );

        this.userData.shader = shader;
    }
}

export class BuildingMaterialB extends CustomMaterial {
    onBeforeCompile(shader) {
        super.onBeforeCompile(shader);

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `
            diffuseColor = ${COLOR_PALETTE_GLSL.black};

            bool isInWindow = vUv.y > 0.1
                && vUv.y < 0.5
                && (sin(50.0 * 3.1415 * (vUv.x - 0.05)) > -0.8)
                && (sin(50.0 * vUv.y) > 0.5);

            if (isInWindow) {
                diffuseColor = ${COLOR_PALETTE_GLSL.color1};

                if (vUv.y < 0.3) {
                    diffuseColor = ${COLOR_PALETTE_GLSL.color4};
                }
            }
            `
        );

        this.userData.shader = shader;
    }
}

export class BuildingMaterialC extends CustomMaterial {
    onBeforeCompile(shader) {
        super.onBeforeCompile(shader);

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `
            diffuseColor = ${COLOR_PALETTE_GLSL.black};

            bool isInWindow = vUv.y > 0.5
                && vUv.y < 0.8
                && (sin(5.0 * 3.1415 * (vUv.x - 0.05)) > -0.8)
                && (sin(50.0 * vUv.y) > 0.5);

            if (isInWindow) {
                diffuseColor = ${COLOR_PALETTE_GLSL.color9};
            }
            `
        );

        this.userData.shader = shader;
    }
}

export class BuildingMaterialD extends CustomMaterial {
    onBeforeCompile(shader) {
        super.onBeforeCompile(shader);

        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `
            diffuseColor = ${COLOR_PALETTE_GLSL.black};

            bool isInWindow = vUv.y > 0.1
                && (sin(50.0 * vUv.y) > -0.8);

            if (isInWindow) {
                diffuseColor = ${COLOR_PALETTE_GLSL.color5};
            }
            `
        );

        this.userData.shader = shader;
    }
}
