import { RecentItem } from "@/models/recent.item";
import { useItemStore } from "@/store/item.store";
import { List, ListItem, ListItemButton, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

export default function ListRecentItem() {
  const items = useItemStore((state) => state.recentItems);
  
  const handleSelectItem = (item: RecentItem) => {
    //console.log("Seleccionado:", item);
  };

  return (
    <List
      sx={{
        overflowY: "auto",
        maxHeight: "50vh",
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
    
      {items.map((item) => (
        <ListItem key={item.timestamp} disablePadding>
          <ListItemButton onClick={() => handleSelectItem(item)}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {item.origin} → {item.destination}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </Typography>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}