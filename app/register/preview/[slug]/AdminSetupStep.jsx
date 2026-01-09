"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Store,
  Globe,
  Copy,
  ExternalLink,
  Phone,
  Building2
} from "lucide-react";

// ===== SECURITY: Input Sanitization =====
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

// ===== SECURITY: Email Validation =====
const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// ===== Phone Validation =====
const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// ===== SECURITY: Password Strength Check =====
const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, checks: {} };
  
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  Object.values(checks).forEach(passed => {
    if (passed) strength++;
  });
  
  return { strength, checks };
};

const getStrengthLabel = (strength) => {
  if (strength <= 1) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
  if (strength <= 2) return { label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-500' };
  if (strength <= 3) return { label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
  if (strength <= 4) return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
  return { label: 'Very Strong', color: 'bg-emerald-600', textColor: 'text-emerald-600' };
};

// ===== Generate Slug from Business Name =====
const generateSlug = (name) => {
  if (!name) return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// ===== PASSWORD STRENGTH INDICATOR =====
function PasswordStrengthIndicator({ password }) {
  const { strength, checks } = getPasswordStrength(password);
  const strengthInfo = getStrengthLabel(strength);
  
  if (!password) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 space-y-3"
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Password strength</span>
          <span className={`font-semibold ${strengthInfo.textColor}`}>
            {strengthInfo.label}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex gap-0.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <motion.div
              key={level}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: level <= strength ? 1 : 0 }}
              transition={{ duration: 0.2, delay: level * 0.05 }}
              className={`flex-1 rounded-full origin-left ${
                level <= strength ? strengthInfo.color : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs">
        {[
          { key: 'length', label: '8+ characters' },
          { key: 'lowercase', label: 'Lowercase (a-z)' },
          { key: 'uppercase', label: 'Uppercase (A-Z)' },
          { key: 'number', label: 'Number (0-9)' },
          { key: 'special', label: 'Special (!@#$)' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1.5 py-0.5">
            {checks[key] ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
            )}
            <span className={`truncate ${checks[key] ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ===== COPY TO CLIPBOARD =====
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title="Copy URL"
    >
      {copied ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
}

// ===== MAIN COMPONENT =====
export default function AdminSetupStep({ 
  slug: initialSlug = "", 
  businessName: initialBusinessName = "", 
  logo: initialLogo = "",
  phone: initialPhone = ""
}) {
  const router = useRouter();
  
  // Form fields
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Generated slug preview
  const previewSlug = generateSlug(businessName);
  const previewUrl = previewSlug ? `https://${previewSlug}.locallaunch.in` : '';

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    
    if (touched.businessName && businessName) {
      if (businessName.trim().length < 2) {
        newErrors.businessName = "Business name must be at least 2 characters";
      } else if (generateSlug(businessName).length < 2) {
        newErrors.businessName = "Business name must contain valid characters";
      }
    }

    if (touched.phone && phone) {
      if (!isValidPhone(phone)) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }
    }
    
    if (touched.email && email) {
      if (!isValidEmail(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    
    if (touched.password && password) {
      const { strength } = getPasswordStrength(password);
      if (strength < 3) {
        newErrors.password = "Password is too weak";
      }
    }
    
    if (touched.confirmPassword && confirmPassword) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
  }, [businessName, phone, email, password, confirmPassword, touched]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateAll = () => {
    const newErrors = {};
    
    if (!businessName || businessName.trim().length < 2) {
      newErrors.businessName = "Business name is required";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const { strength } = getPasswordStrength(password);
      if (strength < 3) {
        newErrors.password = "Password is too weak";
      }
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    setTouched({ 
      businessName: true, 
      phone: true, 
      email: true, 
      password: true, 
      confirmPassword: true 
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateAll()) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    setLoading(true);

    try {
      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      const sanitizedBusinessName = sanitizeInput(businessName);
      const sanitizedPhone = sanitizeInput(phone);
      const generatedSlug = generateSlug(businessName);

      // Rate limiting
      const lastAttempt = sessionStorage.getItem('lastSignupAttempt');
      const now = Date.now();
      if (lastAttempt && now - parseInt(lastAttempt) < 3000) {
        toast.error("Please wait a moment before trying again");
        setLoading(false);
        return;
      }
      sessionStorage.setItem('lastSignupAttempt', now.toString());

      const res = await fetch("/api/admin-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          business_name: sanitizedBusinessName,
          slug: generatedSlug,
          email: sanitizedEmail,
          password: password,
          phone: sanitizedPhone,
          type: "general",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.alreadyRegistered) {
          toast.info("This business already exists. Redirecting to dashboard...");
          const redirectSlug = data.redirectTo ? data.redirectTo.split('/site/')[1]?.split('/')[0] : generatedSlug;
          localStorage.setItem("admin_slug", redirectSlug || generatedSlug);
          
          setTimeout(() => {
            window.location.href = `/site/${redirectSlug || generatedSlug}/admin`;
          }, 1000);
          return;
        }
        
        if (data.code === "DUPLICATE_SLUG") {
          setErrors(prev => ({ 
            ...prev, 
            businessName: "This business name is already taken. Please choose a different name." 
          }));
          throw new Error(data.error);
        }
        
        throw new Error(data.error || "Failed to create account");
      }

      if (data.success) {
        const finalSlug = data.slug || generatedSlug;
        localStorage.setItem("admin_slug", finalSlug);
        
        toast.success("🎉 Your store has been created! Redirecting to dashboard...");
        
        // Redirect directly to dashboard
        setTimeout(() => {
          window.location.href = `/site/${finalSlug}/admin`;
        }, 1500);
      } else {
        throw new Error(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSignup();
    }
  };

  const { strength } = getPasswordStrength(password);
  const isFormValid = businessName && 
                      businessName.trim().length >= 2 && 
                      isValidPhone(phone) &&
                      email && 
                      password && 
                      confirmPassword && 
                      isValidEmail(email) && 
                      strength >= 3 && 
                      password === confirmPassword;

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-0">
      <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl sm:shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-5 sm:p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex p-3 sm:p-4 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-sm mb-3 sm:mb-4"
          >
            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </motion.div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            Create Your Store
          </h2>
          <p className="text-white/80 text-xs sm:text-sm">
            Get your online store in just 2 minutes
          </p>
        </div>

        {/* URL Preview */}
        {previewSlug && (
          <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                  Your Store URL
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm sm:text-base">
                    {previewSlug}
                  </span>
                  <span className="text-emerald-600/70 dark:text-emerald-400/70 text-sm sm:text-base">
                    .locallaunch.in
                  </span>
                </div>
                <CopyButton text={previewUrl} />
              </div>
            </motion.div>
          </div>
        )}

        {/* Form */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
          
          {/* Business Name Field */}
          <div>
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Business Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onBlur={() => handleBlur('businessName')}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete="organization"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm sm:text-base transition-all focus:outline-none focus:ring-0 disabled:opacity-50 ${
                  errors.businessName && touched.businessName
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
                }`}
              />
              {businessName && businessName.trim().length >= 2 && !errors.businessName && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              )}
            </div>
            <AnimatePresence>
              {errors.businessName && touched.businessName && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 mt-1.5 sm:mt-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.businessName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Field */}
          <div>
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onBlur={() => handleBlur('phone')}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete="tel"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm sm:text-base transition-all focus:outline-none focus:ring-0 disabled:opacity-50 ${
                  errors.phone && touched.phone
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
                }`}
              />
              {phone && isValidPhone(phone) && !errors.phone && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              )}
            </div>
            <AnimatePresence>
              {errors.phone && touched.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 mt-1.5 sm:mt-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          {/* Email Field */}
          <div>
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete="email"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm sm:text-base transition-all focus:outline-none focus:ring-0 disabled:opacity-50 ${
                  errors.email && touched.email
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
                }`}
              />
              {email && isValidEmail(email) && !errors.email && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              )}
            </div>
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 mt-1.5 sm:mt-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div>
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete="new-password"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pr-10 sm:pr-12 rounded-lg sm:rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm sm:text-base transition-all focus:outline-none focus:ring-0 disabled:opacity-50 ${
                  errors.password && touched.password
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            
            <AnimatePresence>
              {password && <PasswordStrengthIndicator password={password} />}
            </AnimatePresence>
            
            <AnimatePresence>
              {errors.password && touched.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 mt-1.5 sm:mt-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete="new-password"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pr-10 sm:pr-12 rounded-lg sm:rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm sm:text-base transition-all focus:outline-none focus:ring-0 disabled:opacity-50 ${
                  errors.confirmPassword && touched.confirmPassword
                    ? 'border-red-400 focus:border-red-500' 
                    : confirmPassword && password === confirmPassword
                      ? 'border-emerald-400 focus:border-emerald-500'
                      : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            
            {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-500 mt-1.5 sm:mt-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Passwords match
              </motion.p>
            )}
            
            <AnimatePresence>
              {errors.confirmPassword && touched.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 mt-1.5 sm:mt-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.confirmPassword}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={handleSignup}
            disabled={loading || !isFormValid}
            className="w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg sm:shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Creating Your Store...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create My Store</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </motion.button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have a store?{" "}
            <button 
              onClick={() => router.push('/admin-access')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Login here
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
            {[
              { icon: Shield, text: "256-bit SSL" },
              { icon: Lock, text: "Encrypted" },
              { icon: BadgeCheck, text: "Verified" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-6 sm:h-0" />
    </div>
  );
}