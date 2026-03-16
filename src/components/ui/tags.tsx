import type { Tag } from "@/generated/prisma";
import { ucfirst } from "@/lib/utils";

export function Tags({ tags }: { tags: Tag[] }) {
    if (!tags.length) return null;
    return (
        <>
            {tags.map((tag) => (
                <span
                    key={tag.id}
                    className="inline-block px-2 py-0.5 mr-1 rounded bg-primary text-white text-xs"
                >
                    {ucfirst(tag.name)}
                </span>
            ))}
        </>
    );
}
