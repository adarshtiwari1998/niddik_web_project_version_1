
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  label: string;
  country: string;
  size: number;
  isHub?: boolean;
}

interface Connection {
  from: string;
  to: string;
  animated?: boolean;
}

const GlobalNetworkMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  // Define key locations for India, US, and Canada with proper geographic coordinates
  const nodes: NetworkNode[] = [
    // India - Main Hub
    { id: 'noida', x: 77.3, y: 28.6, label: 'Noida (HQ)', country: 'IN', size: 12, isHub: true },
    { id: 'mumbai', x: 72.8, y: 19.0, label: 'Mumbai', country: 'IN', size: 8 },
    { id: 'bangalore', x: 77.6, y: 12.9, label: 'Bangalore', country: 'IN', size: 8 },
    { id: 'delhi', x: 77.2, y: 28.7, label: 'Delhi', country: 'IN', size: 7 },
    
    // United States
    { id: 'newyork', x: -74.0, y: 40.7, label: 'New York', country: 'US', size: 10, isHub: true },
    { id: 'sanfrancisco', x: -122.4, y: 37.8, label: 'San Francisco', country: 'US', size: 9 },
    { id: 'chicago', x: -87.6, y: 41.9, label: 'Chicago', country: 'US', size: 7 },
    { id: 'austin', x: -97.7, y: 30.3, label: 'Austin', country: 'US', size: 6 },
    { id: 'seattle', x: -122.3, y: 47.6, label: 'Seattle', country: 'US', size: 7 },
    
    // Canada
    { id: 'toronto', x: -79.4, y: 43.7, label: 'Toronto', country: 'CA', size: 9, isHub: true },
    { id: 'vancouver', x: -123.1, y: 49.3, label: 'Vancouver', country: 'CA', size: 7 },
    { id: 'montreal', x: -73.6, y: 45.5, label: 'Montreal', country: 'CA', size: 6 },
    { id: 'calgary', x: -114.1, y: 51.0, label: 'Calgary', country: 'CA', size: 5 },
  ];

  // Enhanced connections showing recruitment network
  const connections: Connection[] = [
    // Primary Hub Connections (India to North America)
    { from: 'noida', to: 'newyork', animated: true },
    { from: 'noida', to: 'toronto', animated: true },
    { from: 'mumbai', to: 'sanfrancisco', animated: true },
    { from: 'bangalore', to: 'seattle', animated: true },
    
    // Cross-border connections (US-Canada)
    { from: 'newyork', to: 'toronto', animated: true },
    { from: 'seattle', to: 'vancouver', animated: true },
    { from: 'chicago', to: 'montreal', animated: true },
    
    // Regional networks
    { from: 'noida', to: 'mumbai' },
    { from: 'mumbai', to: 'bangalore' },
    { from: 'newyork', to: 'chicago' },
    { from: 'sanfrancisco', to: 'seattle' },
    { from: 'toronto', to: 'vancouver' },
    { from: 'toronto', to: 'montreal' },
    
    // Additional cross-connections
    { from: 'austin', to: 'calgary' },
    { from: 'delhi', to: 'austin', animated: true },
  ];

  // Convert lat/lng to SVG coordinates
  const projectToSVG = (lng: number, lat: number, width: number, height: number) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  // World map outline coordinates (simplified)
  const worldMapPath = `
    M 158.5 110.5 
    C 180 95, 220 88, 280 95
    C 320 88, 380 85, 420 90
    C 460 95, 500 100, 540 110
    C 580 115, 620 120, 660 125
    L 680 140
    C 690 160, 695 180, 700 200
    C 705 220, 700 240, 690 260
    C 680 280, 670 300, 650 320
    C 630 340, 610 350, 590 360
    C 570 370, 550 375, 530 380
    C 510 385, 490 390, 470 385
    C 450 380, 430 375, 410 370
    C 390 365, 370 360, 350 355
    C 330 350, 310 345, 290 340
    C 270 335, 250 330, 230 325
    C 210 320, 190 315, 170 310
    C 150 305, 140 290, 135 270
    C 130 250, 132 230, 135 210
    C 138 190, 142 170, 148 150
    C 154 130, 158.5 110.5, 158.5 110.5 Z
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      // Enhanced grid with subtle glow
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([1, 3]);
      
      // Vertical grid lines
      for (let i = 0; i <= 12; i++) {
        const x = (i / 12) * (canvas.width / 2);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / 2);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let i = 0; i <= 6; i++) {
        const y = (i / 6) * (canvas.height / 2);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / 2, y);
        ctx.stroke();
      }

      ctx.setLineDash([]);

      // Draw enhanced connections with multiple animation effects
      connections.forEach((conn, index) => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (!fromNode || !toNode) return;

        const from = projectToSVG(fromNode.x, fromNode.y, canvas.width / 2, canvas.height / 2);
        const to = projectToSVG(toNode.x, toNode.y, canvas.width / 2, canvas.height / 2);

        // Enhanced connection line with gradient
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        
        if (conn.animated) {
          // Animated primary connections
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
          gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.6)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.8)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
        } else {
          // Static regional connections
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Animated data flow for primary connections
        if (conn.animated) {
          const numPackets = 3;
          for (let p = 0; p < numPackets; p++) {
            const progress = ((time * 0.015 + index * 0.2 + p * 0.33) % 1);
            const packetX = from.x + (to.x - from.x) * progress;
            const packetY = from.y + (to.y - from.y) * progress;

            // Glowing packet effect
            const packetGradient = ctx.createRadialGradient(packetX, packetY, 0, packetX, packetY, 8);
            packetGradient.addColorStop(0, 'rgba(34, 197, 94, 0.9)');
            packetGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.5)');
            packetGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
            
            ctx.fillStyle = packetGradient;
            ctx.beginPath();
            ctx.arc(packetX, packetY, 8, 0, Math.PI * 2);
            ctx.fill();

            // Inner bright core
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Enhanced nodes with better country representation
      nodes.forEach((node, index) => {
        const pos = projectToSVG(node.x, node.y, canvas.width / 2, canvas.height / 2);
        
        // Dynamic pulsing effect
        const pulsePhase = (time * 0.025 + index * 0.4) % (Math.PI * 2);
        const pulseScale = node.isHub ? 1 + Math.sin(pulsePhase) * 0.4 : 1 + Math.sin(pulsePhase) * 0.2;
        const radius = (node.size / 2) * pulseScale;

        // Country-specific enhanced colors
        let nodeColor = 'rgba(59, 130, 246, 0.8)';
        let glowColor = 'rgba(59, 130, 246, 0.3)';
        
        if (node.country === 'IN') {
          nodeColor = node.isHub ? 'rgba(255, 153, 0, 1)' : 'rgba(255, 153, 0, 0.8)';
          glowColor = 'rgba(255, 153, 0, 0.3)';
        } else if (node.country === 'US') {
          nodeColor = node.isHub ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 0.8)';
          glowColor = 'rgba(239, 68, 68, 0.3)';
        } else if (node.country === 'CA') {
          nodeColor = node.isHub ? 'rgba(34, 197, 94, 1)' : 'rgba(34, 197, 94, 0.8)';
          glowColor = 'rgba(34, 197, 94, 0.3)';
        }

        // Multi-layer glow effect
        for (let layer = 3; layer >= 1; layer--) {
          const layerRadius = radius * (1 + layer * 0.5);
          const opacity = 0.1 * (4 - layer);
          
          const layerGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, layerRadius);
          layerGradient.addColorStop(0, nodeColor.replace(/,\s*[\d.]+\)/, `, ${opacity})`));
          layerGradient.addColorStop(1, nodeColor.replace(/,\s*[\d.]+\)/, ', 0)'));
          
          ctx.fillStyle = layerGradient;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, layerRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main node
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Hub indicator ring
        if (node.isHub) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Inner bright core
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 0.3, 0, Math.PI * 2);
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
    <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden border border-gray-700">
      {/* Animated background constellation */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* World map SVG overlay */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 800 400"
      >
        <defs>
          <pattern id="worldPattern" patternUnits="userSpaceOnUse" width="50" height="50">
            <circle cx="25" cy="25" r="1" fill="rgba(59, 130, 246, 0.3)" />
          </pattern>
        </defs>
        
        {/* Simplified continents outline */}
        <g stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" fill="none">
          {/* North America */}
          <path d="M 100 80 Q 150 60 200 80 Q 250 70 280 90 Q 300 110 290 140 Q 280 170 250 180 Q 200 190 150 180 Q 120 170 100 150 Q 90 120 100 80 Z" />
          
          {/* Asia (India region) */}
          <path d="M 500 120 Q 550 110 600 130 Q 620 150 610 180 Q 590 200 560 190 Q 530 185 510 170 Q 500 150 500 120 Z" />
          
          {/* Connection lines overlay */}
          <g stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" strokeDasharray="2,4">
            <line x1="180" y1="120" x2="560" y2="150" />
            <line x1="200" y1="100" x2="580" y2="140" />
            <line x1="220" y1="140" x2="540" y2="170" />
          </g>
        </g>
      </svg>

      {/* Main canvas for animations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Enhanced overlay information */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Country legend */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="flex items-center space-x-2 text-white/90 text-sm font-medium">
            <div className="w-3 h-3 bg-orange-400 rounded-full shadow-lg"></div>
            <span>India (HQ)</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90 text-sm font-medium">
            <div className="w-3 h-3 bg-red-400 rounded-full shadow-lg"></div>
            <span>USA</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90 text-sm font-medium">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
            <span>Canada</span>
          </div>
        </div>

        {/* Live network status */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2 text-white/90 text-sm font-medium bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>Live Recruitment Network</span>
          </div>
        </div>

        {/* Network statistics */}
        <div className="absolute bottom-4 left-4 space-y-2">
          <div className="text-white/80 text-xs font-medium bg-black/20 backdrop-blur-sm rounded px-2 py-1">
            🏢 HQ: Noida, India
          </div>
          <div className="text-white/80 text-xs font-medium bg-black/20 backdrop-blur-sm rounded px-2 py-1">
            🌐 Active in 13 Cities
          </div>
        </div>

        {/* Real-time stats overlay */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            150K+
          </div>
          <div className="text-xs opacity-80 font-medium">Global Talent Pool</div>
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-1/4 text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            24/7
          </div>
          <div className="text-xs opacity-80 font-medium">Global Support</div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-1/3 text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
            3
          </div>
          <div className="text-xs opacity-80 font-medium">Core Markets</div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalNetworkMap;
