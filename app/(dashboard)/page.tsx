import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { User, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import OverView from "./_components/OverView";
import History from "./_components/History";


function FomartUserName({user}: {user: User}){
    return (
        <>
        {user.firstName?.charAt(0).toUpperCase()}
        {user.firstName?.slice(1)}!
        </>
    )
}

const Page = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSettings) {
        redirect("/wizard");
    }
    return (
        <div className="w-full h-full bg-background">
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <p className="text-3xl font-bold">
                        Hello,{" "}
                        <span className="text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text ">
                        <FomartUserName user={user} />
                        </span>{" "}
                        👋
                    </p>

                    <div className="flex items-center gap-3">
                        <CreateTransactionDialog
                            trigger={
                                <Button
                                    variant={"outline"}
                                    className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white">
                                    New Income 📈
                                </Button>
                            }
                            type="income"
                        />
                        <CreateTransactionDialog
                            trigger={
                                <Button
                                    variant={"outline"}
                                    className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white">
                                    New Expenses 😃
                                </Button>
                            }
                            type="expense"
                        />
                    </div>
                </div>
            </div>
            <OverView userSettings={userSettings} />
            <History userSettings={userSettings} />
        </div>
    );
};
export default Page;
