export interface GitHubImageConfig {
  owner: string;
  repo: string;
  branch: string;
}

const defaultConfig: GitHubImageConfig = {
  owner: process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER || 'username',
  repo: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME || 'kirana-point-assets',
  branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main',
};

/**
 * Builds a GitHub Raw CDN URL for a stored asset
 */
export function getGitHubImageUrl(path: string, config: GitHubImageConfig = defaultConfig): string {
  if (!path) return '/images/placeholder-product.svg';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${cleanPath}`;
}
