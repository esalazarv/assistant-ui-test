import { streamText } from "ai";
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({
  apiUrl: process.env["LANGGRAPH_API_URL"]!,
  apiKey: process.env["LANGCHAIN_API_KEY"]!,
});



export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const streamResponse = client.runs.stream(
    null, // Threadless run
    "agent", // Assistant ID
    {
        input: {
            "messages": messages,
        },
        streamMode: "messages",
    }
);

  
return streamResponse

  // const result = streamText({
  //   model: openai("gpt-4o"),
  //   messages,
  //   system,
  //   tools: Object.fromEntries(
  //     Object.keys(tools).map((name) => [
  //       name,
  //       { ...tools[name], parameters: jsonSchema(tools[name].parameters) },
  //     ])
  //   ),
  // });

  //return streamResponse.next();
}


// import { NextRequest, NextResponse } from "next/server";
 
// export const runtime = "edge";
 
// function getCorsHeaders() {
//   return {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "*",
//   };
// }
 
// async function handleRequest(req: NextRequest, method: string) {
//   try {
//     const url = new URL(req.url);
//     const searchParams = new URLSearchParams(url.search);
//     searchParams.delete("_path");
//     searchParams.delete("nxtP_path");
 
//     const options: RequestInit = {
//       method,
//       headers: {
//         "x-api-key": process.env["LANGCHAIN_API_KEY"] || "",
//       },
//     };
 
//     if (["POST", "PUT", "PATCH"].includes(method)) {
//       options.body = await req.text();
//     }
 
//     const res = await fetch(
//       `${process.env["LANGGRAPH_API_URL"]}`,
//       options,
//     );
 
//     return new NextResponse(res.body, {
//       status: res.status,
//       statusText: res.statusText,
//       headers: {
//         ...res.headers,
//         ...getCorsHeaders(),
//       },
//     });
//   } catch (e) {
//     const error = e as Error & { status?: number };
//     return NextResponse.json({ error: error.message }, { status: error.status ?? 500 });
//   }
// }
 
// export const GET = (req: NextRequest) => handleRequest(req, "GET");
// export const POST = (req: NextRequest) => handleRequest(req, "POST");
// export const PUT = (req: NextRequest) => handleRequest(req, "PUT");
// export const PATCH = (req: NextRequest) => handleRequest(req, "PATCH");
// export const DELETE = (req: NextRequest) => handleRequest(req, "DELETE");
 
// // Add a new OPTIONS handler
// export const OPTIONS = () => {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       ...getCorsHeaders(),
//     },
//   });
// };