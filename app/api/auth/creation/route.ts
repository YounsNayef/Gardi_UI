import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user === null || !user.id) {
      throw new Error("User not authenticated or missing user ID");
    }

    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      const account = await stripe.accounts.create({
        email: user.email as string,
        type: 'express',
      });

      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          firstName: user.given_name ?? "",
          lastName: user.family_name ?? "",
          email: user.email ?? "",
          profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
          connectedAccountId: account.id,
        },
      });
    }

    return NextResponse.redirect(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://gardi-ui.vercel.app/"
    );

  } catch (error) {
    console.error("Error during GET request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
