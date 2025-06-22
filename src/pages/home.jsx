import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  MapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const ModernHome = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const b2bSolutions = [
    {
      id: "ghost-mail",
      icon: <EnvelopeIcon className="h-8 w-8" />,
      title: "Ghost Mail Hunter",
      description: "Recherchez et trouvez des adresses email professionnelles avec nos algorithmes avancés de prospection.",
      features: ["Scan de bases de données", "Vérification en temps réel", "Export en masse"],
      path: "/gMail",
    },
    {
      id: "company-trace",
      icon: <MagnifyingGlassIcon className="h-8 w-8" />,
      title: "Company Trace",
      description: "Générez des emails d'entreprise et identifiez les patterns de contact pour vos campagnes.",
      features: ["Génération automatique", "Patterns d'entreprise", "Intégration CRM"],
      path: "/company-trace",
    },
    {
      id: "map-sniffer",
      icon: <MapIcon className="h-8 w-8" />,
      title: "MapSniffer",
      description: "Découvrez des entreprises géographiquement avec notre interface cartographique interactive.",
      features: ["Recherche géolocalisée", "Filtres avancés", "Export de données"],
      path: "/B2BMap",
    },
    {
      id: "trustpilot-integration",
      icon: <StarIcon className="h-8 w-8" />,
      title: "Shadowpilot Business",
      description: "Intégrez et gérez vos avis clients Shadowpilot pour améliorer votre réputation en ligne.",
      features: ["Gestion des avis", "Analytics de réputation", "Réponses automatisées"],
      path: "/shadowpilot",
    },
  ];

  const b2cSolutions = [
    {
      id: "phonora-map",
      icon: <PhoneIcon className="h-8 w-8" />,
      title: "Phonora Map Search",
      description: "Trouvez vos contacts rapidement avec notre moteur de recherche basé sur la cartographie.",
      features: ["Visualisation géographique", "Recherche intuitive", "Connexions locales"],
      path: "/map-search",
    },
    {
      id: "phonora-advanced",
      icon: <MagnifyingGlassIcon className="h-8 w-8" />,
      title: "Phonora Advanced Search",
      description: "Recherche avancée avec filtres personnalisés et résultats instantanés.",
      features: ["Filtres personnalisés", "Résultats instantanés", "Champs personnalisables"],
      path: "/personal-search",
    },
    {
      id: "vizora",
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Vizora",
      description: "Transformez vos données de contact en insights avec des outils de visualisation.",
      features: ["Tableaux de bord", "Graphiques interactifs", "Analytics avancés"],
      path: "/statistics",
    },
  ];

  const handleTabToggle = (type) => {
    setActiveTab(activeTab === type ? null : type);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20  ">
          <div className={`text-center transition-all duration-1000  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 dark:text-gray-100">
              Gestion de données
              <span className="block text-blue-600">simplifiée</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              DataPull vous aide à organiser, rechercher et visualiser vos données de contact 
              avec facilité. Téléchargez vos données et laissez notre système s'occuper du reste.
            </p>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-gray-100">
            Choisissez votre solution
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des outils adaptés à vos besoins, que vous soyez une entreprise ou un particulier
          </p>
        </div>

        {/* Solution Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* B2B Card */}
          <div className={`group cursor-pointer transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-purple-200">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Solutions B2B
              </h3>
              <p className="text-gray-600 mb-8 text-center">
                Outils de gestion de données de niveau entreprise pour les équipes. 
                Fonctionnalités avancées pour la collaboration professionnelle.
              </p>
              <button
                onClick={() => handleTabToggle("b2b")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {activeTab === "b2b" ? "Masquer les options" : "Découvrir"}
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* B2C Card */}
          <div className={`group cursor-pointer transition-all duration-500 delay-200  ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-purple-200">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 mx-auto group-hover:bg-purple-200 transition-colors">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Solutions B2C
              </h3>
              <p className="text-gray-600 mb-8 text-center">
                Gestion de contacts personnelle qui simplifie votre réseau. 
                Plans abordables pour freelances et particuliers.
              </p>
              <button
                onClick={() => handleTabToggle("b2c")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {activeTab === "b2c" ? "Masquer les options" : "Découvrir"}
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Solutions */}
        {activeTab && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 transition-all duration-500">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {activeTab === "b2b" ? "Solutions Business" : "Solutions Personnelles"}
            </h3>
            
            <div className="grid gap-8">
              {(activeTab === "b2b" ? b2bSolutions : b2cSolutions).map((solution, index) => (
                <div
                  key={solution.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row items-start gap-6">
                    <div className="flex items-center gap-4 lg:w-1/3">
                      <div className={`p-3 rounded-xl ${activeTab === "b2b" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                        {solution.icon}
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {solution.title}
                      </h4>
                    </div>
                    
                    <div className="lg:w-2/3">
                      <p className="text-gray-600 mb-4 dark:text-gray-400">
                        {solution.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {solution.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 rounded-full text-sm dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <CheckIcon className="h-3 w-3 text-green-500" />
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => navigate(solution.path)}
                        className={`${activeTab === "b2b" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"} text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300`}
                      >
                        Accéder maintenant
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className=" text-gray-900 dark:text-gray-100 py-16 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-gray-900 dark:text-gray-100 mb-8 text-lg">
            Rejoignez des milliers d'utilisateurs qui font confiance à DataPull 
            pour gérer leurs données efficacement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-300">
              Essai gratuit
            </button>
            <button className="border border-gray-200 hover:border-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-300 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHome;