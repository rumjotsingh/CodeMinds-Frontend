'use client';

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RecentSubmissions({ submissions }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!submissions.length) return <p className="text-muted-foreground">No submissions yet. Start solving!</p>;

  if (!isMobile) {
    // Desktop: Table layout
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((s, idx) => (
              <TableRow key={idx}>
                <TableCell>{new Date(s.createdAt || s.date || "").toLocaleString()}</TableCell>
                <TableCell>{s.problemTitle}</TableCell>
                <TableCell>
                  <Badge variant={s.result === "Accepted" ? "default" : "destructive"}>
                    {s.result}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a href="#" className="text-blue-600 hover:underline">View Solution</a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Mobile: Card layout
  return (
    <div className="space-y-3">
      {submissions.map((s, idx) => (
        <Card key={idx}>
          <CardContent className="p-4 space-y-1">
            <p className="font-medium">{s.problemTitle}</p>
            <Badge variant={s.result === "Accepted" ? "default" : "destructive"}>
              {s.result}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {new Date(s.createdAt || s.date || "").toLocaleString()}
            </p>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              View Solution
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
