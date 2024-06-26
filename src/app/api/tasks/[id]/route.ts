import { TasksDB } from "@/lib/mongodbClient";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: any) {
  const {
    params: { id },
  } = context;
  try {
    const body = await req.json();
    const data = await TasksDB.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    return NextResponse.json({
      message: "Task Created",
      data,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
      },
      {
        status: 404,
      }
    );
  }
}
