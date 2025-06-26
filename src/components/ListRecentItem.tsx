import { useItemStore } from "@/store/item.store";
import {
  List,
  ListItem,
  ListItemButton,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ListaRecientes() {
  const items = useItemStore((state) => state.recentItems);

  if (items.length === 0) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          Sin busquedas recientes.
        </Typography>
      </Box>
    );
  }

  return (
    <List
      sx={{
        overflowY: "auto",
        maxHeight: "50vh",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
        p: 1,
      }}
    >
      {items.map((item, index) => (
        <Box key={item.timestamp}>
          <ListItem
            disablePadding
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              paddingTop: 2,
            }}
          >
            <Typography variant="caption" fontWeight={500}>
              {item.origin} → {item.destination}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hace{" "}
              {formatDistanceToNow(new Date(item.timestamp), {
                addSuffix: false,
                locale: es,
              })}
            </Typography>
          </ListItem>
          {index < items.length - 1 && <Divider component="li" />}
        </Box>
      ))}
    </List>
  );
}
