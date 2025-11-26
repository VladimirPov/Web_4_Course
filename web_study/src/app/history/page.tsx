import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import Link from "next/link";

const mockHistory = [
  {
    id: "1",
    url: "https://youtu.be/design-talk",
    summary: "Short note about the design talk video.",
    href: "/history/1",
  },
  {
    id: "2",
    url: "https://youtu.be/product-update",
    summary: "Brief summary of the product update clip.",
    href: "/history/2",
  },
  {
    id: "3",
    url: "https://youtu.be/podcast-ep",
    summary: "Quick recap of the podcast episode.",
    href: "/history/3",
  },
];

export default function History() {
    return (
        <div className="bg-white h-[50rem] flex items-center justify-center p-6">
            <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                History
            </h1>
            <p className="text-lg text-gray-600 font-medium">
                Incredible stories...
            </p>
        </div>

        <div className="pt-4">
<div className="rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-semibold">Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHistory.map((item) => (
                <TableRow key={item.id} className="bg-background">
                  <TableCell className="p-0 align-top">
                    <Link href={item.href} className="block">
                      <Card className="rounded-none border-0 border-b border-border/40 gap-0 py-0 transition-colors last:border-b-0 hover:bg-muted/40">
                        <CardHeader className="space-y-1 px-4 py-3 pb-1">
                          <CardTitle className="text-sm font-medium">
                            {item.url}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-1">
                          <p className="text-sm text-muted-foreground">
                            {item.summary}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </div>

        <div className="pt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-gray-200 to-gray-300 mx-auto rounded-full"></div>
        </div>
    </div>
</div>
    )
}