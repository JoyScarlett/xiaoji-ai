// 🎯 小鸡AI营销系统 - Supabase 配置
// 第3步：配置文件

const SUPABASE_CONFIG = {
    // Supabase 项目配置
    url: 'YOUR_SUPABASE_URL', // 替换为你的 Supabase URL，例如：https://xxxxx.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // 替换为你的 Supabase Anon Key
    
    // 数据表名称
    tableName: 'button_clicks',
    
    // 是否启用调试模式
    debug: true, // 生产环境设置为 false
    
    // 上报失败重试配置
    retry: {
        maxAttempts: 3,
        delay: 1000 // 毫秒
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}
