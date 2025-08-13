'use client';
import { FaUser } from 'react-icons/fa';
import { Settings, LogOut } from 'lucide-react';

import { useCurrentUser } from '@/hooks/use-current-user';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LogoutButton } from './logout-button';
import Link from 'next/link';

export const UserButton = () => {
  const { user } = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="h-8 w-8 mr-2" />
            Settings
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
