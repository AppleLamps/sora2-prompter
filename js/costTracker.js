/**
 * Cost and Token Tracker
 * Tracks usage across sessions and stores in localStorage
 */
class CostTracker {
    constructor() {
        this.storageKey = 'sora_prompter_usage';
    }

    recordUsage(usage, costInfo, modelId = null) {
        const today = new Date().toISOString().split('T')[0];
        const stats = this.getStats();
        
        // Update today's stats
        if (!stats.daily[today]) {
            stats.daily[today] = {
                requests: 0,
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0,
                total_cost: 0,
                models: {}
            };
        }
        
        const daily = stats.daily[today];
        daily.requests += 1;
        daily.prompt_tokens += usage.prompt_tokens || 0;
        daily.completion_tokens += usage.completion_tokens || 0;
        daily.total_tokens += usage.total_tokens || 0;
        if (costInfo) {
            daily.total_cost += costInfo.total_cost || 0;
        }
        
        // Track by model
        if (modelId) {
            if (!daily.models[modelId]) {
                daily.models[modelId] = {
                    requests: 0,
                    prompt_tokens: 0,
                    completion_tokens: 0,
                    total_tokens: 0,
                    total_cost: 0
                };
            }
            daily.models[modelId].requests += 1;
            daily.models[modelId].prompt_tokens += usage.prompt_tokens || 0;
            daily.models[modelId].completion_tokens += usage.completion_tokens || 0;
            daily.models[modelId].total_tokens += usage.total_tokens || 0;
            if (costInfo) {
                daily.models[modelId].total_cost += costInfo.total_cost || 0;
            }
        }
        
        // Update all-time stats
        stats.all_time.requests += 1;
        stats.all_time.prompt_tokens += usage.prompt_tokens || 0;
        stats.all_time.completion_tokens += usage.completion_tokens || 0;
        stats.all_time.total_tokens += usage.total_tokens || 0;
        if (costInfo) {
            stats.all_time.total_cost += costInfo.total_cost || 0;
        }
        
        // Track request history (keep last 100)
        if (!stats.history) {
            stats.history = [];
        }
        stats.history.unshift({
            timestamp: new Date().toISOString(),
            usage: { ...usage },
            cost: costInfo ? { ...costInfo } : null,
            model: modelId || 'unknown'
        });
        if (stats.history.length > 100) {
            stats.history = stats.history.slice(0, 100);
        }
        
        // Update last 30 days
        this.updateMonthlyStats(stats);
        
        this.saveStats(stats);
        return stats;
    }

    getStats() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        
        return {
            daily: {},
            monthly: {},
            all_time: {
                requests: 0,
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0,
                total_cost: 0
            },
            history: [],
            last_updated: new Date().toISOString()
        };
    }

    updateMonthlyStats(stats) {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Clean up old daily entries
        Object.keys(stats.daily).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete stats.daily[date];
            }
        });
        
        // Calculate monthly totals
        const monthlyTotal = {
            requests: 0,
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
            total_cost: 0
        };
        
        Object.values(stats.daily).forEach(day => {
            monthlyTotal.requests += day.requests;
            monthlyTotal.prompt_tokens += day.prompt_tokens;
            monthlyTotal.completion_tokens += day.completion_tokens;
            monthlyTotal.total_tokens += day.total_tokens;
            monthlyTotal.total_cost += day.total_cost;
        });
        
        stats.monthly = monthlyTotal;
    }

    saveStats(stats) {
        stats.last_updated = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(stats));
    }

    getTodayStats() {
        const today = new Date().toISOString().split('T')[0];
        const stats = this.getStats();
        return stats.daily[today] || {
            requests: 0,
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
            total_cost: 0,
            models: {}
        };
    }

    getMonthlyStats() {
        const stats = this.getStats();
        return stats.monthly || {
            requests: 0,
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
            total_cost: 0
        };
    }

    getAllTimeStats() {
        const stats = this.getStats();
        return stats.all_time;
    }

    getHistory(limit = 50) {
        const stats = this.getStats();
        return (stats.history || []).slice(0, limit);
    }

    getDailyBreakdown(days = 7) {
        const stats = this.getStats();
        const today = new Date();
        const breakdown = [];
        
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = stats.daily[dateStr] || {
                requests: 0,
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0,
                total_cost: 0,
                models: {}
            };
            
            breakdown.unshift({
                date: dateStr,
                displayDate: this.formatDate(date),
                ...dayData
            });
        }
        
        return breakdown;
    }

    formatDate(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    formatCost(cost) {
        if (cost === 0) return '$0.00';
        if (cost < 0.01) return '<$0.01';
        return `$${cost.toFixed(4)}`;
    }

    formatTokens(count) {
        if (count === 0) return '0';
        if (count < 1000) return count.toString();
        if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
        return `${(count / 1000000).toFixed(2)}M`;
    }

    resetStats() {
        localStorage.removeItem(this.storageKey);
    }

    resetHistory() {
        const stats = this.getStats();
        stats.history = [];
        this.saveStats(stats);
    }

    recalculateHistoryCosts() {
        const stats = this.getStats();
        const pricing = Config.getModelPricing();
        
        // Recalculate history with new pricing
        if (stats.history && stats.history.length > 0) {
            stats.history.forEach(item => {
                const modelPricing = pricing[item.model];
                if (modelPricing && item.usage) {
                    const promptCost = (item.usage.prompt_tokens || 0) / 1000000 * modelPricing.prompt;
                    const completionCost = (item.usage.completion_tokens || 0) / 1000000 * modelPricing.completion;
                    const totalCost = promptCost + completionCost;
                    
                    item.cost = {
                        prompt_tokens: item.usage.prompt_tokens || 0,
                        completion_tokens: item.usage.completion_tokens || 0,
                        total_tokens: item.usage.total_tokens || 0,
                        prompt_cost: promptCost,
                        completion_cost: completionCost,
                        total_cost: totalCost,
                        currency: 'USD'
                    };
                }
            });
        }
        
        // Recalculate daily totals
        Object.keys(stats.daily).forEach(date => {
            const day = stats.daily[date];
            day.total_cost = 0;
            
            if (day.models) {
                Object.keys(day.models).forEach(modelId => {
                    const modelData = day.models[modelId];
                    const modelPricing = pricing[modelId];
                    if (modelPricing) {
                        const promptCost = modelData.prompt_tokens / 1000000 * modelPricing.prompt;
                        const completionCost = modelData.completion_tokens / 1000000 * modelPricing.completion;
                        day.total_cost += promptCost + completionCost;
                    }
                });
            }
        });
        
        // Recalculate all-time totals
        let allTimeCost = 0;
        Object.values(stats.daily).forEach(day => {
            allTimeCost += day.total_cost;
        });
        stats.all_time.total_cost = allTimeCost;
        
        // Recalculate monthly totals
        this.updateMonthlyStats(stats);
        
        this.saveStats(stats);
        return stats;
    }
}

