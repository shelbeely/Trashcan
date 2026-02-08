/**
 * Fox - AI Assistant Module
 * Integrates with OpenRouter for diagnostics and automated fixes
 */

import type { Site, Diagnostic, Fix, ResourceMetrics } from '../../types/index.ts';
import { getDatabase } from '../../core/db/index.ts';
import { getConfigManager } from '../../core/config/index.ts';
import { generateId } from '../../core/utils/index.ts';
import { SeagullManager } from '../seagull/index.ts';

export class FoxManager {
  private db = getDatabase();
  private config = getConfigManager();
  private seagull = new SeagullManager();

  /**
   * Diagnose a site's issues using AI
   */
  async diagnose(site: Site): Promise<Diagnostic> {
    console.log(`🦊 Analyzing ${site.name} with AI...`);

    // Collect context
    const logs = await this.seagull.getLogs(site.name, 100);
    const errorLogs = await this.seagull.getErrors(site.name, 50);
    const metrics = await this.getMetrics(site);

    // Prepare prompt for AI
    const prompt = this.buildDiagnosticPrompt(site, errorLogs, metrics);

    // Call OpenRouter API
    let analysis = '';
    let suggestions: Fix[] = [];

    try {
      const config = this.config.get();
      
      if (!config.openrouter.apiKey) {
        throw new Error('OpenRouter API key not configured. Set it in ~/.trashcan/config.json');
      }

      const response = await this.callOpenRouter(prompt);
      
      // Parse AI response
      analysis = response.analysis || 'No analysis available';
      suggestions = this.parseFixes(response.suggestions || '');
    } catch (error) {
      console.error('AI analysis failed:', error);
      analysis = `Unable to perform AI analysis: ${error}`;
      suggestions = [];
    }

    // Create diagnostic record
    const diagnostic: Diagnostic = {
      id: generateId(),
      siteId: site.id,
      timestamp: new Date(),
      logs: errorLogs.map(e => e.message),
      metrics,
      analysis,
      suggestions
    };

    // Save diagnostic
    await this.db.createDiagnostic(diagnostic);

    return diagnostic;
  }

  /**
   * Build diagnostic prompt for AI
   */
  private buildDiagnosticPrompt(site: Site, errorLogs: any[], metrics: ResourceMetrics): string {
    const errorMessages = errorLogs.map(e => e.message).join('\n');

    return `You are a DevOps expert analyzing a Next.js application running in Docker.

Site Information:
- Name: ${site.name}
- Domain: ${site.domain}
- Port: ${site.port}
- Status: ${site.status}

Resource Metrics:
- CPU: ${metrics.cpu}%
- Memory: ${metrics.memory} MB
- Disk: ${metrics.disk} MB

Recent Error Logs:
${errorMessages || 'No errors found'}

Please provide:
1. Root cause analysis of any issues
2. Specific fixes as unified diff patches (if code changes needed)
3. Configuration recommendations
4. Prevention strategies

Format your response as JSON:
{
  "analysis": "detailed analysis here",
  "suggestions": [
    {
      "description": "what this fixes",
      "diff": "unified diff if applicable",
      "confidence": 0.8,
      "files": ["path/to/file"]
    }
  ]
}`;
  }

  /**
   * Call OpenRouter API
   */
  private async callOpenRouter(prompt: string): Promise<any> {
    const config = this.config.get();

    const response = await fetch(config.openrouter.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openrouter.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://trashcan.dev',
        'X-Title': 'Trashcan'
      },
      body: JSON.stringify({
        model: config.openrouter.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Try to parse JSON response
    try {
      return JSON.parse(content);
    } catch {
      // If not JSON, return as plain text
      return {
        analysis: content,
        suggestions: []
      };
    }
  }

  /**
   * Parse fixes from AI response
   */
  private parseFixes(suggestionsText: string): Fix[] {
    const fixes: Fix[] = [];

    // If it's already an array, use it
    if (Array.isArray(suggestionsText)) {
      return suggestionsText.map(s => ({
        id: generateId(),
        description: s.description || '',
        diff: s.diff || '',
        confidence: s.confidence || 0.5,
        files: s.files || [],
        applied: false
      }));
    }

    // Otherwise, try to parse text suggestions
    // This is a simplified parser - in production you'd want more robust parsing
    const lines = suggestionsText.split('\n');
    let currentFix: Partial<Fix> | null = null;

    for (const line of lines) {
      if (line.startsWith('###')) {
        if (currentFix) {
          fixes.push({
            id: generateId(),
            description: currentFix.description || '',
            diff: currentFix.diff || '',
            confidence: currentFix.confidence || 0.5,
            files: currentFix.files || [],
            applied: false
          });
        }
        currentFix = { description: line.replace(/^###\s*/, '') };
      } else if (currentFix) {
        if (line.includes('```diff')) {
          currentFix.diff = '';
        } else if (line.includes('```')) {
          // End of diff
        } else if (currentFix.diff !== undefined) {
          currentFix.diff += line + '\n';
        }
      }
    }

    if (currentFix) {
      fixes.push({
        id: generateId(),
        description: currentFix.description || '',
        diff: currentFix.diff || '',
        confidence: currentFix.confidence || 0.5,
        files: currentFix.files || [],
        applied: false
      });
    }

    return fixes;
  }

  /**
   * Preview a fix (show the diff)
   */
  async previewFix(fix: Fix): Promise<string> {
    let preview = `\n📝 Fix: ${fix.description}\n`;
    preview += `   Confidence: ${(fix.confidence * 100).toFixed(0)}%\n`;
    preview += `   Files: ${fix.files.join(', ')}\n\n`;
    
    if (fix.diff) {
      preview += '━'.repeat(60) + '\n';
      preview += fix.diff;
      preview += '━'.repeat(60) + '\n';
    }

    return preview;
  }

  /**
   * Apply a fix (apply the diff)
   */
  async applyFix(site: Site, fix: Fix): Promise<void> {
    if (!fix.diff) {
      throw new Error('No diff to apply');
    }

    console.log(`🔧 Applying fix: ${fix.description}`);

    // In a real implementation, you would:
    // 1. Parse the unified diff
    // 2. Apply changes to the files
    // 3. Validate syntax
    // 4. Restart services if needed
    // 5. Rollback on failure

    console.log('⚠️  Fix application not fully implemented yet.');
    console.log('   This would apply the following diff:');
    console.log(fix.diff);
  }

  /**
   * Get resource metrics for a site
   * TODO: Implement Docker stats collection
   * Currently returns mock data - needs integration with Docker stats API
   */
  private async getMetrics(site: Site): Promise<ResourceMetrics> {
    // In a real implementation, you'd query Docker stats API
    // For now, return mock data as placeholder
    return {
      cpu: 0,
      memory: 0,
      disk: 0
    };
  }

  /**
   * Get recent diagnostics for a site
   */
  async getDiagnostics(siteId: string): Promise<Diagnostic[]> {
    return await this.db.getDiagnostics(siteId);
  }
}
