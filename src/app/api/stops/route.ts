import { Stop } from "@/models/stop.model";
import driver from "@/lib/neo4j";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await driver.session();

  try {
    const result = await session.run(
      `MATCH (s:Stop {assigned_status: "ASSIGNED"}) 
       RETURN s.id as id, s.name as name, s.latitude as latitude, s.longitude as longitude`
    );

    const stops: Stop[] = result.records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      latitude: record.get('latitude'),
      longitude: record.get('longitude'),
    }));
    return NextResponse.json(stops);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stops" },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}
