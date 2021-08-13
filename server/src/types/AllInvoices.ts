import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class InvoiceType {
  @Field()
  date: Date;

  @Field()
  price: number;

  @Field()
  pdf_invoice: string;

  @Field()
  email: string;
}
