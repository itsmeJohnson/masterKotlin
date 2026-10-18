/* ==========================================================================
   Kotlin Syntax Highlighter
   Tokenizes and highlights Kotlin code safely with clean semantic tags.
   ========================================================================== */

export function highlightKotlin(code) {
  if (!code) return '';

  // Escape HTML characters first
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Match comments
  const comments = [];
  escaped = escaped.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
    const id = `__COMMENT_${comments.length}__`;
    comments.push(`<span class="token-comment">${match}</span>`);
    return id;
  });

  // Match strings
  const strings = [];
  escaped = escaped.replace(/(".*?"|'.*?')/g, (match) => {
    const id = `__STR_${strings.length}__`;
    strings.push(`<span class="token-string">${match}</span>`);
    return id;
  });

  // Match keywords
  const keywords = [
    'fun', 'val', 'var', 'class', 'data', 'sealed', 'interface', 'object',
    'override', 'suspend', 'if', 'else', 'when', 'for', 'while', 'return',
    'in', 'is', 'as', 'try', 'catch', 'finally', 'throw', 'package', 'import',
    'private', 'public', 'protected', 'internal', 'constructor', 'companion'
  ];
  const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  escaped = escaped.replace(kwRegex, '<span class="token-keyword">$1</span>');

  // Match built-in types
  const types = [
    'Int', 'String', 'Boolean', 'Double', 'Float', 'Long', 'Char', 'Unit',
    'Any', 'List', 'MutableList', 'Set', 'MutableSet', 'Map', 'MutableMap',
    'HashMap', 'HashSet', 'IntArray', 'Array', 'StateFlow', 'SharedFlow',
    'Flow', 'Job', 'CoroutineScope', 'Result', 'BigDecimal'
  ];
  const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
  escaped = escaped.replace(typeRegex, '<span class="token-type">$1</span>');

  // Match numbers
  escaped = escaped.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');

  // Restore strings and comments
  strings.forEach((str, i) => {
    escaped = escaped.replace(`__STR_${i}__`, str);
  });
  comments.forEach((comm, i) => {
    escaped = escaped.replace(`__COMMENT_${i}__`, comm);
  });

  return escaped;
}
