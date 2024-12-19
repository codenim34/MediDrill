"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Bot,
  CircleAlert,
  CircleAlertIcon,
  DoorClosedIcon,
  FileCheck2,
  LucideCircleAlert,
  OctagonAlert,
  Plus,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { ModeToggle } from "@/components/modetoggle";
import { useState } from "react";
import { useChat } from "ai/react";
import ReportComponent from "@/components/ReportComponent";
// import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast"
import ChatComponent from "@/components/chatcomponent";

const Home = () => {
  const { toast } = useToast()

  const [reportData, setreportData] = useState("");
  const onReportConfirmation = (data: string) => {
    setreportData(data);
    toast({
      description: "Updated!"
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b border-border/40 px-4">
          <div className="container mx-auto flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">🩺</span>
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                MediDrill
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Settings />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[80vh]">
                  <ReportComponent onReportConfirmation={onReportConfirmation} />
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto flex-1 p-4 grid gap-6 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] xl:gap-8">
          <div className="hidden md:block">
            <div className="sticky top-[5rem] space-y-4">
              <ReportComponent onReportConfirmation={onReportConfirmation} />
            </div>
          </div>
          <div className="min-h-[calc(100vh-10rem)] rounded-xl border bg-card p-4 shadow-sm">
            <ChatComponent reportData={reportData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
