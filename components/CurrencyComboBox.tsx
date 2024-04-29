"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Currencies, Currency } from "@/lib/Currencies"
import { useMutation, useQuery } from "@tanstack/react-query"
import SkeletonWrapper from "./SkeletonWrapper"
import { UserSettings } from "@prisma/client"
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings"
import { Toaster } from "./ui/sonner"
import { toast } from "sonner"



export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  );

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json())
  })

  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find((currency) => currency.value === userSettings.data.currency);

    if (userCurrency) setSelectedOption(userCurrency)
  }, [])


  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success("Currency updated successfully 🎉", {
        id: "update-currency"
      });
      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      )
    },
    onError: (e) => {
      toast.error("Something went wrong !" + e, {
        id: "update-currency"
      })
    }
  })

  const selectOption = React.useCallback((currency: Currency | null) => {
    if (!currency) {
      toast.error("Please select a valid currency")
    }

    toast.loading("updating currency ...", {
      id: "update-currency"
    });

    if (currency) {
      mutation.mutate(currency.value)
    } else {
      toast.error("Please select a valid currency")
    }
  }, [])
  return (
    <div className="flex items-center space-x-4">
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start"
              disabled={mutation.isPending}>
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="top" align="start">
            <Command>
              <CommandInput placeholder="Change status..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {Currencies.map((currency) => (
                    <CommandItem
                      key={currency.value}
                      value={currency.value}
                      onSelect={(value) => {
                        setSelectedOption(
                          Currencies.find((currency) => selectOption(currency)) ||
                          selectedOption
                        )

                        setOpen(false)
                      }}

                    >
                      {currency.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    </div>
  )
}


export default CurrencyComboBox

