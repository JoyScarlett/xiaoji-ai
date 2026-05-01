// WhatsApp 聊天窗口功能

class WhatsAppChat {
    constructor(options = {}) {
        this.phoneNumber = options.phoneNumber || '8619865887404';
        this.welcomeMessage = options.welcomeMessage || '你好！👋\n\n我是小雞說AI客服，很高興為你服務！\n\n請問有什麼可以幫助你的嗎？';
        this.brandName = options.brandName || '小雞說AI';
        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
    }

    createChatWidget() {
        // 创建聊天窗口 HTML
        const chatHTML = `
            <!-- WhatsApp 浮动按钮 -->
            <div class="whatsapp-float-button" id="whatsappFloatBtn">
                <svg viewBox="0 0 32 32">
                    <path d="M16 0C7.164 0 0 7.164 0 16c0 2.828.736 5.484 2.02 7.78L.084 30.916l7.304-1.916A15.923 15.923 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.333c-2.444 0-4.76-.664-6.748-1.82l-.484-.288-5.02 1.316 1.34-4.892-.316-.5A13.267 13.267 0 012.667 16c0-7.364 5.97-13.333 13.333-13.333S29.333 8.636 29.333 16 23.364 29.333 16 29.333z"/>
                    <path d="M23.573 19.433c-.4-.2-2.368-1.168-2.736-1.3-.368-.136-.636-.2-.904.2-.268.4-1.036 1.3-1.268 1.568-.236.268-.468.3-.868.1-.4-.2-1.688-.62-3.216-1.98-1.188-1.06-1.992-2.368-2.224-2.768-.236-.4-.024-.616.176-.816.18-.18.4-.468.6-.7.2-.236.268-.4.4-.668.136-.268.068-.5-.032-.7-.1-.2-.904-2.176-1.236-2.98-.324-.78-.656-.672-.904-.684-.232-.012-.5-.016-.768-.016s-.7.1-1.068.5c-.368.4-1.4 1.368-1.4 3.336s1.436 3.868 1.636 4.136c.2.268 2.828 4.316 6.852 6.052.956.412 1.704.66 2.288.844.96.304 1.836.26 2.528.156.772-.116 2.368-.968 2.7-1.904.332-.936.332-1.74.232-1.904-.1-.168-.368-.268-.768-.468z"/>
                </svg>
            </div>

            <!-- WhatsApp 聊天窗口 -->
            <div class="whatsapp-chat-popup" id="whatsappChatPopup">
                <!-- 头部 -->
                <div class="whatsapp-chat-header">
                    <div class="whatsapp-chat-avatar">🐔</div>
                    <div class="whatsapp-chat-info">
                        <h3>${this.brandName}</h3>
                        <p>通常在幾分鐘內回覆</p>
                    </div>
                    <button class="whatsapp-chat-close" id="whatsappChatClose">×</button>
                </div>

                <!-- 聊天内容 -->
                <div class="whatsapp-chat-body" id="whatsappChatBody">
                    <div class="whatsapp-message received">
                        ${this.welcomeMessage.replace(/\n/g, '<br>')}
                        <div class="whatsapp-message-time">${this.getCurrentTime()}</div>
                    </div>
                </div>

                <!-- 输入区域 -->
                <div class="whatsapp-chat-footer">
                    <input 
                        type="text" 
                        class="whatsapp-chat-input" 
                        id="whatsappChatInput"
                        placeholder="輸入訊息..."
                        readonly
                    >
                    <button class="whatsapp-chat-send" id="whatsappChatSend">
                        ➤
                    </button>
                </div>
            </div>
        `;

        // 插入到页面
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        const floatBtn = document.getElementById('whatsappFloatBtn');
        const chatPopup = document.getElementById('whatsappChatPopup');
        const closeBtn = document.getElementById('whatsappChatClose');
        const sendBtn = document.getElementById('whatsappChatSend');
        const input = document.getElementById('whatsappChatInput');

        // 打开聊天窗口
        floatBtn.addEventListener('click', () => {
            chatPopup.classList.add('active');
            floatBtn.style.display = 'none';
        });

        // 关闭聊天窗口
        closeBtn.addEventListener('click', () => {
            chatPopup.classList.remove('active');
            floatBtn.style.display = 'flex';
        });

        // 点击输入框或发送按钮，跳转到 WhatsApp
        const openWhatsApp = () => {
            const message = encodeURIComponent('你好，我對小雞說AI感興趣！');
            window.open(`https://wa.me/${this.phoneNumber}?text=${message}`, '_blank');
        };

        input.addEventListener('click', openWhatsApp);
        sendBtn.addEventListener('click', openWhatsApp);
    }

    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppChat({
        phoneNumber: '8619865887404',
        brandName: '小雞說AI',
        welcomeMessage: '你好！👋\n\n我是小雞說AI客服，很高興為你服務！\n\n請問有什麼可以幫助你的嗎？'
    });
});
