import { 
  Utensils, 
  Monitor, 
  Heart, 
  Users, 
  Mic, 
  ShoppingBag, 
  Briefcase, 
  Car, 
  Plane, 
  Home, 
  GraduationCap, 
  Scale, 
  DollarSign, 
  Palette, 
  Camera, 
  Hammer, 
  Sparkles 
} from "lucide-react";

export const allCategories = [
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

// Fonction utilitaire pour calculer la hauteur des cartes
export const calculateHeight = (subcategoriesCount) => {
  const baseHeight = 160; // Height for header
  const itemHeight = 40; // Height per subcategory item
  const padding = 32; // Padding for content area
  return baseHeight + (subcategoriesCount * itemHeight) + padding;
};

// Fonction pour filtrer les catégories
export const filterCategories = (categories, searchTerm) => {
  return categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

// Fonction pour grouper les catégories par lignes
export const groupCategoriesByRows = (categories, itemsPerRow = 4) => {
  const grouped = [];
  for (let i = 0; i < categories.length; i += itemsPerRow) {
    grouped.push(categories.slice(i, i + itemsPerRow));
  }
  return grouped;
};

export default allCategories;