/**
 * Stats Manager
 * Handles the stats page display and navigation
 */
class StatsManager {
    constructor() {
        this.initializeNavigation();
        this.initializeButtons();
    }

    initializeNavigation() {
        const chatTab = document.getElementById('chatTab');
        const historyTab = document.getElementById('historyTab');
        const statsTab = document.getElementById('statsTab');

        chatTab.addEventListener('click', () => {
            this.switchPage('chat');
        });

        historyTab.addEventListener('click', () => {
            this.switchPage('history');
        });

        statsTab.addEventListener('click', () => {
            this.switchPage('stats');
        });
    }

    switchPage(page) {
        const chatTab = document.getElementById('chatTab');
        const historyTab = document.getElementById('historyTab');
        const statsTab = document.getElementById('statsTab');
        const chatPage = document.getElementById('chatPage');
        const historyPage = document.getElementById('historyPage');
        const statsPage = document.getElementById('statsPage');
        const floatingInput = document.getElementById('floatingInput');

        // Remove active class from all tabs
        chatTab.classList.remove('active');
        historyTab.classList.remove('active');
        statsTab.classList.remove('active');
        
        // Remove active class from all pages
        chatPage.classList.remove('active');
        historyPage.classList.remove('active');
        statsPage.classList.remove('active');

        if (page === 'chat') {
            chatTab.classList.add('active');
            chatPage.classList.add('active');
            floatingInput.style.display = 'flex';
        } else if (page === 'history') {
            historyTab.classList.add('active');
            historyPage.classList.add('active');
            floatingInput.style.display = 'none';
            // Trigger history update if available
            if (window.updateHistoryDisplay) {
                window.updateHistoryDisplay();
            }
        } else if (page === 'stats') {
            statsTab.classList.add('active');
            statsPage.classList.add('active');
            floatingInput.style.display = 'none';
            this.updateDisplay();
        }
    }

    initializeButtons() {
        const refreshBtn = document.getElementById('refreshStatsBtn');
        const resetBtn = document.getElementById('resetStatsBtn');

        refreshBtn.addEventListener('click', () => {
            this.updateDisplay();
        });

        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all usage data? This cannot be undone.')) {
                if (window.costTracker) {
                    window.costTracker.resetStats();
                    this.updateDisplay();
                }
            }
        });
    }

    updateDisplay() {
        if (!window.costTracker) return;

        this.updateOverview();
        this.updateDailyBreakdown();
        this.updateHistory();
    }

    updateOverview() {
        const container = document.getElementById('overviewStats');
        if (!container) return;

        const today = window.costTracker.getTodayStats();
        const monthly = window.costTracker.getMonthlyStats();
        const allTime = window.costTracker.getAllTimeStats();

        container.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Today</div>
                <div class="stat-value">${window.costTracker.formatTokens(today.total_tokens)}</div>
                <div class="stat-label" style="margin-top: 4px;">${window.costTracker.formatCost(today.total_cost)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">This Month</div>
                <div class="stat-value">${window.costTracker.formatTokens(monthly.total_tokens)}</div>
                <div class="stat-label" style="margin-top: 4px;">${window.costTracker.formatCost(monthly.total_cost)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Cost So Far</div>
                <div class="stat-value" style="font-size: 28px; font-weight: 700;">${window.costTracker.formatCost(allTime.total_cost)}</div>
                <div class="stat-label" style="margin-top: 4px;">${allTime.total_tokens} tokens used</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Requests</div>
                <div class="stat-value">${allTime.requests}</div>
                <div class="stat-label" style="margin-top: 4px;">${monthly.requests} this month</div>
            </div>
        `;
    }

    updateDailyBreakdown() {
        const container = document.getElementById('dailyBreakdown');
        if (!container) return;

        const breakdown = window.costTracker.getDailyBreakdown(7);

        if (breakdown.length === 0) {
            container.innerHTML = '<div style="color: #9ca3af; padding: 16px; text-align: center;">No data yet</div>';
            return;
        }

        container.innerHTML = breakdown.map(day => `
            <div class="daily-item">
                <div class="daily-date">${day.displayDate}</div>
                <div class="daily-stats">
                    <span>${day.requests} requests</span>
                    <span>${window.costTracker.formatTokens(day.total_tokens)} tokens</span>
                    <span>${window.costTracker.formatCost(day.total_cost)}</span>
                </div>
            </div>
        `).join('');
    }

    updateHistory() {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;

        const history = window.costTracker.getHistory(50);

        if (history.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: #9ca3af;">No request history yet</td></tr>';
            return;
        }

        tbody.innerHTML = history.map(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });

            const modelName = item.model.split('/').pop() || item.model;
            const cost = item.cost ? window.costTracker.formatCost(item.cost.total_cost) : 'N/A';

            return `
                <tr>
                    <td>${dateStr} ${timeStr}</td>
                    <td style="font-family: monospace; font-size: 12px;">${modelName}</td>
                    <td>${window.costTracker.formatTokens(item.usage.prompt_tokens || 0)}</td>
                    <td>${window.costTracker.formatTokens(item.usage.completion_tokens || 0)}</td>
                    <td>${window.costTracker.formatTokens(item.usage.total_tokens || 0)}</td>
                    <td>${cost}</td>
                </tr>
            `;
        }).join('');
    }
}

// Make updateStatsDisplay globally available
window.updateStatsDisplay = function() {
    if (window.statsManager) {
        window.statsManager.updateDisplay();
    }
};

