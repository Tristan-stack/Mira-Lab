import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { BackgroundGradientAnimation } from "../Components/ui/background-gradient-animation.jsx";
import Logo from '../../img/image-removebg-preview.png'
import BackgroundGradient from '../../img/Freebie-GradientTextures-01.jpg'
import { Cover } from "@/components/ui/cover";

const Accueil = () => {
    const handleButtonClick = () => {
        Inertia.visit('/home');
    };

    return (
        <div
            className='w-full h-svh'
            style={{
                backgroundImage: `url(${BackgroundGradient})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
                <header className='h-svh '>
                    <div className='flex'>  
                        <div className='w-10/12 bg-white/15 backdrop-blur-sm flex justify-between items-center h-16 p-4 drop-shadow-xl'>
                                <img src={Logo} alt="" className='w-12' />
                            </div>
                    <div onClick={handleButtonClick} className="bg-white/15 backdrop-blur-sm w-1/6 h-16 border-l-2 border-white/40 cursor-pointer flex justify-center items-center font-semibold hover:bg-white text-white hover:text-black transition duration-300 drop-shadow-xl ">
                                Se connecter
                            </div>
                    </div>

                <div className='w-2/3 mt-20 space-y-7 mx-auto'>
                    <h1 className="text-6xl font-bold text-white text-center leading-loose">
                        <span className="bg-white/20 backdrop-blur-xl border border-gray-300/30 hover:bg-white p-2 mr-2 rounded-md shadow-xl duration-200 cursor-default"> <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 '>Transformez </span> </span> vos projets en réussite grâce à la puissance de Mira Lab  et de la <Cover >collaboration intelligente</Cover>.
                        </h1>

                    <p className='text-white tracking-wide w-3/4 mx-auto text-center text-3xl leading-relaxed'>Mira Lab 
                        <span className="bg-white/20 backdrop-blur-xl border border-gray-300/30 hover:bg-white p-1 mx-2 rounded-md shadow-xl duration-200 cursor-default">
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 '>optimise la gestion 
                        </span> 
                        </span> de vos projets et transforme chaque étape en succès collaboratif, 
                        <span className="bg-white/20 backdrop-blur-xl border border-gray-300/30 hover:bg-white p-1 mx-2 rounded-md shadow-xl duration-200 cursor-default">
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-300 '>sans effort
                        </span>
                    </span> supplémentaire.
                    
                    </p>
                    </div>
                </header>
                
            <div className='w-2/3 mx-auto'>
                
                <main className='h-96'>
                    {/* landepage */}
                    <section></section>

                    {/* avantage Mira Lab */}
                    <section></section>

                    {/* fonctionnalités */}
                    <section></section>

                    {/* FAQ */}
                    <section></section>
                </main>

                <footer></footer>
            </div>
        </div>
    );
};

export default Accueil;