"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import {
    Draggable,
    DrawSVGPlugin,
    EaselPlugin,
    Flip,
    GSDevTools,
    InertiaPlugin,
    MotionPathHelper,
    MotionPathPlugin,
    MorphSVGPlugin,
    Observer,
    Physics2DPlugin,
    PhysicsPropsPlugin,
    PixiPlugin,
    ScrambleTextPlugin,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    SplitText,
    TextPlugin,
    RoughEase,
    ExpoScaleEase,
    SlowMo,
    CustomEase,
    CustomBounce,
    CustomWiggle
} from "gsap/all";

export default function GSAPInit() {
    useLayoutEffect(() => {
        gsap.registerPlugin(
            Draggable,
            DrawSVGPlugin,
            EaselPlugin,
            Flip,
            GSDevTools,
            InertiaPlugin,
            MotionPathHelper,
            MotionPathPlugin,
            MorphSVGPlugin,
            Observer,
            Physics2DPlugin,
            PhysicsPropsPlugin,
            PixiPlugin,
            ScrambleTextPlugin,
            ScrollTrigger,
            ScrollSmoother,
            ScrollToPlugin,
            SplitText,
            TextPlugin,
            RoughEase,
            ExpoScaleEase,
            SlowMo,
            CustomEase,
            CustomBounce,
            CustomWiggle
        );
    }, []);

    return null;
}
