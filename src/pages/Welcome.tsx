
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Zap, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Translations {
  [key: string]: {
    appName: string;
    tagline: string;
    subtitle: string;
    features: {
      smart: string;
      fast: string;
      multilingual: string;
    };
    buttonText: string;
  };
}

const translations: Translations = {
  en: {
    appName: "InvoiceEase",
    tagline: "Create Smart Invoices in Seconds",
    subtitle: "Professional invoicing made simple and efficient",
    features: {
      smart: "Smart Templates",
      fast: "Lightning Fast",
      multilingual: "Multi-language"
    },
    buttonText: "Go to Dashboard"
  },
  fr: {
    appName: "InvoiceEase",
    tagline: "Créez des Factures Intelligentes en Secondes",
    subtitle: "Facturation professionnelle simple et efficace",
    features: {
      smart: "Modèles Intelligents",
      fast: "Ultra Rapide",
      multilingual: "Multi-langues"
    },
    buttonText: "Aller au Tableau de Bord"
  },
  yo: {
    appName: "InvoiceEase",
    tagline: "Ṣe Awọn Iwe-owo Ti O Gbọn Ni Awọn Iṣẹju-aya",
    subtitle: "Iṣẹ-owo to ṣe pataki ti o rọrun ati ti o munadoko",
    features: {
      smart: "Awọn Ilana Ọgbọn",
      fast: "Yara Bi Monomono",
      multilingual: "Ọpọ-ede"
    },
    buttonText: "Lọ si Dashboard"
  },
  ha: {
    appName: "InvoiceEase",
    tagline: "Ƙirƙira Lissafin Kuɗi Mai Hankali a Cikin Daƙiƙa",
    subtitle: "Ƙwararrun lissafin kuɗi mai sauƙi da inganci",
    features: {
      smart: "Samfuran Hankali",
      fast: "Sauri Kamar Walƙiya",
      multilingual: "Harsuna Da Yawa"
    },
    buttonText: "Zuwa Dashboard"
  },
  es: {
    appName: "InvoiceEase",
    tagline: "Crea Facturas Inteligentes en Segundos",
    subtitle: "Facturación profesional simple y eficiente",
    features: {
      smart: "Plantillas Inteligentes",
      fast: "Súper Rápido",
      multilingual: "Multi-idioma"
    },
    buttonText: "Ir al Panel"
  },
  de: {
    appName: "InvoiceEase",
    tagline: "Erstelle Intelligente Rechnungen in Sekunden",
    subtitle: "Professionelle Rechnungsstellung einfach und effizient",
    features: {
      smart: "Intelligente Vorlagen",
      fast: "Blitzschnell",
      multilingual: "Mehrsprachig"
    },
    buttonText: "Zum Dashboard"
  }
};

const Welcome = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('invoiceease-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const t = translations[currentLanguage] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Main Logo and Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full shadow-lg">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {t.appName}
          </h1>
          
          <p className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 font-medium mb-2">
            {t.tagline}
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t.features.fast}
              </h3>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t.features.smart}
              </h3>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t.features.multilingual}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <Button 
            onClick={handleGoToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {t.buttonText}
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No sign-up required • Free to use
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
