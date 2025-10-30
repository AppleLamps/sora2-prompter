/**
 * Knowledge File Loader
 * Handles loading and caching of knowledge base files
 */
class KnowledgeLoader {
    constructor() {
        this.knowledgeFiles = {};
        this.knowledgeFilesPaths = [
            'knowledge/systemprompt.md',
            'knowledge/knowledge.md',
            'knowledge/examples.md'
        ];
    }

    async loadKnowledgeFiles() {
        const loadingPromises = this.knowledgeFilesPaths.map(async (file) => {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    console.warn(`Failed to load ${file}: HTTP ${response.status}`);
                    return { file, content: null };
                }
                const content = await response.text();
                return { file, content };
            } catch (error) {
                console.warn(`Failed to load ${file}:`, error);
                return { file, content: null };
            }
        });
        
        const results = await Promise.all(loadingPromises);
        results.forEach(({ file, content }) => {
            if (content !== null) {
                this.knowledgeFiles[file] = content;
            }
        });
        
        console.log('Loaded knowledge files:', Object.keys(this.knowledgeFiles));
        return this.knowledgeFiles;
    }

    async ensureKnowledgeFilesLoaded() {
        if (Object.keys(this.knowledgeFiles).length === 0) {
            await this.loadKnowledgeFiles();
        }
        return this.knowledgeFiles;
    }

    getKnowledgeFile(filename) {
        return this.knowledgeFiles[filename] || '';
    }

    buildSystemPrompt() {
        const systemPromptContent = this.getKnowledgeFile('knowledge/systemprompt.md');
        const knowledgeContent = this.getKnowledgeFile('knowledge/knowledge.md');
        const examplesContent = this.getKnowledgeFile('knowledge/examples.md');
        
        return `You are an expert Sora prompt engineering assistant with comprehensive knowledge of OpenAI's Sora video generation model. You have access to three key knowledge sources:

1. **SYSTEM PROMPT METHODOLOGY** - Expert prompt engineering methodology, structured approaches for different complexity levels, quality checklists, and communication guidelines. This provides your core framework for how to help users effectively.

2. **KNOWLEDGE BASE** - Core philosophy, fundamental principles, technical specifications, prompt complexity levels, and best practices. This is your foundational knowledge about Sora prompting principles.

3. **STYLE EXAMPLES** - Extensive style-specific examples and templates covering various visual styles and use cases. Use these as reference when users ask for specific style guidance.

${systemPromptContent ? `## SYSTEM PROMPT METHODOLOGY:\n${systemPromptContent}\n\n` : ''}

${knowledgeContent ? `## KNOWLEDGE BASE:\n${knowledgeContent}\n\n` : ''}

${examplesContent ? `## STYLE EXAMPLES:\n${examplesContent}\n\n` : ''}

When helping users:
1. Understand their vision and goals
2. Choose appropriate complexity level
3. Apply proven prompting principles
4. Provide copy-paste ready prompts
5. Explain your reasoning and teach techniques
6. Suggest iteration strategies

Always provide practical, actionable advice with specific examples. Balance technical precision with creative guidance. Remember that your goal is to empower users to create exactly what they envision while understanding the creative partnership between human direction and AI interpretation.`;
    }
}

