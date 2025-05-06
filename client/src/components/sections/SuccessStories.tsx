import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
}

const Testimonial = ({ name, role, company, image, quote, rating }: TestimonialProps) => {
  return (
    <div className="bg-andela-light rounded-xl p-8 transition-all hover:shadow-lg">
      <div className="flex items-center mb-6">
        <img 
          src={image} 
          alt={`${name} profile`} 
          className="w-14 h-14 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-andela-gray">{role}, {company}</p>
        </div>
      </div>
      <p className="text-andela-gray mb-4">{quote}</p>
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            fill={i < rating ? "currentColor" : "none"} 
            className={i < rating ? "text-yellow-400" : "text-gray-300"} 
            size={18} 
          />
        ))}
      </div>
    </div>
  );
};

const testimonials: TestimonialProps[] = [
  {
    name: "Michael Johnson",
    role: "CTO",
    company: "TechCorp",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80",
    quote: "Andela helped us scale our engineering team quickly with top talent. The quality of developers and their integration into our team has been seamless.",
    rating: 5
  },
  {
    name: "Sarah Williams",
    role: "Software Engineer",
    company: "",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80",
    quote: "Joining Andela was the best career decision I've made. I've worked with amazing teams on challenging projects, all while growing professionally.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "VP of Engineering",
    company: "InnovateX",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80",
    quote: "The talent we've accessed through Andela has been exceptional. Their team understood our needs and matched us with perfect candidates.",
    rating: 4.5
  }
];

const SuccessStories = () => {
  return (
    <section className="py-20 bg-white">
      <Container>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-andela-gray max-w-2xl mx-auto">
            Hear from our clients and technologists about their experience with Niddik
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Testimonial {...testimonial} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default SuccessStories;
