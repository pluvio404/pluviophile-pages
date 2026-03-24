/**
 * API配置 - 支持本地和GitHub Pages部署
 */

const API_CONFIG = {
    // 开发环境（本地）
    development: {
        baseURL: "http://localhost:8000",
        wsURL: "ws://localhost:8000"
    },
    
    // 生产环境（GitHub Pages + ngrok或其他）
    production: {
        // 默认值，需要根据实际情况修改
        baseURL: "https://your-ngrok-url.ngrok.io",
        wsURL: "wss://your-ngrok-url.ngrok.io"
    }
};

// 自动检测环境
const ENV = (function() {
    const hostname = window.location.hostname;
    
    // 本地环境
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "") {
        return "development";
    }
    
    // GitHub Pages或其他
    return "production";
})();

// 导出配置
const API_BASE_URL = API_CONFIG[ENV].baseURL;
const WS_BASE_URL = API_CONFIG[ENV].wsURL;

// 日志
console.log(`🌍 环境: ${ENV}`);
console.log(`📡 API地址: ${API_BASE_URL}`);

// 连接状态检测
let apiConnected = false;

async function checkAPIConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            timeout: 5000
        });
        
        if (response.ok) {
            apiConnected = true;
            console.log("✅ API连接成功");
            return true;
        }
    } catch (error) {
        apiConnected = false;
        console.error("❌ API连接失败:", error);
        return false;
    }
}

// 显示连接错误提示
function showConnectionError() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'connection-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #FF6B6B;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 350px;
    `;
    
    errorDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">⚠️ 无法连接到后端</div>
        <div style="font-size: 12px; line-height: 1.4;">
            请确保：<br>
            1. 本地后端正在运行 (./run.sh)<br>
            ${ENV === 'production' ? '2. ngrok已启动并更新了config.js<br>3. CORS配置正确' : ''}
        </div>
        <button onclick="this.parentElement.remove(); checkAPIConnection();" 
                style="margin-top: 10px; padding: 5px 10px; border: none; background: white; color: #FF6B6B; border-radius: 4px; cursor: pointer;">
            重试
        </button>
    `;
    
    document.body.appendChild(errorDiv);
}

// 页面加载时检查连接
window.addEventListener('DOMContentLoaded', async () => {
    const connected = await checkAPIConnection();
    if (!connected) {
        showConnectionError();
    }
});
