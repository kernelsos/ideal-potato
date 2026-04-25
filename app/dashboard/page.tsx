import { getServerSession } from "next-auth";
import StreamView from "../components/StreamView";
import { prismaClient } from "../lib/db";
import { redirect } from "next/navigation";

export default async function Component() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prismaClient.user.findFirst({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  return <StreamView creatorId={user.id} playVideo={true} />;
}