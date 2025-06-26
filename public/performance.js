// Performance optimizations for the portfolio

// Lazy load images with intersection observer
document.addEventListener('DOMContentLoaded', function() {
  // Lazy loading for images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Preload critical resources on user interaction
  const preloadResources = () => {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    fontLink.href = '/fonts/inter-var.woff2';
    document.head.appendChild(fontLink);

    // Preload critical images
    const profileImg = new Image();
    profileImg.src = '/profile-pic.jpg';
    
    const ogImage = new Image();
    ogImage.src = '/og-image.jpg';
  };

  // Preload on first user interaction
  ['mousedown', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, preloadResources, { once: true });
  });

  // Service Worker registration for caching (optional)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Critical CSS loading optimization
  const loadCSS = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  // Load non-critical CSS asynchronously
  setTimeout(() => {
    loadCSS('https://unpkg.com/aos@2.3.4/dist/aos.css');
  }, 100);
});
