"use client";

import ListRecentItem from "@/components/ListRecentItem";
import { Stop } from "@/models/stop.model";
import { stopService } from "@/services/stop.service";
import { useItemStore } from "@/store/item.store";
import { useStopStore } from "@/store/stop.store";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  maxHeight: "70vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
};

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [fieldType, setFieldType] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const stops = useStopStore((state) => state.stops);
  const origin = useStopStore((state) => state.origin);
  const destination = useStopStore((state) => state.destination);

  const setStops = useStopStore((state) => state.setStops);
  const setOrigin = useStopStore((state) => state.setOrigin);
  const setDestination = useStopStore((state) => state.setDestination);

  const addItem = useItemStore((state) => state.addItem);

  useEffect(() => {
    if (stops === null) {
      getStops();
    }
  }, []);

  const getStops = async () => {
    try {
      const res = await stopService.getAllStops();
      console.log("stops fetched");
      setStops(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = (type: boolean) => {
    setFieldType(type);
    setSearch("");
    setOpen(true);
  };

  const handleSelectStop = (stop: Stop) => {
    if (fieldType) setOrigin(stop);
    else setDestination(stop);
    setOpen(false);
  };

  const getTrips = () => {
    if (origin !== null && destination != null) {
      const now = Date.now();
      addItem({
        timestamp: now,
        origin: origin.name,
        destination: destination.name,
      });
      router.push("/about");
    }
  };

  const isValidData = () => {
    return (
      origin !== null &&
      destination !== null &&
      origin.name !== destination.name
    );
  };

  const filteredStops =
    stops?.filter((stop) =>
      stop.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Trip Planner
      </Typography>

      <TextField
        label="Origen"
        value={origin?.name || ""}
        onClick={() => handleOpen(true)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />

      <TextField
        label="Destino"
        value={destination?.name || ""}
        onClick={() => handleOpen(false)}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />

      <Button
        variant="contained"
        disabled={!isValidData()}
        onClick={() => getTrips()}
        fullWidth
      >
        Planificar
      </Button>
      <Typography variant="body2" sx={{ paddingTop: "20px" }}>
        Busquedas recientes
      </Typography>
      <ListRecentItem />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" gutterBottom>
              Seleccionar {fieldType ? "Origen" : "Destino"}
            </Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Buscar parada"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <List
            sx={{
              overflowY: "auto",
              maxHeight: "50vh",
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            {filteredStops.length === 0 ? (
              <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
                No se encontraron paradas
              </Typography>
            ) : (
              filteredStops.map((stop) => (
                <ListItem key={stop.id} disablePadding>
                  <ListItemButton onClick={() => handleSelectStop(stop)}>
                    {stop.name}
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Modal>
    </div>
  );
}
