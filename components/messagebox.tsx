import React from 'react'
import { cn } from '@/lib/utils'
import Markdown from './markdown'

type Props = {
  role: string,
  content: string
}

const MessageBox = ({ role, content }: Props) => {
  return (
    <div className={cn(
      "group relative mb-4 flex items-start gap-4 px-4",
      role === "user" ? "flex-row-reverse" : ""
    )}>
      <div className={cn(
        "size-8 rounded-lg flex items-center justify-center text-white",
        role === "user" ? "bg-primary" : "bg-secondary"
      )}>
        {role === "user" ? "👤" : "🤖"}
      </div>
      <div className={cn(
        "flex-1 space-y-4 overflow-hidden rounded-2xl px-4 py-3 transition-colors",
        role === "user" ? "bg-primary/10" : "bg-secondary/10"
      )}>
        <div className="prose prose-sm dark:prose-invert max-w-none font-bengali">
          <Markdown text={content} />
        </div>
      </div>
      {role !== "user" && (
        <div className="absolute bottom-0 left-12 right-4 h-px bg-border/50 transition-opacity group-hover:opacity-0" />
      )}
    </div>
  );
};

export default MessageBox