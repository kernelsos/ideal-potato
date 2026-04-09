import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import youtubesearchapi from "youtube-search-api";

// OLD method of extrcating ID
//var YT_REGEX =/^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
//const extractedId = data.url.split("?v=")[1];
// //const extractedId = data.url.split("?v=")[1] ?? data.url.split("?si=")[1];

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})


export async function POST(req: NextRequest) {
    try {
        /*const isYt = data.url.match(YT_REGEX);
        if (!isYt){
            return NextResponse.json({
                message: "Wrong URL format"
        },{
            status: 411
        })
    } */

        const data = CreateStreamSchema.parse(await req.json());
        
   
        function extractYoutubeId(url: string): string {
        const patterns = [
                /(?:v=)([^&]+)/,        // handles ?v=VIDEO_ID
                /youtu\.be\/([^?]+)/,   // handles youtu.be/VIDEO_ID
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return "";
    }
        const extractedId = extractYoutubeId(data.url);        
        console.log("Full URL:", data.url);
        console.log("extractedId:", extractedId);

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(res);
        console.log("ID---->",res.id);
        console.log("title---->",res.title);
        console.log("thumbnail---->",res.thumbnail.thumbnails);
        
        
        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
            }
        });
        return NextResponse.json({
            message: "Added stream",
            id: stream.id
        })

    } catch (e) {
        console.log(e)
        return NextResponse.json({
            message: "Eror while adding a stream."
        },{
            status: 411
        })
    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""
        }
    })
    return NextResponse.json({
        streams
    })
}