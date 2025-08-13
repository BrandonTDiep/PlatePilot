'use client';

import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import Social from './social';
import { Button } from '../ui/button';
import Link from 'next/link';

interface CardWrapperProps {
  children: React.ReactNode;
  title: string;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export default function CardWrapper({
  children,
  title,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="w-full flex flex-col gap-y-4 items-center justify-center">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{headerLabel}</p>
      </CardHeader>

      <CardContent>{children}</CardContent>

      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm">
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
