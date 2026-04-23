import StreamView from "@/app/components/StreamView";


export default async function Page({ params }: { params: Promise<{ creatorId: string }> }) {
  const { creatorId } = await params;
  return (
    <div>
      <StreamView creatorId={creatorId} playVideo={false} />
    </div>
  );
}