/**
 * Pluviophile AI助手 - 主应用逻辑
 */

// ========================================
// 全局状态
// ========================================

const state = {
    user: {
        username: "Pluviophile",
        level: 1,
        exp: 0,
        exp_to_next: 500,
        health_score: 50.0,
        learned_skills_count: 0
    },
    currentTab: "dashboard"
};


// ========================================
// 初始化
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Pluviophile AI助手启动");
    
    // 初始化标签页切换
    initTabSwitching();
    
    // 加载用户数据
    loadUserData();
    
    // 启动时钟
    updateClock();
    setInterval(updateClock, 1000);
    
    // 测试API连接
    testAPIConnection();
});


// ========================================
// 标签页切换
// ========================================

function initTabSwitching() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // 更新按钮状态
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    
    // 更新页面显示
    document.querySelectorAll(".page").forEach(page => {
        page.classList.toggle("active", page.id === `page-${tabName}`);
    });
    
    state.currentTab = tabName;
    console.log(`切换到标签页: ${tabName}`);
}


// ========================================
// 数据加载
// ========================================

async function loadUserData() {
    try {
        // TODO: 从API加载真实数据
        // 现在使用模拟数据
        updateUI();
    } catch (error) {
        console.error("加载用户数据失败:", error);
    }
}

function updateUI() {
    // 更新用户信息显示
    document.getElementById("username").textContent = state.user.username;
    document.getElementById("user-level").textContent = state.user.level;
    
    // 更新Dashboard统计
    document.getElementById("stat-level").textContent = state.user.level;
    document.getElementById("stat-exp").textContent = state.user.exp;
    document.getElementById("stat-exp-max").textContent = state.user.exp_to_next;
    document.getElementById("stat-health").textContent = state.user.health_score.toFixed(1);
    document.getElementById("stat-skills").textContent = state.user.learned_skills_count;
}


// ========================================
// 时钟
// ========================================

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("zh-CN", {hour12: false});
    document.getElementById("current-time").textContent = timeStr;
}


// ========================================
// API测试
// ========================================

async function testAPIConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/test`);
        const data = await response.json();
        console.log("✅ API连接成功:", data);
    } catch (error) {
        console.error("❌ API连接失败:", error);
    }
}
