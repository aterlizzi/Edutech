import { UserData } from "../entity/User";
import { MyContext } from "./../types/MyContext";
import { Ctx, Query, Resolver } from "type-graphql";
import InvoiceType from "../types/AllInvoices";

const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

@Resolver()
export class retrieveNextInvoiceResolver {
  @Query(() => Date, { nullable: true })
  async retrieveNextInvoice(@Ctx() ctx: MyContext): Promise<Date | null> {
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user || !user.custKey) return null;
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: user.custKey,
    });
    return new Date(invoice.period_end * 1000);
  }
  @Query(() => [InvoiceType], { nullable: true })
  async retrieveAllInvoices(
    @Ctx() ctx: MyContext
  ): Promise<InvoiceType[] | null> {
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user) return null;
    const custId = user.custKey;
    const invoices = await stripe.invoices.list({
      customer: custId,
      limit: 12,
    });
    const output = invoices.data.map((invoice: any) => ({
      date: new Date(invoice.period_end * 1000),
      price: invoice.amount_paid / 100,
      pdf_invoice: invoice.invoice_pdf,
      email: invoice.customer_email,
    }));
    return output;
  }
}
