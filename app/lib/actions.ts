"use server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


const InvoiceDefinition = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const FormSchema = InvoiceDefinition.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};


export async function createInvoice(formData: FormData) {

    const {
        amount,
        customerId,
        status
    } = FormSchema.parse({
        'customerId': formData.get('customerId'),
        'amount': formData.get('amount'),
        'status': formData.get('status')
    });

    const date = new Date().toISOString().split("T")[0];

    try {
        await sql`
        INSERT into invoices(customer_id, amount, status, date) values (${customerId}, ${amount * 100}, ${status}, ${date})
    `;
    } catch {
        return {
            message: 'Database error . Failed to create Invoice',
        }
    }

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");

}

export const updateInvoice = async (id: string, formData: FormData) => {
    const {
        amount,
        customerId,
        status,
    } = FormSchema.parse({
        'customerId': formData.get('customerId'),
        'amount': formData.get('amount'),
        'status': formData.get('status')
    });

    try {
        await sql`
        UPDATE invoices SET customer_id = ${customerId}, amount = ${amount * 100}, status=${status} 
        where id = ${id}
    `;
    } catch {
        return {
            message: "Database error, failed updating invoice"
        }
    }


    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}


export const deleteInvoice = async (id: string) => {


    try {
        await sql`DELETE FROM INVOICES WHERE id = ${id}`;

    } catch {
        return {
            message: ""
        }
    }

    revalidatePath("/dashboard/invoices");

}