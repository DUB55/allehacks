const REPOS = [
  {
    name: "dub55.github.io",
    url: "https://api.github.com/repos/DUB55/dub55.github.io/contents",
    description: "Personal GitHub Pages website"
  },
  {
    name: "Blooket-Hacks",
    url: "https://api.github.com/repos/DUB55/Blooket-Hacks/contents",
    description: "Blooket game hacks and utilities"
  },
  {
    name: "Snake-Hacks",
    url: "https://dub55.github.io/snake",
    description: "Snake game hacks and utilities",
    external: true
  }
];

export const getRepositories = () => REPOS;

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchDirectoryContents = async (url: string) => {
  try {
    // Check cache first
    const cachedData = cache.get(url);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch directory contents');
    }
    
    const data = await response.json();
    
    // Cache the result
    cache.set(url, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching directory contents:', error);
    throw error;
  }
};

export const fetchFileContent = async (url: string) => {
  try {
    // Check cache first
    const cachedData = cache.get(url);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch file content');
    }
    
    const data = await response.json();
    const content = atob(data.content);
    
    // Cache the result
    cache.set(url, {
      data: content,
      timestamp: Date.now()
    });
    
    return content;
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
};

export const searchAllFiles = async (repoName: string, query: string) => {
  const results = [];
  const searchInDirectory = async (path = '') => {
    try {
      const url = `https://api.github.com/repos/DUB55/${repoName}/contents/${path}`;
      const contents = await fetchDirectoryContents(url);

      for (const item of contents) {
        if (item.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            type: item.type,
            name: item.name,
            path: item.path,
            repository: repoName
          });
        }

        if (item.type === 'dir') {
          await searchInDirectory(item.path);
        }
      }
    } catch (error) {
      console.error(`Error searching in ${path}:`, error);
    }
  };

  try {
    await searchInDirectory();
    return results;
  } catch (error) {
    console.error('Error searching files:', error);
    return [];
  }
};

export const isCodeFile = (filename: string) => {
  const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.css', '.html', '.md'];
  return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};