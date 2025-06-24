import { Shape } from "@/models/shape.model";
import driver from "@/lib/neo4j";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse<Shape[] | { error: string }>> {
  const routeName = request.nextUrl.searchParams.get("name");
  const distanceFrom = request.nextUrl.searchParams.get("distanceFrom");
  const distanceTo = request.nextUrl.searchParams.get("distanceTo");

  if (!routeName) {
    return NextResponse.json(
      { error: "Route name parameter is required" },
      { status: 400 }
    );
  }

  const session = await driver.session();

  try {
    let query: string;
    const params: any = { routeName };

    if (distanceFrom || distanceTo) {
      // Construcción más robusta de la cláusula WHERE
      const whereClauses: string[] = [];
      
      if (distanceFrom) {
        whereClauses.push("toFloat(sh.distance_traveled) >= toFloat($distanceFrom)");
        params.distanceFrom = parseFloat(distanceFrom);
      }
      
      if (distanceTo) {
        whereClauses.push("toFloat(sh.distance_traveled) <= toFloat($distanceTo)");
        params.distanceTo = parseFloat(distanceTo);
      }

      query = `
        MATCH (r:Route {long_name: $routeName})-[:HAS_SHAPE]->(sh:Shape)
        ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''}
        RETURN 
          sh.id as id,
          sh.latitude as latitude,
          sh.longitude as longitude,
          toFloat(sh.distance_traveled) as distanceTraveled,
          toFloat(sh.sequence) as sequence
        ORDER BY sh.sequence
      `;
    } else {
      query = `
        MATCH (r:Route {long_name: $routeName})-[:HAS_SHAPE]->(sh:Shape)
        RETURN 
          sh.id as id,
          sh.latitude as latitude,
          sh.longitude as longitude,
          toFloat(sh.distance_traveled) as distanceTraveled,
          toFloat(sh.sequence) as sequence
        ORDER BY sh.sequence
      `;
    }

    const result = await session.run(query, params);

    const shapes: Shape[] = result.records.map(record => ({
      id: record.get('id'),
      latitude: record.get('latitude'),
      longitude: record.get('longitude'),
      distanceTraveled: record.get('distanceTraveled'),
      sequence: record.get('sequence')
    }));

    return NextResponse.json(shapes);
  } catch (error) {
    console.error("Error fetching shape points:", error);
    return NextResponse.json(
      { error: "Failed to fetch shape points" },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}