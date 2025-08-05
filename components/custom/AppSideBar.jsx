import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MessageCircleCodeIcon } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import SideBarFooter from './SideBarFooter';
import { useRouter } from 'next/navigation';
import { useSidebar } from '../ui/sidebar';

function AppSideBar() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  
  const handleNewChat = () => {
    router.push('/');
    toggleSidebar();
  };
  
  return (
    
      <Sidebar>
        <SidebarHeader className="p-5">
            <Image src={'/logo.png'} alt="logo" width={40} height={30} />
            <Button className="mt-5" onClick={handleNewChat}><MessageCircleCodeIcon /> Start New Chat</Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <WorkspaceHistory />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SideBarFooter></SideBarFooter>
        </SidebarFooter>
      </Sidebar>
    
  );
}

export default AppSideBar;
