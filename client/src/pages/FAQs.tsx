
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, HelpCircle, Search, MessageCircle, Users, Target, Award, Trophy } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Button } from "@/components/ui/button";

const FAQs = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const faqData = [
    {
      category: "About NIDDIK IT",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
      questions: [
        {
          question: "What is NIDDIK IT and what services do you offer?",
          answer: "NIDDIK IT offers comprehensive products and services including custom software development, contract staffing, staff augmentation, and expert IT consulting. We serve businesses of every size across technology, finance, healthcare, and other industries, both nationwide and internationally."
        },
        {
          question: "How does NIDDIK IT differentiate from competitors?",
          answer: "As a new startup in the IT consulting and staff augmentation space, we differentiate ourselves from major players like TCS, Infosys, and Wipro through our agility, personalized service, and tailored solutions. We offer competitive rates, niche expertise, and flexible service delivery that allows us to provide a more customized approach than larger consulting firms."
        },
        {
          question: "What industries do you serve?",
          answer: "We serve industry-wide clients including technology, finance, healthcare, e-commerce, and government organizations. We particularly focus on organizations that need niche, specialist IT skills, from startups to SMBs to Fortune 500 companies."
        }
      ]
    },
    {
      category: "Solutions & Services",
      icon: <Target className="w-6 h-6" />,
      color: "from-green-500 to-teal-600",
      questions: [
        {
          question: "What problems does NIDDIK IT solve?",
          answer: "We address critical business challenges including talent acquisition and management, project delivery issues, technology adoption, skills gap, cost management, and flexibility. We help organizations with talent hiring, onboarding, managing projects, bridging skill-set gaps, and ensuring cost-efficiency."
        },
        {
          question: "What is your solution approach?",
          answer: "Our solutions include AI-powered talent matching, advanced project and program management tools, upskilling and reskilling programs, and flexible staffing models. By addressing these pain points, we help clients achieve effective, efficient, and quality-assured project delivery."
        },
        {
          question: "How do you ensure quality in project delivery?",
          answer: "We focus on delivering value to clients through specialized expertise, flexible staffing models, and proven methodologies. Our approach combines technical excellence with business acumen to ensure projects meet quality standards and business objectives."
        }
      ]
    },
    {
      category: "Market & Growth",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600",
      questions: [
        {
          question: "Who is your target market and what is your Total Addressable Market (TAM)?",
          answer: "Our target market includes businesses across technology, finance, healthcare, e-commerce, and government sectors that need specialized IT skills. We serve companies from startups to Fortune 500 enterprises looking for workforce flexibility and specialized talent. The IT staff augmentation market is worth millions and continues growing rapidly."
        },
        {
          question: "What key milestones have you achieved?",
          answer: "We're prioritizing market validation, MVP development, securing first paying customers, and building a core skilled team. Our funding strategy includes seed investment from friends and family, followed by Series A funding. We're also exploring government and private sector grants while focusing on user acquisition and strategic partnerships."
        },
        {
          question: "How do you compare with major competitors in pricing and features?",
          answer: "We offer competitive rates and pricing for quality services while specializing in niche IT consulting and staffing solutions. Our flexibility in pricing and service delivery provides a compelling alternative to larger consulting firms, with deep industry expertise and customized approaches that attract clients seeking personalized solutions."
        }
      ]
    },
    {
      category: "Partnership & Contact",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-orange-500 to-red-600",
      questions: [
        {
          question: "How can I get started with NIDDIK IT services?",
          answer: "You can get started by contacting our team through our website, requesting a demo, or reaching out to discuss your specific requirements. We offer personalized consultations to understand your needs and provide tailored solutions."
        },
        {
          question: "Do you offer flexible engagement models?",
          answer: "Yes, we provide various flexible engagement models including contract staffing, staff augmentation, project-based consulting, and long-term partnerships. Our models are designed to help you scale resources up or down based on project needs while optimizing costs."
        },
        {
          question: "What support do you provide post-implementation?",
          answer: "We provide comprehensive post-implementation support including ongoing maintenance, technical support, training, and continuous improvement. Our goal is to ensure long-term success and value delivery for all our client partnerships."
        }
      ]
    }
  ];

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AnnouncementBar 
        text="Have questions? Our FAQ section has comprehensive answers about NIDDIK IT"
        linkText="Contact Support"
        linkUrl="/contact"
        bgColor="bg-gradient-to-r from-blue-600 to-purple-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('/circuit-board-pattern.svg')] opacity-10"></div>
        </div>
        
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <HelpCircle className="w-10 h-10 text-blue-300 mr-4" />
              <span className="text-xl font-semibold text-blue-200 tracking-wider">FREQUENTLY ASKED QUESTIONS</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Your Questions
              <br />
              Answered
            </h1>
            
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Everything you need to know about NIDDIK IT's services, solutions, and how we can help transform your business
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-lg"
                />
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No results found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your search terms or browse our categories below.</p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Clear Search
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {filteredFAQs.map((category, categoryIndex) => (
                  <motion.div
                    key={categoryIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* Category Header */}
                    <div className={`bg-gradient-to-r ${category.color} p-6`}>
                      <div className="flex items-center text-white">
                        <div className="p-3 bg-white/20 rounded-lg mr-4">
                          {category.icon}
                        </div>
                        <h2 className="text-2xl font-bold">{category.category}</h2>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="divide-y divide-gray-100">
                      {category.questions.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex;
                        const isOpen = openFAQ === globalIndex;
                        
                        return (
                          <motion.div
                            key={faqIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: faqIndex * 0.05 }}
                          >
                            <button
                              onClick={() => setOpenFAQ(isOpen ? null : globalIndex)}
                              className="w-full text-left p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                  {faq.question}
                                </h3>
                                <div className="flex-shrink-0">
                                  {isOpen ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                  )}
                                </div>
                              </div>
                            </button>
                            
                            <motion.div
                              initial={false}
                              animate={{
                                height: isOpen ? "auto" : 0,
                                opacity: isOpen ? 1 : 0
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <p className="text-gray-700 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Our team is here to help you find the perfect IT solutions for your business needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-auto"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact Support
              </Button>
              </Link>
               <Link href="/request-demo">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-andela-green hover:bg-white/10 hover:text-white text-lg px-8 py-4 h-auto backdrop-blur-sm"
              >
                Request Demo
              </Button>
               </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default FAQs;
