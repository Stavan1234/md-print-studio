// app/api/pdf/route.ts
import puppeteerCore from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

// URL to the specific Chromium version compatible with the library
const CHROMIUM_PACK_URL = "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

async function getBrowser() {
  const isVercel = !!process.env.VERCEL || process.env.NODE_ENV === 'production';

  if (isVercel) {
    const chromium = require("@sparticuz/chromium-min");
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      // We explicitly provide the remote URL to fix the "directory does not exist" error
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: chromium.headless,
    });
  }

  // Local development: Point to your local Chrome/Edge
  const puppeteer = require("puppeteer");
  return puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
}

export async function POST(request: Request) {
  const { content } = (await request.json()) as { content?: string };
  if (!content) return new Response(JSON.stringify({ error: "No content" }), { status: 400 });

  const host = request.headers.get("host");
  const baseUrl = `https://${host}`;

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.evaluateOnNewDocument((markdown: string) => {
      (window as any).__MD_PRINT_CONTENT__ = markdown;
    }, content);

    await page.goto(`${baseUrl}/print`, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    await browser.close();
    return new Response(pdfBuffer, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error: any) {
    console.error("PDF Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}