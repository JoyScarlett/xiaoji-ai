// 🎯 小鸡AI营销系统 - 交互脚本
// 水波纹按钮效果 + 用户行为追踪

// 全局追踪器实例
let tracker = null;

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 0. 初始化追踪器（第3步新增）
    // ============================================
    if (typeof ButtonTracker !== 'undefined' && typeof SUPABASE_CONFIG !== 'undefined') {
        tracker = new ButtonTracker(SUPABASE_CONFIG);
        tracker.init();
        console.log('✅ 用户行为追踪已启动');
    } else {
        console.warn('⚠️ 追踪器未加载，请检查 config.js 和 tracker.js');
    }
    
    // ============================================
    // 1. 水波纹按钮效果
    // ============================================
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建水波纹元素
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // 计算点击位置
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 设置水波纹位置和大小
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x - size / 2 + 'px';
            ripple.style.top = y - size / 2 + 'px';
            
            // 添加到按钮中
            button.appendChild(ripple);
            
            // 动画结束后移除
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // ============================================
    // 2. 手动追踪（兼容旧代码，已由自动追踪替代）
    // ============================================
    // 追踪器会自动监听所有带 data-button 属性的元素
    // 无需手动调用
    
    // ============================================
    // 3. 滚动动画观察器
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有卡片元素
    const cards = document.querySelectorAll('.pain-card, .feature-card, .badge');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // ============================================
    // 4. 平滑滚动
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // 5. 性能监控（开发用）
    // ============================================
    if (window.performance) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('页面加载时间:', pageLoadTime + 'ms');
        });
    }
    
});
