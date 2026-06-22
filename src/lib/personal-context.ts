import connectToDatabase from "@/lib/mongodb";
import { cosineSimilarity, getEmbedding } from "@/lib/embeddings";
import User from "@/models/user";

interface StoredJournal {
  title?: string;
  content?: string;
  embedding?: number[];
  createdAt?: Date | string;
}

interface StoredMood {
  mood?: string;
  emotion?: string;
  note?: string;
  date?: Date | string;
}

interface RelevantJournal {
  title: string;
  content: string;
  date: string;
  score: number;
}

interface UserContextDocument {
  journals?: StoredJournal[];
  moodboard?: StoredMood[];
}

function formatDate(value: Date | string | undefined) {
  return value ? new Date(value).toLocaleDateString() : "Unknown date";
}

export async function getPersonalContext(userId: string, query: string) {
  await connectToDatabase();
  const user = await User.findById(userId).select("+journals.embedding").lean() as UserContextDocument | null;

  if (!user) {
    throw new Error("User not found");
  }

  const journals = (user.journals || []) as StoredJournal[];
  const journalsWithEmbeddings = journals
    .filter((journal) => journal.content && Array.isArray(journal.embedding) && journal.embedding.length > 0)
    .slice(-100);

  let relevantJournals: RelevantJournal[] = [];
  if (journalsWithEmbeddings.length > 0) {
    const queryEmbedding = await getEmbedding(query);
    relevantJournals = journalsWithEmbeddings
      .map((journal) => ({
        title: journal.title || "Untitled entry",
        content: journal.content || "",
        date: formatDate(journal.createdAt),
        score: cosineSimilarity(queryEmbedding, journal.embedding || []),
      }))
      .sort((first, second) => second.score - first.score)
      .slice(0, 3);
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentMoods = ((user.moodboard || []) as StoredMood[])
    .filter((entry) => entry.date && new Date(entry.date) >= sevenDaysAgo)
    .sort((first, second) => new Date(second.date || 0).getTime() - new Date(first.date || 0).getTime());

  return { relevantJournals, recentMoods };
}

export function buildPersonalContextBlock(
  relevantJournals: RelevantJournal[],
  recentMoods: StoredMood[]
) {
  const sections: string[] = [];

  if (relevantJournals.length > 0) {
    const journals = relevantJournals.map((entry, index) => (
      `${index + 1}. [${entry.date}] ${entry.title}\n   "${entry.content.slice(0, 600)}"`
    ));
    sections.push(`RELEVANT PRIVATE JOURNAL ENTRIES:\n${journals.join("\n\n")}`);
  }

  if (recentMoods.length > 0) {
    const moods = recentMoods.map((entry) => {
      const description = entry.emotion ? `${entry.mood} (${entry.emotion})` : entry.mood || "Unspecified mood";
      return `${description} — ${formatDate(entry.date)}${entry.note ? `: ${entry.note.slice(0, 180)}` : ""}`;
    });
    sections.push(`RECENT MOOD HISTORY (last 7 days):\n${moods.join("\n")}`);
  }

  return sections.join("\n\n");
}
