
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  label: string;
  country: string;
  size: number;
}

interface Connection {
  from: string;
  to: string;
}

const GlobalNetworkMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Define key locations for India, US, and Canada
  const nodes: NetworkNode[] = [
    // India
    { id: 'delhi', x: 77, y: 28, label: 'New Delhi', country: 'IN', size: 8 },
    { id: 'mumbai', x: 72, y: 19, label: 'Mumbai', country: 'IN', size: 6 },
    { id: 'bangalore', x: 77, y: 12, label: 'Bangalore', country: 'IN', size: 6 },
    { id: 'noida', x: 77.3, y: 28.6, label: 'Noida', country: 'IN', size: 10 }, // Main office
    
    // United States
    { id: 'newyork', x: -74, y: 40, label: 'New York', country: 'US', size: 8 },
    { id: 'sanfrancisco', x: -122, y: 37, label: 'San Francisco', country: 'US', size: 7 },
    { id: 'chicago', x: -87, y: 41, label: 'Chicago', country: 'US', size: 6 },
    { id: 'austin', x: -97, y: 30, label: 'Austin', country: 'US', size: 5 },
    
    // Canada
    { id: 'toronto', x: -79, y: 43, label: 'Toronto', country: 'CA', size: 7 },
    { id: 'vancouver', x: -123, y: 49, label: 'Vancouver', country: 'CA', size: 6 },
    { id: 'montreal', x: -73, y: 45, label: 'Montreal', country: 'CA', size: 5 },
  ];

  // Define connections between major hubs
  const connections: Connection[] = [
    // India to US
    { from: 'noida', to: 'newyork' },
    { from: 'mumbai', to: 'sanfrancisco' },
    { from: 'bangalore', to: 'austin' },
    
    // US to Canada
    { from: 'newyork', to: 'toronto' },
    { from: 'sanfrancisco', to: 'vancouver' },
    { from: 'chicago', to: 'montreal' },
    
    // Within countries
    { from: 'noida', to: 'mumbai' },
    { from: 'mumbai', to: 'bangalore' },
    { from: 'newyork', to: 'chicago' },
    { from: 'toronto', to: 'vancouver' },
  ];

  // Convert lat/lng to canvas coordinates
  const projectToCanvas = (lng: number, lat: number, width: number, height: number) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // High DPI
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    let time = 0;
    const pulsingNodes = new Set<string>();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      // Draw world map outline (simplified)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      
      // Draw grid lines
      for (let i = 0; i <= 8; i++) {
        const x = (i / 8) * (canvas.width / 2);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / 2);
        ctx.stroke();
      }
      
      for (let i = 0; i <= 4; i++) {
        const y = (i / 4) * (canvas.height / 2);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / 2, y);
        ctx.stroke();
      }

      ctx.setLineDash([]);

      // Draw connections with animated data flow
      connections.forEach((conn, index) => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (!fromNode || !toNode) return;

        const from = projectToCanvas(fromNode.x, fromNode.y, canvas.width / 2, canvas.height / 2);
        const to = projectToCanvas(toNode.x, toNode.y, canvas.width / 2, canvas.height / 2);

        // Draw connection line
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Animated data packets
        const progress = (time * 0.02 + index * 0.3) % 1;
        const packetX = from.x + (to.x - from.x) * progress;
        const packetY = from.y + (to.y - from.y) * progress;

        ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
        ctx.beginPath();
        ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Glowing effect
        const gradient = ctx.createRadialGradient(packetX, packetY, 0, packetX, packetY, 6);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.6)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(packetX, packetY, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((node, index) => {
        const pos = projectToCanvas(node.x, node.y, canvas.width / 2, canvas.height / 2);
        
        // Node pulsing effect
        const pulsePhase = (time * 0.03 + index * 0.5) % (Math.PI * 2);
        const pulseScale = 1 + Math.sin(pulsePhase) * 0.3;
        const radius = (node.size / 2) * pulseScale;

        // Country-specific colors
        let nodeColor = 'rgba(59, 130, 246, 0.8)'; // Default blue
        if (node.country === 'IN') nodeColor = 'rgba(255, 153, 0, 0.8)'; // Orange for India
        if (node.country === 'US') nodeColor = 'rgba(239, 68, 68, 0.8)'; // Red for US
        if (node.country === 'CA') nodeColor = 'rgba(34, 197, 94, 0.8)'; // Green for Canada

        // Special highlighting for main office
        if (node.id === 'noida') {
          nodeColor = 'rgba(168, 85, 247, 0.9)'; // Purple for main office
        }

        // Draw outer glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
        gradient.addColorStop(0, nodeColor);
        gradient.addColorStop(1, nodeColor.replace(/,\s*[\d.]+\)/, ', 0)'));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw main node
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw inner core
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Overlay labels */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Country labels */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span>India</span>
          </div>
        </div>
        <div className="absolute top-4 left-20">
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>USA</span>
          </div>
        </div>
        <div className="absolute top-4 left-32">
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Canada</span>
          </div>
        </div>

        {/* Live indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>Live Network</span>
          </div>
        </div>

        {/* Headquarters indicator */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span>HQ - Noida, India</span>
          </div>
        </div>
      </div>

      {/* Floating stats */}
      <motion.div
        className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="text-2xl font-bold">150K+</div>
        <div className="text-xs opacity-80">Global Talents</div>
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 text-center text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="text-2xl font-bold">24/7</div>
        <div className="text-xs opacity-80">Support</div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-center text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="text-2xl font-bold">3</div>
        <div className="text-xs opacity-80">Core Markets</div>
      </motion.div>
    </div>
  );
};

export default GlobalNetworkMap;
