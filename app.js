/**
 * Pluviophile - 展示型网站前端逻辑
 * 从JSON文件加载并展示数据
 */

// 数据路径配置
// 根据URL路径自动判断环境
const DATA_BASE = window.location.pathname.includes('/pluviophile-pages/')
    ? 'data'  // GitHub Pages
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? '/static/data'  // 本地开发（通过FastAPI）
        : 'data');  // 默认

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadAllData();
});

// ===== 导航切换 =====
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有active class
            navButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            
            // 添加active class
            btn.classList.add('active');
            const sectionId = btn.dataset.section + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// ===== 加载所有数据 =====
async function loadAllData() {
    try {
        // 并行加载所有数据
        const [stats, skills, activities, about] = await Promise.all([
            fetchJSON('stats.json'),
            fetchJSON('skills.json'),
            fetchJSON('activities.json'),
            fetchJSON('about.json')
        ]);
        
        // 渲染各个部分
        renderStats(stats);
        renderSkills(skills);
        renderActivities(activities);
        renderAbout(about);
        
        // 更新最后更新时间
        if (stats.updated_at) {
            document.getElementById('last-update').textContent = 
                new Date(stats.updated_at).toLocaleString('zh-CN');
        }
        
    } catch (error) {
        console.error('加载数据失败:', error);
        showError('数据加载失败，请稍后重试');
    }
}

// ===== 获取JSON数据 =====
async function fetchJSON(filename) {
    const response = await fetch(`${DATA_BASE}/${filename}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}`);
    }
    return await response.json();
}

// ===== 渲染统计数据 =====
function renderStats(stats) {
    const overview = stats.overview || {};
    
    // 更新统计卡片
    document.getElementById('total-skills').textContent = overview.total_skills || 0;
    document.getElementById('total-executions').textContent = overview.total_executions || 0;
    document.getElementById('success-rate').textContent = 
        (overview.success_rate || 0).toFixed(1) + '%';
    document.getElementById('avg-health').textContent = 
        (overview.average_health || 0).toFixed(1);
    
    // 渲染类型分布图表
    renderTypeChart(stats.type_distribution || {});
}

// ===== 渲染类型分布图表 =====
function renderTypeChart(distribution) {
    const chartDiv = document.getElementById('type-chart');
    
    if (Object.keys(distribution).length === 0) {
        chartDiv.innerHTML = '<p class="empty-state">暂无数据</p>';
        return;
    }
    
    // 简单的条形图
    let html = '<div style="display: flex; gap: 20px; align-items: end; height: 200px;">';
    
    const maxCount = Math.max(...Object.values(distribution));
    
    for (const [type, count] of Object.entries(distribution)) {
        const height = maxCount > 0 ? (count / maxCount) * 150 : 0;
        const color = type === 'native' ? '#1976d2' : '#7b1fa2';
        
        html += `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="
                    width: 100%;
                    height: ${height}px;
                    background: ${color};
                    border-radius: 8px;
                    transition: all 0.3s ease;
                "></div>
                <div style="text-align: center;">
                    <div style="font-size: 1.5em; font-weight: bold; color: ${color};">${count}</div>
                    <div style="font-size: 0.9em; color: #666;">${type}</div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    chartDiv.innerHTML = html;
}

// ===== 渲染技能列表（按分类） =====
function renderSkills(skills) {
    const container = document.getElementById('skills-grid');
    
    if (!skills || skills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📭 还没有技能</h3>
                <p>在CodeFlicker IDE中创建你的第一个技能：</p>
                <p><code>python3 cli.py create-skill -n "技能名称"</code></p>
            </div>
        `;
        return;
    }
    
    // 按分类分组
    const categoryNames = {
        "general": "💎 通用技能",
        "network": "🌐 网络运维",
        "code": "💻 代码相关",
        "analysis": "📊 数据分析",
        "automation": "🤖 自动化",
        "security": "🔒 安全防护"
    };
    
    const skillsByCategory = {};
    skills.forEach(skill => {
        const cat = skill.category || 'general';
        if (!skillsByCategory[cat]) {
            skillsByCategory[cat] = [];
        }
        skillsByCategory[cat].push(skill);
    });
    
    // 渲染每个分类
    let html = '';
    for (const [category, categorySkills] of Object.entries(skillsByCategory)) {
        html += `
            <div class="skills-category">
                <h3 class="category-title">${categoryNames[category] || category}</h3>
                <div class="skills-grid-inner">
                    ${categorySkills.map(skill => `
                        <div class="skill-card">
                            <div class="skill-header">
                                <div class="skill-name">${escapeHtml(skill.name)}</div>
                                <span class="skill-type ${skill.type}">${skill.type}</span>
                            </div>
                            <div class="skill-description">
                                ${escapeHtml(skill.description) || '暂无描述'}
                            </div>
                            <div class="skill-stats">
                                <span>⚡ 执行: ${skill.stats.execution_count}次</span>
                                <span>✅ 成功率: ${skill.stats.success_rate}%</span>
                                <span>❤️ 健康分: ${skill.stats.health_score}</span>
                            </div>
                            ${skill.tags && skill.tags.length > 0 ? `
                                <div class="skill-tags">
                                    ${skill.tags.map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// ===== 渲染活动列表 =====
function renderActivities(activities) {
    const list = document.getElementById('activities-list');
    
    if (!activities || activities.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <h3>📝 还没有活动记录</h3>
                <p>执行技能后会显示在这里</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-info">
                <div class="activity-skill">
                    ${escapeHtml(activity.skill_name)}
                </div>
                <div class="activity-time">
                    ${formatTime(activity.created_at)}
                    ${activity.execution_time ? ` | 耗时: ${activity.execution_time.toFixed(2)}s` : ''}
                </div>
            </div>
            <div class="activity-status ${activity.status}">
                ${activity.status === 'completed' ? '✅ 成功' : '❌ 失败'}
            </div>
        </div>
    `).join('');
}

// ===== 渲染关于页面 =====
function renderAbout(about) {
    document.getElementById('about-description').textContent = 
        about.description || 'Pluviophile - AI技能库';
    
    // 技术栈
    const techStack = document.getElementById('tech-stack');
    if (about.tech_stack && about.tech_stack.length > 0) {
        techStack.innerHTML = about.tech_stack
            .map(tech => `<li>${escapeHtml(tech)}</li>`)
            .join('');
    }
    
    // 功能特性
    const features = document.getElementById('features');
    if (about.features && about.features.length > 0) {
        features.innerHTML = about.features
            .map(feature => `<li>${escapeHtml(feature)}</li>`)
            .join('');
    }
    
    // GitHub链接
    if (about.github) {
        const link = document.getElementById('github-link');
        link.href = about.github;
        link.textContent = about.github;
    }
}

// ===== 工具函数 =====

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 格式化时间
function formatTime(isoString) {
    if (!isoString) return '-';
    
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;
        
        // 1分钟内
        if (diff < 60000) {
            return '刚刚';
        }
        // 1小时内
        if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}分钟前`;
        }
        // 24小时内
        if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}小时前`;
        }
        // 7天内
        if (diff < 604800000) {
            return `${Math.floor(diff / 86400000)}天前`;
        }
        
        // 超过7天显示完整日期
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return isoString;
    }
}

// 显示错误
function showError(message) {
    const main = document.querySelector('.main .container');
    main.innerHTML = `
        <div class="empty-state">
            <h3>❌ 出错了</h3>
            <p>${message}</p>
        </div>
    `;
}
