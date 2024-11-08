"use server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const InvoiceDefinition = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer"
    }),
    amount: z.coerce.number().gt(0, { message: "Please enter a number greater than 0" }),
    status: z.enum(['pending', 'paid'], {
        message: "Please select a valid invoice status"
    }),
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


export const authenticate = async (prevState: undefined | string, formData: FormData) => {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials";
                default:
                    return "Something went wrong";
            }
        }
        throw error;
    }
}

export async function createInvoice(prevState: State, formData: FormData) {

    const validatedFields = FormSchema.safeParse({
        'customerId': formData.get('customerId'),
        'amount': formData.get('amount'),
        'status': formData.get('status')
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid Fields',
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const {
        amount,
        customerId,
        status
    } = validatedFields.data;

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

export const updateInvoice = async (id: string, prevState: State, formData: FormData) => {

    const validatedFields = FormSchema.safeParse({
        'customerId': formData.get('customerId'),
        'amount': formData.get('amount'),
        'status': formData.get('status')
    });

    if (!validatedFields.success) {
        return {
            message: "Validation Failed",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }


    const {
        amount,
        customerId,
        status,
    } = validatedFields.data;

    try {
        await sql`
        UPDATE invoices SET customer_id = ${customerId}, amount = ${amount * 100}, status=${status} 
        where id = ${id}
    `;
    } catch {
        return {
            message: "Database error, failed updating invoice",
        }
    }


    // revalidatePath("/dashboard/invoices");
    // redirect("/dashboard/invoices");
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