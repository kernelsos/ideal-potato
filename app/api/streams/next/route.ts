import { prismaClient } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creatorId");

    if (!creatorId) {
        return NextResponse.json({ message: "creatorId missing" }, { status: 400 });
    }

    const mostUpvotedStream = await prismaClient.stream.findFirst({
        where: {
            userId: creatorId  // ← 734153f3... will now match
        },
        orderBy: {
            upvotes: { _count: "desc" }
        }
    });

    if (!mostUpvotedStream) {
        return NextResponse.json({ message: "No stream in queue" }, { status: 404 });
    }
    try {
    // Step 1 — delete upvotes first (FK constraint requires this)
        await prismaClient.upvote.deleteMany({
            where: { streamId: mostUpvotedStream.id }
        });
    
        // Step 2 — now safe to run both together
        await Promise.all([
            prismaClient.currentStream.upsert({
                where: { userId: creatorId },
                update: { streamId: mostUpvotedStream.id },
                create: { userId: creatorId, streamId: mostUpvotedStream.id }
            }),
            prismaClient.stream.delete({
                where: { id: mostUpvotedStream.id }
            })
        ]);
    } catch (e) {
        console.error("Promise.all failed:", e);
        return NextResponse.json({ message: "Failed to play next stream" }, { status: 500 });
    }

    return NextResponse.json({ stream: mostUpvotedStream });
}