import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme applied to the Data Grid
import { useCallback, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { createUserAccount, financialAccount, getUserAccountData, removeUserAccount, updateUserAccount } from '@/api/Transactions';
import { CellEditRequestEvent, GetRowIdParams, GridReadyEvent, INumberCellEditorParams, ITextCellEditorParams } from 'node_modules/ag-grid-community/dist/types/core/main';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select'






export default function AccountGrid() {
  const CreateAccountForm = () => {

    const formSchema = z.object({
      accountNumber: z.string({
        required_error: "Account Number Required",
      }),
      intrest: z.number({
      }).nonnegative("intrest Must be positive"),
      maxBalance: z.number({
        invalid_type_error: "Max balance must be a Number"

      }).nonnegative("Max balance Must be positive"),

      type: z.enum(["checkings", "savings", "credit"]),
      provider: z.string({
        required_error: 'A Provider is required',
        invalid_type_error: 'Provider Must be a string'
      }).max(55).min(3),
      nickName: z.string({
        required_error: 'A Nick Name is required',
        invalid_type_error: 'Nick Name Must be a string'
      }).max(55).min(3)
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        accountNumber: 0,
        provider: "",
        nickName: "",
        intrest: 0.0,
        maxBalance: 0,
        type: "checkings",
      },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        const respose = await createUserAccount(values.accountNumber, values.intrest, values.maxBalance, values.type, values.provider, values.nickName);
        setRawMap(prevMap => {
          const updatedMap = new Map(prevMap);
          updatedMap.set(respose.id, respose); // Add new account to the map
          return updatedMap;
        });

        setRowData(prevRowData => [...prevRowData, respose]);

      } catch (error) {
        console.error('Failed to create financial account: ', error);
      }
    }


    return (



      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="07544438" type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your bank account Number. You may leave this as 000 as this is only to help you indentify which account you are look at.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Input placeholder="Cool Guy Bank" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the provider of the account I.e Chase, Bank Of America, etc..
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nick Name</FormLabel>
                  <FormControl>
                    <Input placeholder="College Savings" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the Nick Name for the account for easy identification.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intrest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intrest</FormLabel>
                  <FormControl>
                    <Input placeholder="5.5%" type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the intrest applied on the account, if it's a checkings account you may leave this at 0.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max balance / Savings Goal</FormLabel>
                  <FormControl>
                    <Input placeholder="$25000" type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    This represents the maximum balance of the account in the case of a credit card. Alternatively this represents the savings goal on a savings account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"

              render={({ field }) => (
                <FormItem className='flex flex-col space-y-6' >
                  <FormLabel>Type</FormLabel>
                  <Select  >
                    <FormControl>
                      <SelectTrigger >
                        <SelectValue placeholder="Select account type " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent >
                      <SelectItem value={field.value[0]}>Checkings account</SelectItem>
                      <SelectItem value={field.value[1]}>Savings account</SelectItem>
                      <SelectItem value={field.value[2]}>Credit account</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>

            <AlertDialog.Cancel asChild>
              <button className="">
                Cancel
              </button>
            </AlertDialog.Cancel>
          </form>
        </Form>

      </>
    )
  }


  let rowImmutableStore: any[]

  const CreateAccount = () => {




    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className="p-2 text-center p-0 place-self-end bg-green-700">
            Add new +
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black bg-opacity-55 data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] md:max-w-[1000px] sm:max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Add New Account
            </AlertDialog.Title>
            <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
              This creates a new account based on your specification.
            </AlertDialog.Description>
            <div className='flex flex-col'>
              <CreateAccountForm />

              <AlertDialog.Action asChild>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>)
  }



  const deleteAccount = (params: CustomCellRendererProps) => {
    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className="mt-0 text-center p-0">
            ❌
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black bg-opacity-55 data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Are you absolutely sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
              This action cannot be undone. This will permanently delete your account and remove your
              data from our servers.
            </AlertDialog.Description>
            <div className="flex justify-end gap-[25px]">
              <AlertDialog.Cancel asChild>
                <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button onClick={async () => {
                  await removeUserAccount(params.data.id);
                  // Remove the account from the state without fetching all data again
                  setRawMap(prevMap => {
                    const updatedMap = new Map(prevMap);
                    updatedMap.delete(params.data.id); // Remove account from the map
                    return updatedMap;})

                    setRowData(prevRowData => prevRowData.filter(account => account.id !== params.data.id));

                }} className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                  Yes, delete account
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>)
  }

  function formatDataAccountData(data: Map<number, financialAccount>) {
    let result = [];
    Array.from(data.values()).forEach(account => {
      result.push(account)

    });
    return result;
  }


  const interestCellRender = (props: CustomCellRendererProps) => {
    if (props.value === null || props.value === undefined) {
      return <> None </>
    } else {
      return <>{props.value} %</>
    }
  }

  const maxBalance = (props: CustomCellRendererProps) => {
    if (props.value === null || props.value === undefined) {
      return <> None </>
    } else {
      return <>${props.value}</>
    }
  }

  const getRowId = useCallback(
    (params: GetRowIdParams) => String(params.data.id),
    [],
  );

  const [rowData, setRowData] = useState([]
  );
  const [rawMap, setRawMap] = useState(new Map<number, financialAccount>())

  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    const data = await getUserAccountData();
    const result = formatDataAccountData(data)
    setRowData(result)
    setRawMap(data)
  }, []);

  const onCellEditRequest = useCallback(
    (event: CellEditRequestEvent) => {
      const data = event.data;
      const field = event.colDef.field;
      const newValue = event.newValue;
      const oldItem = rawMap.get(data.id);
      if (!oldItem || !field) {
        return;
      }
      const newItem = { ...oldItem, [field]: newValue };
      const updatedMap = new Map(rawMap);
      updatedMap.set(data.id, newItem);
      setRawMap(updatedMap);

      // Update the rowData to trigger re-render
      const updatedRowData = Array.from(updatedMap.values());
      setRowData(updatedRowData);
      console.log(newItem)
      updateUserAccount(data.id, newItem)
    },
    [rawMap],
  );

  const [colDefs, setColDefs] = useState([
    {
      field: "id",
      flex: 0.5,
      cellEditor: false
    },
    {
      field: "accountNumber",
      flex: 1,
      editable: true,
      cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        precision: 2,
      } as INumberCellEditorParams
    },
    {
      field: "provider", flex: 1,
      editable: true,
      cellEditor: "agTextCellEditor",
      cellEditorParams: {
        maxLength: 20,
      } as ITextCellEditorParams,
    },
    {
      field: "nickName",
      editable: true,
      flex: 1,
    },
    { field: "balance", flex: 1, valueFormatter: p => '$' + p.value },
    {
      field: "intrest",
      editable: true,
      cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        precision: 2,
      } as INumberCellEditorParams,
      flex: 1, cellRenderer: interestCellRender
    },
    {
      field: "maxBalance",
      cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        precision: 2,
      } as INumberCellEditorParams,
      editable: true,
      flex: 1, cellRenderer: maxBalance
    },
    {
      field: "type",
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['savings', 'checkings', 'credit'],
      },
      flex: 1
    },
    {
      field: "Delete",
      headerName: "Delete",
      cellRenderer: deleteAccount,
      flex: 1
    },

  ]);


  return (
    <>
      <div
        className="ag-theme-alpine-dark" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          getRowId={getRowId}
          readOnlyEdit={true}
          onGridReady={onGridReady}
          onCellEditRequest={onCellEditRequest}
        />
      </div>
      <CreateAccount />
    </>
  )
}
