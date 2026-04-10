'use client'

import { useEffect, useState } from 'react'
//import { VideoPlayer } from '@/components/video-player'
//import { VideoSubmission } from '@/components/video-submission'
//import { VideoQueue } from '@/components/video-queue'

export interface Video {
  id: string
  youtubeId: string
  title: string
  thumbnail: string
  votes: number
  userVote?: 'up' | 'down' | null
}

const REFRESH_INTERVAL_MS = 10*1000;

export default function Page() {
  const [currentVideo, setCurrentVideo] = useState<Video>({
    id: '1',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Current Playing Song - Rick Astley - Never Gonna Give You Up',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    votes: 142,
  })

  const [queue, setQueue] = useState<Video[]>([
    {
      id: '2',
      youtubeId: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      votes: 87,
    },
    {
      id: '3',
      youtubeId: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      votes: 65,
    },
    {
      id: '4',
      youtubeId: 'OPf0YbXqDm0',
      title: 'Mark Ronson - Uptown Funk ft. Bruno Mars',
      thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg',
      votes: 54,
    },
    {
      id: '5',
      youtubeId: 'lDK9QqIzhwk',
      title: 'Levan Polkka - Loituma',
      thumbnail: 'https://img.youtube.com/vi/lDK9QqIzhwk/maxresdefault.jpg',
      votes: 41,
    },
  ])
  async function refreshStreams() {
    const res = await fetch(`api/streams/my`);
    console.log(res)
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {

    }, REFRESH_INTERVAL_MS)
  })
  
  const handleVote = (videoId: string, voteType: 'up' | 'down') => {
    setQueue((prevQueue) =>
      prevQueue
        .map((video) => {
          if (video.id !== videoId) return video

          const currentVote = video.userVote
          let newVotes = video.votes
          let newUserVote: 'up' | 'down' | null = voteType

          // If clicking the same vote, remove it
          if (currentVote === voteType) {
            newUserVote = null
            newVotes += voteType === 'up' ? -1 : 1
          }
          // If switching votes
          else if (currentVote) {
            newVotes += voteType === 'up' ? 2 : -2
          }
          // If voting for the first time
          else {
            newVotes += voteType === 'up' ? 1 : -1
          }

          return { ...video, votes: newVotes, userVote: newUserVote }
        })
        .sort((a, b) => b.votes - a.votes)
    )
  }

  const handleAddVideo = (youtubeId: string, title: string, thumbnail: string) => {
    const newVideo: Video = {
      id: Date.now().toString(),
      youtubeId,
      title,
      thumbnail,
      votes: 0,
    }
    setQueue((prevQueue) => [...prevQueue, newVideo].sort((a, b) => b.votes - a.votes))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,60,200,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(60,100,200,0.08),transparent_50%)]" />
        Hello there
      </div>
    </div>
  )
}

