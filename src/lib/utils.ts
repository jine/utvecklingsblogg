export function formatDate(date: Date | null | undefined): string {
    if (!date) return "";

    return date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
