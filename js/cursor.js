// Custom Minimalist Cursor
// Engineering Tool Inspired Design

class MinimalistCursor {
    constructor() {
        this.cursor = null;
        this.dot = null;
        this.outline = null;
        this.isVisible = false;
        this.isActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.outlineX = 0;
        this.outlineY = 0;
        this.trail = [];
        this.maxTrailLength = 3;
        
        this.init();
    }
    
    init() {
        this.createCursor();
        this.bindEvents();
        this.animate();
    }
    
    createCursor() {
        // Main cursor container
        this.cursor = document.getElementById('cursor');
        if (!this.cursor) {
            this.cursor = document.createElement('div');
            this.cursor.id = 'cursor';
            this.cursor.className = 'cursor';
            document.body.appendChild(this.cursor);
        }
        
        // Cursor dot
        this.dot = this.cursor.querySelector('.cursor-dot');
        if (!this.dot) {
            this.dot = document.createElement('div');
            this.dot.className = 'cursor-dot';
            this.cursor.appendChild(this.dot);
        }
        
        // Cursor outline
        this.outline = this.cursor.querySelector('.cursor-outline');
        if (!this.outline) {
            this.outline = document.createElement('div');
            this.outline.className = 'cursor-outline';
            this.cursor.appendChild(this.outline);
        }
        
        // Create trail elements
        for (let i = 0; i < this.maxTrailLength; i++) {
            const trailElement = document.createElement('div');
            trailElement.className = 'cursor-trail';
            trailElement.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(0, 212, 170, ${0.6 - i * 0.2});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease-out;
                opacity: 0;
            `;
            document.body.appendChild(trailElement);
            this.trail.push(trailElement);
        }
        
        // Add cursor styles
        this.addStyles();
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Hide cursor initially
        this.cursor.style.opacity = '0';
    }
    
    addStyles() {
        if (document.getElementById('cursor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cursor-styles';
        style.textContent = `
            .cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 10000;
                mix-blend-mode: difference;
                transition: opacity 0.3s ease;
            }
            
            .cursor-dot {
                width: 8px;
                height: 8px;
                background: #00D4AA;
                border-radius: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
                transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: 0 0 10px rgba(0, 212, 170, 0.3);
            }
            
            .cursor-outline {
                width: 32px;
                height: 32px;
                border: 1px solid rgba(0, 212, 170, 0.4);
                border-radius: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .cursor.active .cursor-dot {
                transform: translate(-50%, -50%) scale(1.5);
                background: #FF6B35;
                box-shadow: 0 0 15px rgba(255, 107, 53, 0.5);
            }
            
            .cursor.active .cursor-outline {
                transform: translate(-50%, -50%) scale(1.5);
                border-color: rgba(255, 107, 53, 0.6);
            }
            
            .cursor.hover .cursor-dot {
                transform: translate(-50%, -50%) scale(0.5);
                background: #00D4AA;
            }
            
            .cursor.hover .cursor-outline {
                transform: translate(-50%, -50%) scale(2);
                border-color: rgba(0, 212, 170, 0.6);
                border-width: 2px;
            }
            
            .cursor.text .cursor-dot {
                transform: translate(-50%, -50%) scaleX(0.3) scaleY(1.5);
                background: #00D4AA;
                border-radius: 2px;
            }
            
            .cursor.text .cursor-outline {
                transform: translate(-50%, -50%) scale(0.8);
                border-color: rgba(0, 212, 170, 0.3);
            }
            
            .cursor.hidden {
                opacity: 0;
            }
            
            /* Hide cursor on touch devices */
            @media (hover: none) and (pointer: coarse) {
                .cursor,
                .cursor-trail {
                    display: none !important;
                }
                
                body {
                    cursor: auto !important;
                }
            }
            
            /* Ensure cursor is hidden on elements that should show default cursor */
            input, textarea, select, button, a, [contenteditable] {
                cursor: none !important;
            }
            
            /* Special cursor states for different elements */
            .cursor.button .cursor-dot {
                background: #FF6B35;
                transform: translate(-50%, -50%) scale(1.2);
            }
            
            .cursor.button .cursor-outline {
                border-color: rgba(255, 107, 53, 0.6);
                transform: translate(-50%, -50%) scale(1.3);
            }
            
            .cursor.link .cursor-dot {
                background: #00D4AA;
                transform: translate(-50%, -50%) scale(0.8);
            }
            
            .cursor.link .cursor-outline {
                border-color: rgba(0, 212, 170, 0.8);
                transform: translate(-50%, -50%) scale(1.8);
                border-width: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    bindEvents() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (!this.isVisible) {
                this.show();
            }
        });
        
        // Mouse enter/leave document
        document.addEventListener('mouseenter', () => {
            this.show();
        });
        
        document.addEventListener('mouseleave', () => {
            this.hide();
        });
        
        // Mouse down/up
        document.addEventListener('mousedown', () => {
            this.setActive(true);
        });
        
        document.addEventListener('mouseup', () => {
            this.setActive(false);
        });
        
        // Hover effects for different elements
        this.setupHoverEffects();
    }
    
    setupHoverEffects() {
        // Interactive elements
        const interactiveElements = document.querySelectorAll(`
            a, button, input, textarea, select, 
            .cta-button, .nav-link, .thumbnail,
            .project-marker, .timeline-item,
            .capability-card, .value-card,
            [role="button"], [tabindex]:not([tabindex="-1"])
        `);
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.setHover(true, this.getElementType(element));
            });
            
            element.addEventListener('mouseleave', () => {
                this.setHover(false);
            });
        });
        
        // Text elements
        const textElements = document.querySelectorAll(`
            p, span, h1, h2, h3, h4, h5, h6,
            .hero-description, .section-description,
            .timeline-text, .card-description
        `);
        
        textElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.setTextMode(true);
            });
            
            element.addEventListener('mouseleave', () => {
                this.setTextMode(false);
            });
        });
    }
    
    getElementType(element) {
        if (element.matches('button, .cta-button')) {
            return 'button';
        } else if (element.matches('a, .nav-link')) {
            return 'link';
        } else if (element.matches('input, textarea, select')) {
            return 'text';
        } else {
            return 'hover';
        }
    }
    
    show() {
        this.isVisible = true;
        this.cursor.style.opacity = '1';
        this.cursor.classList.remove('hidden');
        
        // Show trail elements
        this.trail.forEach(trailElement => {
            trailElement.style.opacity = '1';
        });
    }
    
    hide() {
        this.isVisible = false;
        this.cursor.style.opacity = '0';
        this.cursor.classList.add('hidden');
        
        // Hide trail elements
        this.trail.forEach(trailElement => {
            trailElement.style.opacity = '0';
        });
    }
    
    setActive(active) {
        this.isActive = active;
        if (active) {
            this.cursor.classList.add('active');
        } else {
            this.cursor.classList.remove('active');
        }
    }
    
    setHover(hover, type = 'hover') {
        // Remove all hover classes
        this.cursor.classList.remove('hover', 'button', 'link', 'text');
        
        if (hover) {
            this.cursor.classList.add(type);
        }
    }
    
    setTextMode(textMode) {
        if (textMode) {
            this.cursor.classList.add('text');
        } else {
            this.cursor.classList.remove('text');
        }
    }
    
    updateTrail() {
        // Update trail positions with delay
        for (let i = this.trail.length - 1; i > 0; i--) {
            const current = this.trail[i];
            const previous = this.trail[i - 1];
            
            current.style.left = previous.style.left;
            current.style.top = previous.style.top;
        }
        
        // Update first trail element to follow cursor with slight delay
        if (this.trail.length > 0) {
            this.trail[0].style.left = this.outlineX + 'px';
            this.trail[0].style.top = this.outlineY + 'px';
        }
    }
    
    animate() {
        // Smooth cursor movement with different speeds for dot and outline
        const dotSpeed = 0.9;
        const outlineSpeed = 0.15;
        
        // Update dot position (fast)
        if (this.dot) {
            this.dot.style.left = this.mouseX + 'px';
            this.dot.style.top = this.mouseY + 'px';
        }
        
        // Update outline position (slow, smooth)
        this.outlineX += (this.mouseX - this.outlineX) * outlineSpeed;
        this.outlineY += (this.mouseY - this.outlineY) * outlineSpeed;
        
        if (this.outline) {
            this.outline.style.left = this.outlineX + 'px';
            this.outline.style.top = this.outlineY + 'px';
        }
        
        // Update trail
        this.updateTrail();
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Public methods for external control
    destroy() {
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        
        this.trail.forEach(trailElement => {
            if (trailElement.parentNode) {
                trailElement.parentNode.removeChild(trailElement);
            }
        });
        
        document.body.style.cursor = 'auto';
        
        const styles = document.getElementById('cursor-styles');
        if (styles) {
            styles.remove();
        }
    }
    
    toggle(visible) {
        if (visible) {
            this.show();
        } else {
            this.hide();
        }
    }
}

// Initialize cursor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on non-touch devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.minimalistCursor = new MinimalistCursor();
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinimalistCursor;
}

