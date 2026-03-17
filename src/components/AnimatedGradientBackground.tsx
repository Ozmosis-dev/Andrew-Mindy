"use client";

import { useEffect, useRef, useMemo } from "react";
import { cubicBezier, useInView } from "framer-motion";

// --- Types ---

interface AnimatedGradientBackgroundProps {
    color1?: string;
    color2?: string;
    color3?: string;
    rotation?: number;
    proportion?: number; // 0-100
    scale?: number;
    speed?: number; // 0-100
    distortion?: number; // 0-100
    swirl?: number; // 0-100
    swirlIterations?: number; // 0-20
    softness?: number; // 0-100
    offset?: number;
    shape?: "Checks" | "Stripes" | "Edge";
    shapeSize?: number; // 0-100
    noiseOpacity?: number; // 0-1
    noiseScale?: number; // 0.2-2
    className?: string;
    style?: React.CSSProperties;
}

// --- Constants & Defaults ---

const PATTERN_SHAPES = {
    Checks: 0,
    Stripes: 1,
    Edge: 2,
};

const DEFAULT_PRESET = {
    color1: "#050505",
    color2: "#66B3FF",
    color3: "#FFFFFF",
    rotation: -50,
    proportion: 1,
    scale: 0.01,
    speed: 30,
    distortion: 0,
    swirl: 50,
    swirlIterations: 16,
    softness: 47,
    offset: -299,
    shape: "Checks" as const,
    shapeSize: 45,
};

const SPEED_EASE = cubicBezier(0.65, 0, 0.88, 0.77);

// --- Component ---

export default function AnimatedGradientBackground(
    props: AnimatedGradientBackgroundProps
) {
    const {
        color1 = DEFAULT_PRESET.color1,
        color2 = DEFAULT_PRESET.color2,
        color3 = DEFAULT_PRESET.color3,
        rotation = DEFAULT_PRESET.rotation,
        proportion = DEFAULT_PRESET.proportion,
        scale = DEFAULT_PRESET.scale,
        speed = DEFAULT_PRESET.speed,
        distortion = DEFAULT_PRESET.distortion,
        swirl = DEFAULT_PRESET.swirl,
        swirlIterations = DEFAULT_PRESET.swirlIterations,
        softness = DEFAULT_PRESET.softness,
        offset = DEFAULT_PRESET.offset,
        shape = DEFAULT_PRESET.shape,
        shapeSize = DEFAULT_PRESET.shapeSize,
        noiseOpacity = 0.5,
        noiseScale = 1,
        className,
        style,
    } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shaderMountRef = useRef<ShaderMount | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.1 });

    // Calculate current speed based on visibility
    const currentSpeed = useMemo(() => {
        if (isInView) {
            return SPEED_EASE(speed / 100) * 5;
        }
        return 0;
    }, [isInView, speed]);

    // Derive uniforms
    const uniforms = useMemo(() => {
        return {
            u_scale: scale,
            u_rotation: rotation,
            u_color1: getShaderColorFromString(color1),
            u_color2: getShaderColorFromString(color2),
            u_color3: getShaderColorFromString(color3),
            u_proportion: proportion / 100, // Normalize to 0-1
            u_softness: softness / 100, // Normalize to 0-1
            u_distortion: distortion / 50, // Normalize
            u_swirl: swirl / 100, // Normalize
            u_swirlIterations: swirl === 0 ? 0 : swirlIterations,
            u_shapeScale: shapeSize / 100, // Normalize
            u_shape: PATTERN_SHAPES[shape],
        };
    }, [
        scale,
        rotation,
        color1,
        color2,
        color3,
        proportion,
        softness,
        distortion,
        swirl,
        swirlIterations,
        shapeSize,
        shape,
    ]);

    // Initial Setup
    useEffect(() => {
        if (canvasRef.current && !shaderMountRef.current) {
            shaderMountRef.current = new ShaderMount(
                canvasRef.current,
                WARP_FRAGMENT_SHADER,
                uniforms,
                { alpha: true, preserveDrawingBuffer: false }, // WebGL Context Attributes
                currentSpeed,
                offset * 10 // Seed
            );
        }
        return () => {
            shaderMountRef.current?.dispose();
            shaderMountRef.current = null;
        };
    }, []); // Run once on mount

    // Update Uniforms
    useEffect(() => {
        shaderMountRef.current?.setUniforms(uniforms);
    }, [uniforms]);

    // Update Speed
    useEffect(() => {
        shaderMountRef.current?.setSpeed(currentSpeed);
    }, [currentSpeed]);

    // Update Seed/Offset
    useEffect(() => {
        shaderMountRef.current?.setSeed(offset * 10);
    }, [offset]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: "100%",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
            {noiseOpacity > 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
                        backgroundSize: `${noiseScale * 200}px`,
                        backgroundRepeat: "repeat",
                        opacity: noiseOpacity / 2, // Scaled down as per original logic
                        pointerEvents: "none",
                    }}
                />
            )}
        </div>
    );
}

// --- Shader Helper Logic ---

const WARP_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;

uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define PI 3.14159265358979323846
#define ONE_PI 3.14159265358979323846
#define TWO_PI 6.2831853071795864769252867665590

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  // Smoothstep for interpolation
  vec2 u = f * f * (3.0 - 2.0 * f);

  // Do the interpolation as two nested mix operations
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
    vec3 color1 = c1.rgb * c1.a;
    vec3 color2 = c2.rgb * c2.a;
    vec3 color3 = c3.rgb * c3.a;

    float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
    float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);

    vec3 blended_color_2 = mix(color1, color2, r1);
    float blended_opacity_2 = mix(c1.a, c2.a, r1);

    vec3 c = mix(blended_color_2, color3, r2);
    float o = mix(blended_opacity_2, c3.a, r2);
    return vec4(c, o);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv_original = uv;

    float t = .5 * u_time;

    float noise_scale = .0005 + .006 * u_scale;

    uv -= .5;
    uv *= (noise_scale * u_resolution);
    uv = rotate(uv, u_rotation * .5 * PI);
    uv /= u_pixelRatio;
    uv += .5;

    float n1 = noise(uv * 1. + t);
    float n2 = noise(uv * 2. - t);
    float angle = n1 * TWO_PI;
    uv.x += 4. * u_distortion * n2 * cos(angle);
    uv.y += 4. * u_distortion * n2 * sin(angle);

    float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
    for (float i = 1.; i <= iterations_number; i++) {
        uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
        uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
    }

    float proportion = clamp(u_proportion, 0., 1.);

    float shape = 0.;
    float mixer = 0.;
    if (u_shape < .5) {
      vec2 checks_shape_uv = uv * (.5 + 3.5 * u_shapeScale);
      shape = .5 + .5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
      mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
    } else if (u_shape < 1.5) {
      vec2 stripes_shape_uv = uv * (.25 + 3. * u_shapeScale);
      float f = fract(stripes_shape_uv.y);
      shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
      mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
    } else {
      float sh = 1. - uv.y;
      sh -= .5;
      sh /= (noise_scale * u_resolution.y);
      sh += .5;
      float shape_scaling = .2 * (1. - u_shapeScale);
      shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
      mixer = shape;
    }

    vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);

    fragColor = vec4(color_mix.rgb, color_mix.a);
}
`;

// --- Shader Mount Class ---

class ShaderMount {
    canvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;
    program: WebGLProgram | null = null;
    uniformLocations: Record<string, WebGLUniformLocation | null> = {};
    fragmentShader: string;
    rafId: number | null = null;
    lastFrameTime: number = 0;
    totalAnimationTime: number = 0;
    speed: number = 1;
    providedUniforms: Record<string, number | number[] | Float32Array>;
    hasBeenDisposed: boolean = false;
    resolutionChanged: boolean = true;
    resizeObserver: ResizeObserver | null = null;

    constructor(
        canvas: HTMLCanvasElement,
        fragmentShader: string,
        uniforms: Record<string, number | number[] | Float32Array> = {},
        webGlContextAttributes: WebGLContextAttributes,
        speed: number = 1,
        seed: number = 0
    ) {
        this.canvas = canvas;
        this.fragmentShader = fragmentShader;
        this.providedUniforms = uniforms;
        this.totalAnimationTime = seed;

        const gl = canvas.getContext("webgl2", webGlContextAttributes);
        if (!gl) {
            throw new Error("WebGL not supported");
        }
        this.gl = gl;

        this.initWebGL();
        this.setupResizeObserver();
        this.setSpeed(speed);

        // Initial render
        this.lastFrameTime = performance.now();
        this.render(performance.now());
    }

    initWebGL = () => {
        const program = createProgram(this.gl, VERTEX_SHADER_SOURCE, this.fragmentShader);
        if (!program) return;
        this.program = program;
        this.setupPositionAttribute();
        this.setupUniforms();
    };

    setupPositionAttribute = () => {
        if (!this.program) return;
        const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    };

    setupUniforms = () => {
        if (!this.program) return;
        this.uniformLocations = {
            u_time: this.gl.getUniformLocation(this.program, "u_time"),
            u_pixelRatio: this.gl.getUniformLocation(this.program, "u_pixelRatio"),
            u_resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
            ...Object.fromEntries(
                Object.keys(this.providedUniforms).map((key) => [
                    key,
                    this.gl.getUniformLocation(this.program!, key),
                ])
            ),
        };
    };

    setupResizeObserver = () => {
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.canvas);
        this.handleResize();
    };

    handleResize = () => {
        const pixelRatio = window.devicePixelRatio;
        const newWidth = this.canvas.clientWidth * pixelRatio;
        const newHeight = this.canvas.clientHeight * pixelRatio;

        if (this.canvas.width !== newWidth || this.canvas.height !== newHeight) {
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            this.resolutionChanged = true;
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            // Force render to prevent blank frames
            this.render(performance.now());
        }
    };

    render = (currentTime: number) => {
        if (this.hasBeenDisposed || !this.program) return;

        const dt = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        if (this.speed !== 0) {
            this.totalAnimationTime += dt * this.speed;
        }

        // Clear
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Use Program
        this.gl.useProgram(this.program);

        // Update Built-in Uniforms
        if (this.uniformLocations.u_time) {
            this.gl.uniform1f(this.uniformLocations.u_time, this.totalAnimationTime * 0.001);
        }

        if (this.resolutionChanged) {
            if (this.uniformLocations.u_resolution) {
                this.gl.uniform2f(
                    this.uniformLocations.u_resolution,
                    this.gl.canvas.width,
                    this.gl.canvas.height
                );
            }
            if (this.uniformLocations.u_pixelRatio) {
                this.gl.uniform1f(this.uniformLocations.u_pixelRatio, window.devicePixelRatio);
            }
            this.resolutionChanged = false;
        }

        // Update Provided Uniforms (in case they weren't updated via setUniforms, though setUniforms handles this too)
        // Actually, only update if needed. But for now, we rely on setUniforms to update values on the GPU state for those uniforms.
        // However, the original code updates provided uniforms *on change*.

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        if (this.speed !== 0) {
            this.requestRender();
        } else {
            this.rafId = null;
        }
    };

    requestRender = () => {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }
        this.rafId = requestAnimationFrame(this.render);
    };

    // setUniforms is critical
    setUniforms = (newUniforms: Record<string, number | number[] | Float32Array>) => {
        this.providedUniforms = { ...this.providedUniforms, ...newUniforms };
        if (!this.program) return;

        this.gl.useProgram(this.program);

        // Update GPU uniform values
        Object.entries(this.providedUniforms).forEach(([key, value]) => {
            const location = this.uniformLocations[key];
            if (location) {
                if (Array.isArray(value)) {
                    // Check if it's a flat array or array of arrays (matrix) - simplified for this use case
                    if (value.length === 2) this.gl.uniform2fv(location, value);
                    else if (value.length === 3) this.gl.uniform3fv(location, value);
                    else if (value.length === 4) this.gl.uniform4fv(location, value);
                } else if (typeof value === "number") {
                    this.gl.uniform1f(location, value);
                }
            }
        });

        // Optionally render a frame if not animating
        if (this.speed === 0) {
            this.render(performance.now());
        }
    };

    setSpeed = (newSpeed: number = 1) => {
        this.speed = newSpeed;
        if (this.rafId === null && newSpeed !== 0) {
            this.lastFrameTime = performance.now();
            this.rafId = requestAnimationFrame(this.render);
        } else if (this.rafId !== null && newSpeed === 0) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    };

    setSeed = (newSeed: number) => {
        // 120fps frame duration approx 8.33ms
        const oneFrameAt120Fps = 1000 / 120;
        this.totalAnimationTime = newSeed * oneFrameAt120Fps;
        this.lastFrameTime = performance.now();
        this.render(performance.now());
    };

    dispose = () => {
        this.hasBeenDisposed = true;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.gl && this.program) {
            this.gl.deleteProgram(this.program);
            this.program = null;
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    };
}

const VERTEX_SHADER_SOURCE = `#version 300 es
layout(location = 0) in vec4 a_position;
void main() {
  gl_Position = a_position;
}`;

// --- Utils ---

function createShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(
    gl: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string
) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function getShaderColorFromString(colorString: string, fallback = [0, 0, 0, 1]) {
    // Simple hex to rgba parser
    if (typeof colorString !== "string") return fallback;

    // Basic implementation for hex and common formats
    if (colorString.startsWith("#")) {
        const hex = colorString.replace(/^#/, "");
        // Expand shorthand
        const fullHex = hex.length === 3 ? hex.split("").map(c => c + c).join("") : hex;
        // Add alpha if missing
        const finalHex = fullHex.length === 6 ? fullHex + "ff" : fullHex;

        const r = parseInt(finalHex.slice(0, 2), 16) / 255;
        const g = parseInt(finalHex.slice(2, 4), 16) / 255;
        const b = parseInt(finalHex.slice(4, 6), 16) / 255;
        const a = parseInt(finalHex.slice(6, 8), 16) / 255;

        return [r, g, b, a];
    }

    // TODO: Add support for rgb/hsl if needed, but hex is most common
    return fallback;
}
