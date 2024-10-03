// HomePage.jsx
import React, { useEffect, useState } from 'react';
import Login from '@/Pages/Auth/Login'; // Assurez-vous d'importer votre composant Login
import anime from 'animejs';
import { BackgroundLines } from "@/components/ui/background-lines";
import { motion, useAnimation } from 'framer-motion';

const HomePage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        // Anime le texte au centre
        anime({
            targets: '#welcomeText',
            opacity: [0, 1],
            duration: 2000,
            easing: 'easeInOutQuad',
            complete: () => {
                // Après l'animation de fade in, faire fade out
                anime({
                    targets: '#welcomeText',
                    opacity: [1, 0],
                    duration: 2000,
                    easing: 'easeInOutQuad',
                    complete: () => {
                        setShowLogin(true); // Afficher le formulaire après fade out
                    }
                });
            }
        });
    }, []);

    useEffect(() => {
        if (showLogin) {
            controls.start({ opacity: 1, y: 0 });
        }
    }, [showLogin, controls]);

    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 id="welcomeText" className="text-5xl font-bold text-center">
                    Bienvenue sur Mira Lab
                </h1>

                {showLogin && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} // Position initiale et opacité
                        animate={controls} // Utilisation de l'animation définie par controls
                        transition={{ duration: 0.5 }} // Durée de l'animation
                        className="z-10"
                    >
                        <Login /> {/* Afficher le formulaire de connexion */}
                    </motion.div>
                )}
            </div>
        </BackgroundLines>
    );
};

export default HomePage;
