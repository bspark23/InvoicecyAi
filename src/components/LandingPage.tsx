
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Zap, 
  Globe, 
  Shield, 
  DollarSign, 
  Clock, 
  Check,
  Star,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight
} from "lucide-react";
import VoluntaryContribution from "./VoluntaryContribution";
import LanguageDropdown from "./LanguageDropdown";
import { useNavigate } from "react-router-dom";

interface LandingPageProps {
  businessName: string;
  businessLogo?: string;
  invoiceNumber: string;
  clientName: string;
  total: string;
  status: 'paid' | 'unpaid';
  currency: string;
  onGetStarted: () => void;
}

const LandingPage = ({ 
  businessName, 
  businessLogo, 
  invoiceNumber, 
  clientName, 
  total, 
  status,
  currency,
  onGetStarted
}: LandingPageProps) => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Lightning Fast",
      description: "Create professional invoices in seconds with our intuitive interface"
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Multi-Currency",
      description: "Support for multiple currencies including USD, EUR, GBP, NGN, and more"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Secure & Reliable",
      description: "Your data is stored locally and securely with automatic backups"
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Professional Templates",
      description: "Beautiful, customizable invoice templates that impress clients"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Free to Use",
      description: "No subscription fees, no hidden costs. Completely free forever"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Save Time",
      description: "Automated calculations, tax handling, and invoice numbering"
    }
  ];

  const stats = [
    { label: "Invoices Created", value: "50,000+", icon: <FileText className="w-5 h-5" /> },
    { label: "Happy Users", value: "10,000+", icon: <Users className="w-5 h-5" /> },
    { label: "Money Processed", value: "$250M+", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Countries Served", value: "120+", icon: <Globe className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content: "This invoice generator has saved me hours every week. The templates are beautiful and professional.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Consultant",
      content: "Finally, an invoicing tool that's completely free and actually works better than paid alternatives.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Agency Owner",
      content: "The multi-currency support is fantastic for our international clients. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header with Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageDropdown />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 dark:opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 dark:opacity-10 animate-pulse animation-delay-2000"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 p-4 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <FileText className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 10,000+ professionals worldwide
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Professional Invoicing
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Create, customize, and send professional invoices in minutes. 
              Free forever with no hidden fees, no limitations, and no signup required.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <Badge variant="secondary" className="px-6 py-3 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-700">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                No Sign-up Required
              </Badge>
              <Badge variant="secondary" className="px-6 py-3 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200 dark:border-green-700">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                100% Free Forever
              </Badge>
              <Badge variant="secondary" className="px-6 py-3 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-700">
                <Zap className="w-4 h-4 mr-2 text-purple-500" />
                Instant Setup
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Creating Invoices
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                onClick={() => navigate('/invoices')}
              >
                View Demo
              </Button>
            </div>
          </div>

          {/* Invoice Preview Card */}
          <div className="max-w-4xl mx-auto mb-20">
            <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-3xl transition-shadow duration-500">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    {businessLogo ? (
                      <img 
                        src={businessLogo} 
                        alt="Company Logo" 
                        className="w-16 h-16 object-contain rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        {businessName || "InvoiceCraft Pro"}
                      </h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">INVOICE</h3>
                    <p className="text-gray-600 dark:text-gray-300">#{invoiceNumber}</p>
                    <Badge variant={status === 'paid' ? 'default' : 'destructive'} className="mt-2 shadow-sm">
                      {status === 'paid' ? '✅ Paid' : '❌ Unpaid'}
                    </Badge>
                  </div>
                </div>

                <Separator className="mb-8 dark:bg-gray-700" />

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Bill To:</h4>
                    <p className="font-medium text-gray-900 dark:text-white">{clientName}</p>
                    <p className="text-gray-600 dark:text-gray-300">client@example.com</p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1 text-gray-600 dark:text-gray-300">
                      <p><span className="font-medium">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
                      <p><span className="font-medium">Currency:</span> {currency}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-700 dark:text-gray-300">Professional Service</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{total}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-2xl font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">{total}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4 mb-20">
        <Button 
          variant="secondary" 
          size="lg" 
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition"
          onClick={() => navigate("/invoices")}
        >
          Create Invoice
        </Button>
        <Button 
          variant="secondary" 
          size="lg" 
          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition"
          onClick={() => navigate("/voluntary-contribution")}
        >
          Voluntary Contribution
        </Button>
      </div>

      {/* Stats Section */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Join thousands of freelancers and businesses</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white">
              <Award className="w-4 h-4 mr-2" />
              Premium Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make invoicing effortless and professional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg dark:text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl opacity-90">
              See what our users are saying about us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 dark:bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm opacity-80">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-900 dark:bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">
                Why Choose Our Platform?
              </h2>
              <div className="space-y-6">
                {[
                  "No monthly subscriptions or hidden fees",
                  "Professional templates that impress clients", 
                  "Multi-currency support for global business",
                  "Automatic calculations and tax handling",
                  "Instant PDF and image export options",
                  "Local data storage for maximum privacy"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="bg-green-500 dark:bg-green-600 p-1 rounded-full group-hover:scale-110 transition-transform">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 dark:from-blue-700/30 dark:to-purple-700/30 backdrop-blur-sm rounded-3xl p-8 border border-white/10 dark:border-white/20">
                <div className="text-center">
                  <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 dark:from-green-300 dark:to-blue-300 bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-2xl font-semibold mb-6">Free Forever</div>
                  <div className="space-y-3 text-lg opacity-90">
                    <p className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-400 dark:text-green-300 mr-2" />
                      Unlimited invoices
                    </p>
                    <p className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-400 dark:text-green-300 mr-2" />
                      All features included
                    </p>
                    <p className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-400 dark:text-green-300 mr-2" />
                      No credit card required
                    </p>
                    <p className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-400 dark:text-green-300 mr-2" />
                      No account needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Create Your First Invoice?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of professionals who trust our platform for their invoicing needs
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Now - It's Free!
            <Sparkles className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
