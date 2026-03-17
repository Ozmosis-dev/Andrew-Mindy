
"use client";

import { useLottie } from "lottie-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimationWrapperProps {
    animationPath: string;
    className?: string;
}

export default function AnimationWrapper({ animationPath, className }: AnimationWrapperProps) {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch(animationPath)
            .then((res) => res.json())
            .then((data) => setAnimationData(data));
    }, [animationPath]);

    const options = {
        animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(options);

    if (!animationData) return null;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            {View}
        </motion.div>
    );
}
