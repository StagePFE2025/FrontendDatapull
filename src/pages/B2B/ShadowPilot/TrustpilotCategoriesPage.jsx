import React, { useState } from 'react';
import { Search, Utensils, Monitor, Heart, Users, Mic, ShoppingBag, Briefcase, Car, Plane, Home, GraduationCap, Scale, DollarSign, Palette, Camera, Hammer, Sparkles } from 'lucide-react';

const TrustpilotCategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const allCategories = [
    {
      name: 'Aliments, boissons & tabac',
      color: 'bg-yellow-100',
      icon: <Utensils className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Agriculture & production',
        'Bière & vin',
        'Boissons & alcool',
        'Bonbons & chocolat',
        'Boulangerie & pâtisserie',
        'Café & thé',
        'Déjeuner & traiteur',
        'Épiceries & marchés',
        'Épiceries asiatiques',
        'Fruits & légumes',
        'Production alimentaire',
        'Tabac & cigarettes',
        'Viande, fruits de mer & oeufs'
      ]
    },
    {
      name: 'Électronique & technologie',
      color: 'bg-pink-200',
      icon: <Monitor className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Appareils électroniques',
        'Audiovisuel',
        'Internet & logiciels',
        'Ordinateurs & téléphones',
        'Services de réparation'
      ]
    },
    {
      name: 'Santé & médecine',
      color: 'bg-orange-200',
      icon: <Heart className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Aides physiques',
        'Cliniques',
        'Diagnostic & tests',
        'Docteurs & chirurgiens',
        'Équipement médical',
        'Hôpital & urgences',
        'Maternité & enfants',
        'Médecins spécialistes',
        'Pharmacie & médicaments',
        'Santé mentale',
        'Services dentaires',
        'Thérapie & santé pour personnes âgées',
        'Vue & audition'
      ]
    },
    {
      name: 'Services publics & locaux',
      color: 'bg-green-200',
      icon: <Users className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Emploi & carrière',
        'Enfants & famille',
        'Funérailles & mémorial',
        'Gestion des déchets',
        'Institutions religieuses',
        'Militaire & ancien combattant',
        'Nature & environnement',
        'Organisations professionnelles',
        'Refuges & centres accueil',
        'Services publics et bien-être',
        'Sociétés de logement'
      ]
    },
    {
      name: 'Événements & divertissement',
      color: 'bg-yellow-50',
      icon: <Mic className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Discothèques & vie nocturne',
        'Divertissement pour adultes',
        'Divertissement pour enfants',
        'Jeux',
        'Jeux argent',
        'Lieux événements',
        'Mariage & fêtes',
        'Musées & expositions',
        'Musique & films',
        'Théâtre & opéra'
      ]
    },
    {
      name: 'Services',
      color: 'bg-pink-200',
      icon: <Briefcase className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Énergie & électricité',
        'Pétrole & carburant',
        'Traitement des eaux'
      ]
    },
    {
      name: 'Shopping & mode',
      color: 'bg-orange-200',
      icon: <ShoppingBag className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Accessoires',
        'Bijoux & montres',
        'Centres commerciaux & marchés',
        'Costume & mariage',
        'Location & Réparation de vêtements',
        'Vêtements & sous-vêtements'
      ]
    },
    {
      name: 'Animaux',
      color: 'bg-green-100',
      icon: <Heart className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Animalerie',
        'Chats & chiens',
        'Chevaux & équitation',
        'Parcs animaliers & zoos',
        'Santé animale',
        'Services animaliers'
      ]
    },
    {
      name: 'Loisirs & artisanat',
      color: 'bg-green-200',
      icon: <Palette className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Activités extérieures',
        'Art & artisanat',
        'Astrologie & numérologie',
        'Chasse & pêche',
        'Couture & tricot',
        'Loisirs',
        'Musique & instruments',
        'Peinture & papier',
        'Travail du métal, de la pierre & du verre'
      ]
    },
    {
      name: 'Services à domicile',
      color: 'bg-yellow-200',
      icon: <Home className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Artisan',
        'Déménagement & entreposage',
        'Gardiennage de maison et sécurité',
        'Plomberie & assainissement',
        'Prestataires de service de nettoyage',
        'Prestataires de services de réparation',
        'Services à domicile'
      ]
    },
    {
      name: 'Sport',
      color: 'bg-orange-200',
      icon: <Users className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Arts martiaux & lutte',
        'Danse & gymnastique',
        'Équipement & associations sportives',
        'Fitness & haltérophilie',
        'Golf & ultimate',
        'Hockey & patinage sur glace',
        'Jeux de balle',
        'Jeux de balle & de balle',
        'Jeux de boules & sur pelouse',
        'Natation & sports aquatiques',
        'Sports de tir & sports de cible',
        'Sports en extérieur & sports hiver',
        'Sports extrêmes',
        'Tennis & sports de raquette'
      ]
    },
    {
      name: 'Argent & assurance',
      color: 'bg-pink-100',
      icon: <DollarSign className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Assurance',
        'Banque & argent',
        'Comptabilité & taxes',
        'Immobilier',
        'Placements et patrimoine',
        'Services endettement et de crédit'
      ]
    },
    {
      name: 'Beauté & bien-être',
      color: 'bg-green-100',
      icon: <Sparkles className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Bien-être & spa',
        'Hygiène personnelle',
        'Produits de beauté & maquillage',
        'Salons & cliniques esthétiques',
        'Soins capillaires & coiffure',
        'Tatouages & piercings',
        'Yoga & méditation'
      ]
    },
    {
      name: 'Maison & jardin',
      color: 'bg-pink-200',
      icon: <Home className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Amélioration de habitat',
        'Décoration & design intérieur',
        'Énergie & chauffage',
        'Jardin & paysagisme',
        'Magasin équipement pour la maison',
        'Magasins de meubles',
        'Produits culturels',
        'Salle de bains & cuisine',
        'Services ménagers & jardinage',
        'Tissus & papeterie'
      ]
    },
    {
      name: 'Services aux entreprises',
      color: 'bg-green-200',
      icon: <Briefcase className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Administration & services',
        'Associations & centres',
        'Commerce de gros',
        'Import & export',
        'Impression & design graphique',
        'Informatique & communication',
        'Locaux & fournitures de bureau',
        'Ressources humaines & recrutement',
        'Transport & logistique',
        'Ventes & marketing'
      ]
    },
    {
      name: 'Construction & fabrication',
      color: 'bg-orange-200',
      icon: <Hammer className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Architectes & ingénieurs',
        'Entrepreneurs & consultants',
        'Équipement usine',
        'Fabrication industrielle',
        'Fournitures industrielles',
        'Jardin & paysagisme',
        'Matériaux de construction',
        'Outils & équipement',
        'Produits chimiques & plastique',
        'Services de construction',
        'Services de production'
      ]
    },
    {
      name: 'Médias & édition',
      color: 'bg-green-200',
      icon: <Camera className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Livres & magazines',
        'Médias & information',
        'Photographie',
        'Vidéo & son'
      ]
    },
    {
      name: 'Services juridiques & administration',
      color: 'bg-pink-200',
      icon: <Scale className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Avocats & juristes',
        'Bibliothèques & archives',
        'Département gouvernemental',
        'Département municipal',
        'Douane & péage',
        'Maintien de ordre public',
        'Prestataires de services juridiques',
        'Services enregistrement'
      ]
    },
    {
      name: 'Vacances & voyages',
      color: 'bg-pink-200',
      icon: <Plane className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Activités & excursions',
        'Agences de voyage',
        'Compagnies aériennes & aéroports',
        'Hébergements & logements de vacances',
        'Hôtels'
      ]
    },
    {
      name: 'Éducation & formation',
      color: 'bg-orange-200',
      icon: <GraduationCap className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Apprentissage des langues étrangères',
        'Collèges & universités',
        'Cours de musique et de théâtre',
        'École & lycée',
        'Établissements spécialisés',
        'Formation professionnelle',
        'Formations & cours',
        'Services éducatifs'
      ]
    },
    {
      name: 'Restaurants & bars',
      color: 'bg-orange-200',
      icon: <Utensils className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'À emporter',
        'Bars & cafés',
        'Cuisine africaine & cuisine du Pacifique',
        'Cuisine chinoise & coréenne',
        'Cuisine Afrique du Nord et du Sud',
        'Cuisine Asie du Sud-Est',
        'Cuisine du Moyen-Orient',
        'Cuisine européenne',
        'Cuisine japonaise',
        'Cuisine méditerranéenne',
        'Restaurants spécialisés',
        'Végétarien & régime'
      ]
    },
    {
      name: 'Véhicules & transport',
      color: 'bg-yellow-100',
      icon: <Car className="w-8 h-8 text-gray-700" />,
      subcategories: [
        'Aéroports & parking',
        'Autres véhicules & remorques',
        'Location de véhicules',
        'Motos & sports motorisés',
        'Pièces automobiles détachées & roues',
        'Réparation de véhicules & carburant',
        'Taxis & transports publics',
        'Transport aérien & nautique',
        'Vélos',
        'Voitures & camions'
      ]
    }
  ];

  // Calculate height based on number of subcategories
  const calculateHeight = (subcategoriesCount) => {
    const baseHeight = 160; // Height for header
    const itemHeight = 40; // Height per subcategory item
    const padding = 32; // Padding for content area
    return baseHeight + (subcategoriesCount * itemHeight) + padding;
  };

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group categories by rows of 4
  const groupedCategories = [];
  for (let i = 0; i < filteredCategories.length; i += 4) {
    groupedCategories.push(filteredCategories.slice(i, i + 4));
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="text-green-400 mr-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">Trustpilot</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-white hover:text-gray-300">Catégories</a>
              <a href="#" className="text-white hover:text-gray-300">Blog</a>
              <a href="#" className="text-white hover:text-gray-300">Connexion</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-200 text-gray-800 px-4 py-2 rounded-full hover:bg-blue-300 transition-colors">
                Pour les entreprises
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Que cherchez-vous ?
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Explorez les entreprises par catégorie
          </h2>
        </div>

        {/* Categories Grids */}
        <div className="space-y-6">
          {groupedCategories.map((categoryRow, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryRow.map((category, index) => {
                const cardHeight = calculateHeight(category.subcategories.length);
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    style={{ height: cardHeight + 'px' }}
                  >
                    {/* Category Header */}
                    <div className={`${category.color} p-6 text-center`}>
                      <div className="flex flex-col items-center">
                        <div className="mb-3">
                          {category.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Subcategories List */}
                    <div className="bg-white p-4">
                      <div className="space-y-2">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <div key={subIndex}>
                            <a 
                              href="#" 
                              className="block text-sm text-gray-700 hover:text-green-600 hover:underline py-1 transition-colors"
                            >
                              {subcategory}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Results Info */}
        {searchTerm && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {filteredCategories.length} catégories trouvées pour "{searchTerm}"
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-green-400 mr-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">Trustpilot</span>
              </div>
              <p className="text-gray-400">
                La plateforme d'avis la plus puissante au monde, gratuite pour tous.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Pour les consommateurs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Écrire un avis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lire les avis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parcourir les catégories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confiance et sécurité</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Pour les entreprises</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Commencer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Produits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Histoires de réussite</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emplois</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Trustpilot A/S. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrustpilotCategoriesPage;