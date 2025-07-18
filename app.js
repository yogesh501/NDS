// NDS App JavaScript - Fixed Version
class NDSApp {
    constructor() {
        this.currentSection = 'home';
        this.currentSlide = 0;
        this.isEnglish = true;
        this.carouselInterval = null;
        this.liveTimer = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupNavigation();
        this.setupCarousel();
        this.setupLanguageToggle();
        this.setupFilters();
        this.setupViewToggles();
        this.setupCategoryFilters();
        this.setupCommunityFeatures();
        this.setupLiveTimer();
        this.setupFAB();
        this.setupTouchSupport();
        
        // Ensure home section is visible on load
        this.navigateToSection('home');
        
        console.log('NDS App initialized successfully');
    }

    // Navigation System - Fixed
    setupNavigation() {
        // Bottom navigation
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Quick access buttons
        const quickBtns = document.querySelectorAll('.quick-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });
    }

    navigateToSection(sectionName) {
        console.log(`Navigating to section: ${sectionName}`);
        
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        } else {
            console.error(`Section ${sectionName} not found`);
            return;
        }

        // Update navigation buttons
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionName) {
                btn.classList.add('active');
            }
        });

        this.currentSection = sectionName;
        
        // Special handling for different sections
        if (sectionName === 'home') {
            this.startCarousel();
        } else {
            this.stopCarousel();
        }

        // Initialize section-specific features
        this.initializeSectionFeatures(sectionName);
    }

    initializeSectionFeatures(sectionName) {
        switch (sectionName) {
            case 'scoreboard':
                this.setupLiveTimer();
                break;
            case 'venues':
                this.initializeVenueView();
                break;
            case 'community':
                this.initializeCommunityFeatures();
                break;
        }
    }

    // Carousel Functionality
    setupCarousel() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Auto-start carousel only if on home page
        if (this.currentSection === 'home') {
            this.startCarousel();
        }
    }

    startCarousel() {
        this.stopCarousel();
        this.carouselInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopCarousel() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }
    }

    nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        this.goToSlide(this.currentSlide);
    }

    goToSlide(slideIndex) {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');

        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === slideIndex) {
                slide.classList.add('active');
            }
        });

        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === slideIndex) {
                dot.classList.add('active');
            }
        });

        this.currentSlide = slideIndex;
    }

    // Language Toggle
    setupLanguageToggle() {
        const toggleBtn = document.getElementById('languageToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    toggleLanguage() {
        this.isEnglish = !this.isEnglish;
        const toggleBtn = document.getElementById('languageToggle');
        
        if (this.isEnglish) {
            toggleBtn.textContent = 'தமிழ்';
            this.updateUILanguage('en');
        } else {
            toggleBtn.textContent = 'English';
            this.updateUILanguage('ta');
        }
    }

    updateUILanguage(lang) {
        // Show language change feedback
        const currentSection = document.getElementById(this.currentSection);
        if (currentSection) {
            currentSection.style.opacity = '0.8';
            setTimeout(() => {
                currentSection.style.opacity = '1';
            }, 200);
        }
        
        this.showToast(lang === 'en' ? 'Switched to English' : 'தமிழ் மொழிக்கு மாற்றப்பட்டது');
    }

    // Filter System
    setupFilters() {
        const dateFilter = document.getElementById('dateFilter');
        const locationFilter = document.getElementById('locationFilter');

        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.filterScoreboard('date', e.target.value);
            });
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.filterScoreboard('location', e.target.value);
            });
        }
    }

    filterScoreboard(filterType, value) {
        console.log(`Filtering ${filterType} by ${value}`);
        // Add visual feedback
        const participantList = document.querySelector('.participant-list');
        if (participantList) {
            participantList.style.opacity = '0.7';
            setTimeout(() => {
                participantList.style.opacity = '1';
            }, 300);
        }
        
        this.showToast(`Filtered by ${filterType}: ${value}`);
    }

    // View Toggles (List/Map) - Fixed
    setupViewToggles() {
        const viewToggles = document.querySelectorAll('.view-toggle');
        viewToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(view) {
        const listView = document.getElementById('venuesView');
        const mapView = document.getElementById('mapView');
        const toggles = document.querySelectorAll('.view-toggle');

        // Update toggle buttons
        toggles.forEach(toggle => {
            toggle.classList.remove('active');
            if (toggle.dataset.view === view) {
                toggle.classList.add('active');
            }
        });

        // Switch views
        if (view === 'list') {
            if (listView) {
                listView.classList.remove('hidden');
                listView.style.display = 'block';
            }
            if (mapView) {
                mapView.classList.add('hidden');
                mapView.style.display = 'none';
            }
        } else if (view === 'map') {
            if (listView) {
                listView.classList.add('hidden');
                listView.style.display = 'none';
            }
            if (mapView) {
                mapView.classList.remove('hidden');
                mapView.style.display = 'block';
            }
        }
        
        this.showToast(`Switched to ${view} view`);
    }

    initializeVenueView() {
        // Ensure list view is shown by default
        this.switchView('list');
    }

    // Category Filters
    setupCategoryFilters() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.currentTarget.dataset.category;
                const parentSection = e.currentTarget.closest('.section');
                this.filterByCategory(category, parentSection);
            });
        });
    }

    filterByCategory(category, section) {
        // Update active button
        const categoryBtns = section.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });

        // Filter content (visual feedback)
        const grid = section.querySelector('.news-grid, .articles-grid');
        if (grid) {
            grid.style.opacity = '0.7';
            setTimeout(() => {
                grid.style.opacity = '1';
            }, 300);
        }

        this.showToast(`Filtering by: ${category}`);
        console.log(`Filtering ${section.id} by category: ${category}`);
    }

    // Community Features - Fixed
    setupCommunityFeatures() {
        const newPostBtn = document.getElementById('newPostBtn');
        if (newPostBtn) {
            newPostBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNewPostDialog();
            });
        }

        this.setupPostInteractions();
    }

    initializeCommunityFeatures() {
        this.setupPostInteractions();
    }

    setupPostInteractions() {
        // Setup post interactions
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePostAction(e.currentTarget);
            });
        });
    }

    showNewPostDialog() {
        // Create a simple modal-like experience
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 2000;
            max-width: 90%;
            width: 400px;
            border: 2px solid #800000;
        `;
        
        dialog.innerHTML = `
            <h3 style="color: #800000; margin-bottom: 16px;">Create New Post</h3>
            <textarea 
                placeholder="What's on your mind about Jallikattu?"
                style="width: 100%; height: 100px; padding: 12px; border: 2px solid #800000; border-radius: 8px; font-family: inherit; resize: vertical; box-sizing: border-box;"
            ></textarea>
            <div style="margin-top: 16px; display: flex; gap: 12px; justify-content: flex-end;">
                <button id="cancelPost" style="padding: 8px 16px; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
                <button id="submitPost" style="padding: 8px 16px; background: #800000; color: white; border: none; border-radius: 6px; cursor: pointer;">Post</button>
            </div>
        `;

        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1999;
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(dialog);

        // Focus on textarea
        const textarea = dialog.querySelector('textarea');
        setTimeout(() => textarea.focus(), 100);

        // Handle close
        const closeDialog = () => {
            if (document.body.contains(backdrop)) {
                document.body.removeChild(backdrop);
            }
            if (document.body.contains(dialog)) {
                document.body.removeChild(dialog);
            }
        };

        backdrop.addEventListener('click', closeDialog);
        dialog.querySelector('#cancelPost').addEventListener('click', closeDialog);
        dialog.querySelector('#submitPost').addEventListener('click', () => {
            const textarea = dialog.querySelector('textarea');
            if (textarea.value.trim()) {
                this.addNewPost(textarea.value.trim());
                closeDialog();
            }
        });
    }

    addNewPost(content) {
        const postsContainer = document.querySelector('.community-posts');
        if (!postsContainer) return;

        const newPost = document.createElement('div');
        newPost.className = 'post-card';
        newPost.style.opacity = '0';
        newPost.style.transform = 'translateY(-20px)';
        
        newPost.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <strong>You</strong>
                    <span class="post-time">Just now</span>
                </div>
            </div>
            <div class="post-content">
                <p>${content}</p>
            </div>
            <div class="post-actions">
                <button class="action-btn">👍 0</button>
                <button class="action-btn">💬 0</button>
                <button class="action-btn">🔄 Share</button>
            </div>
        `;

        postsContainer.insertBefore(newPost, postsContainer.firstChild);
        
        // Animate in
        setTimeout(() => {
            newPost.style.transition = 'all 0.3s ease';
            newPost.style.opacity = '1';
            newPost.style.transform = 'translateY(0)';
        }, 10);

        // Setup action buttons for new post
        const actionBtns = newPost.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePostAction(e.currentTarget);
            });
        });

        this.showToast('Post created successfully!');
    }

    handlePostAction(btn) {
        const action = btn.textContent.trim();
        
        if (action.includes('👍')) {
            // Handle like
            const currentLikes = parseInt(action.match(/\d+/)[0]);
            btn.textContent = `👍 ${currentLikes + 1}`;
            btn.style.color = '#800000';
            
            // Add animation
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
            
            this.showToast('Post liked!');
        } else if (action.includes('💬')) {
            // Handle comment
            this.showToast('Comments feature coming soon!');
        } else if (action.includes('🔄')) {
            // Handle share
            this.sharePost();
        }
    }

    sharePost() {
        if (navigator.share) {
            navigator.share({
                title: 'NDS - Native Dravidian Sports',
                text: 'Check out this post about Jallikattu!',
                url: window.location.href
            });
        } else {
            // Fallback
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                this.showToast('Link copied to clipboard!');
            }).catch(() => {
                this.showToast('Unable to copy link');
            });
        }
    }

    // Live Timer - Fixed
    setupLiveTimer() {
        const timerElement = document.getElementById('timeRemaining');
        if (timerElement && this.currentSection === 'scoreboard') {
            this.startLiveTimer();
        }
    }

    startLiveTimer() {
        // Clear existing timer
        if (this.liveTimer) {
            clearInterval(this.liveTimer);
        }

        let timeRemaining = 2 * 3600 + 30 * 60; // 2:30:00 in seconds
        const timerElement = document.getElementById('timeRemaining');
        
        if (!timerElement) return;

        this.liveTimer = setInterval(() => {
            timeRemaining--;
            
            if (timeRemaining <= 0) {
                clearInterval(this.liveTimer);
                timerElement.textContent = '00:00:00';
                this.showToast('Event completed!');
                return;
            }

            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = timeRemaining % 60;

            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Floating Action Button - Fixed
    setupFAB() {
        const fab = document.getElementById('fab');
        if (fab) {
            fab.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFABClick();
            });
        }
    }

    handleFABClick() {
        const currentSection = this.currentSection;
        
        switch (currentSection) {
            case 'home':
                this.navigateToSection('community');
                break;
            case 'community':
                this.showNewPostDialog();
                break;
            case 'news':
                this.navigateToSection('community');
                break;
            case 'articles':
                this.navigateToSection('community');
                break;
            case 'venues':
                this.navigateToSection('community');
                break;
            case 'scoreboard':
                this.navigateToSection('community');
                break;
            default:
                this.navigateToSection('home');
        }
    }

    // Touch and Swipe Support
    setupTouchSupport() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Horizontal swipe (for carousel)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (this.currentSection === 'home') {
                    if (deltaX > 0) {
                        // Swipe right - previous slide
                        this.goToSlide(this.currentSlide > 0 ? this.currentSlide - 1 : 2);
                    } else {
                        // Swipe left - next slide
                        this.nextSlide();
                    }
                }
            }
        });
    }

    // Utility Functions
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: #800000;
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Cleanup
    destroy() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
        }
        if (this.liveTimer) {
            clearInterval(this.liveTimer);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ndsApp = new NDSApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        if (window.ndsApp) {
            window.ndsApp.stopCarousel();
        }
    } else {
        // Resume animations when page is visible
        if (window.ndsApp && window.ndsApp.currentSection === 'home') {
            window.ndsApp.startCarousel();
        }
    }
});

// Handle offline/online status
window.addEventListener('online', () => {
    if (window.ndsApp) {
        window.ndsApp.showToast('App is back online');
    }
});

window.addEventListener('offline', () => {
    if (window.ndsApp) {
        window.ndsApp.showToast('App is offline');
    }
});

// Service Worker registration for PWA capabilities
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