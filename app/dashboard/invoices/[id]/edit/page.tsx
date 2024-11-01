import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';

export default async function Page(props: {
    params: Promise<{
        id: string
    }>
}) {

    const params = await props.params;
    const { id } = params;

    const [customers, invoice] = await Promise.all([
        fetchCustomers(),
        fetchInvoiceById(id)
    ]);


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Create Invoice',
                        href: '/dashboard/invoices/create',
                        active: true,
                    },
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    )
}

