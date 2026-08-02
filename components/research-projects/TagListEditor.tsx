"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TagListEditorProps {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
}

export default function TagListEditor({ items, onChange, placeholder = "Type and press Enter" }: TagListEditorProps) {
    const [input, setInput] = useState("");

    const handleAdd = () => {
        const value = input.trim();
        if (value && !items.includes(value)) {
            onChange([...items, value]);
            setInput("");
        }
    };

    const handleRemove = (item: string) => {
        onChange(items.filter((i) => i !== item));
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    className="h-12 border-2 focus:border-blue-500 transition-all"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                />
                <Button type="button" onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 h-12 px-6">
                    Add
                </Button>
            </div>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg border-2 border-blue-100">
                    {items.map((item, idx) => (
                        <Badge key={idx} className="px-3 py-2 bg-white border-2 border-blue-200 text-blue-800 hover:bg-blue-100 transition-all text-sm">
                            {item}
                            <button type="button" className="ml-2 text-red-500 hover:text-red-700 font-bold" onClick={() => handleRemove(item)}>
                                ×
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
