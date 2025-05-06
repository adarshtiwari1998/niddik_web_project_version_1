import { motion } from "framer-motion";
import { 
  Star, 
  CogIcon, 
  CheckCircle2, 
  PieChart, 
  Globe2,
  Zap,
  HeartHandshake,
  Building2,
  PersonStanding,
  ClipboardCheck,
  ArrowRight
} from "lucide-react";
import Container from "@/components/ui/container";
import { Link } from "wouter";

const WhyUs = () => {
  const advantages = [
    {
      icon: <CogIcon className="h-12 w-12 text-andela-green" />,
      title: "Proprietary Matching Technology",
      description: "Our AI-powered platform finds the perfect fit between talent and opportunity based on skills, experience, culture, and growth potential."
    },
    {
      icon: <Globe2 className="h-12 w-12 text-andela-green" />,
      title: "Global Talent Pool",
      description: "Access extraordinary talent from over 100 countries, bringing diverse perspectives and solutions to your challenges."
    },
    {
      icon: <CheckCircle2 className="h-12 w-12 text-andela-green" />,
      title: "Rigorous Vetting Process",
      description: "Only the top 1% of applicants join our talent network after passing technical assessments, soft skills evaluation, and reference checks."
    },
    {
      icon: <PieChart className="h-12 w-12 text-andela-green" />,
      title: "Data-Driven Insights",
      description: "We continuously analyze performance and satisfaction metrics to optimize matches and ensure long-term success."
    }
  ];

  const testimonials = [
    {
      quote: "Niddik completely transformed our engineering team. Their vetting process is exceptional, and every developer we've hired has been a perfect cultural and technical fit.",
      author: "Sarah Johnson",
      position: "CTO, TechInnovate Inc."
    },
    {
      quote: "The speed and quality of Niddik's matching process is unmatched. We scaled our team by 300% in just six months with zero bad hires.",
      author: "Michael Chang",
      position: "VP of Engineering, CloudScale"
    }
  ];

  const comparisonPoints = [
    {
      category: "Talent Quality",
      traditional: "Variable quality depending on recruiter expertise",
      niddik: "Top 1% of global tech talent, rigorously vetted"
    },
    {
      category: "Time to Hire",
      traditional: "30-90 days average",
      niddik: "7-14 days average"
    },
    {
      category: "Matching Accuracy",
      traditional: "Based on keyword matching and subjective assessment",
      niddik: "AI-powered skills and culture matching with continuous optimization"
    },
    {
      category: "Talent Retention",
      traditional: "60-70% after one year",
      niddik: "92% after one year"
    },
    {
      category: "Global Reach",
      traditional: "Typically limited to local or regional markets",
      niddik: "Access to talent in 100+ countries"
    }
  ];

  const solutions = [
    {
      icon: <Building2 className="h-10 w-10 text-blue-500" />,
      title: "Enterprise Teams",
      description: "Comprehensive talent solutions for large organizations with ongoing hiring needs.",
      benefits: [
        "Dedicated account management",
        "Custom talent pipeline",
        "Advanced analytics dashboard"
      ]
    },
    {
      icon: <Zap className="h-10 w-10 text-amber-500" />,
      title: "Startup Scaling",
      description: "Agile talent acquisition designed specifically for high-growth startups.",
      benefits: [
        "Flexible engagement models",
        "Quick ramp-up capabilities",
        "Startup-friendly pricing"
      ]
    },
    {
      icon: <PersonStanding className="h-10 w-10 text-green-500" />,
      title: "Individual Talent",
      description: "For professionals seeking exceptional opportunities with leading companies.",
      benefits: [
        "Career growth planning",
        "Skills development resources",
        "Global opportunity access"
      ]
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-purple-500" />,
      title: "Project-Based Teams",
      description: "Complete teams assembled for specific project needs and timelines.",
      benefits: [
        "Pre-vetted team dynamics",
        "Seamless collaboration tools",
        "Outcome-focused management"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-andela-dark to-andela-dark/90 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Why Choose <span className="text-andela-green">Niddik</span> for Your Talent Needs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              Our innovative approach to technical talent is redefining how companies build teams and how professionals grow their careers.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Our Advantages Section */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">The Niddik Advantage</h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              Our technology-driven approach delivers faster, better matches between exceptional talent and world-class companies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-8 flex gap-6 items-start shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  {advantage.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-andela-dark">{advantage.title}</h3>
                  <p className="text-andela-gray">{advantage.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* By the Numbers Section */}
      <section className="py-20 bg-gradient-to-r from-andela-dark to-andela-dark/90 text-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Niddik By The Numbers</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our impact in transforming how the world connects talent with opportunity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-5xl font-bold text-andela-green mb-3">100+</h3>
              <p className="text-gray-200">Countries with active talent</p>
            </motion.div>
            
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-5xl font-bold text-andela-green mb-3">92%</h3>
              <p className="text-gray-200">Talent retention after one year</p>
            </motion.div>
            
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-5xl font-bold text-andela-green mb-3">7-14</h3>
              <p className="text-gray-200">Days average time to hire</p>
            </motion.div>
            
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-5xl font-bold text-andela-green mb-3">10K+</h3>
              <p className="text-gray-200">Successful placements made</p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">How We Compare</h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              See how Niddik transforms technical recruiting compared to traditional methods
            </p>
          </motion.div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-white uppercase bg-andela-dark">
                <tr>
                  <th scope="col" className="px-6 py-4">Criteria</th>
                  <th scope="col" className="px-6 py-4">Traditional Recruiting</th>
                  <th scope="col" className="px-6 py-4 bg-andela-green">Niddik Approach</th>
                </tr>
              </thead>
              <tbody>
                {comparisonPoints.map((point, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <th scope="row" className="px-6 py-4 font-medium text-andela-dark whitespace-nowrap">
                      {point.category}
                    </th>
                    <td className="px-6 py-4 text-andela-gray">
                      {point.traditional}
                    </td>
                    <td className="px-6 py-4 font-medium bg-green-50 text-andela-dark">
                      {point.niddik}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Solutions For Every Need</h2>
            <p className="text-xl text-andela-gray max-w-2xl mx-auto">
              Customized approaches for companies and individuals at any stage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center mb-6">
                    {solution.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-andela-dark">{solution.title}</h3>
                  <p className="text-andela-gray mb-6">{solution.description}</p>
                  <div className="space-y-2">
                    {solution.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-andela-green mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-andela-gray">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-andela-light">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">What Our Clients Say</h2>
            <p className="text-xl text-andela-gray max-w-2xl mx-auto">
              Hear directly from companies who've transformed their teams with Niddik
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" size={20} />
                  ))}
                </div>
                <p className="text-lg text-andela-gray italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-andela-dark">{testimonial.author}</p>
                  <p className="text-andela-green">{testimonial.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-andela-dark text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-4 border-white"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full border-4 border-white"></div>
          <div className="absolute top-1/4 right-1/4 w-20 h-20 rounded-full bg-white"></div>
        </div>

        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Transform How You Build Teams?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 mb-8"
            >
              Join thousands of companies that have revolutionized their talent strategy with Niddik.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link 
                href="/contact" 
                className="inline-flex items-center bg-andela-green hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/services" 
                className="inline-flex items-center bg-white hover:bg-gray-100 text-andela-dark px-8 py-3 rounded-md font-medium transition-colors"
              >
                Explore Solutions
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default WhyUs;