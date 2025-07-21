import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, UserType } from "@/lib/type";
import { getTime } from "@/lib/utils";
import { useConversationStore } from "@/store/chat-store";
import ChatBubbleAvatar from "./chat-bubble-avertar";
import DateIndicator from "./date_indicator";

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

    if (!fromMe) {
        return (
            <>
                <DateIndicator message={message} previousMessage={previousMessage} />
                <div className="flex gap-1 w-3/5">
                    <ChatBubbleAvatar message={message} isMember={isMember} isGroup={isGroup} />
                    <div
                        className={`relative flex flex-col min-w-24 max-w-fit px-2 pt-1 rounded-md shadow-md z-20 ${bgClass}`}
                    >
                        <OtherMessageIndicator />
                        <TextMessage message={message} />
                        <MessageTime time={time} fromMe={fromMe} />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <DateIndicator message={message} previousMessage={previousMessage} />
            <div className="flex gap-1 w-3/5 ml-auto">
                <div
                    className={`relative flex flex-col min-w-24 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto z-20 ${bgClass}`}
                >
                    <SelfMessageIndicator />
                    <TextMessage message={message} />
                    <MessageTime time={time} fromMe={fromMe} />
                </div>
            </div>
        </>
    );
}

const OtherMessageIndicator = () => (
    <div className="absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full" />
);

const SelfMessageIndicator = () => (
    <div className="absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden" />
);

const TextMessage = ({ message }: { message: IMessage }) => {
    const words = message.content.split(" ");

    return (
        <p className={`mr-2 text-sm font-light whitespace-pre-wrap break-words`}>
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

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
    return (
        <p className="text-[10px] mt-2 self-end flex gap-1 items-center">
            {time} {fromMe && <MessageSeenSvg />}
        </p>
    );
};
