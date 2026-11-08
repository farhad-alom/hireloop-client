import { MongoClient } from "mongodb"

// Temporary test route. Open /api/db-check in the browser, then delete this file.
export async function GET() {
  const uri = process.env.MONGODB_URI?.trim()

  if (!uri) {
    return Response.json({ ok: false, error: "MONGODB_URI is missing" }, { status: 500 })
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 })

  try {
    await client.connect()
    const result = await client
      .db("hireloop-db")
      .collection("connection_test")
      .insertOne({ createdAt: new Date() })

    return Response.json({ ok: true, insertedId: String(result.insertedId) })
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
