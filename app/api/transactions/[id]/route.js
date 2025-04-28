import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  const client = await clientPromise;
  const db = client.db("finance");
  const id = params.id;
  await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
  return new Response(JSON.stringify({ message: "Deleted" }));
}

export async function PUT(req, { params }) {
  const client = await clientPromise;
  const db = client.db("finance");
  const id = params.id;
  const body = await req.json();
  await db.collection("transactions").updateOne({ _id: new ObjectId(id) }, { $set: body });
  return new Response(JSON.stringify({ message: "Updated" }));
}
