import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  ChevronDown, 
  Mail, 
  Phone, 
  Linkedin, 
  Instagram, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  Heart,
  ArrowRight,
  Quote,
  User,
  Briefcase,
  BookOpen,
  Camera,
  Loader2,
  AlertCircle
} from "lucide-react";
import { mockYogaOfferings, mockInvestments, mockVolunteeringInitiatives, mockTestimonials } from "../mock";
import { reflectionApi, contactApi, apiUtils } from "../services/api";
import { useToast } from "../hooks/use-toast";

const Homepage = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("home");
  const [reflections, setReflections] = useState([]);
  const [reflectionsLoading, setReflectionsLoading] = useState(true);
  const [reflectionsError, setReflectionsError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    message: ""
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formError) setFormError("");
  };

  // Load reflections on component mount
  useEffect(() => {
    loadReflections();
  }, []);

  const loadReflections = async (category = null) => {
    try {
      setReflectionsLoading(true);
      setReflectionsError(null);
      
      const response = await reflectionApi.getAll(category);
      setReflections(response.reflections || []);
      setCategories(['all', ...response.categories || []]);
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      setReflectionsError(errorInfo.message);
      console.error('Failed to load reflections:', error);
    } finally {
      setReflectionsLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    const filterCategory = category === 'all' ? null : category;
    loadReflections(filterCategory);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");

    // Basic form validation
    if (!formData.name || !formData.email || !formData.reason || !formData.message) {
      setFormError("Please fill in all required fields.");
      setFormSubmitting(false);
      return;
    }

    try {
      const response = await contactApi.submit(formData);
      
      if (response.success) {
        toast({
          title: "Message Sent!",
          description: response.message,
        });
        setFormData({ name: "", email: "", reason: "", message: "" });
      }
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      setFormError(errorInfo.message);
      toast({
        title: "Error",
        description: errorInfo.message,
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-100px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section[id]");
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-serif text-xl font-bold text-gray-900">
              Pranay Sultania
            </div>
            <div className="hidden md:flex space-x-8">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "yoga", label: "Yoga" },
                { id: "investments", label: "Investments" },
                { id: "reflections", label: "Reflections" },
                { id: "volunteering", label: "Volunteering" },
                { id: "contact", label: "Contact" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-[#007C91] ${
                    activeSection === item.id ? "text-[#007C91]" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/xqz1vx3e_IMG_8977.jpg')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#007C91]/80 to-[#8FCB9B]/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Where Capital Meets
            <span className="block text-[#FFD447]">Consciousness</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Private Equity Investor | Yoga Teacher | Lifelong Learner
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#FFD447] hover:bg-[#FFD447]/90 text-black font-semibold"
              onClick={() => scrollToSection("yoga")}
            >
              Explore My Yoga Offerings
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#007C91]"
              onClick={() => scrollToSection("investments")}
            >
              View My Investment Work
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent border border-[#FFD447] text-[#FFD447] hover:bg-[#FFD447] hover:text-black"
              onClick={() => scrollToSection("contact")}
            >
              Let's Connect
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                Who I Am
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>Hi, I'm Pranay.</p>
                <p>
                  I wear two very different hats — and yet, they feel completely aligned. As a private equity investor, 
                  I work on channeling capital into sectors that drive real-world impact. As a yoga teacher, I guide 
                  people inward, helping them reconnect with their breath, body and presence.
                </p>
                <p>
                  Over the last decade, I've led deals across India, advised startups, and taught yoga to working 
                  professionals, entrepreneurs, and curious beginners. I've lived across cities — Chennai, Bangalore, 
                  Mumbai, Ranchi, Delhi — and carry with me stories from boardrooms and yoga mats alike.
                </p>
                <p>
                  This website is a living space for my personal and professional growth. Whether you're here to 
                  collaborate, to practice, or simply to know more — I'm glad you're here.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/tbun0xgt_IMG_20211120_094046_597.jpg"
                  alt="Pranay Sultania portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8FCB9B] rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FFD447] rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Yoga Section */}
      <section id="yoga" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
              Yoga with Pranay
            </h2>
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-2xl italic text-[#007C91] mb-8 flex items-center justify-center">
                <Quote className="h-8 w-8 mr-3 opacity-50" />
                "The body is the entry point. The breath is the guide. The self is what you meet."
              </blockquote>
              <p className="text-lg text-gray-600">
                I teach yoga grounded in classical principles, adapted for modern living. My focus lies in 
                breath-led movement, intentional alignment, and inner spaciousness. Whether you're a beginner 
                or experienced practitioner, I meet you where you are.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {mockYogaOfferings.map((offering, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#8FCB9B]">
                <CardHeader>
                  <CardTitle className="text-[#007C91]">{offering.title}</CardTitle>
                  <CardDescription>{offering.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {offering.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {offering.format}
                  </div>
                  <div className="text-sm font-semibold text-[#007C91]">
                    {offering.price}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <img
                src="https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/hysim7o4_IMG-20220220-WA0031.jpg"
                alt="Yoga practice"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-[#007C91] mb-2">Certifications</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Internationally certified yoga teacher</li>
                  <li>• 3+ years of teaching experience</li>
                  <li>• Specialized in Hatha & Vinyasa styles</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <img
                src="https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/kewatv5s_IMG-20220317-WA0018.jpg"
                alt="Yoga movement"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-[#007C91] mb-2">Philosophy</h4>
                <p className="text-gray-600">
                  My teaching integrates ancient wisdom with contemporary understanding, 
                  creating space for both physical practice and inner exploration.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-[#8FCB9B] hover:bg-[#8FCB9B]/90 text-white">
              <Calendar className="h-5 w-5 mr-2" />
              Book a Session
            </Button>
          </div>
        </div>
      </section>

      {/* Investments Section */}
      <section id="investments" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
              My Work in Investments
            </h2>
            <div className="max-w-3xl mx-auto text-lg text-gray-600 space-y-4">
              <p>
                I'm a Vice President at Lok Capital, focusing on impact-driven investments across financial 
                services, sustainable agriculture, and climate sectors. My work spans fund deployment, 
                portfolio management, and leading fundraises.
              </p>
              <p>Previously, I worked at Grant Thornton and PwC in transaction advisory.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
              <Briefcase className="h-12 w-12 text-[#007C91] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Private Equity & Impact Investing</h3>
              <p className="text-gray-600 text-sm">Strategic investments in high-impact sectors</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
              <Building className="h-12 w-12 text-[#007C91] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">M&A & Transaction Advisory</h3>
              <p className="text-gray-600 text-sm">Guiding complex financial transactions</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
              <Users className="h-12 w-12 text-[#007C91] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Startup Strategy & Capital Raising</h3>
              <p className="text-gray-600 text-sm">Supporting growth-stage companies</p>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Key Investments</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockInvestments.map((investment, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-[#007C91]">{investment.company}</h4>
                    <Badge variant="secondary" className="bg-[#8FCB9B]/20 text-[#007C91]">
                      {investment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{investment.sector}</p>
                  <p className="text-sm text-gray-500">{investment.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-x-4">
            <Button size="lg" className="bg-[#007C91] hover:bg-[#007C91]/90">
              Download My CV
            </Button>
            <Button size="lg" variant="outline" className="border-[#007C91] text-[#007C91] hover:bg-[#007C91] hover:text-white">
              <Linkedin className="h-5 w-5 mr-2" />
              Connect on LinkedIn
            </Button>
          </div>
        </div>
      </section>

      {/* Reflections Section */}
      <section id="reflections" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
              Reflections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A collection of thoughts, insights, and creative expressions from my journey 
              at the intersection of consciousness and capital.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  className={selectedCategory === category ? "bg-[#007C91] text-white" : ""}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {reflectionsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#007C91]" />
              <span className="ml-2 text-gray-600">Loading reflections...</span>
            </div>
          )}

          {/* Error State */}
          {reflectionsError && (
            <div className="flex justify-center py-12">
              <Alert className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {reflectionsError}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Reflections Grid */}
          {!reflectionsLoading && !reflectionsError && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reflections.map((reflection) => (
                <Card key={reflection.id} className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className={`
                        ${reflection.category === 'journal' ? 'bg-[#FFD447]/20 text-[#007C91]' : ''}
                        ${reflection.category === 'blog' ? 'bg-[#8FCB9B]/20 text-[#007C91]' : ''}
                        ${reflection.category === 'artwork' ? 'bg-[#007C91]/20 text-[#007C91]' : ''}
                      `}>
                        {reflection.category === 'journal' && <BookOpen className="h-3 w-3 mr-1" />}
                        {reflection.category === 'blog' && <User className="h-3 w-3 mr-1" />}
                        {reflection.category === 'artwork' && <Camera className="h-3 w-3 mr-1" />}
                        {reflection.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{reflection.read_time}</span>
                    </div>
                    <CardTitle className="group-hover:text-[#007C91] transition-colors">
                      {reflection.title}
                    </CardTitle>
                    <CardDescription>{reflection.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {apiUtils.formatDate(reflection.date)}
                      </span>
                      <Button variant="ghost" size="sm" className="text-[#007C91] p-0 h-auto">
                        Read more <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!reflectionsLoading && !reflectionsError && reflections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No reflections found for the selected category.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-[#007C91] text-[#007C91] hover:bg-[#007C91] hover:text-white">
              View All Reflections
            </Button>
          </div>
        </div>
      </section>

      {/* Volunteering Section */}
      <section id="volunteering" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                  Purpose Beyond Profit
                </h2>
                <p className="text-lg text-gray-600">
                  Beyond work and wellness, I find meaning in service. Whether it's supporting mental health 
                  during the pandemic, mentoring students, or enabling inclusive art, giving back keeps me grounded.
                </p>
              </div>

              <div className="space-y-4">
                {mockVolunteeringInitiatives.map((initiative, index) => (
                  <Card key={index} className="hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-[#8FCB9B] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-[#007C91] mb-1">{initiative.organization}</h4>
                          <p className="text-sm text-gray-600 mb-1">{initiative.role}</p>
                          <p className="text-sm text-gray-500">{initiative.focus}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/a1kaloiv_IMG_20220206_170738_767.jpg"
                  alt="Volunteering activities"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#FFD447] rounded-full opacity-30"></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#8FCB9B] rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#007C91]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
              What Others Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-[#8FCB9B] mb-4" />
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-[#007C91]">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
              Let's Connect
            </h2>
            <p className="text-lg text-gray-600">
              Whether you're interested in yoga, investment opportunities, or just want to have a meaningful conversation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleFormChange("name", e.target.value)}
                        placeholder="Your name"
                        disabled={formSubmitting}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                        placeholder="your@email.com"
                        disabled={formSubmitting}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Contact</label>
                    <Select 
                      value={formData.reason} 
                      onValueChange={(value) => handleFormChange("reason", value)}
                      disabled={formSubmitting}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yoga">Yoga</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="collaboration">Collaboration</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleFormChange("message", e.target.value)}
                      placeholder="Your message..."
                      rows={4}
                      disabled={formSubmitting}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-[#007C91] hover:bg-[#007C91]/90"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#007C91]" />
                  <span className="text-gray-600">pranaysultania6@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#007C91]" />
                  <span className="text-gray-600">+91 81056 57505</span>
                </div>
                <div className="flex items-center gap-4 pt-4">
  <Button 
    variant="outline" 
    size="sm" 
    className="border-[#007C91] text-[#007C91] hover:bg-[#007C91] hover:text-white"
    onClick={() => window.open('https://www.linkedin.com/in/pranay-sultania-06297899/', '_blank')}
  >
    <Linkedin className="h-4 w-4 mr-2" />
    LinkedIn
  </Button>
  <Button 
    variant="outline" 
    size="sm" 
    className="border-[#8FCB9B] text-[#8FCB9B] hover:bg-[#8FCB9B] hover:text-white"
    onClick={() => window.open('https://www.instagram.com/pranayog_?igsh=bWFtNmd6c3R5Yno%3D&utm_source=qr', '_blank')}
  >
    <Instagram className="h-4 w-4 mr-2" />
    Instagram
  </Button>
</div>
</div>
              
              <Card className="p-6 bg-[#007C91]/5">
                <h3 className="font-semibold text-[#007C91] mb-3">Quick Response Times</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Yoga inquiries: Within 24 hours</li>
                  <li>• Investment discussions: 2-3 business days</li>
                  <li>• General inquiries: Within 48 hours</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="font-serif text-2xl font-bold mb-4">Pranay Sultania</div>
            <p className="text-gray-400 mb-6">Where Capital Meets Consciousness</p>
            <div className="flex justify-center space-x-6 mb-8">
  <Button 
    variant="ghost" 
    size="sm" 
    className="text-gray-400 hover:text-white"
    onClick={() => window.open('https://www.linkedin.com/in/pranay-sultania-06297899/', '_blank')}
  >
    <Linkedin className="h-5 w-5" />
  </Button>
  <Button 
    variant="ghost" 
    size="sm" 
    className="text-gray-400 hover:text-white"
    onClick={() => window.open('https://www.instagram.com/pranayog_?igsh=bWFtNmd6c3R5Yno%3D&utm_source=qr', '_blank')}
  >
    <Instagram className="h-5 w-5" />
  </Button>
  <Button 
    variant="ghost" 
    size="sm" 
    className="text-gray-400 hover:text-white"
    onClick={() => window.open('mailto:pranaysultania6@gmail.com', '_blank')}
  >
    <Mail className="h-5 w-5" />
  </Button>
</div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Pranay Sultania. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
