import { NextResponse } from "next/server";
import supabase from "@/app/utils/db"; // Import koneksi Supabase

export async function POST(req) {
  const request = await req.json();
  const id_pi = request.id_pi;
  const no_part = request.no_part;
  const no_part_update = request.no_part_update;

  try {
    // 1. Cek apakah data sudah ada di database
    const { data: existingData, error: checkError } = await supabase
      .from("draft") // Nama tabel
      .select("*") // Ambil semua kolom
      .eq("no_part", no_part); // Filter berdasarkan `no_part`

    if (checkError) {
      console.error("Error checking existing data:", checkError);
      return NextResponse.json({ error: "Error checking existing data" });
    }

    // 2. Jika data sudah ada, kembalikan pesan error
    if (existingData.length > 0) {
      return NextResponse.json({ error: "Data sudah ada di database" });
    }

    // 3. Jika data belum ada, lakukan insert
    const { data: insertedData, error: insertError } = await supabase
      .from("draft") // Nama tabel
      .insert([
        {
          id_pi: id_pi,
          no_part: no_part,
          no_part_update: no_part_update,
        },
      ])
      .select(); // Mengembalikan data yang baru saja dimasukkan

    if (insertError) {
      console.error("Error inserting data:", insertError);
      return NextResponse.json({ error: "Error inserting data" });
    }

    // 4. Kembalikan data yang berhasil dimasukkan
    return NextResponse.json({ data: insertedData });
  } catch (error) {
    console.error("Error on route:", error);
    return NextResponse.json({ error: "Error on route" });
  }
}
