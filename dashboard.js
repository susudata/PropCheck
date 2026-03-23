/**
 * PropCheck Dashboard - Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
    initFeatureToasts();
    initPropertyCards();
});

/**
 * Initialize feature toast notifications
 * All buttons with data-feature attribute will show "not ready" toast
 */
function initFeatureToasts() {
    const toast = document.getElementById('featureToast');
    if (!toast) return;
    
    // Find all elements with data-feature attribute
    const featureElements = document.querySelectorAll('[data-feature]');
    
    featureElements.forEach(element => {
        element.addEventListener('click', (e) => {
            // Don't trigger if it's a link (has href)
            if (element.tagName === 'A' && element.getAttribute('href') && element.getAttribute('href') !== '#') {
                return;
            }
            
            e.preventDefault();
            showFeatureToast();
        });
    });
    
    // Close toast on button click
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideFeatureToast);
    }
    
    // Close toast on outside click
    document.addEventListener('click', (e) => {
        if (!toast.contains(e.target) && toast.classList.contains('visible')) {
            hideFeatureToast();
        }
    });
}

/**
 * Show feature not available toast
 */
function showFeatureToast() {
    const toast = document.getElementById('featureToast');
    if (!toast) return;
    
    // Hide any existing toast
    toast.classList.remove('visible');
    
    // Small delay before showing
    setTimeout(() => {
        toast.classList.add('visible');
    }, 10);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        hideFeatureToast();
    }, 4000);
}

/**
 * Hide feature toast
 */
function hideFeatureToast() {
    const toast = document.getElementById('featureToast');
    if (!toast) return;
    
    toast.classList.remove('visible');
}

/**
 * Property cards interactions
 */
function initPropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card:not(.property-card-add)');
    
    propertyCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignore clicks on buttons
            if (e.target.closest('button')) return;
            
            // Could open property details in the future
            // showFeatureToast();
        });
    });
    
    // Add property card hover effect
    const addCard = document.querySelector('.property-card-add');
    if (addCard) {
        addCard.addEventListener('click', () => {
            showFeatureToast();
        });
    }
}

/**
 * Initialize property menu dropdowns (placeholder)
 */
function initPropertyMenus() {
    const menuButtons = document.querySelectorAll('.property-menu-btn');
    
    menuButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // In future: show dropdown menu
            showFeatureToast();
        });
    });
}

initPropertyMenus();
