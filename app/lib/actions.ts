'use server'; //marks all the exported functions within the file as Server Actions

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
 
const sql = postgres(process.env.nextjs_POSTGRES_URL!, { ssl: 'require' });

//This schema will validate the formData before saving it to a database.
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),//The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

//extract the values of formData
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  //good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
  const amountInCents = amount * 100;
  //create a new date with the format "YYYY-MM-DD" for the invoice's creation date
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
//revalidatePath updates the data displayed in the invoices route, to clear this cache and trigger a new request to the server
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices'); //to redirect the user back to the /dashboard/invoices page
}