
import React from 'react';

const Tooltip = ({ children, text }) => {
    return (
        <div className="relative flex items-center group">
            {children}
            <div className="absolute top-full w-24 mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-50">
                {text}
            </div>
        </div>
    );
};

export default Tooltip;