"use client";

import { UploadDropzone, UploadButton } from "@/lib/uploadthing"
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { buttonVariants } from "./ui/button";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
    const [fileType, setFileType] = useState("");

    useEffect(() => {
        if (!value) {
            setFileType("");
            return;
        }
    }, [value]);

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Uploaded image"
                    className={cn(endpoint === "serverImage" ? "rounded-full" : "")}
                />
                <button onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button">
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }
    
    if (value && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon 
                    className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                    <a 
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline truncate max-w-[200px]"
                    >
                        {value}
                    </a>
                <button onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button">
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }
    return (
        <div>
            <UploadDropzone 
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log(res);
                onChange(res?.[0]?.ufsUrl);
                
                const fileName = res?.[0]?.name || "";
                const fileType = fileName.split('.').pop()?.toLowerCase() || "";

                setFileType(fileType);
            }}
            onUploadError={(error: Error) => {
                console.log("Upload Error", error);
            }}
            appearance={{
                container: "",
                uploadIcon: "",
                label: "",
                allowedContent: "",
                button: cn(buttonVariants({ variant: "primary"})),
            }}
            />
        </div>
    );
}