import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // E-commerce routers
  categories: router({
    list: publicProcedure.query(async () => {
      const { getAllCategories } = await import("./db");
      return getAllCategories();
    }),
    bySlug: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "string") return val;
        throw new Error("Invalid input: expected string");
      })
      .query(async ({ input }) => {
        const { getCategoryBySlug } = await import("./db");
        return getCategoryBySlug(input);
      }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const { getAllProducts } = await import("./db");
      return getAllProducts();
    }),
    featured: publicProcedure.query(async () => {
      const { getFeaturedProducts } = await import("./db");
      return getFeaturedProducts();
    }),
    byCategory: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error("Invalid input: expected number");
      })
      .query(async ({ input }) => {
        const { getProductsByCategory } = await import("./db");
        return getProductsByCategory(input);
      }),
    bySlug: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "string") return val;
        throw new Error("Invalid input: expected string");
      })
      .query(async ({ input }) => {
        const { getProductBySlug } = await import("./db");
        return getProductBySlug(input);
      }),
    search: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "string") return val;
        throw new Error("Invalid input: expected string");
      })
      .query(async ({ input }) => {
        const { searchProducts } = await import("./db");
        return searchProducts(input);
      }),
  }),

  reviews: router({
    byProduct: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error("Invalid input: expected number");
      })
      .query(async ({ input }) => {
        const { getProductReviews } = await import("./db");
        return getProductReviews(input);
      }),
    create: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "productId" in val && "rating" in val) {
          return val as { productId: number; rating: number; comment?: string; imageUrl?: string };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        const { createReview } = await import("./db");
        return createReview({
          productId: input.productId,
          userId: ctx.user.id,
          rating: input.rating,
          comment: input.comment,
          imageUrl: input.imageUrl,
        });
      }),
  }),

  cart: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getCartItems, getProductById } = await import("./db");
      const items = await getCartItems(ctx.user.id);
      // Enrich cart items with product data
      const enriched = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return { ...item, product };
        })
      );
      return enriched;
    }),
    add: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "productId" in val) {
          return val as { productId: number; quantity?: number };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        const { addToCart } = await import("./db");
        return addToCart(ctx.user.id, input.productId, input.quantity || 1);
      }),
    updateQuantity: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cartItemId" in val && "quantity" in val) {
          return val as { cartItemId: number; quantity: number };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ input }) => {
        const { updateCartItemQuantity } = await import("./db");
        return updateCartItemQuantity(input.cartItemId, input.quantity);
      }),
    remove: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error("Invalid input: expected number");
      })
      .mutation(async ({ input }) => {
        const { removeFromCart } = await import("./db");
        return removeFromCart(input);
      }),
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      const { clearCart } = await import("./db");
      return clearCart(ctx.user.id);
    }),
  }),

  addresses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserAddresses } = await import("./db");
      return getUserAddresses(ctx.user.id);
    }),
    create: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          return val as any; // Type will be validated by db layer
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        const { createAddress } = await import("./db");
        return createAddress({ ...input, userId: ctx.user.id });
      }),
  }),

  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserOrders, getAllOrders } = await import("./db");
      // If admin, return all orders; otherwise return user's orders
      if (ctx.user.role === "admin") {
        return getAllOrders();
      }
      return getUserOrders(ctx.user.id);
    }),
    byId: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error("Invalid input: expected number");
      })
      .query(async ({ input }) => {
        const { getOrderById, getOrderItems } = await import("./db");
        const order = await getOrderById(input);
        if (!order) return null;
        const items = await getOrderItems(input);
        return { ...order, items };
      }),
    create: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          return val as any; // Type will be validated by db layer
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        const { createOrder, createOrderItems, clearCart } = await import("./db");
        const { order, items } = input as { order: any; items: any[] };
        const result = await createOrder({ ...order, userId: ctx.user.id });
        const orderId = (result as any).insertId;
        await createOrderItems(items.map((item: any) => ({ ...item, orderId })));
        await clearCart(ctx.user.id);
        return { orderId };
      }),
    updateStatus: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          return val as any;
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        // Only admins can update order status
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { updateOrderStatus } = await import("./db");
        const { orderId, status, trackingCode } = input as { orderId: number; status: string; trackingCode?: string };
        await updateOrderStatus(orderId, status, trackingCode);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
