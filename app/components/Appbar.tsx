"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import {Radio} from "lucide-react";
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Appbar() {
    const session = useSession();
    return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Radio className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">StreamSync</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {session.data?.user && <Button variant="ghost" size="sm" onClickCapture={()=> signOut()}> LogOut</Button>}
              {!session.data?.user && <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => signIn()}> SignIn </Button>}
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => signIn()}>Get Started</Button>
            </div>
          </div>
        </div>
    </nav>
    )
}
