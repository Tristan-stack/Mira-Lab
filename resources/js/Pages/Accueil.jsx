import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { BackgroundGradientAnimation } from "../Components/ui/background-gradient-animation.jsx";
import Logo from '../../img/image-removebg-preview.png';
import BackgroundGradient from '../../img/Freebie-GradientTextures-01.jpg';
import { Cover } from "@/components/ui/cover";
import { FaTasks, FaUsers, FaComments, FaChartLine, FaSyncAlt } from 'react-icons/fa';

const Accueil = () => {
  const handleButtonClick = () => {
    Inertia.visit('/home');
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className='flex'>
        <div className='w-10/12 bg-white flex justify-between items-center h-16 p-4 drop-shadow-xl'>
          <img src={Logo} alt="" className='w-12' />
        </div>
        <div onClick={handleButtonClick} className="bg-white w-1/6 h-16 border-l-2 border-black cursor-pointer flex justify-center items-center font-semibold hover:bg-black text-black hover:text-white transition duration-300 drop-shadow-xl">
          Se connecter
        </div>
      </div>

      <div
        className='p-32'
        style={{
          backgroundImage: `url(${BackgroundGradient})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <header className='flex flex-col'>
          <div className='w-2/3 space-y-8 mx-auto flex flex-col justify-center items-center'>
            <h1 className="text-6xl font-bold text-white text-center leading-relaxed">
              <span className="bg-white/20 backdrop-blur-xl border border-gray-300/30 hover:bg-white p-2 rounded-md shadow-xl duration-200 cursor-default">
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'>Transformez</span>
              </span> vos projets en réussite grâce à la puissance de Mira Lab et de la collaboration intelligente.
            </h1>

            <p className='text-white tracking-wide w-3/4 mx-auto text-center text-3xl leading-relaxed'>
              Mira Lab
              <span className="bg-white/20 backdrop-blur-xl border border-gray-300/30 hover:bg-white p-1 mx-2 rounded-md shadow-xl duration-200 cursor-default">
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'>optimise la gestion</span>
              </span> de vos projets et transforme chaque étape en succès collaboratif,
              <span className="bg-white/20 backdrop-blur-xl border border-gray-300/30 hover:bg-white p-1 mx-2 rounded-md shadow-xl duration-200 cursor-default">
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-300'>sans effort</span>
              </span> supplémentaire.
            </p>

            <button className='p-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 duration-200' onClick={() => handleScrollTo("first-ancre")}>
              Découvrir Mira Lab
            </button>
          </div>
        </header>
      </div>

      <main className='w-full'>
        <div className=''>
          <section className="p-16 w-3/4 mx-auto" id='first-ancre'>
            <h2 className="text-5xl w-1/3 mx-auto font-bold text-center text-gray-900 mb-10">
              Comment Mira Lab va <span className="text-purple-500">révolutionner</span> votre quotidien ?
            </h2>
            <div className="flex flex-wrap justify-center">
              <div className="text-left w-full sm:w-80 m-4">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                  <FaTasks className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimisez vos projets et collaborez efficacement</h3>
                <p className="text-gray-600">
                  Mira Lab vous permet d'organiser vos projets sous forme de tableaux intuitifs, de suivre l'avancement des tâches et de collaborer avec des équipes sur des projets publics ou privés. Simplifiez la gestion et renforcez la productivité.
                </p>
              </div>
              <div className="text-left w-full sm:w-80 m-4">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                  <FaComments className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Communiquez et travaillez en temps réel</h3>
                <p className="text-gray-600">
                  Échangez instantanément avec votre équipe grâce au chat intégré, partagez des idées et réagissez rapidement aux besoins des projets. Chaque modification ou message est immédiatement visible pour une synergie parfaite.
                </p>
              </div>
              <div className="text-left w-full sm:w-80 m-4">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                  <FaChartLine className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysez et améliorez vos performances</h3>
                <p className="text-gray-600">
                  Accédez à des statistiques détaillées sur vos projets et votre profil. Mesurez vos progrès, identifiez les points à optimiser et améliorez continuellement votre efficacité pour atteindre vos objectifs.
                </p>
              </div>
            </div>
          </section>

          {/* avantage Mira Lab */}

          <section className="w-full p-32 bg-purple-100/60">
            <div className='w-3/4 mx-auto text-center'>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Comment Mira Lab <span className="text-purple-500">fonctionne</span> ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Mira Lab vous aide à gérer vos projets de manière intuitive, en facilitant la collaboration en temps réel, le suivi des performances, et en optimisant chaque étape de votre workflow.
              </p>
              <button className="px-8 py-3 text-white bg-purple-500 rounded-lg mb-12 hover:bg-purple-600">
                Découvrir la plateforme →
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <h3 className="text-4xl font-bold text-purple-500 mb-2">01</h3>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Créez et organisez vos projets</h4>
                  <p className="text-gray-600">
                    Connectez-vous à Mira Lab et commencez par organiser vos projets sous forme de tableaux intuitifs. Ajoutez des équipes et répartissez les tâches facilement.
                  </p>
                </div>

                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <h3 className="text-4xl font-bold text-purple-500 mb-2">02</h3>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Collaborez en temps réel</h4>
                  <p className="text-gray-600">
                    Travaillez avec votre équipe de manière synchronisée. Les messages et mises à jour sont visibles en temps réel, permettant une collaboration fluide et efficace.
                  </p>
                </div>

                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <h3 className="text-4xl font-bold text-purple-500 mb-2">03</h3>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Suivez vos performances</h4>
                  <p className="text-gray-600">
                    Accédez à des statistiques avancées pour mesurer vos progrès, analyser la productivité de votre équipe et ajuster vos stratégies en fonction des résultats.
                  </p>
                </div>

                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <h3 className="text-4xl font-bold text-purple-500 mb-2">04</h3>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Recevez des notifications</h4>
                  <p className="text-gray-600">
                    Soyez informé en temps réel des mises à jour importantes par mail ou notification, pour ne rien manquer et être toujours prêt à agir.
                  </p>
                </div>
              </div>
            </div>
          </section>


          {/* fonctionnalités */}
          <section></section>

          {/* FAQ */}
          <section></section>
        </div>
      </main>

      <footer></footer>

    </>
  );
};

export default Accueil;