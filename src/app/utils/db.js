// import { Pool } from "pg";

// export const pool = new Pool({
//   user: process.env.USER_NAME,
//   host: process.env.HOST_NAME,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.PORT_NUMBER,
// });

// export default async function handlerQuery(query, values) {
//   const client = await pool.connect();
//   try {
//     const hasil = await client.query(query, values);
//     return hasil;
//   } finally {
//     client.release();
//   }
// }

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi default untuk menangani berbagai jenis query
export default async function handlerQuery(query, values = []) {
  if (typeof query === "string") {
    // Jika query adalah string SQL, gunakan select helper
    try {
      const tableName = query
        .toLowerCase()
        .split("from")[1]
        .split("where")[0]
        .trim();
      const conditions =
        values.length > 0
          ? {
              [query.split("$1")[0].split("=")[0].trim().split(" ").pop()]:
                values[0],
            }
          : {};

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .match(conditions);

      if (error) throw error;

      return {
        rows: data || [],
        rowCount: data?.length || 0,
      };
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  } else {
    // Jika query adalah object dengan format baru
    try {
      const { data, error } = await supabase
        .from(query.table)
        .select(query.select || "*")
        .match(query.conditions || {});

      if (error) throw error;

      return {
        rows: data || [],
        rowCount: data?.length || 0,
      };
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}

// Fungsi helper umum
export async function select(table, columns = "*", conditions = {}) {
  if (!table) throw new Error("Table name is required");

  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .match(conditions);

  if (error) throw error;

  return {
    rows: data || [],
    rowCount: data?.length || 0,
  };
}

export async function insert(table, values) {
  if (!table) throw new Error("Table name is required");

  const { data, error } = await supabase.from(table).insert(values).select();

  if (error) throw error;

  return {
    rows: data || [],
    rowCount: data?.length || 0,
  };
}

export async function update(table, values, conditions) {
  if (!table) throw new Error("Table name is required");

  const { data, error } = await supabase
    .from(table)
    .update(values)
    .match(conditions)
    .select();

  if (error) throw error;

  return {
    rows: data || [],
    rowCount: data?.length || 0,
  };
}

export async function remove(table, conditions) {
  if (!table) throw new Error("Table name is required");

  const { data, error } = await supabase
    .from(table)
    .delete()
    .match(conditions)
    .select();

  if (error) throw error;

  return {
    rows: data || [],
    rowCount: data?.length || 0,
  };
}
