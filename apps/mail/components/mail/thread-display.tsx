import {
  Archive,
  ArchiveX,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

import { MoreVerticalIcon } from "../icons/animated/more-vertical";
import { useState, useEffect, useCallback, useRef } from "react";
import { ArchiveIcon } from "../icons/animated/archive";
import { ExpandIcon } from "../icons/animated/expand";
import { MailDisplaySkeleton } from "./mail-skeleton";
import { Button } from "@/components/ui/button";
import { useThread } from "@/hooks/use-threads";
import { XIcon } from "../icons/animated/x";
import ReplyCompose from "./reply-composer";
import MailDisplay from "./mail-display";
import { useMail } from "./use-mail";
import { cn } from "@/lib/utils";
import React from "react";
import { ReplyIcon } from "../icons/animated/reply";

interface ThreadDisplayProps {
  mail: any;
  onClose?: () => void;
  isMobile?: boolean;
}

export function ThreadDemo({ mail: emailData, onClose, isMobile }: ThreadDisplayProps) {
  const isFullscreen = false;

  return (
    <div
      className={cn(
        "flex flex-col",
        isFullscreen ? "h-screen" : isMobile ? "h-full" : "h-[calc(100vh-2rem)]",
      )}
    >
      <div
        className={cn(
          "bg-offsetLight dark:bg-offsetDark relative flex flex-col overflow-hidden transition-all duration-300",
          isMobile ? "h-full" : "h-full",
          !isMobile && !isFullscreen && "rounded-r-lg",
          isFullscreen ? "fixed inset-0 z-50" : "",
        )}
      >
        <div className="flex flex-shrink-0 items-center border-b p-2">
          <div className="flex flex-1 items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!emailData}>
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!emailData}>
                  {isFullscreen ? (
                    <ExpandIcon className="h-4 w-4" />
                  ) : (
                    <ExpandIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!emailData}>
                  <ArchiveIcon className="h-4 w-4 relative top-0.5" />
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!emailData}>
                  <ReplyIcon className="h-4 w-4" />
                  <span className="sr-only">Reply</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!emailData}>
                  <MoreVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ArchiveX className="mr-2 h-4 w-4" /> Move to spam
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ReplyAll className="mr-2 h-4 w-4" /> Reply all
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="mr-2 h-4 w-4" /> Forward
                </DropdownMenuItem>
                <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                <DropdownMenuItem>Add label</DropdownMenuItem>
                <DropdownMenuItem>Mute thread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1" type="scroll">
            <div className="pb-4">
              {[...(emailData || [])].reverse().map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "transition-all duration-200",
                    index > 0 && "border-border border-t",
                  )}
                >
                  <MailDisplay
                    demo
                    emailData={message}
                    isFullscreen={isFullscreen}
                    isMuted={false}
                    isLoading={false}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="relative top-1 flex-shrink-0">
            <ReplyCompose emailData={emailData} isOpen={false} setIsOpen={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreadActionButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  className,
}: {
  icon: React.ComponentType<React.ComponentPropsWithRef<any>> & {
    startAnimation?: () => void;
    stopAnimation?: () => void;
  };
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const iconRef = useRef<any>(null);

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="ghost"
      className={cn("md:h-fit md:px-2", className)}
      onMouseEnter={() => iconRef.current?.startAnimation?.()}
      onMouseLeave={() => iconRef.current?.stopAnimation?.()}
    >
      <Icon ref={iconRef} className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export function ThreadDisplay({ mail, onClose, isMobile }: ThreadDisplayProps) {
  const [, setMail] = useMail();
  const { data: emailData, isLoading } = useThread(mail ?? "");
  const [isMuted, setIsMuted] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const moreVerticalIconRef = useRef<any>(null);

  useEffect(() => {
    if (emailData?.[0]) {
      setIsMuted(emailData[0].unread ?? false);
    }
  }, [emailData]);

  const handleClose = useCallback(() => {
    onClose?.();
    setMail((m) => ({ ...m, selected: null }));
  }, [onClose, setMail]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  if (isLoading || !emailData)
    return (
      <div
        className={cn(
          "flex flex-col",
          isFullscreen ? "h-screen" : isMobile ? "h-full" : "h-[calc(100vh-2rem)]",
        )}
      >
        <div
          className={cn(
            "bg-offsetLight dark:bg-offsetDark relative flex flex-col overflow-hidden transition-all duration-300",
            isMobile ? "h-full" : "h-full",
            !isMobile && !isFullscreen && "rounded-r-lg",
            isFullscreen ? "fixed inset-0 z-50" : "",
          )}
        >
          <div className="flex flex-shrink-0 items-center border-b px-1 pb-1 md:px-3 md:pb-2 md:pt-[10px]">
            <div className="flex flex-1 items-center">
              <ThreadActionButton icon={XIcon} label="Close" onClick={handleClose} />
            </div>
            <div className="flex items-center gap-1 sm:gap-2 md:gap-6">
              <ThreadActionButton
                icon={isFullscreen ? ExpandIcon : ExpandIcon}
                label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
              
              <ThreadActionButton
                icon={ArchiveIcon}
                label="Archive"
                disabled={true}
                className="relative top-0.5"
              />
              
              <ThreadActionButton
                icon={ReplyIcon}
                label="Reply"
                disabled={true}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0 md:h-fit md:w-auto md:px-2" 
                    disabled={true}
                  >
                    <MoreVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ArchiveX className="mr-2 h-4 w-4" /> Move to spam
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ReplyAll className="mr-2 h-4 w-4" /> Reply all
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="mr-2 h-4 w-4" /> Forward
                  </DropdownMenuItem>
                  <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem>Add label</DropdownMenuItem>
                  <DropdownMenuItem>Mute thread</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <ScrollArea className="h-full flex-1" type="auto">
              <div className="pb-4">
                <MailDisplaySkeleton isFullscreen={isFullscreen} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={cn(
        "flex flex-col",
        isFullscreen ? "h-screen" : isMobile ? "h-full" : "h-[calc(100vh-2rem)]",
      )}
    >
      <div
        className={cn(
          "bg-offsetLight dark:bg-offsetDark relative flex flex-col overflow-hidden transition-all duration-300",
          isMobile ? "h-full" : "h-full",
          !isMobile && !isFullscreen && "rounded-r-lg",
          isFullscreen ? "fixed inset-0 z-50" : "",
        )}
      >
        <div className="flex flex-shrink-0 items-center border-b px-1 pb-1 md:px-3 md:pb-2 md:pt-[10px]">
          <div className="flex flex-1 items-center">
            <ThreadActionButton
              icon={XIcon}
              label="Close"
              disabled={!emailData}
              onClick={handleClose}
            />
          </div>
          <div className="flex items-center md:gap-6">
            <ThreadActionButton
              icon={isFullscreen ? ExpandIcon : ExpandIcon}
              label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              disabled={!emailData}
              onClick={() => setIsFullscreen(!isFullscreen)}
            />
            <ThreadActionButton
              icon={ArchiveIcon}
              label="Archive"
              disabled={!emailData}
              className="relative top-0.5"
            />
            <ThreadActionButton
              icon={ReplyIcon}
              label="Reply"
              disabled={!emailData}
              onClick={() => setIsReplyOpen(true)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:h-fit md:px-2"
                  disabled={!emailData}
                  onMouseEnter={() => moreVerticalIconRef.current?.startAnimation?.()}
                  onMouseLeave={() => moreVerticalIconRef.current?.stopAnimation?.()}
                >
                  <MoreVerticalIcon ref={moreVerticalIconRef} className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ArchiveX className="mr-2 h-4 w-4" /> Move to spam
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ReplyAll className="mr-2 h-4 w-4" /> Reply all
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="mr-2 h-4 w-4" /> Forward
                </DropdownMenuItem>
                <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                <DropdownMenuItem>Add label</DropdownMenuItem>
                <DropdownMenuItem>Mute thread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ScrollArea className="h-full flex-1" type="auto">
            <div className="pb-4">
              {[...(emailData || [])].reverse().map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "transition-all duration-200",
                    index > 0 && "border-border border-t",
                  )}
                >
                  <MailDisplay
                    emailData={message}
                    isFullscreen={isFullscreen}
                    isMuted={isMuted}
                    isLoading={isLoading}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="relative top-1 flex-shrink-0">
            <ReplyCompose emailData={emailData} isOpen={isReplyOpen} setIsOpen={setIsReplyOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

<style jsx global>{`
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`}</style>;
