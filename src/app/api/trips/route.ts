import driver from "@/lib/neo4j";
import { TripOptionType } from "@/models/trip.option.enum";
import { TripOption } from "@/models/trip.option.model";
import { getTotalDuration } from "@/utils/time.util";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  
    const body = await request.json();
    const origin = body.origin?.trim();
    const destination = body.destination?.trim();

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination parameters are required" },
        { status: 400 }
      );
    }

    if (origin === destination) {
      return NextResponse.json(
        { error: "Origin cannot be the same as destination" },
        { status: 400 }
      );
    }

  const now = new Date();
  const buenosAiresOffset = -3 * 60; // UTC-3 en minutos
  now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + buenosAiresOffset);
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().substring(0, 5); // "HH:MM"
  console.log("fecha : " + currentDate)
  console.log("hora : " + currentTime)
  
  const session = await driver.session();
 try {
    const directTripsQuery = `
      MATCH (o:Stop {name: $origin})<-[:LOCATED_AT]-(o_st:StopTime)-[:PART_OF_TRIP]->(trp:Trip)-[:TRIP_AT]->(s:Service)-[:HAS_CALENDAR_DATE]->(c:CalendarDate {date: $currentDate})
      WHERE o_st.arrival_time >= $currentTime
      WITH o_st, trp
      MATCH (d:Stop {name: $destination})<-[:LOCATED_AT]-(d_st:StopTime)-[:PART_OF_TRIP]->(trp)-[]-(r:Route) 
      WHERE d_st.arrival_time > o_st.arrival_time
      RETURN 
        trp.id AS tripId,  
        r.long_name AS routeName,
        toFloat(o_st.distance_traveled) AS fromShape,
        toFloat(d_st.distance_traveled) AS toShape,
        o_st.arrival_time AS departureTime,
        d_st.arrival_time AS arrivalTime
      ORDER BY d_st.arrival_time ASC
      LIMIT 5
    `;

    const directResults = await session.run(directTripsQuery, {
      origin,
      destination,
      currentDate,
      currentTime
    });

    const directOptions: TripOption[] = directResults.records.map(record => ({
      type: TripOptionType.DIRECT,
      tripId: record.get('tripId'),
      routeName: record.get('routeName'),
      fromShape: record.get('fromShape'),
      toShape: record.get('toShape'),
      departureStop: origin,
      departureTime: record.get('departureTime'),
      arrivalStop: destination,
      arrivalTime: record.get('arrivalTime'),
      totalDuration: getTotalDuration(record.get('arrivalTime'), record.get('departureTime')),
      transferOption: null
    }));

    if (directOptions.length > 0) {
      return NextResponse.json(directOptions);
    }

    //transbord query
    const transferTripsQuery = `
      MATCH (o:Stop {name: $origin})<-[:LOCATED_AT]-(o_st:StopTime)-[:PART_OF_TRIP]->(trp1:Trip)-[:TRIP_AT]->(s:Service)-[:HAS_CALENDAR_DATE]->(c:CalendarDate {date: $currentDate})
      WHERE o_st.arrival_time >= $currentTime
      WITH o_st, trp1, s
      
      MATCH (t:Stop)<-[:LOCATED_AT]-(t1_st:StopTime)-[:PART_OF_TRIP]->(trp1)<-[:HAS_TRIP]-(r1:Route)
      WHERE t1_st.arrival_time > o_st.arrival_time
      WITH o_st, t, t1_st, r1, s, trp1
      
      MATCH (t)<-[:LOCATED_AT]-(t2_st:StopTime)-[:PART_OF_TRIP]->(trp2:Trip)-[:TRIP_AT]->(s)
      WHERE t2_st.arrival_time > t1_st.arrival_time
      WITH o_st, t, t1_st, r1, t2_st, trp1, trp2, s
      
      MATCH (r2:Route)-[:HAS_TRIP]->(trp2)<-[:PART_OF_TRIP]-(d_st:StopTime)-[:LOCATED_AT]->(d:Stop {name: $destination})
      WHERE d_st.arrival_time > t2_st.arrival_time
      
      RETURN 
        o_st.arrival_time AS departureTime1,
        t1_st.arrival_time AS arrivalTime1,
        r1.long_name AS routeName1,
        toFloat(o_st.distance_traveled) AS fromShape1,
        toFloat(t1_st.distance_traveled) AS toShape1,
        toFloat(t2_st.distance_traveled) AS fromShape2,
        toFloat(d_st.distance_traveled) AS toShape2,
        t AS transferStop,
        t2_st.arrival_time AS departureTime2,
        d_st.arrival_time AS arrivalTime2,
        r2.long_name AS routeName2,
        trp1.id AS tripId1,
        trp2.id AS tripId2
      ORDER BY d_st.arrival_time ASC
      LIMIT 5
    `;

    const transferResults = await session.run(transferTripsQuery, {
      origin,
      destination,
      currentDate,
      currentTime,
    });

    const transferOptions: TripOption[] = transferResults.records.map(record => ({
      type: TripOptionType.TRANSFER,
      tripId: record.get('tripId1'),
      routeName: record.get('routeName1'),
      fromShape: record.get('fromShape1'),
      toShape: record.get('toShape1'),
      departureStop: origin,
      departureTime: record.get('departureTime1'),
      arrivalStop: destination,
      arrivalTime: record.get('arrivalTime2'),
      totalDuration: getTotalDuration(record.get('arrivalTime2'), record.get('departureTime1')),
      transferOption:{
        tripId: record.get('tripId2'),
        routeName: record.get('routeName2'),
        fromShape: record.get('fromShape2'),
        toShape: record.get('toShape2'),
        transferStop: {
          id: record.get('transferStop').properties.id,
          name: record.get('transferStop').properties.name,
          latitude: record.get('transferStop').properties.latitude,
          longitude: record.get('transferStop').properties.longitude,
        },
        arrivalTime: record.get('departureTime1'),
        departureTime: record.get('arrivalTime2'),
        waitDuration: getTotalDuration(record.get('departureTime2'), record.get('arrivalTime1'))
        },
    }));

    return NextResponse.json(transferOptions);
  } catch (error) {
    console.error("Error fetching trip options:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip options" },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}