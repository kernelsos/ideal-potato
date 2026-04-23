import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";

const MAX_QUEUE_LENGTH = 10;

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
      const session  = await getServerSession();
      const user = await prismaClient.user.findFirst({
        where: {
          email: session?.user?.email ?? ""
        }
      });
      if (!user){
        return NextResponse.json({
          message: "Unauthenticated"
        }, {
          status: 403
        })
      }
      const extractedId = extractYoutubeId(data.url);        
      const res = await youtubesearchapi.GetVideoDetails(extractedId);
      const thumbnails = res.thumbnail.thumbnails;
      thumbnails.sort((a:{width: number}, b:{width: number}) => a.width < b.width ? -1 : 1);

      const existingActiveStream =await prismaClient.stream.count({
        where: {
          userId: data.creatorId
        }
      })

      if(existingActiveStream > MAX_QUEUE_LENGTH) {
        return NextResponse.json({
          message: "Already at limit"
        }, { status : 411} )

      }
     
      console.log("creatorId being used:", data.creatorId)
      const stream = await prismaClient.stream.create({
          data: {
              userId: data.creatorId,
              url: data.url,
              extractedId,
              type: "Youtube",
              title: res.title ?? "Can't find video title",
              smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length -2].url : thumbnails[thumbnails.length -1].url) ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC3rt-o0TwZQbpDZ5QvQ8FCePSx_9aaJXulA&s",
              bigImg: thumbnails[thumbnails.length -1].url ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC3rt-o0TwZQbpDZ5QvQ8FCePSx_9aaJXulA&s"
          }
        });

        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
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

  if (!creatorId) {
    return NextResponse.json({ message: "Error" }, { status: 411 });
  }

  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: { email: session?.user?.email ?? "" }
  });

  const [streams, activeStreams] = await Promise.all([await prismaClient.stream.findMany({
    where: {
      userId: creatorId   
    },
    include: {
      _count: {
        select: { upvotes: true }
      },
      upvotes: {
        where: {
          userId: user?.id ?? ""  
        }
      }
    }
  }), prismaClient.currentStream.findFirst({

    where: {
      userId: creatorId
    },
    include: {
      stream: true
    }
  })])

  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      upvotes: _count.upvotes,
      haveUpvoted: rest.upvotes.length ? true : false
    })),
    activeStreams
  });
}