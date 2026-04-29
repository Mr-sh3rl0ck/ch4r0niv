// Use Vite's glob import to get all markdown files
const mdFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

function parseFrontMatter(mdString) {
  // Regex to match frontmatter between --- and ---
  const match = mdString.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: mdString };
  
  const frontMatterStr = match[1];
  const content = match[2];
  const data = {};
  
  frontMatterStr.split('\n').forEach(line => {
    // Split by first colon
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Remove quotes from start and end if they exist
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Simple array parsing
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      
      data[key] = value;
    }
  });
  
  return { data, content };
}

export function getAllPosts() {
  const posts = [];
  
  for (const path in mdFiles) {
    const fileContent = mdFiles[path];
    const { data, content } = parseFrontMatter(fileContent);
    
    // Extract slug from filename: '../posts/hello-world.md' -> 'hello-world'
    const slug = path.split('/').pop().replace(/\.md$/, '');
    
    posts.push({
      slug,
      frontmatter: data,
      content,
    });
  }
  
  // Sort by date descending
  return posts.sort((a, b) => {
    return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
  });
}

export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find(p => p.slug === slug);
}
