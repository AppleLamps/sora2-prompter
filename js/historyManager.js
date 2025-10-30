/**
 * History Manager
 * Handles saving and loading conversation history
 */
class HistoryManager {
    constructor() {
        this.storageKey = 'sora_prompt_history';
        this.history = this.loadHistory();
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load history:', error);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }

    addConversation(userMessage, assistantResponse, timestamp = Date.now()) {
        const entry = {
            id: `history_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
            userMessage,
            assistantResponse,
            timestamp,
            preview: this.generatePreview(userMessage)
        };
        
        this.history.unshift(entry);
        
        // Keep only last 100 entries
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
        
        this.saveHistory();
        return entry;
    }

    generatePreview(text, maxLength = 80) {
        const cleaned = text.trim().replace(/\n+/g, ' ');
        return cleaned.length > maxLength 
            ? cleaned.substring(0, maxLength) + '...' 
            : cleaned;
    }

    getHistory() {
        return this.history;
    }

    getEntryById(id) {
        return this.history.find(entry => entry.id === id);
    }

    deleteEntry(id) {
        this.history = this.history.filter(entry => entry.id !== id);
        this.saveHistory();
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    searchHistory(query) {
        const lowerQuery = query.toLowerCase();
        return this.history.filter(entry => 
            entry.userMessage.toLowerCase().includes(lowerQuery) ||
            entry.assistantResponse.toLowerCase().includes(lowerQuery)
        );
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}
