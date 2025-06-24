import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Trip Planner
          </Typography>
         
            <Link href="/">Home</Link>
     
         
            <Link href="/about">About</Link>
        
        </Toolbar>
      </AppBar>
    </Box>
  );
}
