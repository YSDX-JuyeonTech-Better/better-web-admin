import swaggerDocument from "../../../swagger";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(swaggerDocument, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
