// contexts/GradientContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRandomGradient } from '../utils/gradientUtils';

const GradientContext = createContext();

export const GradientProvider = ({ children }) => {
    const [gradient, setGradient] = useState('');

    useEffect(() => {
        setGradient(getRandomGradient());
    }, []);

    return (
        <GradientContext.Provider value={gradient}>
            {children}
        </GradientContext.Provider>
    );
};

export const useGradient = () => {
    return useContext(GradientContext);
};