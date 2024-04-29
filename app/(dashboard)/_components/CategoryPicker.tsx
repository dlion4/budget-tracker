"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {TransactionType} from "@/lib/types";
import { Category } from "@prisma/client";

import {useQuery} from "@tanstack/react-query";
import React, { useCallback } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsDownUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  type: TransactionType;
  onChange: (value:string)=> void
}
const CategoryPicker = ({type, onChange} : Props) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(()=>{
    if(!value) return;
    onChange(value)
  }, [onChange, value])

  const categoriesQuery = useQuery({
    queryKey: [
      "categories", type
    ],
    queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json())
  });
  const selectedCategory = categoriesQuery.data?.find((category:Category)=> category.name === value);


  const successCallback = useCallback((category:Category) => {
setValue(category.name)
setOpen((prev)=>!prev)
  }
, [setValue, setOpen])


  return <Popover open={open} onOpenChange={setOpen}>
<PopoverTrigger asChild className=""> 
    <Button variant={"outline"} role="combobox" aria-expanded={open} className="w-[200px] justify-between">
        {selectedCategory ? <CategoryRow category={selectedCategory} /> : <>Select category</> }

        <ChevronsDownUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />

    </Button>
</PopoverTrigger>

<PopoverContent className="w-[200px] p-0">
    <Command onSubmit={(e)=>{
        e.preventDefault();
    }}>
        <CommandInput placeholder="Search category ..." />
        <CreateCategoryDialog type={type} successCallback={successCallback} />
        <CommandEmpty>
          <p>Category not found</p>
          <div className="text-muted-foreground text-xs">Tip! Create nw category</div>
        </CommandEmpty>
        <CommandGroup>
          <CommandList>
            {
              categoriesQuery.data && categoriesQuery.data.map((category:Category)=><CommandItem key={category.name} onSelect={(currentValue)=>{
                setValue(category.name);
                setOpen((prev)=> !prev)
              }} className="flex items-center justify-between gap-2">
                <CategoryRow category={category} />
                <Check className={cn(" w-4 h-4 mr-2 opacity-0", value === category.name && "opacity-100" )} />
              </CommandItem>)
            }
          </CommandList>
        </CommandGroup>
    </Command>
</PopoverContent>
  </Popover>;
};


function CategoryRow({category}: {category: Category}){
return (
    <div className="flex items-center gap-3">
        <span role="img">{category.icon}</span>
        <span>{category.name}</span>
    </div>
)
}


export default CategoryPicker;


