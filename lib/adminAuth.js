/**
 * Admin Authentication Helper Functions
 * Works with JWT-based authentication system
 */

/**
 * Get cookie value
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return null;
}

/**
 * Set cookie (client-side helper)
 */
export function setCookie(name, value, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Delete cookie
 */
export function deleteCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Get business slug from cookie or localStorage
 */
export function getBusinessSlug() {
  // Try cookie first
  const cookieSlug = getCookie("businessSlug");
  if (cookieSlug) return cookieSlug;

  // Try localStorage
  if (typeof window !== "undefined") {
    const localSlug = localStorage.getItem("businessSlug");
    if (localSlug) return localSlug;
  }

  return null;
}

/**
 * Get admin session from cookies (JWT-based)
 */
export function getAdminSession() {
  const adminEmail = getCookie("admin_email");
  const adminToken = getCookie("admin_token");
  
  if (!adminEmail || !adminToken) {
    return null;
  }

  return {
    email: adminEmail,
    token: adminToken,
  };
}

/**
 * Save business slug to localStorage and cookie
 */
export function saveBusinessSlug(slug) {
  if (typeof window !== "undefined") {
    localStorage.setItem("businessSlug", slug);
  }
  setCookie("businessSlug", slug, 3);
}

/**
 * Clear admin session and logout
 */
export function clearAdminSession() {
  // Clear all cookies
  deleteCookie("admin_token");
  deleteCookie("admin_email");
  deleteCookie("businessSlug");
  
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("businessSlug");
  }
}