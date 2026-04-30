import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MD Print Studio",
  description: "Privacy Policy for MD Print Studio. Learn how we handle your data, ChatGPT text, and Google Drive integration.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm md:p-12">
        <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
          &larr; Back to Studio
        </Link>
        
        <article className="prose prose-zinc max-w-none prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-semibold prose-a:text-blue-600">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>

          <p>
            Welcome to MD Print Studio. We take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our service to convert ChatGPT text into beautiful PDFs.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            MD Print Studio is designed to be as privacy-focused as possible. The primary data we interact with includes:
          </p>
          <ul>
            <li><strong>Text Data:</strong> The Markdown or ChatGPT text you paste into the editor.</li>
            <li><strong>Authentication Data:</strong> Basic profile information (like your email address) provided by Google OAuth if you choose to sign in.</li>
            <li><strong>Images:</strong> Images you paste into the editor while logged in.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information collected strictly to provide and improve the service:</p>
          <ul>
            <li><strong>PDF Generation:</strong> The text you paste is temporarily processed by our servers solely to generate the A4 PDF document. We do not store or persist your text content in any database after the PDF is generated.</li>
            <li><strong>AI Fixing:</strong> If you use the "Fix with AI" feature, your text is temporarily sent to an AI provider (like Google Gemini or Groq) to repair LaTeX syntax. We do not use your text to train any models.</li>
            <li><strong>Google Drive Integration:</strong> If you log in with Google, we request the <code>drive.file</code> scope. This is used exclusively to upload images you paste directly into your own personal Google Drive. We do not have access to any other files in your Google Drive, nor do we store your images on our servers.</li>
          </ul>

          <h2>3. Data Sharing and Third Parties</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information or pasted text to outside parties. 
          </p>

          <h2>4. Cookies and Local Storage</h2>
          <p>
            We use standard session cookies via NextAuth to maintain your Google login state. No tracking or marketing cookies are used.
          </p>

          <h2>5. Your Consent</h2>
          <p>
            By using MD Print Studio, you consent to our Privacy Policy. If you do not agree with this policy, please do not use the application.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions regarding this privacy policy, you may contact us or open an issue on our <a href="https://github.com/Stavan1234/md-print-studio" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
