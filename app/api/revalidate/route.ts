import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface RevalidatePayload {
    paths?: string[];
    tags?: string[];
}

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as RevalidatePayload;
    const paths = body.paths ?? [];
    const tags = body.tags ?? [];

    if (paths.length === 0 && tags.length === 0) {
        revalidateTag("portfolio", "max");
        revalidatePath("/portfolio");
        return NextResponse.json({ ok: true, revalidated: { paths: ["/portfolio"], tags: ["portfolio"] } });
    }

    paths.forEach((path) => revalidatePath(path));
    tags.forEach((tag) => revalidateTag(tag, "max"));

    return NextResponse.json({
        ok: true,
        revalidated: {
            paths,
            tags,
        },
    });
}
