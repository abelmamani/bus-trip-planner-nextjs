"use client";

import { TripOptionType } from "@/models/trip.option.enum";
import { TripOption } from "@/models/trip.option.model";
import { shapeService } from "@/services/shape.service";
import { tripService } from "@/services/trip.service";
import { useShapeStore } from "@/store/shape.store";
import { useStopStore } from "@/store/stop.store";
import { formatDuration } from "@/utils/time.util";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const About = () => {
  const router = useRouter();
  const [tripOptions, setTripOptions] = useState<TripOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const origin = useStopStore((state) => state.origin);
  const destination = useStopStore((state) => state.destination);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const setTransfer = useStopStore((state) => state.setTransfer);
  const clearTransfer = useStopStore((state) => state.clearTransfer);
  const setFromShapes = useShapeStore((state) => state.setFromShapes);
  const setToShapes = useShapeStore((state) => state.setToShapes);
  const clearShapes = useShapeStore((state) => state.clearShapes);

  const handleBack = () => {
    clearShapes();
    clearTransfer();
    router.back();
  };

  const getTrips = async () => {
    try {
      setIsLoading(true);
      if (origin && destination) {
        const res = await tripService.tripPlanner({
          origin: origin.name,
          destination: destination.name,
        });
        setTripOptions(res);
      }
    } catch (err) {
      console.log("Error al obtener las rutas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrips();
  }, []);

  const getTotalDuration = (time: string) => {
    return formatDuration(time);
  };

  const fetchShape = async (name: string, from: number, to: number) => {
    try {
      const data = await shapeService.getShapes(name, from, to);
      setFromShapes(data);
    } catch (err) {
      console.error("Error loading shapes", err);
    }
  };
  const fetchShape2 = async (name: string, from: number, to: number) => {
    try {
      const data = await shapeService.getShapes(name, from, to);
      setToShapes(data);
    } catch (err) {
      console.error("Error loading shapes", err);
    }
  };
  const getDetail = async (option: TripOption, index: number) => {
    setSelectedIndex(index);
    await fetchShape(option.routeName, option.fromShape, option.toShape);
    if (option.type === TripOptionType.TRANSFER && option.transferOption) {
      setTransfer(option.transferOption.transferStop);
      await fetchShape2(
        option.transferOption.routeName,
        option.transferOption?.fromShape,
        option.transferOption?.toShape
      );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ padding: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body1" color="text.secondary">
          Buscando rutas...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 1 }}>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="text"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        ></Button>

        <Typography variant="h6" gutterBottom>
          Trip Planner
        </Typography>
      </Box>

      {!isLoading && tripOptions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No se encontraron viajes disponibles.
        </Typography>
      ) : (
        <List
          sx={{
            overflowY: "auto",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          {tripOptions.map((option, index) => (
            <Box key={index}>
              <ListItem alignItems="flex-start" disablePadding>
                <Box sx={{ width: "100%", padding: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Línea:{" "}
                    {option.type === TripOptionType.DIRECT
                      ? option.routeName
                      : option.routeName +
                        " y " +
                        option.transferOption?.routeName}
                  </Typography>
                  <Typography variant="body2">
                    Salida: {option.departureTime} hs
                  </Typography>
                  <Typography variant="body2">
                    Llegada: {option.arrivalTime} hs
                  </Typography>
                  {option.type === TripOptionType.TRANSFER && (
                    <div>
                      <Typography variant="body2">
                        Trasbordo: {option.transferOption?.transferStop.name}
                      </Typography>
                      <Typography variant="body2">
                        Tiempo de espera:{" "}
                        {getTotalDuration(
                          option.transferOption?.waitDuration || "00:00"
                        )}
                      </Typography>
                    </div>
                  )}
                  <Typography variant="body2">
                    Duración total: {getTotalDuration(option.totalDuration)}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      onClick={() => getDetail(option, index)}
                      variant="contained"
                      size="small"
                      disabled={selectedIndex === index}
                    >
                      Ver
                    </Button>
                  </Box>
                </Box>
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default About;
