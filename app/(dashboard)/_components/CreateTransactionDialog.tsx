"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {TransactionType} from "@/lib/types";
import {cn} from "@/lib/utils";
import {CreateTransactionSchema, CreateTransactionSchemaType} from "@/schema/transaction";
import React, {ReactNode, useCallback} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";
import {Span} from "next/dist/trace";
import {CalendarIcon, Loader2} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CreateTransaction} from "../_actions/transactions";
import {toast} from "sonner";
import {DateToUTCDate} from "@/lib/helpers";

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

const CreateTransactionDialog = ({trigger, type} : Props) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date()
    }
  });

  const [open, setOpen] = React.useState(false);

  const handleCategoryChange = useCallback((value : string) => {
    form.setValue("category", value);
  }, [form]);

  const queryClient = useQueryClient();

  const {mutate, isPending} = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction created succesfully ❤", {id: "create-transaction"});

      form.reset({type, description: "", amount: 0, category: undefined, date: new Date()});

      // after transaction querys revalidate

      queryClient.invalidateQueries({queryKey: ["overview"]});

      setOpen((prev) => !prev);
    }
  });

  const onSubmit = useCallback((values : CreateTransactionSchemaType) => {
    toast.loading("creating transaction ...", {id: "create-transaction"});

    mutate({
      ...values,
      date: DateToUTCDate(values.date)
    });
  }, [mutate]);

  return (<Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild={true}>{trigger}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Create a new{" "}
          <span className={cn(
              "m-1", type === "income"
              ? "text-emerald-500"
              : "text-red-500")}>
            {type.toUpperCase()}
          </span>{" "}
          Transaction
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form action="" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField control={form.control} name="description" render={({field}) => (<FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input defaultValue={""} placeholder="Transaction description" {...field}/>
              </FormControl>
              <FormDescription>
                Transaction description (optional)
              </FormDescription>
            </FormItem>)}/>
          <FormField control={form.control} name="amount" render={({field}) => (<FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input defaultValue={0} type="number" {...field}/>
              </FormControl>
              <FormDescription>
                Transaction Amount (Required)
              </FormDescription>
            </FormItem>)}/>{" "}
          {/* Transaction: {form.watch("category")} */}
          <div className="flex items-center justify-between gap-2 w-full">
            <FormField control={form.control} name="category" render={({field}) => (<FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategoryPicker type={type} onChange={handleCategoryChange}/>
                </FormControl>
                <FormDescription>
                  Select category for this Transaction (Required)
                </FormDescription>
              </FormItem>)}/>

            <FormField control={form.control} name="date" render={({field}) => (<FormItem>
                <FormLabel>Transaction Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild={true}>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-[200px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {
                          field.value
                            ? (format(field.value, "PPP"))
                            : (<span>Pick a date</span>)
                        }
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange}/>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select a date for transaction (Required)
                </FormDescription>
                <FormMessage/>
              </FormItem>)}/>
          </div>
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild={true}>
          <Button type="button" variant={"secondary"} onClick={() => {
              form.reset();
            }}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
          {!isPending && "Create"}
          {isPending && <Loader2 className="animate-spin"/>}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>);
};
export default CreateTransactionDialog;
