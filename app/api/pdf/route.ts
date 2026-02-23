import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const maxDuration = 60;

async function getBrowser() {
  const isVercel = !!process.env.VERCEL;

  if (isVercel) {
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  return puppeteer.launch({
    headless: "new",
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

  // Prefer Origin header, then fall back to host or env var
  const baseUrl =
    originHeader ??
    (host
      ? `https://${host}`
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.evaluateOnNewDocument((markdown) => {
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

    const response = new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      },
    });

    await browser.close();
    return response;
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

