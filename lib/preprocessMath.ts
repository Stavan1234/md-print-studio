// /**
//  * Preprocesses text to detect and clean mathematical content.
//  */

// // Mapping from plain text math keywords to LaTeX commands
// const plainTextToLatex: Record<string, string> = {
//   // Operators
//   int: '\\int',
//   sum: '\\sum',
//   prod: '\\prod',
//   coprod: '\\coprod',
//   bigcup: '\\bigcup',
//   bigcap: '\\bigcap',
//   bigvee: '\\bigvee',
//   bigwedge: '\\bigwedge',
//   bigoplus: '\\bigoplus',
//   bigotimes: '\\bigotimes',
//   bigodot: '\\bigodot',
//   lim: '\\lim',
//   log: '\\log',
//   ln: '\\ln',
//   exp: '\\exp',
//   sin: '\\sin',
//   cos: '\\cos',
//   tan: '\\tan',
//   cot: '\\cot',
//   sec: '\\sec',
//   csc: '\\csc',
//   arcsin: '\\arcsin',
//   arccos: '\\arccos',
//   arctan: '\\arctan',
//   sinh: '\\sinh',
//   cosh: '\\cosh',
//   tanh: '\\tanh',
//   coth: '\\coth',
//   max: '\\max',
//   min: '\\min',
//   sup: '\\sup',
//   inf: '\\inf',
//   limsup: '\\limsup',
//   liminf: '\\liminf',
//   det: '\\det',
//   gcd: '\\gcd',
//   lcm: '\\lcm',
//   mod: '\\mod',
//   pmod: '\\pmod',
//   bmod: '\\bmod',
  
//   // Greek letters (lowercase)
//   alpha: '\\alpha',
//   beta: '\\beta',
//   gamma: '\\gamma',
//   delta: '\\delta',
//   epsilon: '\\epsilon',
//   varepsilon: '\\varepsilon',
//   zeta: '\\zeta',
//   eta: '\\eta',
//   theta: '\\theta',
//   vartheta: '\\vartheta',
//   iota: '\\iota',
//   kappa: '\\kappa',
//   lambda: '\\lambda',
//   mu: '\\mu',
//   nu: '\\nu',
//   xi: '\\xi',
//   pi: '\\pi',
//   varpi: '\\varpi',
//   rho: '\\rho',
//   varrho: '\\varrho',
//   sigma: '\\sigma',
//   varsigma: '\\varsigma',
//   tau: '\\tau',
//   upsilon: '\\upsilon',
//   phi: '\\phi',
//   varphi: '\\varphi',
//   chi: '\\chi',
//   psi: '\\psi',
//   omega: '\\omega',
  
//   // Greek letters (uppercase)
//   Gamma: '\\Gamma',
//   Delta: '\\Delta',
//   Theta: '\\Theta',
//   Lambda: '\\Lambda',
//   Xi: '\\Xi',
//   Pi: '\\Pi',
//   Sigma: '\\Sigma',
//   Upsilon: '\\Upsilon',
//   Phi: '\\Phi',
//   Psi: '\\Psi',
//   Omega: '\\Omega',
  
//   // Special symbols
//   infty: '\\infty',
//   partial: '\\partial',
//   nabla: '\\nabla',
//   in: '\\in',
//   notin: '\\notin',
//   ni: '\\ni',
//   subset: '\\subset',
//   supset: '\\supset',
//   subseteq: '\\subseteq',
//   supseteq: '\\supseteq',
//   cup: '\\cup',
//   cap: '\\cap',
//   wedge: '\\wedge',
//   vee: '\\vee',
//   lnot: '\\lnot',
//   forall: '\\forall',
//   exists: '\\exists',
//   nexists: '\\nexists',
//   emptyset: '\\emptyset',
//   varnothing: '\\varnothing',
//   prime: '\\prime',
//   angle: '\\angle',
//   measuredangle: '\\measuredangle',
//   triangle: '\\triangle',
//   diamond: '\\diamond',
//   box: '\\Box',
//   checkmark: '\\checkmark',
//   dag: '\\dagger',
//   ddag: '\\ddagger',
//   star: '\\star',
//   ast: '\\ast',
//   circ: '\\circ',
//   bullet: '\\bullet',
//   cdot: '\\cdot',
//   times: '\\times',
//   div: '\\div',
//   pm: '\\pm',
//   mp: '\\mp',
//   oplus: '\\oplus',
//   ominus: '\\ominus',
//   otimes: '\\otimes',
//   oslash: '\\oslash',
//   odot: '\\odot',
//   equiv: '\\equiv',
//   approx: '\\approx',
//   sim: '\\sim',
//   simeq: '\\simeq',
//   cong: '\\cong',
//   ne: '\\ne',
//   le: '\\le',
//   ge: '\\ge',
//   ll: '\\ll',
//   gg: '\\gg',
//   prec: '\\prec',
//   succ: '\\succ',
//   preceq: '\\preceq',
//   succeq: '\\succeq',
//   subsetneq: '\\subsetneq',
//   supsetneq: '\\supsetneq',
//   to: '\\to',
//   gets: '\\gets',
//   leftarrow: '\\leftarrow',
//   rightarrow: '\\rightarrow',
//   Leftarrow: '\\Leftarrow',
//   Rightarrow: '\\Rightarrow',
//   leftrightarrow: '\\leftrightarrow',
//   Leftrightarrow: '\\Leftrightarrow',
//   uparrow: '\\uparrow',
//   downarrow: '\\downarrow',
//   Uparrow: '\\Uparrow',
//   Downarrow: '\\Downarrow',
  
//   // Other common ones
//   Re: '\\Re',
//   Im: '\\Im',
//   aleph: '\\aleph',
//   hbar: '\\hbar',
//   ell: '\\ell',
//   wp: '\\wp',
//   imath: '\\imath',
//   jmath: '\\jmath',
//   ldots: '\\ldots',
//   cdots: '\\cdots',
//   vdots: '\\vdots',
//   ddots: '\\ddots',
//   text: '\\text' // careful – only matches plain "text", not "\text"
// };

// /**
//  * Converts plain-text math keywords (e.g., "int") to LaTeX commands ("\\int")
//  * ONLY inside math regions ($...$ or $$...$$).
//  */
// function convertPlainTextToLatexInMathContext(text: string): string {
//   console.log("🚀 convertPlainTextToLatexInMathContext called");
  
//   // First handle display math $$...$$
//   let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner) => {
//     console.log("✅ Display math block found:", match);
//     let processed = inner;
//     const sortedKeys = Object.keys(plainTextToLatex).sort((a, b) => b.length - a.length);
//     for (const key of sortedKeys) {
//       const replacement = plainTextToLatex[key];
//       const regex = new RegExp(`(?<![a-zA-Z])${key}(?![a-zA-Z])`, 'g');
//       processed = processed.replace(regex, replacement);
//     }
//     return '$$\n' + processed.trim() + '\n$$';
//   });

//   // Then handle inline math $...$
//   result = result.replace(/\$([^\n$]+?)\$/g, (match, inner) => {
//     console.log("✅ Inline math block found:", match);
//     let processed = inner;
//     const sortedKeys = Object.keys(plainTextToLatex).sort((a, b) => b.length - a.length);
//     for (const key of sortedKeys) {
//       const replacement = plainTextToLatex[key];
//       const regex = new RegExp(`(?<![a-zA-Z])${key}(?![a-zA-Z])`, 'g');
//       processed = processed.replace(regex, replacement);
//     }
//     return '$' + processed + '$';
//   });

//   return result;
// }

export function preprocessMath(text: string): string {
  let result = text;

  // 1. Normalize line endings
  result = result.replace(/\r\n/g, '\n');

  // 2. Fix broken patterns BEFORE any $ protection
  
  // Fix \maxbig$|...|,\;|...|big$ -> \max(|...|, |...|)
  result = result.replace(/\\maxbig\s*\$([^$]+)\$big\$/g, (match, content) => {
    content = content.replace(/\|([^|]+)\|/g, '\\lvert$1\\rvert');
    content = content.replace(/,\s*\\;/g, ',');
    return '\\max(' + content + ')';
  });
  
  // Fix d_8 = \max\big|...|,|...|\big -> d_8 = \max{...}
  result = result.replace(
    /d_8\s*=\s*\\max(?:\\big)?\|([^|]+)\|,;?\|([^|]+)\|(?:\\big)?/g,
    'd_8 = \\max\\{\\lvert$1\\rvert,\\lvert$2\\rvert\\}'
  );

  // Fix ,;| pattern
  result = result.replace(/,\s*;\|/g, ',|');
  result = result.replace(/\|([^|]+)\|,\s*;\|/g, '|$1|,|');

  // Fix nested $ inside formulas
  result = result.replace(/\$([^$]+)\$\^(\d+)/g, '($1)^$2');
  result = result.replace(/\$([^$]+)\$\^(\{[^}]+\})/g, '($1)^$2');
  result = result.replace(/\^(\d+)\$([^$]+)\$/g, '^($1)$2');
  result = result.replace(/\^(\{[^}]+\})\$([^$]+)\$/g, '^($1)$2');

  // d_E = \sqrt{$x_2 - x_1$^2 + $y_2 - y_1$^2}
  result = result.replace(/\\sqrt\{\$([^$]+)\$\^(\d+)\s*\+\s*\$([^$]+)\$\^(\d+)\}/g, 
    (match, x, xexp, y, yexp) => `\\sqrt{(${x})^${xexp} + (${y})^${yexp}}`);

//     // After fixing delimiters but before protecting math regions
// result = convertPlainTextToLatexInMathContext(result);

  // 3. CRITICAL: Convert \(...\) to $...$ first (handle nested parens)
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (match, content) => {
    return '$' + content + '$';
  });

  // 4. Convert \[...\] to $$...$$ - fix broken $$ first
  result = result.replace(/\$\$\s*\n\s*\\boxed/g, '$$\n\\boxed');
  result = result.replace(/\\boxed([\s\S]*?)\n\s*\$\$/g, '$$\\boxed$1$$');
  
  // Now convert \[...\] 
  // result = result.replace(/\\\[([\s\S]*?)\\\]/g, (match, content) => '$$\n' + content.trim() + '\n$$');
  result = result.replace(/\\\[([\s\S]*?)\\\]/g, (match, content) => {
  // Ensure the opening $$ is on its own line by adding a leading newline
  return '\n$$\n' + content.trim() + '\n$$\n';
});



  // 5. Remove stray $ that are not at boundaries
  result = result
    .replace(/\$([^\$]+)\$\s*([\^_{])/g, '$1$2')
    .replace(/([\^_{])\s*\$([^\$]+)\$/g, '$1$2');

  // 6. Handle parenthesized formulas: (formula) -> $formula$
  const lines = result.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line.includes('$') || /^#{1,6}\s/.test(line) || /^[-*•]\s/.test(line)) {
      processedLines.push(line);
      continue;
    }
    
    line = line.replace(/^\s*\(([^)]+)\)\s*$/gm, (match, inner) => {
      if (hasLatexCommand(inner) || looksLikeStrictMath(inner) || /^[d_]\d*=|\\/.test(inner)) {
        return '$' + inner + '$';
      }
      return match;
    });
    
    processedLines.push(line);
  }
  result = processedLines.join('\n');

// // 6a. Convert plain-text math keywords to LaTeX commands inside math regions
// console.log("➡️ Before calling convertPlainTextToLatexInMathContext");
// result = convertPlainTextToLatexInMathContext(result);
// console.log("⬅️ After calling convertPlainTextToLatexInMathContext");

  // 7. Define LaTeX commands to protect
  const latexCommands = new Set([
    'frac', 'sqrt', 'boxed', 'text', 'cdot', 'times', 'div', 'pm', 'mp',
    'leq', 'geq', 'neq', 'approx', 'infty', 'partial', 'nabla', 'int',
    'sum', 'prod', 'coprod', 'cup', 'cap', 'subset', 'supset', 'in', 'notin',
    'forall', 'exists', 'neg', 'wedge', 'vee', 'Rightarrow', 'Leftrightarrow',
    'langle', 'rangle', 'lceil', 'rceil', 'lfloor', 'rfloor',
    'begin', 'end', 'matrix', 'pmatrix', 'bmatrix', 'vmatrix', 'Vmatrix',
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta',
    'eta', 'theta', 'vartheta', 'iota', 'kappa', 'lambda', 'mu', 'nu',
    'xi', 'pi', 'varpi', 'rho', 'varrho', 'sigma', 'varsigma', 'tau',
    'upsilon', 'phi', 'varphi', 'chi', 'psi', 'omega',
    'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon',
    'Phi', 'Psi', 'Omega',
    'max', 'min', 'lim', 'log', 'ln', 'exp', 'sin', 'cos', 'tan', 'cot',
    'sec', 'csc', 'arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'coth',
    'ast', 'star', 'dagger', 'ddagger', 'oplus', 'ominus', 'otimes', 'oslash',
    'circ', 'bullet', 'vert', 'Vert', 'backslash',
    'vdots', 'ldots', 'cdots', 'ddots', 'dots',
    'lvert', 'rvert', 'lVert', 'rVert',
    'det', 'gcd', 'lcm', 'mod', 'bmod', 'pmod', 'ker', 'arg', 'dim', 'hom',
    'Re', 'Im', 'deg', 'rank', 'Tr', 'tr', 'trace',
    'big', 'Big', 'bigg', 'Bigg',
    'rarr', 'larr', 'uarr', 'darr', 'to', 'rightarrow', 'leftarrow', 'uparrow', 'downarrow'
  ]);

  // 8. Protect math regions $...$ and $$...$$ FIRST
  const mathRegions: string[] = [];
  result = result.replace(/(\$[^\$]*\$|\$\$[\s\S]*?\$\$)/g, (match) => {
    mathRegions.push(match);
    return `@@MATH_REGION_${mathRegions.length - 1}@@`;
  });

  // Process single-letter backslashes outside math regions
  result = result.replace(/\\([a-zA-Z])(?=[_^]|[\d\s]|$)/g, (match, letter) => {
    if (latexCommands.has(letter)) {
      return match;
    }
    return letter;
  });

  // Handle longer commands
  result = result.replace(/\\([a-zA-Z]{2,}[a-zA-Z0-9]*)/g, (match, cmd) => {
    if (latexCommands.has(cmd)) {
      return match;
    }
    return cmd;
  });

  // Remove backslashes before numbers
  result = result.replace(/\\(\d+)/g, '$1');

  // 9. Restore math regions
  result = result.replace(/@@MATH_REGION_(\d+)@@/g, (_, index) => mathRegions[parseInt(index)]);

  // 10. Continue with cleaning
  result = result
    .replace(/\^{\s*\\wedge\s*}/g, '^')
    .replace(/\\text\s+{/g, '\\text{')
    .replace(/\\text\s*{\s*cdot\s*}/g, '\\cdot')
    .replace(/\\boxed\s*{([^}]*(?:}[^}]*)*)}/g, '\\boxed{$1}')
    .replace(/\\begin\{[a-zA-Z]*matrix\}([\s\S]*?)\\end\{[a-zA-Z]*matrix\}/g, (match) => {
      return match.replace(/\\\$/g, '\\\\').replace(/\$/g, '');
    });

  // 11. Protect ASCII diagrams
  result = result.replace(/^\s*\$\s*\([^)]+\)\s*\([^)]+\)\s*\([^)]+\)\s*\$\s*$/gm, (match) => {
    return match.replace(/\$/g, '');
  });

  // 12. Protect existing math regions again
  const protectedBlocks: string[] = [];
  result = result.replace(
    /(\$\$[^\$]*\$\$|\$[^\$]*\$)/g,
    (match) => {
      protectedBlocks.push(match);
      return `@@PROTECTED_${protectedBlocks.length - 1}@@`;
    }
  );

  // 13. Heuristic: wrap standalone math lines
  const finalLines = result.split('\n');
  for (let idx = 0; idx < finalLines.length; idx++) {
    const line = finalLines[idx].trim();
    
    if (!line || line.startsWith('$') || line.startsWith('\\') || 
        line.startsWith('@@PROTECTED') || line.includes('$') || line.includes('@@PROTECTED')) {
      continue;
    }
    if (/^#{1,6}\s|^[-*•]\s|^\d+\.\s|\*\*/.test(line)) {
      continue;
    }
    if (isAsciiDiagram(line)) {
      continue;
    }
    
    if (hasLatexCommand(line) && !looksLikeProse(line)) {
      finalLines[idx] = '$' + line + '$';
      continue;
    }
    
    if (line.includes('|') && line.length < 80) {
      if (/^\s*[dd]_[48]\s*=|^\\sqrt\{/.test(line) || /\|.+\|/.test(line)) {
        finalLines[idx] = '$' + line + '$';
        continue;
      }
    }
    
    if (/City|Block|Manhattan|Chessboard|Distance|Euclidean/i.test(line)) {
      continue;
    }
    
    const lineWithoutTrailingPunct = line.replace(/[.,;:]$/, '');
    if (lineWithoutTrailingPunct.length > 100) continue;
    if (line.includes('  ')) continue;
    if (looksLikeStrictMath(lineWithoutTrailingPunct) && !containsProse(lineWithoutTrailingPunct)) {
      finalLines[idx] = '$' + line + '$';
    }
  }
  result = finalLines.join('\n');

  // 14. Restore protected blocks
  result = result.replace(/@@PROTECTED_(\d+)@@/g, (_, index) => protectedBlocks[parseInt(index)]);

  console.log("PREPROCESSED:", result);
  return result;
}

function hasLatexCommand(line: string): boolean {
  const latexCmdPattern = /\\(sqrt|frac|cdot|times|pm|infty|int|sum|prod|leq|geq|neq|approx|partial|nabla|max|min|lim|sin|cos|tan|log|exp|alpha|beta|gamma|delta|theta|lambda|pi|sigma|omega|cdot|leftarrow|rightarrow|Rightarrow|Leftrightarrow)/;
  return latexCmdPattern.test(line);
}

function looksLikeProse(line: string): boolean {
  const words = line.match(/[a-zA-Z]{3,}/g) || [];
  return words.length > 3;
}

function isAsciiDiagram(line: string): boolean {
  const coordPattern = /\(\s*[a-zA-Z0-9]+[+-]\d+\s*,\s*[a-zA-Z0-9]+[+-]\d+\s*\)/;
  const matches = line.match(coordPattern);
  if (!matches) return false;
  const coordCount = (line.match(/\([^)]+\)/g) || []).length;
  return coordCount >= 2 || (coordCount === 1 && line.length < 50);
}

function looksLikeStrictMath(str: string): boolean {
  const s = str.trim();
  if (s.length === 0) return false;

  if (/\\[a-zA-Z]+/.test(s)) return true;

  const mathSymbols = /[≤≥≠≈∞∫∑√∂∇∏∐∪∩∈∉⊂⊃⊆⊇∀∃¬∧∨⇒⇔⟨⟩×÷±∓∝∞]|\\[a-zA-Z]+/;
  if (mathSymbols.test(s)) {
    const mathCount = (s.match(/[≤≥≠≈∞∫∑√∂∇∏∐∪∩∈∉⊂⊃⊆⊇∀∃¬∧∨⇒⇔⟨⟩×÷±∓∝∞]|\\[a-zA-Z]+/g) || []).length;
    const wordCount = (s.match(/[a-zA-Z]{3,}/g) || []).length;
    if (mathCount > wordCount) return true;
  }

  if (/\|[^|]+\|/.test(s)) return true;
  if (/[a-zA-Z0-9]_\{[^\}]+\}|\^\{[^\}]+\}/.test(s)) return true;
  if (/[a-zA-Z0-9]_\d+|\^\d+/.test(s)) return true;
  if (/^[a-zA-Z]\([a-zA-Z0-9,\s]+\)$/.test(s)) return true;
  if (/^\d+\s*[×*/^]\s*\d+$/.test(s)) return true;
  if (/^[0-9<>\s]+[<≤>≥][\s0-9]+$/.test(s)) return true;
  if (/^\{[0-9,\s]+\}$/.test(s)) return true;
  if (/\\begin\{[a-zA-Z]*matrix\}/.test(s)) return true;
  if (/^[a-zA-Z]\s*=\s*[^\s]+$/.test(s) && s.length < 30) return true;
  if (/^d_[E48]\s*=/.test(s)) return true;

  return false;
}

function containsProse(str: string): boolean {
  const proseWords = [
    'the', 'and', 'for', 'with', 'this', 'that', 'from', 'have',
    'illumination', 'reflectance', 'intensity', 'image', 'function',
    'coordinates', 'pixel', 'matrix', 'discrete', 'spatial', 'distance',
    'euclidean', 'city', 'block', 'chessboard', 'center', 'ascii', 'memorize',
    'manhattan', 'chebyshev'
  ];
  const lower = str.toLowerCase();
  return proseWords.some(word => lower.includes(word));
}
