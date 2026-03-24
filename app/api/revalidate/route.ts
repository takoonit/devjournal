import { revalidatePath, revalidateTag } from "next/cache";
import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

interface RevalidatePayload {
    paths?: string[];
    tags?: string[];
}

const revalidateTagCompat = revalidateTag as unknown as (tag: string) => void;

function secureCompare(a: string | null, b: string | undefined): boolean {
    if (typeof a !== "string" || typeof b !== "string") return false;
    const hashA = createHash("sha256").update(a).digest();
    const hashB = createHash("sha256").update(b).digest();
    return timingSafeEqual(hashA, hashB);
}

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");

    if (!secureCompare(secret, process.env.REVALIDATE_SECRET)) {
        return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as RevalidatePayload;
    const paths = body.paths ?? [];
    const tags = body.tags ?? [];

    if (paths.length === 0 && tags.length === 0) {
        revalidateTagCompat("portfolio");
        revalidatePath("/portfolio");
        return NextResponse.json({ ok: true, revalidated: { paths: ["/portfolio"], tags: ["portfolio"] } });
    }

    for (const path of paths) {
        revalidatePath(path);
    }

    for (const tag of tags) {
        revalidateTagCompat(tag);
    }

    return NextResponse.json({
        ok: true,
        revalidated: {
            paths,
            tags,
        },
    });
}
