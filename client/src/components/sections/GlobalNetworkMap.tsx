
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface NetworkNode {
  id: string;
  lat: number;
  lng: number;
  label: string;
  country: string;
  size: number;
  isHub?: boolean;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  animated?: boolean;
}

const GlobalNetworkMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [rotation, setRotation] = useState(0);

  // Define key locations with proper lat/lng coordinates
  const nodes: NetworkNode[] = [
    // India - Main Hub
    { id: 'noida', lat: 28.6, lng: 77.3, label: 'Noida (HQ)', country: 'IN', size: 16, isHub: true, color: '#ff9800' },
    { id: 'mumbai', lat: 19.0, lng: 72.8, label: 'Mumbai', country: 'IN', size: 12, color: '#ff9800' },
    { id: 'bangalore', lat: 12.9, lng: 77.6, label: 'Bangalore', country: 'IN', size: 12, color: '#ff9800' },
    { id: 'delhi', lat: 28.7, lng: 77.2, label: 'Delhi', country: 'IN', size: 10, color: '#ff9800' },
    
    // United States
    { id: 'newyork', lat: 40.7, lng: -74.0, label: 'New York', country: 'US', size: 14, isHub: true, color: '#f44336' },
    { id: 'sanfrancisco', lat: 37.8, lng: -122.4, label: 'San Francisco', country: 'US', size: 12, color: '#f44336' },
    { id: 'chicago', lat: 41.9, lng: -87.6, label: 'Chicago', country: 'US', size: 10, color: '#f44336' },
    { id: 'austin', lat: 30.3, lng: -97.7, label: 'Austin', country: 'US', size: 9, color: '#f44336' },
    { id: 'seattle', lat: 47.6, lng: -122.3, label: 'Seattle', country: 'US', size: 10, color: '#f44336' },
    
    // Canada
    { id: 'toronto', lat: 43.7, lng: -79.4, label: 'Toronto', country: 'CA', size: 12, isHub: true, color: '#4caf50' },
    { id: 'vancouver', lat: 49.3, lng: -123.1, label: 'Vancouver', country: 'CA', size: 10, color: '#4caf50' },
    { id: 'montreal', lat: 45.5, lng: -73.6, label: 'Montreal', country: 'CA', size: 9, color: '#4caf50' },
    { id: 'calgary', lat: 51.0, lng: -114.1, label: 'Calgary', country: 'CA', size: 8, color: '#4caf50' },
  ];

  // Network connections
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

  // Convert lat/lng to 3D globe coordinates
  const latLngToXYZ = (lat: number, lng: number, radius: number, rotation: number = 0) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + rotation) * (Math.PI / 180);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return { x, y, z };
  };

  // Project 3D coordinates to 2D screen
  const project3DTo2D = (x: number, y: number, z: number, centerX: number, centerY: number) => {
    const distance = 800;
    const scale = distance / (distance + z);
    
    return {
      x: centerX + x * scale,
      y: centerY - y * scale,
      scale: scale,
      visible: z > -200 // Only show points on the front side of the globe
    };
  };

  // Draw world map dots on globe
  const drawWorldMap = (ctx: CanvasRenderContext2D, centerX: number, centerY: number, radius: number, rotation: number) => {
    const mapData = [];
    
    // Generate world map dots (simplified continents)
    // North America
    for (let lat = 25; lat <= 70; lat += 3) {
      for (let lng = -140; lng <= -60; lng += 4) {
        if ((lat >= 25 && lat <= 50 && lng >= -125 && lng <= -65) || 
            (lat >= 50 && lat <= 70 && lng >= -140 && lng <= -60)) {
          mapData.push({ lat, lng });
        }
      }
    }
    
    // Europe
    for (let lat = 35; lat <= 70; lat += 3) {
      for (let lng = -10; lng <= 40; lng += 4) {
        mapData.push({ lat, lng });
      }
    }
    
    // Asia
    for (let lat = 10; lat <= 70; lat += 3) {
      for (let lng = 40; lng <= 140; lng += 4) {
        mapData.push({ lat, lng });
      }
    }
    
    // Africa
    for (let lat = -35; lat <= 35; lat += 3) {
      for (let lng = -20; lng <= 50; lng += 4) {
        mapData.push({ lat, lng });
      }
    }
    
    // Australia
    for (let lat = -45; lat <= -10; lat += 3) {
      for (let lng = 110; lng <= 155; lng += 4) {
        mapData.push({ lat, lng });
      }
    }
    
    // South America
    for (let lat = -55; lat <= 15; lat += 3) {
      for (let lng = -80; lng <= -35; lng += 4) {
        mapData.push({ lat, lng });
      }
    }

    // Draw map dots
    mapData.forEach(point => {
      const { x, y, z } = latLngToXYZ(point.lat, point.lng, radius * 0.98, rotation);
      const projected = project3DTo2D(x, y, z, centerX, centerY);
      
      if (projected.visible) {
        const alpha = Math.max(0.1, projected.scale);
        ctx.fillStyle = `rgba(100, 181, 246, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 1 * projected.scale, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  // Draw connection lines on globe
  const drawConnections = (ctx: CanvasRenderContext2D, centerX: number, centerY: number, radius: number, rotation: number, time: number) => {
    connections.forEach((conn, index) => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return;

      const from3D = latLngToXYZ(fromNode.lat, fromNode.lng, radius, rotation);
      const to3D = latLngToXYZ(toNode.lat, toNode.lng, radius, rotation);
      
      const fromProjected = project3DTo2D(from3D.x, from3D.y, from3D.z, centerX, centerY);
      const toProjected = project3DTo2D(to3D.x, to3D.y, to3D.z, centerX, centerY);

      if (fromProjected.visible && toProjected.visible) {
        // Draw curved connection line
        const midX = (fromProjected.x + toProjected.x) / 2;
        const midY = (fromProjected.y + toProjected.y) / 2;
        const distance = Math.sqrt((toProjected.x - fromProjected.x) ** 2 + (toProjected.y - fromProjected.y) ** 2);
        const curveHeight = distance * 0.2;

        ctx.strokeStyle = conn.animated ? 'rgba(76, 175, 80, 0.8)' : 'rgba(100, 181, 246, 0.4)';
        ctx.lineWidth = conn.animated ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(fromProjected.x, fromProjected.y);
        ctx.quadraticCurveTo(midX, midY - curveHeight, toProjected.x, toProjected.y);
        ctx.stroke();

        // Animated data packets
        if (conn.animated) {
          const progress = ((time * 0.02 + index * 0.3) % 1);
          const t = progress;
          const packetX = (1 - t) * (1 - t) * fromProjected.x + 2 * (1 - t) * t * midX + t * t * toProjected.x;
          const packetY = (1 - t) * (1 - t) * fromProjected.y + 2 * (1 - t) * t * (midY - curveHeight) + t * t * toProjected.y;

          ctx.fillStyle = 'rgba(76, 175, 80, 1)';
          ctx.beginPath();
          ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  };

  // Draw nodes on globe
  const drawNodes = (ctx: CanvasRenderContext2D, centerX: number, centerY: number, radius: number, rotation: number, time: number) => {
    nodes.forEach((node, index) => {
      const { x, y, z } = latLngToXYZ(node.lat, node.lng, radius, rotation);
      const projected = project3DTo2D(x, y, z, centerX, centerY);
      
      if (projected.visible) {
        const pulsePhase = (time * 0.03 + index * 0.5) % (Math.PI * 2);
        const pulseScale = node.isHub ? 1 + Math.sin(pulsePhase) * 0.3 : 1;
        const nodeRadius = (node.size / 2) * projected.scale * pulseScale;

        // Glow effect
        const gradient = ctx.createRadialGradient(projected.x, projected.y, 0, projected.x, projected.y, nodeRadius * 2);
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(0.7, node.color + '80');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, nodeRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Main node
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Hub ring
        if (node.isHub) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(projected.x, projected.y, nodeRadius + 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Inner bright core
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, nodeRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      const centerX = canvas.width / 4;
      const centerY = canvas.height / 4;
      const radius = Math.min(centerX, centerY) * 0.7;
      
      // Auto-rotate the globe
      const currentRotation = time * 0.5;
      setRotation(currentRotation);

      // Draw globe outline
      ctx.strokeStyle = 'rgba(100, 181, 246, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw grid lines (longitude and latitude)
      ctx.strokeStyle = 'rgba(100, 181, 246, 0.1)';
      ctx.lineWidth = 1;
      
      // Longitude lines
      for (let lng = -180; lng <= 180; lng += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const { x, y, z } = latLngToXYZ(lat, lng, radius, currentRotation);
          const projected = project3DTo2D(x, y, z, centerX, centerY);
          if (projected.visible) {
            if (lat === -90) ctx.moveTo(projected.x, projected.y);
            else ctx.lineTo(projected.x, projected.y);
          }
        }
        ctx.stroke();
      }
      
      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lng = -180; lng <= 180; lng += 5) {
          const { x, y, z } = latLngToXYZ(lat, lng, radius, currentRotation);
          const projected = project3DTo2D(x, y, z, centerX, centerY);
          if (projected.visible) {
            if (lng === -180) ctx.moveTo(projected.x, projected.y);
            else ctx.lineTo(projected.x, projected.y);
          }
        }
        ctx.stroke();
      }

      // Draw world map
      drawWorldMap(ctx, centerX, centerY, radius, currentRotation);
      
      // Draw connections
      drawConnections(ctx, centerX, centerY, radius, currentRotation, time);
      
      // Draw nodes
      drawNodes(ctx, centerX, centerY, radius, currentRotation, time);

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
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden border border-gray-700">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
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

      {/* Main 3D Globe Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Enhanced overlay information */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Country legend */}
        <div className="absolute top-6 left-6 space-y-3">
          <motion.div 
            className="flex items-center space-x-3 text-white/90 text-sm font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-4 h-4 bg-orange-400 rounded-full shadow-lg border-2 border-white/50"></div>
            <span>India (HQ)</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-3 text-white/90 text-sm font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg border-2 border-white/50"></div>
            <span>USA</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-3 text-white/90 text-sm font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg border-2 border-white/50"></div>
            <span>Canada</span>
          </motion.div>
        </div>

        {/* Live network status */}
        <motion.div 
          className="absolute top-6 right-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-2 text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>Live Global Network</span>
          </div>
        </motion.div>

        {/* Network statistics overlays */}
        <motion.div
          className="absolute bottom-20 right-20 text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            150K+
          </div>
          <div className="text-sm opacity-80 font-medium">Global Talent Pool</div>
        </motion.div>

        <motion.div
          className="absolute top-32 left-1/4 text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            99.9%
          </div>
          <div className="text-sm opacity-80 font-medium">Network Uptime</div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-20 text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
            3
          </div>
          <div className="text-sm opacity-80 font-medium">Core Markets</div>
        </motion.div>

        {/* Interactive hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-xs font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          🌍 Interactive 3D Globe • Auto-rotating view
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalNetworkMap;
