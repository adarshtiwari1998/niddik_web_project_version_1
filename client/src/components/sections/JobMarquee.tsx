
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, ArrowRight, Briefcase, Users, Calendar } from "lucide-react";
import Container from "@/components/ui/container";
import "./job-marquee.css";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedDate: string;
  urgency?: 'high' | 'medium' | 'low';
  skills: string[];
}

// Enhanced marquee component with pause on hover
const JobMarqueeScroll = ({ children, speed = 60 }: { children: React.ReactNode; speed?: number }) => {
  const [isPaused, setIsPaused] = useState(false);
  
  return (
    <div 
      className="job-marquee-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="job-marquee-content"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
          animationDuration: `${speed}s`,
        }}
      >
        {children}
        {/* Duplicate content for seamless loop */}
        <div className="job-marquee-duplicate">
          {children}
        </div>
      </div>
    </div>
  );
};

// Individual job card component
const JobCard = ({ job }: { job: Job }) => {
  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getUrgencyText = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'Urgent';
      case 'medium': return 'Priority';
      default: return 'Open';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="job-card group"
    >
      <Link href={`/jobs/${job.id}`} className="block">
        <div className="relative bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 min-w-[350px] mx-3 overflow-hidden">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-andela-green/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Urgency badge */}
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getUrgencyColor(job.urgency)}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse"></div>
              {getUrgencyText(job.urgency)}
            </span>
          </div>

          {/* Job content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-andela-green/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-andela-green" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-andela-green transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">{job.company}</p>
                </div>
              </div>
            </div>

            {/* Job details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-andela-green" />
                <span>{job.location}</span>
                <span className="text-gray-400">•</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">{job.type}</span>
              </div>
              
              {job.salary && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-600">{job.salary}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Posted {job.postedDate}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                    +{job.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Apply button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>12 applicants</span>
              </div>
              <div className="flex items-center gap-2 text-andela-green font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Apply Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const JobMarquee = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/job-listings');
        if (response.ok) {
          const data = await response.json();
          // Transform and enhance the job data
          const enhancedJobs = data.data.map((job: any) => ({
            ...job,
            company: job.company || 'NIDDIK Partner',
            urgency: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
            skills: job.requirements ? job.requirements.split(',').slice(0, 5) : ['JavaScript', 'React', 'Node.js'],
            postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '2 days ago'
          }));
          setJobs(enhancedJobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        // Fallback demo data
        setJobs([
          {
            id: 1,
            title: "Senior Full Stack Developer",
            company: "TechCorp Inc",
            location: "Remote",
            type: "Full-time",
            salary: "$120k - $150k",
            postedDate: "2 days ago",
            urgency: "high",
            skills: ["React", "Node.js", "TypeScript", "PostgreSQL"]
          },
          {
            id: 2,
            title: "DevOps Engineer",
            company: "CloudTech Solutions",
            location: "New York, NY",
            type: "Full-time",
            salary: "$110k - $140k",
            postedDate: "1 week ago",
            urgency: "medium",
            skills: ["AWS", "Docker", "Kubernetes", "Python"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <Container>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 via-blue-50/30 to-green-50/20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-andela-green/10 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-andela-green rounded-full animate-pulse"></div>
            <span className="text-andela-green font-semibold text-sm">LIVE JOB OPPORTUNITIES</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next <span className="text-andela-green">Career Move</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore cutting-edge opportunities with industry leaders. Real-time job updates from our global network.
          </p>
        </motion.div>
      </Container>

      {/* Jobs marquee */}
      <div className="mt-8">
        <JobMarqueeScroll speed={80}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </JobMarqueeScroll>
      </div>

      {/* Call to action */}
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link 
            href="/careers" 
            className="inline-flex items-center gap-2 bg-andela-green hover:bg-andela-green/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <span>View All Opportunities</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};

export default JobMarquee;
