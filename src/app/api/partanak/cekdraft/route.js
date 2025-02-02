import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const request = await req.json();
  const id_pi = request.id_pi;

  try {
    const query = `
      SELECT 
        COUNT(id_pi) AS count
      FROM 
        draft
      WHERE 
        id_pi = $1
    `;
    const values = [id_pi];
    const data = await handlerQuery(query, values);

    console.log(data);

    return NextResponse.json({ count: data[0].count });
  } catch (error) {
    return NextResponse.json({ error: error.message }); // Tampilkan pesan error spesifik
  }
}
