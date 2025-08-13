"use client";
import { useState ,useEffect} from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon, PanelBottomCloseIcon, SearchIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(()=>{
    const down = (e: KeyboardEvent)=>{
        if(e.key ==="k" &&(e.metaKey || e.ctrlKey)){
            e.preventDefault();
            setCommandOpen((open)=>!open);
        }
    }
    document.addEventListener("keydown", down)
    return()=> document.removeEventListener("keydown", down );

  }, []);
  return (
    <>
      {/* Dashboard Command Dialog */}
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

      {/* Navbar */}
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        {/* Sidebar Toggle */}
        <Button className="size-9" variant="outline" onClick={toggleSidebar}>
          {(state === "collapsed" || isMobile) 
            ? <PanelLeftIcon className="size-4" /> 
            : <PanelBottomCloseIcon className="size-4" />}
        </Button>

        {/* Search Button */}
        <Button
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon className="mr-2" />
          Search
          <kbd className="ml-auto inline-flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            &#8984; K
          </kbd>
        </Button>
      </nav>
    </>
  );
};
