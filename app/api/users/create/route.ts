import { NextResponse } from "next/server";
import { insertUser } from "../../../../lib/users/insert";

import { User } from "../../../../lib/users/types";

export async function POST(request: Request) {
  try {
    await insertUser(user);
    const user: User = await request.json();

    return NextResponse.json({ message: "Product inserted successfully" });
  } catch (error) {
    console.error("Database insertion failed:", error);
    return NextResponse.json(
      { error: "Database insertion failed", details: error.message },
      { status: 500 }
    );
  }
}
