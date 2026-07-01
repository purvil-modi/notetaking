import type { MiddlewareHandler } from "hono";
import type { ZodSchema } from "zod";

type Target = "json" | "query" | "param";

export function validate(schema: ZodSchema, target: Target = "json"): MiddlewareHandler {
  return async (c, next) => {
    let dataToParse: any;

    try {
      if (target === "json") {
        dataToParse = await c.req.json();
      } else if (target === "query") {
        dataToParse = c.req.query();
      } else if (target === "param") {
        dataToParse = c.req.param();
      }
    } catch (err) {
      return c.json({ error: "Invalid request payload format" }, 400);
    }

    const parsed = schema.safeParse(dataToParse);

    if (!parsed.success) {
      return c.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        422
      );
    }

    // Assign validated data to context variables or keep it on body
    c.set("validatedData" as any, parsed.data);

    await next();
  };
}
