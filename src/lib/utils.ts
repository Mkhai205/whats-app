import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IMessage } from "./type";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date_ms: number) {
    // Convert to Date object directly
    const date_obj = new Date(date_ms);

    // Get current date and time
    const current_date = new Date();
    current_date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    const current_time = current_date.getTime();

    // Get the date part of the provided date
    const provided_date = new Date(date_obj);
    provided_date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    // Check if it's today
    if (provided_date.getTime() === current_time) {
        return date_obj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    // Check if it's yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    if (provided_date.getTime() === yesterday.getTime()) {
        return "Yesterday";
    }

    // Check if it's within the past week (2-7 days ago)
    const days_diff = Math.floor((current_time - provided_date.getTime()) / (1000 * 60 * 60 * 24));
    if (days_diff >= 2 && days_diff <= 7) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[provided_date.getDay()];
    }

    // If none of the above conditions match, return in MM/DD/YYYY format
    return (
        provided_date.getMonth() +
        1 +
        "/" +
        provided_date.getDate() +
        "/" +
        provided_date.getFullYear()
    );
}

export const getTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

export const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

export const getRelativeDateTime = (message: IMessage, previousMessage: IMessage | undefined) => {
    const today = new Date();
    const yesterday = new Date(today.getDate() - 1);
    const lastWeek = new Date(today.getDate() - 7);

    const messageDate = new Date(message._creationTime);

    if (!previousMessage) {
        if (isSameDay(messageDate.getTime(), today.getTime())) {
            return "Today";
        } else if (isSameDay(messageDate.getTime(), yesterday.getTime())) {
            return "Yesterday";
        } else if (messageDate.getTime() > lastWeek.getTime()) {
            const options: Intl.DateTimeFormatOptions = {
                weekday: "long",
            };
            return messageDate.toLocaleDateString(undefined, options);
        } else {
            const options: Intl.DateTimeFormatOptions = {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            };
            return messageDate.toLocaleDateString(undefined, options);
        }
    }
};

export function randomID(len: number) {
    let result = "";
    const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
    const maxPos = chars.length;
    len = len || 5;
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}
