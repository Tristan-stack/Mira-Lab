export const getRandomGradient = () => {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFEB33', '#33FFF6', '#8A33FF',
    ];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    let color2 = colors[Math.floor(Math.random() * colors.length)];
    while (color1 === color2) {
        color2 = colors[Math.floor(Math.random() * colors.length)];
    }
    return `linear-gradient(135deg, ${color1}, ${color2})`;
};