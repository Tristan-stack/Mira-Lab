import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { BackgroundGradientAnimation } from "../Components/ui/background-gradient-animation.jsx";
import Logo from '../../img/image-removebg-preview.png'
import BackgroundGradient from '../../img/Freebie-GradientTextures-01.jpg'
import { Cover } from "@/components/ui/cover";
import { FaTasks, FaUsers, FaComments, FaChartLine, FaSyncAlt } from 'react-icons/fa';


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
                        <div className='w-10/12 bg-white backdrop-blur-sm flex justify-between items-center h-16 p-4 drop-shadow-xl'>
                                <img src={Logo} alt="" className='w-12' />
                            </div>
                    <div onClick={handleButtonClick} className="bg-white backdrop-blur-sm w-1/6 h-16 border-l-2 border-black cursor-pointer flex justify-center items-center font-semibold hover:bg-black text-black hover:text-white transition duration-300 drop-shadow-xl ">
                                Se connecter
                            </div>
                    </div>

                <div className='w-2/3 mt-20 space-y-8 mx-auto flex flex-col justify-center items-center'>
                    <h1 className="text-6xl font-bold text-white text-center leading-relaxed">
                        <span className="bg-white/20 backdrop-blur-xl border border-gray-300/30 hover:bg-white p-2 rounded-md shadow-xl duration-200 cursor-default"> <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 '>Transformez</span></span> vos projets en réussite grâce à la puissance de Mira Lab  et de la collaboration intelligente
                            .
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

                    <button className='p-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 duration-200'>Découvrir Mira Lab</button>
                    </div>
                </header>
                
            <div className='w-3/4 mx-auto'>
                
                <main className='w-full'>
                    <section className=" py-16 px-8 ">
                        <h2 className="text-5xl w-1/3 mx-auto font-bold text-center text-gray-900 mb-10">
                            Comment Mira Lab va <span className="text-purple-500">révolutionner</span> votre quotidien ?
                        </h2>
                        <div className="flex flex-wrap justify-center">
                          <div className="text-left w-full sm:w-80 m-4">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                              <FaTasks className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimisez votre gestion de projet</h3>
                            <p className="text-gray-600">
                              Mira Lab vous permet d'organiser vos projets sous forme de tableaux intuitifs. Gardez une vue d'ensemble sur vos tâches, attribuez-les facilement à votre équipe, et suivez l'avancement de chaque projet en un coup d'œil.
                            </p>
                          </div>
                          <div className="text-left w-full sm:w-80 m-4">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                              <FaUsers className="w-6 h-6 text-purple-500" />
                            </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Rejoignez des équipes et des projets privés ou publics</h3>
                            <p className="text-gray-600">
                              Collaborez en toute sécurité sur des projets publics et privés. Avec Mira Lab, vous pouvez rejoindre des équipes et des projets, que ce soit en interne ou avec des partenaires externes, pour une coopération simplifiée et productive.
                            </p>
                          </div>
                          <div className="text-left w-full sm:w-80 m-4">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                              <FaComments className="w-6 h-6 text-purple-500" />
                            </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Communiquez en temps réel</h3>
                            <p className="text-gray-600">
                              Le chat intégré de Mira Lab vous permet d’échanger instantanément avec les membres de votre équipe. Partagez des idées, réagissez rapidement aux besoins du projet et gardez votre équipe informée à chaque étape.
                            </p>
                          </div>
                          <div className="text-left w-full sm:w-80 m-4">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                              <FaChartLine className="w-6 h-6 text-purple-500" />
                            </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Suivez vos statistiques et performances</h3>
                            <p className="text-gray-600">
                              Accédez à des statistiques détaillées sur votre profil et vos projets. Mesurez votre progression, analysez vos performances et identifiez les domaines à optimiser pour améliorer votre efficacité.
                            </p>
                          </div>
                          <div className="text-left w-full sm:w-80 m-4">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                              <FaSyncAlt className="w-6 h-6 text-purple-500" />
                            </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Profitez d'une expérience en temps réel</h3>
                            <p className="text-gray-600">
                              Mira Lab vous offre une expérience collaborative en temps réel : chaque modification, ajout ou message est immédiatement visible par votre équipe, pour une synergie parfaite sans délai.
                            </p>
                          </div>
                        </div>
                    </section>

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