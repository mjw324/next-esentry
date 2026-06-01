import { NextRequest } from "next/server";
import { forwardInsights } from "../_forward";

export async function POST(req: NextRequest) {
  return forwardInsights(req, "calibrate");
}
