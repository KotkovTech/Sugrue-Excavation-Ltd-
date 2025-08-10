// Mobile Video Autoplay Enhancement
document.addEventListener('DOMContentLoaded', function() {
    // Force video autoplay on mobile devices
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Set mobile-specific attributes
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('preload', 'auto');
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        
        // Force play on mobile
        const playVideo = () => {
            video.play().catch(e => {
                console.log('Video autoplay failed:', e);
                // Retry after user interaction
                document.addEventListener('touchstart', () => {
                    video.play().catch(console.log);
                }, { once: true });
            });
        };
        
        // Try to play immediately
        playVideo();
        
        // Also try when video is loaded
        video.addEventListener('loadeddata', playVideo);
        video.addEventListener('canplay', playVideo);
        
        // Ensure video stays playing
        video.addEventListener('pause', () => {
            if (!video.ended) {
                video.play().catch(console.log);
            }
        });
    });
    
    // Additional mobile detection and handling
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Force video play on any user interaction
        const forceVideoPlay = () => {
            videos.forEach(video => {
                if (video.paused) {
                    video.play().catch(console.log);
                }
            });
        };
        
        document.addEventListener('touchstart', forceVideoPlay, { once: true });
        document.addEventListener('click', forceVideoPlay, { once: true });
        
        // Intersection Observer to play videos when they come into view
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        video.play().catch(console.log);
                    }
                });
            }, { threshold: 0.1 });
            
            videos.forEach(video => {
                videoObserver.observe(video);
            });
        }
    }
});

