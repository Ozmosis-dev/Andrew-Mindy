
"use client";

import styles from './DesignGallery.module.scss';
import { motion } from 'framer-motion';
import Image from 'next/image';

const projects = [
    { id: 1, title: "Home Trust", category: "Web Design", image: "/images/HomeTrust-1024x576.png" },
    { id: 2, title: "Hope State", category: "Branding", image: "/images/Hope-State-1024x576.png" },
    { id: 3, title: "Doughlicious", category: "Marketing", image: "/images/Doughlicious-Vegan-1024x576.png" },
    { id: 4, title: "Kai", category: "UI/UX", image: "/images/Kai-1-1024x576.png" },
    { id: 5, title: "Kharis", category: "Web Design", image: "/images/Kharis-1-1024x576.png" },
    { id: 6, title: "Resting Place", category: "Branding", image: "/images/Resting-Place-1-1024x576.png" },
    { id: 7, title: "TST", category: "Web Development", image: "/images/TST-1-1024x576.png" },
    { id: 8, title: "Wise", category: "App Design", image: "/images/Wise-1-1024x576.png" },
];

export default function DesignGallery() {
    return (
        <div className={styles.gallery}>
            {projects.map((project, index) => (
                <motion.div
                    key={project.id}
                    className={styles.item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Image
                        src={project.image}
                        alt={project.title}
                        width={1024}
                        height={576}
                    />
                    <div className={styles.overlay}>
                        <h4>{project.title}</h4>
                        <p>{project.category}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
