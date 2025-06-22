import {
  Card,
  CardHeader,
  CardBody,
  Typography,

  Button,
} from "@material-tailwind/react";
import { useState } from "react";
import Input from "../../components/form/input/InputField";
import axios from "axios";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
export function CompanyTrace() {
  // État pour le domaine saisi
  const [domain, setDomain] = useState("");
  // État pour les emails valides
  const [validEmails, setValidEmails] = useState([]);
  // État pour les erreurs
  const [error, setError] = useState(null);
  // État pour le chargement
  const [loading, setLoading] = useState(false);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Vérification que le domaine n'est pas vide
    if (!domain.trim()) {
      setError("Le domaine est obligatoire.");
      setLoading(false);
      return;
    }

    // Validation simple du format du domaine
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      setError("Veuillez entrer un domaine valide (ex. example.com).");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://51.44.136.165:8081/api/verify/${encodeURIComponent(domain)}`);
      console.log("Domaine vérifié:", domain);
      console.log("Réponse de l'API:", response.data);
      // Extraire uniquement les emails valides
      setValidEmails(response.data.validEmails || []);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la vérification du domaine.");
    } finally {
      setLoading(false);
    }
  };

  // Style dégradé
  //const gradientStyle = { background: "linear-gradient(135deg, #b24592 0%, #f15f79 100%)" };
  const gradientStyle = { background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" };
  return (
    <div className="mt-2 mb-2 flex flex-col gap-8">
          

      {/* En-tête avec logo et titre côte à côte */}
  
      
     

      {/* Formulaire pour saisir le domaine */}
      <ComponentCard
        title={<div className="flex flex-col items-center justify-center mb-4 mt-4">
          <div className="flex items-center mb-4">
            {/* Logo de la marque */}
            <div className="p-3 rounded-lg shadow-lg mr-4" style={gradientStyle}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Titre de l'application */}
            <div>
              <label className="font-bold mb-0 text-gray-800 dark:text-gray-200" color="blue-gray" style={{ fontSize: "3rem" }}>
                Company<span className="text-red-400">Trace</span>
              </label>
            </div>
          </div>
          
          <label className="text-center max-w-lg opacity-80 text-gray-800 dark:text-gray-200" style={{ fontSize: "1rem" }}>
          Trouvez rapidement des e-mails valides pour n’importe quelle entreprise. 
          </label>
        </div>} 
        className="border border-blue-gray-100 shadow-md">
        <CardHeader 
          variant="gradient" 
          className="mb-4 p-6"
          style={gradientStyle}
        >
          <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          <Typography variant="h5" color="white" className="font-bold">
          Rechercher des e-mails par domaine
          </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Domaine de l'entreprise"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              required
              size="lg"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
            />
            <Button 
              type="submit" 
              disabled={loading} 
              className="mt-2"
              style={gradientStyle}
              fullWidth
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...                
                  </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search for Emails
                </div>
              )}
            </Button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              <Typography color="red" className="text-sm font-medium">
                {error}
              </Typography>
            </div>
          )}
        </CardBody>
      </ComponentCard>

      {/* Liste des emails valides */}
      <ComponentCard className="border border-blue-gray-100 shadow-md">
        <CardHeader 
          variant="gradient" 
          className="mb-0 p-6"
          style={gradientStyle}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <Typography variant="h5" color="white" className="font-bold">
            E-mails valides
            </Typography>
            {domain && (
              <div className="px-3 py-1 bg-white/20 rounded-full ml-auto">
                <Typography color="white" className="text-sm font-medium">
                  {domain}
                </Typography>
              </div>
            )}
          </div>
        </CardHeader>
        <CardBody className="px-6 py-4">
          {validEmails.length > 0 ? (
            <div className="flex flex-col gap-2">
              {validEmails.map((email, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow flex items-center">
                  <div className="p-2 rounded-full bg-pink-50 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Typography className="text-base font-medium">
                    {email}
                  </Typography>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" 
                strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <Label color="blue-gray" className="font-medium mb-2 text-blue-gray-500">
              Aucun e-mail valide trouvé pour l’instant.
              </Label>
              <Label color="blue-gray" className="text-sm text-blue-gray-500">
              Entrez le domaine d’une entreprise pour trouver des e-mails valides.
              </Label>
            </div>
          )}
        </CardBody>
      </ComponentCard>
    </div>
  );
}

export default CompanyTrace;