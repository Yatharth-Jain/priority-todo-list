import { TasksDB } from "@/lib/mongodbClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await TasksDB.collection("tasks").find().toArray();
    return NextResponse.json({
      message: "data Fetched",
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

export async function POST(req: Request) {
  try {
    const body: Omit<TaskType, "_id"> = await req.json();
    body.created_at = new Date().getTime();
    const data = await TasksDB.collection("tasks").insertOne({ ...body });
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
