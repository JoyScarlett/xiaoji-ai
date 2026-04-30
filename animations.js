// 🎯 小鸡AI营销系统 - 动画效果 JavaScript
// 第9步：动画效果系统 - 核心逻辑

class AnimationController {
    constructor(options = {}) {
        this.options = {
            debug: options.debug || false,
            scrollThreshold: options.scrollThreshold || 0.1,
            parallaxStrength: {
                light: options.parallaxLight || 0.02,
                medium: options.parallaxMedium || 0.05,
                strong: options.parallaxStrong || 0.1
            }
        };
        
        this.observers = [];
        this.parallaxElements = [];
        this.cursorGlow = null;
        
        if (this.options.debug) {
            console.log('🎨 AnimationController 初始化完成');
        }
    }
    
    // ============================================
    // 1. 滚动动画观察器
    // ============================================
    initScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-down, .scroll-animate-scale');
        
        if (elements.length === 0) {
            if (this.options.debug) {
                console.log('⚠️ 未找到滚动动画元素');
            }
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    if (this.options.debug) {
                        console.log('✨ 元素进入视口:', entry.target);
                    }
                }
            });
        }, {
            threshold: this.options.scrollThreshold,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => observer.observe(el));
        this.observers.push(observer);
        
        if (this.options.debug) {
            console.log(`✅ 滚动动画已初始化，监听 ${elements.length} 个元素`);
        }
    }
    
    // ============================================
    // 2. 视差效果 - 鼠标跟踪
    // ============================================
    initParallaxEffect() {
        const containers = document.querySelectorAll('.parallax-container');
        
        if (containers.length === 0) {
            if (this.options.debug) {
                console.log('⚠️ 未找到视差容器');
            }
            return;
        }
        
        containers.forEach(container => {
            const elements = container.querySelectorAll('.parallax-element');
            
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                elements.forEach(el => {
                    let strength = this.options.parallaxStrength.medium;
                    
                    if (el.classList.contains('parallax-light')) {
                        strength = this.options.parallaxStrength.light;
                    } else if (el.classList.contains('parallax-strong')) {
                        strength = this.options.parallaxStrength.strong;
                    }
                    
                    const moveX = x * strength * 100;
                    const moveY = y * strength * 100;
                    
                    el.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
            
            // 鼠标离开时重置
            container.addEventListener('mouseleave', () => {
                elements.forEach(el => {
                    el.style.transform = 'translate(0, 0)';
                });
            });
        });
        
        if (this.options.debug) {
            console.log(`✅ 视差效果已初始化，监听 ${containers.length} 个容器`);
        }
    }
    
    // ============================================
    // 3. 3D视差效果
    // ============================================
    init3DParallax() {
        const containers = document.querySelectorAll('.parallax-3d');
        
        if (containers.length === 0) return;
        
        containers.forEach(container => {
            const layers = container.querySelectorAll('.parallax-3d-layer');
            
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                layers.forEach((layer, index) => {
                    const depth = (index + 1) * 10;
                    const moveX = x * depth;
                    const moveY = y * depth;
                    
                    layer.style.transform = `translate3d(${moveX}px, ${moveY}px, ${depth}px)`;
                });
            });
            
            container.addEventListener('mouseleave', () => {
                layers.forEach(layer => {
                    layer.style.transform = 'translate3d(0, 0, 0)';
                });
            });
        });
        
        if (this.options.debug) {
            console.log(`✅ 3D视差效果已初始化`);
        }
    }
    
    // ============================================
    // 4. 水波纹效果
    // ============================================
    initRippleEffect() {
        const buttons = document.querySelectorAll('.btn-ripple');
        
        if (buttons.length === 0) {
            if (this.options.debug) {
                console.log('⚠️ 未找到水波纹按钮');
            }
            return;
        }
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                // 动画结束后移除元素
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                if (this.options.debug) {
                    console.log('💧 水波纹效果触发');
                }
            });
        });
        
        if (this.options.debug) {
            console.log(`✅ 水波纹效果已初始化，监听 ${buttons.length} 个按钮`);
        }
    }
    
    // ============================================
    // 5. 数字计数器动画
    // ============================================
    initCounterAnimation() {
        const counters = document.querySelectorAll('.counter');
        
        if (counters.length === 0) {
            if (this.options.debug) {
                console.log('⚠️ 未找到计数器元素');
            }
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    this.animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => observer.observe(counter));
        this.observers.push(observer);
        
        if (this.options.debug) {
            console.log(`✅ 计数器动画已初始化，监听 ${counters.length} 个元素`);
        }
    }
    
    // 执行计数动画
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target') || element.textContent);
        const duration = parseInt(element.getAttribute('data-duration') || 2000);
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            element.classList.add('counter-animate');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                element.classList.remove('counter-animate');
                
                if (this.options.debug) {
                    console.log(`🔢 计数器动画完成: ${target}`);
                }
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    // ============================================
    // 6. 字符动画分割器
    // ============================================
    initCharAnimation() {
        const elements = document.querySelectorAll('.text-char-animate');
        
        if (elements.length === 0) {
            if (this.options.debug) {
                console.log('⚠️ 未找到字符动画元素');
            }
            return;
        }
        
        elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            // 将每个字符包裹在span中
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char; // 保留空格
                span.style.animationDelay = `${index * 0.05}s`;
                element.appendChild(span);
            });
        });
        
        if (this.options.debug) {
            console.log(`✅ 字符动画已初始化，处理 ${elements.length} 个元素`);
        }
    }
    
    // ============================================
    // 7. 光标跟随效果
    // ============================================
    initCursorGlow() {
        // 检查是否已存在
        if (document.querySelector('.cursor-glow')) {
            if (this.options.debug) {
                console.log('⚠️ 光标效果已存在');
            }
            return;
        }
        
        // 创建光标元素
        this.cursorGlow = document.createElement('div');
        this.cursorGlow.className = 'cursor-glow';
        document.body.appendChild(this.cursorGlow);
        
        // 跟踪鼠标位置
        document.addEventListener('mousemove', (e) => {
            this.cursorGlow.style.left = `${e.clientX}px`;
            this.cursorGlow.style.top = `${e.clientY}px`;
        });
        
        // 鼠标离开页面时隐藏
        document.addEventListener('mouseleave', () => {
            this.cursorGlow.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursorGlow.style.opacity = '1';
        });
        
        if (this.options.debug) {
            console.log('✅ 光标跟随效果已初始化');
        }
    }
    
    // ============================================
    // 8. 粒子效果生成器
    // ============================================
    createParticles(container, count = 20) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) {
            console.warn('⚠️ 粒子容器不存在');
            return;
        }
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机位置
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // 随机延迟
            particle.style.animationDelay = `${Math.random() * 10}s`;
            
            // 随机持续时间
            particle.style.animationDuration = `${5 + Math.random() * 10}s`;
            
            container.appendChild(particle);
        }
        
        if (this.options.debug) {
            console.log(`✅ 已创建 ${count} 个粒子`);
        }
    }
    
    // ============================================
    // 9. 卡片翻转效果（手动触发）
    // ============================================
    initCardFlip() {
        const cards = document.querySelectorAll('.card-flip');
        
        if (cards.length === 0) return;
        
        cards.forEach(card => {
            // 支持点击翻转（移动端）
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
        
        if (this.options.debug) {
            console.log(`✅ 卡片翻转效果已初始化`);
        }
    }
    
    // ============================================
    // 10. 进度条动画
    // ============================================
    animateProgressBar(element, targetWidth) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;
        
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.width = `${targetWidth}%`;
        }, 100);
    }
    
    // ============================================
    // 11. 页面过渡效果
    // ============================================
    initPageTransition(type = 'fade') {
        document.body.classList.add(`page-transition-${type}`);
        
        if (this.options.debug) {
            console.log(`✅ 页面过渡效果: ${type}`);
        }
    }
    
    // ============================================
    // 12. 销毁所有观察器
    // ============================================
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        if (this.cursorGlow) {
            this.cursorGlow.remove();
            this.cursorGlow = null;
        }
        
        if (this.options.debug) {
            console.log('🗑️ AnimationController 已销毁');
        }
    }
    
    // ============================================
    // 13. 初始化所有动画
    // ============================================
    initAll() {
        // 检查用户是否偏好减少动画
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('⚠️ 用户偏好减少动画，跳过初始化');
            return;
        }
        
        this.initScrollAnimations();
        this.initParallaxEffect();
        this.init3DParallax();
        this.initRippleEffect();
        this.initCounterAnimation();
        this.initCharAnimation();
        this.initCardFlip();
        // this.initCursorGlow(); // 可选，根据需要启用
        this.initPageTransition('fade');
        
        if (this.options.debug) {
            console.log('🎉 所有动画效果已初始化完成');
        }
    }
}

// ============================================
// 工具函数
// ============================================

// 快速创建滚动动画
function addScrollAnimation(selector, direction = 'up', delay = 0) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.classList.add(`scroll-animate-${direction}`);
        if (delay > 0) {
            el.classList.add(`scroll-animate-delay-${Math.min(delay + index, 5)}`);
        }
    });
}

// 快速添加视差效果
function addParallax(containerSelector, elementSelector, strength = 'medium') {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.classList.add('parallax-container');
    
    const elements = container.querySelectorAll(elementSelector);
    elements.forEach(el => {
        el.classList.add('parallax-element', `parallax-${strength}`);
    });
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController, addScrollAnimation, addParallax };
}
