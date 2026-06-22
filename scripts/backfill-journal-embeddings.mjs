import { MongoClient } from "mongodb";
import OpenAI from "openai";

const mongoUri = process.env.MONGODB_URI;
const apiKey = process.env.OPENAI_API_KEY;

if (!mongoUri || !apiKey) {
  throw new Error("MONGODB_URI and OPENAI_API_KEY must be configured before backfilling embeddings.");
}

const client = new MongoClient(mongoUri);
const openai = new OpenAI({ apiKey });

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  return response.data[0].embedding;
}

try {
  await client.connect();
  const users = client.db(process.env.MONGODB_DB || "lilly_db").collection("users");
  let embeddedCount = 0;

  for await (const user of users.find({ "journals.0": { $exists: true } })) {
    let changed = false;
    const journals = await Promise.all((user.journals || []).map(async (journal) => {
      if (Array.isArray(journal.embedding) && journal.embedding.length > 0) return journal;

      changed = true;
      embeddedCount += 1;
      const embedding = await getEmbedding(`${journal.title || "Untitled entry"}\n\n${journal.content || ""}`);
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { ...journal, embedding };
    }));

    if (changed) {
      await users.updateOne({ _id: user._id }, { $set: { journals } });
    }
  }

  console.log(`Backfill complete: embedded ${embeddedCount} journal entries.`);
} finally {
  await client.close();
}
