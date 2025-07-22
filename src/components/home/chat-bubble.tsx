"use client";

import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, UserType } from "@/lib/type";
import { getTime } from "@/lib/utils";
import { useConversationStore } from "@/store/chat-store";
import ChatBubbleAvatar from "./chat-bubble-avertar";
import DateIndicator from "./date_indicator";
import ReactPlayer from "react-player";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import ChatAvatarAction from "./chat-avatar-action";

type ChatBubbleProps = {
    previousMessage: IMessage | undefined;
    message: IMessage;
    me: UserType | undefined;
};

export default function ChatBubble({ previousMessage, message, me }: ChatBubbleProps) {
    const { selectedConversation } = useConversationStore();
    const isGroup = !!selectedConversation?.isGroup;
    const isMember = !!selectedConversation?.participants.includes(message.sender._id);
    const fromMe = message.sender._id === me?._id;
    const bgClass = fromMe ? "bg-green-chat" : "bg-white dark:bg-gray-primary";
    const time = getTime(message._creationTime);

    const [open, setOpen] = useState(false);

    const renderMessageContent = useCallback(() => {
        switch (message.messageType) {
            case "text":
                return <TextMessage message={message} />;
            case "image":
                return <ImageMessage message={message} handleOnClick={() => setOpen(true)} />;
            case "video":
                return <VideoMessage message={message} />;
            default:
                return null;
        }
    }, [message]);

    if (!fromMe) {
        return (
            <>
                <DateIndicator message={message} previousMessage={previousMessage} />
                <div className="flex gap-1 w-3/5">
                    <ChatBubbleAvatar message={message} isMember={isMember} isGroup={isGroup} />
                    <div className="flex flex-col justify-end gap-1">
                        {isGroup && <ChatAvatarAction message={message} me={me} />}
                        <div
                            className={`relative flex flex-col min-w-24 max-w-fit rounded-md shadow-md z-20 ${bgClass}`}
                        >
                            {renderMessageContent()}
                        </div>
                        <MessageTime time={time} fromMe={fromMe} />
                    </div>
                </div>
                {open && (
                    <ImageDialog src={message.content} onClose={() => setOpen(false)} open={open} />
                )}
            </>
        );
    }

    return (
        <>
            <DateIndicator message={message} previousMessage={previousMessage} />
            <div className="flex flex-col gap-1 w-3/5 ml-auto">
                <div
                    className={`relative flex flex-col min-w-24 max-w-fit rounded-md shadow-md ml-auto z-20 ${bgClass}`}
                >
                    {renderMessageContent()}
                </div>
                <MessageTime time={time} fromMe={fromMe} />
            </div>
            {open && (
                <ImageDialog src={message.content} onClose={() => setOpen(false)} open={open} />
            )}
        </>
    );
}

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
    return (
        <p className="text-[10px] self-end flex gap-1 items-center">
            {time} {fromMe && <MessageSeenSvg />}
        </p>
    );
};

const TextMessage = ({ message }: { message: IMessage }) => {
    const words = message.content.split(" ");

    return (
        <p className={`px-2 py-1 text-sm font-light whitespace-pre-wrap break-words`}>
            {words.map((word, index) => {
                const isUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(word); // Check if the individual word is a URL
                if (isUrl) {
                    return (
                        <span key={index}>
                            <a
                                href={word}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-blue-400 underline hover:text-blue-500 break-all`}
                            >
                                {word}
                            </a>
                            {index < words.length - 1 ? " " : ""}
                        </span>
                    );
                } else {
                    return word + (index < words.length - 1 ? " " : "");
                }
            })}
        </p>
    );
};

const VideoMessage = ({ message }: { message: IMessage }) => {
    return (
        <div className="max-w-[360px]">
            <ReactPlayer
                src={message.content}
                width="auto"
                height="360px"
                controls={true}
                light={true}
                className="rounded-md"
            />
        </div>
    );
};

const ImageMessage = ({
    message,
    handleOnClick,
}: {
    message: IMessage;
    handleOnClick: () => void;
}) => {
    return (
        <div className="max-w-[360px]" onClick={handleOnClick}>
            <Image
                alt="image"
                src={message.content}
                width={400}
                height={320}
                className="cursor-pointer object-cover rounded-md"
            />
        </div>
    );
};

const ImageDialog = ({
    src,
    onClose,
    open,
}: {
    open: boolean;
    src: string;
    onClose: () => void;
}) => {
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <DialogTitle></DialogTitle>
            <DialogContent className="!p-0 !rounded-md">
                <Image
                    alt="image"
                    src={src}
                    width={600}
                    height={480}
                    className="object-cover rounded-md"
                />
            </DialogContent>
        </Dialog>
    );
};
