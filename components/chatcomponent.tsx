import { useChat } from "ai/react";
import { Badge } from "./ui/badge";
import Messages from "./messages";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Send } from "lucide-react";
import Markdown from './markdown';

type Props = {
  reportData: string;
};

const ChatComponent = ({ reportData }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat({
    api: "api/medichatgemini",
    body: {
      reportData: reportData,
    },
  });

  return (
    <div className="relative flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <Badge variant="outline" className="w-fit">
        {reportData ? "✓ Report Added" : "No Report Added"}
      </Badge>

      <div className="flex-1 overflow-y-auto pr-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-4">
              <div className="size-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Welcome to MediDrill AI</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Upload your medical report and start asking questions. I can help you understand your reports in both English and Bengali.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Messages messages={messages} isLoading={isLoading} />
        )}
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-background from-50% pt-6">
        <form 
          onSubmit={handleSubmit} 
          className="flex gap-2"
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your medical report..."
            className="min-h-12 resize-none rounded-xl border bg-background p-3 shadow-none focus-visible:ring-1"
            rows={1}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !reportData}
            className="h-12 w-12 shrink-0 rounded-xl"
          >
            {isLoading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
            ) : (
              <Send className="size-5" />
            )}
          </Button>
        </form>
      </div>

      {data?.retrievals && (
        <Accordion type="single" className="text-sm" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xs text-muted-foreground">View Related Clinical Findings</AccordionTrigger>
            <AccordionContent>
              <Markdown text={data.retrievals} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default ChatComponent;