// app/api/downloads/route.ts
import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("watchwingai");
    const collection = db.collection("stats");

    // Find the counter doc
    const counter = await collection.findOne({ name: "downloads" });

    return NextResponse.json({ count: counter?.count || 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("watchwingai");
    const collection = db.collection("stats");

    // Increment or create new
    const result = await collection.findOneAndUpdate(
      { name: "downloads" },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ count: result?.count || 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update count" },
      { status: 500 }
    );
  }
}
