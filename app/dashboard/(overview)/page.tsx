import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { dmsans } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { CardSkeleton, InvoiceSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';

export const experimental_ppr = true;

export default async function Page() {
    


    return (
        <main>
            <h1 className={`${dmsans.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* <Card title="Collected" value={`GH₵ ${totalPaidInvoices}`} type="collected" />
                <Card title="Pending" value={` Gh₵ ${totalPendingInvoices}`} type="pending" />
                <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
                <Card
                    title="Total Customers"
                    value={numberOfCustomers}
                    type="customers"
                /> */}
                <Suspense fallback={<CardSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<InvoiceSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}