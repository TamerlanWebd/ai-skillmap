import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { userId } = getAuth(request as any);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const docRef = db.collection("skillmaps").doc(userId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return NextResponse.json(docSnap.data(), { status: 200 });
    } else {
      return NextResponse.json({ nodes: [], edges: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("[SKILLMAP_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request as any);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { nodes, edges } = body;

    if (!nodes || !edges) {
      return new NextResponse("Missing nodes or edges data", { status: 400 });
    }

    const docRef = db.collection("skillmaps").doc(userId);
    await docRef.set({ nodes, edges, updatedAt: new Date() });

    return new NextResponse("Skillmap saved successfully", { status: 200 });
  } catch (error) {
    console.error("[SKILLMAP_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
