import { Octokit } from '@octokit/rest';
import { GitHubConfig, MCPToolResult } from './interfaces/mcp.interfaces.js';

export class GitHubMCPServer {
  private octokit: Octokit;

  constructor(config: GitHubConfig) {
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  async getRepositoryInfo(owner: string, repo: string): Promise<MCPToolResult> {
    try {
      const { data } = await this.octokit.rest.repos.get({ owner, repo });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                name: data.name,
                description: data.description,
                language: data.language,
                stars: data.stargazers_count,
                forks: data.forks_count,
                open_issues: data.open_issues_count,
                created_at: data.created_at,
                updated_at: data.updated_at,
                default_branch: data.default_branch,
                size: data.size,
                topics: data.topics,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Error al obtener información del repositorio: ${error.message}`,
      );
    }
  }

  async listRepositoryFiles(
    owner: string,
    repo: string,
    path: string = '',
  ): Promise<MCPToolResult> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      const files = Array.isArray(data) ? data : [data];
      const fileList = files.map((file) => ({
        name: file.name,
        path: file.path,
        type: file.type,
        size: file.size,
        download_url: file.download_url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(fileList, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Error al listar archivos: ${error.message}`);
    }
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
  ): Promise<MCPToolResult> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        };
      } else {
        throw new Error('El archivo solicitado es un directorio');
      }
    } catch (error) {
      throw new Error(
        `Error al obtener contenido del archivo: ${error.message}`,
      );
    }
  }

  async listIssues(
    owner: string,
    repo: string,
    state: string = 'open',
  ): Promise<MCPToolResult> {
    try {
      const { data } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: state as 'open' | 'closed' | 'all',
        per_page: 10, // Limitar resultados
      });

      const issues = data.map((issue) => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        author: issue.user?.login,
        created_at: issue.created_at,
        body: issue.body?.substring(0, 200) + '...', // Truncar body
        labels: issue.labels.map((label) =>
          typeof label === 'string' ? label : label.name,
        ),
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(issues, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Error al listar issues: ${error.message}`);
    }
  }

  async listCommits(
    owner: string,
    repo: string,
    limit: number = 10,
  ): Promise<MCPToolResult> {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: limit,
      });

      const commits = data.map((commit) => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author?.name,
        date: commit.commit.author?.date,
        url: commit.html_url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(commits, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Error al listar commits: ${error.message}`);
    }
  }
}
