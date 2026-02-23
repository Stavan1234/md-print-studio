import puppeteerCore from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

async function getBrowser() {
  const isVercel = !!process.env.VERCEL;

  if (isVercel) {
    // Dynamic require to bypass type errors and optimize Vercel bundle
    const chromium = require("@sparticuz/chromium-min");
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  // Local Development: Uses your local Chrome install
  const puppeteer = require("puppeteer");
  return puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
}

export async function POST(request: Request) {
  const { content } = (await request.json()) as { content?: string };

  if (!content || typeof content !== "string") {
    return new Response(JSON.stringify({ error: "Missing content" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const originHeader = request.headers.get("origin");
  const host = request.headers.get("host");

  const baseUrl =
    originHeader ??
    (host
      ? `https://${host}`
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

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
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation failed", error);
    return new Response(
      JSON.stringify({ error: "PDF generation failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}