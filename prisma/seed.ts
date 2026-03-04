import slugify from "slugify";
import { prisma } from "../src/lib/db";

const titles = [
    "Vi testar se om vi kan seeda databasen",
    "Det här borde fungera tror jag",
    "Men är ute på outforskat vatten",
    "Hoppas det inte kraschar",
];

async function main() {
    await prisma.post.createMany({

        // Make sure to set this to avoid errors if you run the seed multiple times
        skipDuplicates: true,

        // Seed data for posts
        data: titles.map((title) => ({
            title,
            slug: slugify(title, { lower: true }),
            summary: `Min ${title} är bäst i världen.`,
            htmlContent: `<p>HTML content för <b>${title}</b>, det ser ju <br>bra ut</p>`,
            published: true,
            publishDate: new Date(),
        })),
    });
}

main();
