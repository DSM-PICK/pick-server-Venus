import { Schema } from "joi";

import { invalidParameterError } from "../../../errors";

export default async ({ schema, value }: { schema: Schema; value: any }) => {
  try {
    await schema.validateAsync(value);
  } catch {
    throw invalidParameterError;
  }
};
