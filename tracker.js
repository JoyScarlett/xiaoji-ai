// 🎯 小鸡AI营销系统 - 用户行为追踪
// 第3步：追踪核心逻辑

class ButtonTracker {
    constructor(config) {
        this.config = config;
        this.supabaseUrl = config.url;
        this.supabaseKey = config.anonKey;
        this.tableName = config.tableName;
        this.debug = config.debug;
        
        // 初始化时收集页面信息
        this.pageInfo = this.collectPageInfo();
        this.deviceInfo = this.collectDeviceInfo();
        this.sourceInfo = this.analyzeSource();
        
        if (this.debug) {
            console.log('🎯 ButtonTracker 初始化完成');
            console.log('页面信息:', this.pageInfo);
            console.log('设备信息:', this.deviceInfo);
            console.log('来源信息:', this.sourceInfo);
        }
    }
    
    // ============================================
    // 1. 收集页面信息
    // ============================================
    collectPageInfo() {
        return {
            pageUrl: window.location.href,
            pageTitle: document.title,
            pagePath: window.location.pathname,
            pageHost: window.location.host
        };
    }
    
    // ============================================
    // 2. 收集设备信息
    // ============================================
    collectDeviceInfo() {
        const ua = navigator.userAgent;
        
        return {
            userAgent: ua,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            deviceType: this.detectDeviceType(ua),
            browser: this.detectBrowser(ua),
            os: this.detectOS(ua),
            language: navigator.language || navigator.userLanguage,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }
    
    // 检测设备类型
    detectDeviceType(ua) {
        if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
            if (/ipad|tablet/i.test(ua)) return 'tablet';
            return 'mobile';
        }
        return 'desktop';
    }
    
    // 检测浏览器
    detectBrowser(ua) {
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome') && !ua.includes('Edge')) return 'Chrome';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE';
        return 'Unknown';
    }
    
    // 检测操作系统
    detectOS(ua) {
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac OS')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
        return 'Unknown';
    }
    
    // ============================================
    // 3. 智能分析访客来源
    // ============================================
    analyzeSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const referrer = document.referrer;
        
        // 优先级1：UTM参数
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmTerm = urlParams.get('utm_term');
        const utmContent = urlParams.get('utm_content');
        
        if (utmSource) {
            return {
                source: utmSource,
                medium: utmMedium || 'unknown',
                campaign: utmCampaign || 'none',
                term: utmTerm || null,
                content: utmContent || null,
                referrer: referrer || null,
                sourceType: 'utm'
            };
        }
        
        // 优先级2：Referrer域名分析
        if (referrer) {
            try {
                const referrerUrl = new URL(referrer);
                const referrerDomain = referrerUrl.hostname;
                
                // 判断是否为外部来源
                if (referrerDomain !== window.location.hostname) {
                    const sourceInfo = this.categorizeReferrer(referrerDomain);
                    return {
                        source: sourceInfo.source,
                        medium: sourceInfo.medium,
                        campaign: 'organic',
                        term: null,
                        content: null,
                        referrer: referrer,
                        sourceType: 'referrer'
                    };
                }
            } catch (e) {
                console.warn('Referrer解析失败:', e);
            }
        }
        
        // 优先级3：直接访问
        return {
            source: 'direct',
            medium: 'none',
            campaign: 'none',
            term: null,
            content: null,
            referrer: null,
            sourceType: 'direct'
        };
    }
    
    // 分类Referrer来源
    categorizeReferrer(domain) {
        // 搜索引擎
        const searchEngines = {
            'google': 'Google',
            'baidu': 'Baidu',
            'bing': 'Bing',
            'yahoo': 'Yahoo',
            'sogou': 'Sogou',
            'so.com': '360搜索'
        };
        
        for (const [key, name] of Object.entries(searchEngines)) {
            if (domain.includes(key)) {
                return { source: name, medium: 'organic_search' };
            }
        }
        
        // 社交媒体
        const socialMedia = {
            'facebook': 'Facebook',
            'twitter': 'Twitter',
            'linkedin': 'LinkedIn',
            'weibo': 'Weibo',
            'wechat': 'WeChat',
            'douyin': 'Douyin',
            'xiaohongshu': 'Xiaohongshu'
        };
        
        for (const [key, name] of Object.entries(socialMedia)) {
            if (domain.includes(key)) {
                return { source: name, medium: 'social' };
            }
        }
        
        // 其他外部来源
        return { source: domain, medium: 'referral' };
    }
    
    // ============================================
    // 4. 追踪按钮点击
    // ============================================
    async trackClick(buttonElement) {
        const buttonName = buttonElement.getAttribute('data-button') || 'unknown';
        const buttonText = buttonElement.textContent.trim();
        const targetLink = buttonElement.getAttribute('href') || 
                          buttonElement.getAttribute('data-link') || 
                          null;
        
        // 构建追踪数据
        const trackingData = {
            // 按钮信息
            button_name: buttonName,
            button_type: buttonElement.tagName.toLowerCase(),
            target_link: targetLink,
            
            // 页面信息
            page_url: this.pageInfo.pageUrl,
            
            // 来源信息
            referrer: this.sourceInfo.referrer,
            utm_source: this.sourceInfo.source,
            utm_medium: this.sourceInfo.medium,
            utm_campaign: this.sourceInfo.campaign,
            utm_term: this.sourceInfo.term,
            utm_content: this.sourceInfo.content,
            
            // 设备信息
            user_agent: this.deviceInfo.userAgent,
            device_type: this.deviceInfo.deviceType,
            browser: this.deviceInfo.browser,
            os: this.deviceInfo.os,
            screen_resolution: this.deviceInfo.screenResolution,
            
            // 时间戳（由数据库自动生成，这里不需要）
            // clicked_at 会由数据库的 DEFAULT NOW() 自动填充
        };
        
        if (this.debug) {
            console.log('📊 追踪数据:', trackingData);
        }
        
        // 异步上报数据
        this.sendToSupabase(trackingData);
    }
    
    // ============================================
    // 5. 异步上报到Supabase
    // ============================================
    async sendToSupabase(data) {
        // 检查配置
        if (!this.supabaseUrl || this.supabaseUrl === 'YOUR_SUPABASE_URL') {
            console.warn('⚠️ Supabase未配置，数据仅在控制台显示');
            console.log('待上报数据:', data);
            return;
        }
        
        const url = `${this.supabaseUrl}/rest/v1/${this.tableName}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                if (this.debug) {
                    console.log('✅ 数据上报成功');
                }
            } else {
                const errorText = await response.text();
                console.error('❌ 数据上报失败:', response.status, errorText);
                
                // 失败时保存到本地存储，供后续重试
                this.saveToLocalStorage(data);
            }
        } catch (error) {
            console.error('❌ 网络错误:', error);
            
            // 网络错误时保存到本地存储
            this.saveToLocalStorage(data);
        }
    }
    
    // ============================================
    // 6. 本地存储（失败重试机制）
    // ============================================
    saveToLocalStorage(data) {
        try {
            const key = 'pending_tracks';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push({
                data: data,
                timestamp: Date.now()
            });
            
            // 最多保存100条
            if (existing.length > 100) {
                existing.shift();
            }
            
            localStorage.setItem(key, JSON.stringify(existing));
            
            if (this.debug) {
                console.log('💾 数据已保存到本地，等待重试');
            }
        } catch (e) {
            console.error('本地存储失败:', e);
        }
    }
    
    // 重试发送本地存储的数据
    async retryPendingTracks() {
        try {
            const key = 'pending_tracks';
            const pending = JSON.parse(localStorage.getItem(key) || '[]');
            
            if (pending.length === 0) return;
            
            if (this.debug) {
                console.log(`🔄 尝试重新上报 ${pending.length} 条数据`);
            }
            
            for (const item of pending) {
                await this.sendToSupabase(item.data);
            }
            
            // 清空本地存储
            localStorage.removeItem(key);
            
        } catch (e) {
            console.error('重试失败:', e);
        }
    }
    
    // ============================================
    // 7. 初始化自动追踪
    // ============================================
    init() {
        // 页面加载时尝试重试之前失败的上报
        this.retryPendingTracks();
        
        // 监听所有带有 data-track 属性的元素
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-button]');
            if (target) {
                this.trackClick(target);
            }
        }, true);
        
        if (this.debug) {
            console.log('✅ 自动追踪已启用');
        }
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ButtonTracker;
}
