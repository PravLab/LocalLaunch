"use client";

import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Bell, 
  Plus, 
  Eye, 
  Edit, 
  IndianRupee, 
  Clock, 
  CheckCircle2,
  Settings,
  CreditCard,
  Megaphone,
  Bot,
  Truck,
  Globe,
  QrCode,
  ExternalLink,
  LogOut,
  ChevronRight,
  Sparkles,
  Store,
  FileText,
  MapPin,
  Smartphone,
  Download,
  Share2,
  Zap,
  BarChart3,
  Users,
  Star
} from "lucide-react";
import { useState } from "react";

// ===== ANIMATED STAT CARD =====
function StatCard({ icon: Icon, label, value, change, color, delay }) {
  const colorClasses = {
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      icon: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      icon: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      icon: "text-purple-600 dark:text-purple-400",
      badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
    },
  };

  const classes = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 rounded-2xl bg-white dark:bg-gray-800/80 
        border border-gray-100 dark:border-gray-700/50
        shadow-lg shadow-gray-100/50 dark:shadow-none
        hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600
        transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${classes.bg}`}>
          <Icon className={`w-5 h-5 ${classes.icon}`} />
        </div>
        {change && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${classes.badge}`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </motion.div>
  );
}

// ===== MENU CARD =====
function MenuCard({ icon: Icon, title, description, color, badge, delay }) {
  const colorClasses = {
    indigo: "from-indigo-500 to-blue-600",
    emerald: "from-emerald-500 to-green-600",
    amber: "from-amber-500 to-orange-600",
    purple: "from-purple-500 to-pink-600",
    blue: "from-blue-500 to-cyan-600",
    rose: "from-rose-500 to-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800/80 
        border border-gray-100 dark:border-gray-700/50
        shadow-lg shadow-gray-100/50 dark:shadow-none
        hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600
        transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Hover Gradient Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 
        transition-opacity duration-300 bg-gradient-to-br ${colorClasses[color]}`} />
      
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full 
          bg-amber-100 dark:bg-amber-900/30 
          text-amber-700 dark:text-amber-400 
          text-xs font-bold">
          {badge}
        </div>
      )}
      
      <div className="relative z-10">
        <div className={`inline-flex p-3 rounded-xl mb-4 
          bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h4 className="font-bold text-gray-900 dark:text-white mb-1 
          group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h4>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      
      {/* Arrow */}
      <ChevronRight className="absolute right-4 bottom-4 w-5 h-5 
        text-gray-300 dark:text-gray-600 
        group-hover:text-indigo-500 dark:group-hover:text-indigo-400
        group-hover:translate-x-1 transition-all" />
    </motion.div>
  );
}

// ===== MAIN COMPONENT =====
export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <section id="demo" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 
      bg-gradient-to-b from-white via-gray-50/50 to-white
      dark:from-[#0d1117] dark:via-[#0a0f1a] dark:to-[#0d1117] 
      relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 
          bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 
          bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ===== SECTION HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-gradient-to-r from-emerald-100 to-green-100 
              dark:from-emerald-900/30 dark:to-green-900/30 
              border border-emerald-200 dark:border-emerald-800
              text-emerald-700 dark:text-emerald-400 
              text-sm font-bold mb-6"
          >
            <CheckCircle2 className="w-4 h-4" />
            Ye Sab Milega FREE Mein
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold 
            text-gray-900 dark:text-white mb-4 sm:mb-6">
            <span className="block sm:inline">Powerful</span>{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
              dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 
              bg-clip-text text-transparent">
              Seller Dashboard
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Apna business manage karo ek professional dashboard se — 
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {" "}orders, products, marketing sab ek jagah.
            </span>
          </p>
        </motion.div>

        {/* ===== DASHBOARD MOCKUP ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glow Effect Behind */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 
            rounded-3xl blur-2xl opacity-60 dark:opacity-40" />
          
          {/* Browser Frame */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden 
            border border-gray-200/80 dark:border-gray-700/80 
            shadow-2xl shadow-gray-300/50 dark:shadow-black/50
            bg-white dark:bg-gray-900">
            
            {/* ===== BROWSER TOP BAR ===== */}
            <div className="flex items-center justify-between px-4 py-3 
              bg-gray-100 dark:bg-gray-800 
              border-b border-gray-200 dark:border-gray-700">
              
              {/* Window Controls */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
                </div>
              </div>
              
              {/* URL Bar */}
              <div className="flex-1 mx-4 max-w-md">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-700 
                  rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-600">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                    locallaunch.in/admin/megmart
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* ===== DASHBOARD CONTENT ===== */}
            <div className="flex flex-col lg:flex-row">
              
              {/* ===== SIDEBAR (Desktop) ===== */}
              <div className="hidden lg:flex flex-col w-64 
                bg-gray-50 dark:bg-gray-800/50 
                border-r border-gray-200 dark:border-gray-700/50 p-4">
                
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 p-3 
                  rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold">MegMart</div>
                    <div className="text-xs text-white/70">Admin Panel</div>
                  </div>
                </div>
                
                {/* Navigation */}
                <nav className="space-y-1 flex-1">
                  {[
                    { icon: BarChart3, label: "Dashboard", active: true },
                    { icon: ShoppingBag, label: "Orders", badge: "3" },
                    { icon: Package, label: "Products" },
                    { icon: FileText, label: "Site Info" },
                    { icon: CreditCard, label: "Payments" },
                    { icon: Megaphone, label: "Marketing" },
                    { icon: Bot, label: "AI Chatbot", badge: "NEW" },
                    { icon: Truck, label: "Delivery Zones" },
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
                        ${item.active 
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                          ${item.badge === 'NEW' 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </nav>
                
                {/* Bottom Actions */}
                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl
                    text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                    <Eye className="w-5 h-5" />
                    <span className="text-sm font-medium">View Site</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl
                    text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>

              {/* ===== MAIN CONTENT ===== */}
              <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50/50 dark:bg-[#0a0f1a]">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Admin Panel
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 
                        text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                        LIVE
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">MegMart</span> Admin
                      <span className="mx-2">•</span>
                      Manage your business online
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                      text-gray-700 dark:text-gray-300 text-sm font-medium
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View Site</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                      bg-gradient-to-r from-indigo-600 to-purple-600 
                      hover:from-indigo-700 hover:to-purple-700
                      text-white text-sm font-bold shadow-lg shadow-indigo-500/30
                      transition-all duration-300">
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <StatCard 
                    icon={IndianRupee} 
                    label="Today's Sales" 
                    value="₹2,450" 
                    change="+12%" 
                    color="emerald"
                    delay={0.1}
                  />
                  <StatCard 
                    icon={ShoppingBag} 
                    label="Total Orders" 
                    value="128" 
                    change="+8%" 
                    color="blue"
                    delay={0.2}
                  />
                  <StatCard 
                    icon={Clock} 
                    label="Pending" 
                    value="3" 
                    change="Action" 
                    color="amber"
                    delay={0.3}
                  />
                  <StatCard 
                    icon={TrendingUp} 
                    label="Total Revenue" 
                    value="₹45,200" 
                    change="+24%" 
                    color="purple"
                    delay={0.4}
                  />
                </div>

                {/* Menu Grid - Your Actual Dashboard Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
                  <MenuCard 
                    icon={ShoppingBag}
                    title="Orders"
                    description="Manage customer orders and track deliveries"
                    color="indigo"
                    badge="3 New"
                    delay={0.15}
                  />
                  <MenuCard 
                    icon={Package}
                    title="Products"
                    description="Add, edit and organize your product catalog"
                    color="emerald"
                    delay={0.2}
                  />
                  <MenuCard 
                    icon={FileText}
                    title="Site Info"
                    description="Update business details and settings"
                    color="blue"
                    delay={0.25}
                  />
                  <MenuCard 
                    icon={CreditCard}
                    title="Payments"
                    description="Configure payment methods and pricing"
                    color="purple"
                    delay={0.3}
                  />
                  <MenuCard 
                    icon={Megaphone}
                    title="Marketing"
                    description="Create posters and promote your business"
                    color="rose"
                    delay={0.35}
                  />
                  <MenuCard 
                    icon={Bot}
                    title="AI Chatbot"
                    description="Enable smart assistant on your site"
                    color="amber"
                    badge="₹299/mo"
                    delay={0.4}
                  />
                </div>

                {/* Quick Actions Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {[
                    { icon: Truck, label: "Delivery Zones", color: "bg-cyan-500" },
                    { icon: Globe, label: "Custom Domain", color: "bg-violet-500" },
                    { icon: QrCode, label: "QR Code", color: "bg-pink-500" },
                    { icon: Share2, label: "Share Store", color: "bg-orange-500" },
                  ].map((action, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      whileHover={{ y: -3 }}
                      className="flex items-center gap-3 p-4 rounded-xl
                        bg-white dark:bg-gray-800/80 
                        border border-gray-100 dark:border-gray-700/50
                        shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Welcome Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="p-6 rounded-2xl 
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                    text-white relative overflow-hidden"
                >
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} 
                  />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold mb-1">
                          Welcome to your admin panel! 🎉
                        </h4>
                        <p className="text-white/80 text-sm sm:text-base">
                          Start by adding products to your catalog and configuring delivery zones.
                        </p>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 rounded-xl bg-white text-indigo-600 font-bold
                      hover:bg-gray-100 transition-colors shadow-lg">
                      Get Started
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ===== FLOATING BADGES ===== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="absolute -right-2 sm:-right-4 top-24 p-3 sm:p-4 rounded-xl 
              bg-white dark:bg-gray-800 
              shadow-xl border border-gray-100 dark:border-gray-700
              hidden md:flex items-center gap-2"
          >
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">QR Ready</div>
              <div className="text-xs text-gray-500">Scan & Shop</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="absolute -left-2 sm:-left-4 bottom-32 p-3 sm:p-4 rounded-xl 
              bg-white dark:bg-gray-800 
              shadow-xl border border-gray-100 dark:border-gray-700
              hidden md:flex items-center gap-2"
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">Mobile Ready</div>
              <div className="text-xs text-gray-500">Works everywhere</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="absolute -right-2 sm:-right-4 bottom-24 p-3 sm:p-4 rounded-xl 
              bg-white dark:bg-gray-800 
              shadow-xl border border-gray-100 dark:border-gray-700
              hidden lg:flex items-center gap-2"
          >
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">Real-time</div>
              <div className="text-xs text-gray-500">Instant updates</div>
            </div>
          </motion.div>
        </motion.div>

        {/* ===== FEATURES LIST BELOW ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { icon: Package, title: "Unlimited Products", desc: "No limits on catalog" },
            { icon: ShoppingBag, title: "Order Management", desc: "Track all orders" },
            { icon: QrCode, title: "QR Code", desc: "Print & share" },
            { icon: BarChart3, title: "Analytics", desc: "Sales insights" },
            { icon: Megaphone, title: "Marketing Tools", desc: "Posters & promos" },
            { icon: Truck, title: "Delivery Zones", desc: "Set service areas" },
            { icon: Bot, title: "AI Assistant", desc: "Smart chatbot" },
            { icon: Globe, title: "Custom Domain", desc: "Your own URL" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-xl
                bg-white/80 dark:bg-gray-800/50 
                border border-gray-100 dark:border-gray-700/50
                shadow-md"
            >
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <feature.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {feature.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}