import sharp from "sharp";
import { NextResponse } from "next/server";
import { getAdminBrandSettings } from "@/lib/admin-brand";


export async function GET() {
  const brand = await getAdminBrandSettings();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let response: Response;
    try {
      response = await fetch(brand.logoUrl, {
        signal: controller.signal,
        cache: "no-store",
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return new NextResponse("Ritu Rosh favicon unavailable", { status: 503 });
    }

    const source = Buffer.from(await response.arrayBuffer());
    const png = await sharp(source)
      .resize(64, 64, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("Ritu Rosh favicon unavailable", { status: 503 });
  }
}
