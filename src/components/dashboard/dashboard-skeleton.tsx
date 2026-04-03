import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-[28rem] max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-[290px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="mx-auto h-52 w-52 rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
