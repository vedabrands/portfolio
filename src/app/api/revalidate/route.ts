import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = body?.path || "/";

    // Revalidate the homepage and any specified path
    revalidatePath(path);
    revalidatePath("/", "page");

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Revalidation failed";
    return NextResponse.json({ revalidated: false, error: message }, { status: 500 });
  }
}
