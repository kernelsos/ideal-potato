"use client"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent } from "@/components/ui/card"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { Appbar } from "./Appbar";
import "../globals.css"


function ChevronUp() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-white/30" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function getId(url: string): string {
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


// ── Types ─────────────────────────────────────────────────────────────────────
interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
}


const REFRESH_INTERVAL_MS = 10 * 1000;


export default function StreamView({
    creatorId
}:{
    creatorId: string
}) {

  const [inputLink, setInputLink] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);


  async function refreshStreams() {
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`, { credentials: "include" 
    });
    const json = await res.json();
    setQueue(json.streams.sort((a: any,b: any) => a.upvotes < b.upvotes ? 1 : -1));
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/streams/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        creatorId,
        url:inputLink
      }),
    });
    await refreshStreams();
    setLoading(false);
    setInputLink("");
  };

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? { ...video, upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1 ,
              haveUpvoted: !video.haveUpvoted 
            }
            : video
        ).sort((a, b) => (b.upvotes) - (a.upvotes)));

    fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({ 
        streamId: id 
      }),
    });
  };

  const playNext = () => {
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
      setQueue(queue.slice(1));
    }
  };

  const handleShare = () => {
  const shareLink = `${window.location.origin}/creator/${creatorId}`;
  navigator.clipboard.writeText(shareLink).then(
    () => toast.success("Link copied!"),
    () => toast.error("Failed to copy link.")
  );
};
return (
    <>
      <div
        className="min-h-screen bg-[#0d0d14] text-slate-200"
      >
        <Appbar />
        <div className="max-w-7xl mx-auto px-4 pb-20 pt-5">

          {/* ── Header ── */}
          <div className="relative flex flex-col items-center gap-2 pt-16 pb-6">
            <button
              onClick={handleShare}
              className="absolute right-0 top-16 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg
                bg-indigo-500/10 border border-indigo-500/30 text-indigo-400
                text-xs font-semibold hover:bg-indigo-500/20 transition-colors cursor-pointer"
            >
              <ShareIcon /> Share
            </button>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent"
            >
              Song{" "}
              <span className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">
              Voting Queue
              </span>
            </h1>
            <p className="text-[13px] text-white/40 text-center max-w-xs leading-relaxed">         
              Vote for the next song on the stream. Submit your favorites and let the community decide!
            </p>
          </div>

          {/* ── Two Column Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* ── LEFT: Upcoming Songs ── */}
            <div>
              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-[11px] font-bold tracking-[1.6px] uppercase text-white/30">
                  Upcoming Songs
                </p>
                <span className="text-[11px] text-white/30 bg-white/[0.055] px-2.5 py-0.5 rounded-full">
                  {queue.length} songs
                </span>
              </div>

              {queue.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-white/20 border border-dashed border-white/[0.08] rounded-xl">
                  Queue is empty — be the first to submit a song!
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {queue.map((video, i) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl
                        bg-white/[0.03] border border-white/[0.065]
                        hover:bg-white/[0.055] transition-colors"
                    >
                      {/* Rank badge */}
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0
                          ${i === 0
                            ? "bg-gradient-to-br from-indigo-500 to-indigo-400 text-white"
                            : i === 1
                            ? "bg-indigo-500/30 text-indigo-300"
                            : "bg-white/[0.07] text-white/40"
                          }`}
                      >
                        {i + 1}
                      </div>

                      {/* Thumbnail */}
                      <img
                        className="w-14 h-9 rounded-md object-cover shrink-0 bg-white/[0.06]"
                        src={video.smallImg || "/placeholder.svg?height=36&width=56"}
                        alt={`Thumbnail for ${video.title}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg?height=36&width=56";
                        }}
                      />

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-200 truncate">
                          {video.title}
                        </p>
                      </div>

                      {/* Vote controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleVote(video.id, video.haveUpvoted ? false : true)}
                          title={video.haveUpvoted ? "Remove upvote" : "Upvote"}
                          className={`p-1.5 rounded transition-colors cursor-pointer
                            ${video.haveUpvoted
                              ? "text-indigo-400 bg-indigo-500/10"
                              : "text-white/30 hover:text-indigo-400 hover:bg-white/[0.06]"
                            }`}
                        >
                          {video.haveUpvoted ? <ChevronDown /> : <ChevronUp />}
                        </button>
                        <span
                          className={`text-[13px] font-bold min-w-[20px] leading-none
                            ${video.haveUpvoted ? "text-indigo-400" : "text-slate-400"}`}
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {video.upvotes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Submit + Now Playing ── */}
            <div className="flex flex-col gap-6">

              {/* Submit a Song */}
              <div>
                <p className="mb-2.5 text-[11px] font-bold tracking-[1.6px] uppercase text-white/30">
                  Submit a Song
                </p>
                <div className="bg-white/[0.035] border border-white/[0.075] rounded-xl p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="flex gap-2.5">
                      <div className="flex flex-1 items-center gap-2 bg-black/30 border border-white/[0.09] rounded-lg px-3">
                        <LinkIcon />
                        <input
                          type="text"
                          placeholder="Paste YouTube link here…"
                          value={inputLink}
                          onChange={(e) => setInputLink(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-slate-200
                            placeholder:text-white/25 text-[13px] py-2.5"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                      </div>
                      <button
                        disabled={loading}
                        type="submit"
                        className="px-4 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700
                          text-white text-[13px] font-bold whitespace-nowrap cursor-pointer
                          shadow-[0_2px_14px_rgba(99,102,241,0.38)] hover:opacity-90 transition-opacity
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Loading..." : "+ Add to Queue"}
                      </button>
                    </div>
                  </form>

                  {/* Preview thumbnail */}
                  {inputLink && !loading && (
                    <Card className="mt-3 rounded-lg overflow-hidden border border-indigo-500/20 bg-black/30">
                      <CardContent className="p-4">
                        <LiteYouTubeEmbed title="" id={getId(inputLink)} />
                      </CardContent>
                      <p className="py-2 text-xs text-white/35 text-center">Video Preview</p>
                    </Card>
                  )}
                </div>
              </div>

              {/* Now Playing */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="animate-live-pulse inline-block w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                  <p className="text-[11px] font-bold tracking-[1.6px] uppercase text-white/30">
                    Now Playing
                  </p>
                </div>

                <div className="bg-white/[0.025] border border-white/[0.07] rounded-2xl overflow-hidden">
                  {currentVideo ? (
                    <>
                      <div className="relative pt-[56.25%]">
                        <iframe
                          src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
                          className="absolute inset-0 w-full h-full border-none"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Now Playing"
                        />
                      </div>
                      <div className="px-4 py-3.5">
                        <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-white/30 mb-1">
                          Current Playing Song
                        </p>
                        <p className="text-[15px] font-bold text-slate-200">{currentVideo.title}</p>
                      </div>
                    </>
                  ) : (
                    <p className="py-14 text-center text-[13px] text-white/20">
                      No video playing — add one to the queue!
                    </p>
                  )}
                </div>

                <button
                  onClick={playNext}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                    bg-indigo-500/10 border border-indigo-500/25 text-indigo-400
                    text-[13px] font-semibold hover:bg-indigo-500/20 transition-colors cursor-pointer"
                >
                  <PlayIcon /> Play Next
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}