import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";

const MAX_QUEUE_LENGTH = 10;

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        
        function extractYoutubeId(url: string): string {
            const patterns = [
                /(?:v=)([^&]+)/,
                /youtu\.be\/([^?]+)/,
            ];
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) return match[1];
            }
            return "";
        }

        const session = await getServerSession();
        const user = await prismaClient.user.findFirst({
            where: {
                email: session?.user?.email ?? ""
            }
        });

        if (!user) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
        }

        const extractedId = extractYoutubeId(data.url);

        if (!extractedId) {
            return NextResponse.json({ message: "Invalid YouTube URL" }, { status: 411 });
        }

        // ✅ Replaced youtube-search-api with official YouTube Data API v3
        const ytRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${extractedId}&part=snippet&key=${process.env.YOUTUBE_API_KEY}`
        );
        const ytData = await ytRes.json();

        if (!ytData.items?.length) {
            return NextResponse.json({ message: "Video not found" }, { status: 411 });
        }

        const snippet = ytData.items[0].snippet;
        const title = snippet.title ?? "Can't find video title";
        const thumbnails = snippet.thumbnails;

        const smallImg = thumbnails?.medium?.url 
            ?? thumbnails?.default?.url 
            ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC3rt-o0TwZQbpDZ5QvQ8FCePSx_9aaJXulA&s";

        const bigImg = thumbnails?.maxres?.url 
            ?? thumbnails?.high?.url 
            ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC3rt-o0TwZQbpDZ5QvQ8FCePSx_9aaJXulA&s";

        const existingActiveStream = await prismaClient.stream.count({
            where: { userId: data.creatorId }
        });

        if (existingActiveStream > MAX_QUEUE_LENGTH) {
            return NextResponse.json({ message: "Already at limit" }, { status: 411 });
        }

        console.log("creatorId being used:", data.creatorId);

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title,
                smallImg,
                bigImg
            }
        });

        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
        });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error while adding a stream." }, { status: 411 });
    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");

    if (!creatorId) {
        return NextResponse.json({ message: "Error" }, { status: 411 });
    }

    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: { email: session?.user?.email ?? "" }
    });

    const [streams, activeStreams] = await Promise.all([
        prismaClient.stream.findMany({
            where: { userId: creatorId },
            include: {
                _count: { select: { upvotes: true } },
                upvotes: { where: { userId: user?.id ?? "" } }
            }
        }),
        prismaClient.currentStream.findFirst({
            where: { userId: creatorId },
            include: { stream: true }
        })
    ]);

    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false
        })),
        activeStreams
    });
}