/**
 * Model Selector
 * Handles model selection dropdown functionality
 */
class ModelSelector {
    constructor(config, onModelChange) {
        this.config = config;
        this.onModelChange = onModelChange;
        this.models = {
            'inclusionai/ling-1t': 'Ling 1T',
            'inclusionai/ring-1t': 'Ring 1T',
            'z-ai/glm-4.6:exacto': 'GLM 4.6 Exacto',
            'anthropic/claude-sonnet-4.5': 'Claude Sonnet 4.5',
            'x-ai/grok-4-fast': 'Grok 4 Fast',
            'moonshotai/kimi-k2-0905': 'Kimi K2',
            'openai/gpt-5-chat': 'GPT-5 Chat',
            'openai/gpt-5': 'GPT-5',
            'openai/gpt-5-mini': 'GPT-5 Mini',
            'openai/gpt-oss-120b:exacto': 'GPT-OSS 120B',
            'mistralai/codestral-2508': 'Codestral',
            'anthropic/claude-haiku-4.5': 'Claude Haiku 4.5'
        };
        this.isOpen = false;
    }

    getDisplayName(modelId) {
        return this.models[modelId] || modelId.split('/').pop();
    }

    initialize() {
        const selectorButton = document.getElementById('modelSelector');
        const selectorDropdown = document.getElementById('modelDropdown');
        
        if (!selectorButton || !selectorDropdown) return;

        // Update display name
        this.updateDisplayName();

        // Toggle dropdown
        selectorButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!selectorButton.contains(e.target) && !selectorDropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Populate dropdown items
        this.populateDropdown();
    }

    updateDisplayName() {
        const selectedModel = this.config.getSelectedModel();
        const displayName = this.getDisplayName(selectedModel);
        const span = document.querySelector('#modelSelector span');
        if (span) {
            span.textContent = displayName;
        }
    }

    populateDropdown() {
        const dropdown = document.getElementById('modelDropdown');
        if (!dropdown) return;

        dropdown.innerHTML = '';
        
        Object.entries(this.models).forEach(([modelId, displayName]) => {
            const item = document.createElement('div');
            item.className = 'model-dropdown-item';
            if (this.config.getSelectedModel() === modelId) {
                item.classList.add('selected');
            }
            item.innerHTML = `
                <span>${displayName}</span>
                ${this.config.getSelectedModel() === modelId ? '<svg class="w-4 h-4"><use href="#icon-check"></use></svg>' : ''}
            `;
            item.addEventListener('click', () => {
                this.selectModel(modelId);
            });
            dropdown.appendChild(item);
        });
    }

    selectModel(modelId) {
        this.config.setSelectedModel(modelId);
        this.updateDisplayName();
        this.populateDropdown();
        this.closeDropdown();
        if (this.onModelChange) {
            this.onModelChange(modelId);
        }
    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;
        const dropdown = document.getElementById('modelDropdown');
        if (dropdown) {
            if (this.isOpen) {
                dropdown.classList.add('open');
            } else {
                dropdown.classList.remove('open');
            }
        }
    }

    closeDropdown() {
        this.isOpen = false;
        const dropdown = document.getElementById('modelDropdown');
        if (dropdown) {
            dropdown.classList.remove('open');
        }
    }
}

