import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music, Radio, Users, Zap, PlayCircle, Headphones } from "lucide-react"
import Link from "next/link"
import { Appbar } from "./components/Appbar"
import { Redirect } from "./components/Redirect"


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Appbar/>
      <Redirect/>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,60,200,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(60,100,200,0.08),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">Interactive Live Streaming</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight text-balance">
              Let Your Fans
              <br />
              <span className="text-accent">Choose the Music</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-balance max-w-2xl mx-auto">
              Transform your live streams with real-time fan interaction. Give your audience the power to select tracks and create unforgettable streaming moments together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-12">
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Streaming Free
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12 bg-transparent">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
              <div className="aspect-[16/9] bg-gradient-to-br from-accent/20 via-background to-background p-8 flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                  {/* Streaming Interface */}
                  <Card className="p-6 bg-card/80 backdrop-blur border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Radio className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">Live Now</p>
                        <p className="text-sm text-muted-foreground">2.4K viewers</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-accent/30 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-2/3 rounded-full animate-pulse" />
                      </div>
                      <p className="text-sm text-muted-foreground">Currently Playing: Midnight Dreams</p>
                    </div>
                  </Card>

                  {/* Fan Selection */}
                  <Card className="p-6 bg-card/80 backdrop-blur border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-accent" />
                      <p className="font-semibold">Fan Requests</p>
                    </div>
                    <div className="space-y-2">
                      {['Electric Pulse', 'Neon Dreams', 'Digital Wave'].map((track, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{track}</span>
                          </div>
                          <span className="text-xs text-accent font-medium">+{12 - i * 3}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Three simple steps to revolutionize your live streaming experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Setup Your Stream",
                description: "Connect StreamSync to your preferred streaming platform. Configure your music library and preferences in minutes.",
                icon: Radio,
              },
              {
                number: "02",
                title: "Fans Vote on Tracks",
                description: "Your audience browses your curated playlist and votes for their favorite songs in real-time during your stream.",
                icon: Users,
              },
              {
                number: "03",
                title: "Music Plays Live",
                description: "The most requested tracks automatically queue up and play, creating an interactive experience everyone loves.",
                icon: Headphones,
              },
            ].map((step, i) => (
              <Card key={i} className="p-8 bg-card border-border hover:border-accent/50 transition-colors">
                <div className="text-5xl font-bold text-muted-foreground/20 mb-4">{step.number}</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
                Elevate Your Streaming Experience
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                StreamSync transforms passive viewers into active participants, creating deeper connections between creators and their communities.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Boost Engagement",
                    description: "Keep viewers invested and participating throughout your entire stream with interactive music selection.",
                    icon: Zap,
                  },
                  {
                    title: "Build Community",
                    description: "Foster stronger bonds as fans collaborate on creating the perfect soundtrack for your content.",
                    icon: Users,
                  },
                  {
                    title: "Stay in Control",
                    description: "Maintain full creative control with custom playlists, filters, and moderation tools.",
                    icon: Radio,
                  },
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Music className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Average Engagement</p>
                        <p className="text-2xl font-bold text-accent">+156%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Watch Time Increase</p>
                        <p className="text-2xl font-bold text-accent">+89%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Headphones className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Active Participants</p>
                        <p className="text-2xl font-bold text-accent">78%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-accent/10 via-accent/5 to-background border-accent/20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
              Ready to Transform Your Streams?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Join thousands of creators who are building stronger communities through interactive music experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-12">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12 bg-transparent">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">No credit card required • Free for 14 days</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Support</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <Radio className="h-5 w-5 text-primary" />
              <span className="font-bold">StreamSync</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 StreamSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
