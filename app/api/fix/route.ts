import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { preprocessMath } from '@/lib/preprocessMath';
import Groq from 'groq-sdk';

const execAsync = promisify(exec);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let groqClient: any = null;

function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

async function fixWithAI(brokenLatex: string): Promise<string> {
  const client = getGroqClient();
  if (!client) {
    console.warn('GROQ_API_KEY not set, skipping AI fix');
    return brokenLatex;
  }
  
  const prompt = `Fix the LaTeX syntax in the following fragment. Only return the corrected LaTeX, no explanations:\n\n${brokenLatex}`;
  const completion = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'mixtral-8x7b-32768',
    temperature: 0,
  });
  return completion.choices[0]?.message?.content || brokenLatex;
}

export async function POST(request: Request) {
  const { content } = await request.json();
  if (!content) return NextResponse.json({ error: 'No content' }, { status: 400 });

  // Step 1: Run your existing preprocessor
  const preprocessed = preprocessMath(content);

  // Step 2: Extract LaTeX fragments (simple regex – improve as needed)
  const latexFragments = preprocessed.match(/(\$\$[^\$]*\$\$|\$[^\$]*\$)/g) || [];

  let fixedContent = preprocessed;

  for (const fragment of latexFragments) {
    try {
      // Run chktex on the fragment
      const { stdout, stderr } = await execAsync(`echo "${fragment}" | chktex -q -v0`, {
        shell: '/bin/bash',
        timeout: 5000,
      });

      // Parse stderr for errors (chktex outputs errors to stderr)
      if (stderr) {
        console.log('chktex errors:', stderr);
        // Apply simple fixes based on error messages
        // This is a placeholder – you'd map error codes to replacements
        const fixedFragment = applyChktexFixes(fragment, stderr);
        fixedContent = fixedContent.replace(fragment, fixedFragment);
      }
    } catch (error) {
      console.error('chktex failed for fragment:', fragment, error);
    }
  }

  return NextResponse.json({ fixed: fixedContent });
}

function applyChktexFixes(latex: string, errors: string): string {
  let result = latex;
  // Example: if error says "Command \N undefined", remove the backslash
  if (errors.includes('Command \\N undefined')) {
    result = result.replace(/\\N/g, 'N');
  }
  // Add more mappings based on chktex error codes
  // See `chktex --help` for error codes
  return result;
}
