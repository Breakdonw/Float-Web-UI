import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme applied to the Data Grid
import { useCallback, useEffect, useRef, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { createTransaction, createUserAccount, financialAccount, getUserRawTransactions, removeTransaction, simpleCategory, updateTransaction, updateUserAccount } from '@/api/Transactions';
import { CellEditRequestEvent, GetRowIdParams, GridReadyEvent, INumberCellEditorParams, ISelectCellEditorParams, ITextCellEditorParams } from 'node_modules/ag-grid-community/dist/types/core/main';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { map, z } from "zod"
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select'
import { CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';





export default function TransactionGrid({ categories, accounts }: { categories: Map<number, simpleCategory>, accounts: Map<number, financialAccount> }) {





  const CreateTransactionForm = () => {




    const formSchema = z.object({
      amount: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number({
          invalid_type_error: "Transaction amount must be Number.",
          required_error: 'Transaction Amount required.'
        }).nonnegative("Transaction Amount Must Be positive")),

      company: z.string({
        required_error: "Invocing Company Required",
        invalid_type_error: "Invocing Company Must be a string",
      }).min(3).max(255),
      date: z.date({
        required_error: "Date of transacation Required",
        invalid_type_error: "Date of transacation must be a date"
      }),
      accountid: z.number({
        required_error: "An account is required for the charge",
        invalid_type_error: "Account id must be an int."
      }),
      categoryid: z.number({
        required_error: 'Transaction category is required',
        invalid_type_error: "Transaction category must be a int."
      }),
      type: z.enum(["purchase", "recurring", "income"]),
      frequency: z.number({
        invalid_type_error: "Frequency needs to be a number"
      }).optional(),

    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        company: "",
        date: new Date(),
        accountid: 0,
        categoryid: 0,
        type: "purchase",
      },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        const respose = createTransaction(values.amount, values.accountid, values.company, values.categoryid, values.type, values.frequency, values.date);
        setRawMap(prevMap => {
          const updatedMap = new Map(prevMap);
          updatedMap.set(respose.id, respose); // Add new account to the map
          return updatedMap;
        });

        setRowData(prevRowData => [...prevRowData, respose]);

      } catch (error) {
        console.error('Failed to create Transaction', error);
      }
    }


    let actList = []
    {
      accounts.forEach(account => {
        actList.push(
          <><SelectItem className=' hover:bg-slate-700' key={account.id} value={account.id}> {account.nickName} ({account.accountNumber}) </SelectItem></>
        )
      })
    }

    let catList = []
    {
      categories.forEach(cat => {
        catList.push(
          <><SelectItem className=' hover:bg-slate-700' key={cat.id} value={cat.id}> {cat.name}  </SelectItem></>
        )
      })
    }

    return (



      <>
        <Form {...form} >
          <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="$25.13" type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the cost of the transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="30 days" type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the frequency of the transaction in days if applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invocing Company</FormLabel>
                  <FormControl>
                    <Input placeholder="The Burger Joint" {...field} />
                  </FormControl>
                  <FormDescription>
                    The company charging invocing you for this transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of invoice</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Date of invoice.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountid"

              render={({ field }) => (
                <FormItem className='flex flex-col' >
                  <FormLabel>Account</FormLabel>
                  <Select  >
                    <FormControl>
                      <SelectTrigger >
                        <SelectValue placeholder="Select account type " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-slate-900 text-white'>
                      <SelectGroup>
                        <SelectLabel>Your accounts</SelectLabel>
                        {actList}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The account associated with the transaction
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryid"

              render={({ field }) => (
                <FormItem className='flex flex-col' >
                  <FormLabel>Category</FormLabel>
                  <Select  >
                    <FormControl>
                      <SelectTrigger >
                        <SelectValue placeholder="Select account type " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-slate-900 text-white'>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {catList}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The category of the purchase
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"

              render={({ field }) => (
                <FormItem className='flex flex-col' >
                  <FormLabel>Type</FormLabel>
                  <Select  >
                    <FormControl>
                      <SelectTrigger >
                        <SelectValue placeholder="Select account type " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent >
                      <SelectItem value={field.value[0]}>Purchase</SelectItem>
                      <SelectItem value={field.value[1]}>Recurring</SelectItem>
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
            <div className='space-x-3 mt-5'>
              <Button type="submit">Submit</Button>
              <AlertDialog.Cancel asChild>
                <button className="">
                  Cancel
                </button>
              </AlertDialog.Cancel>
            </div>

          </form>
        </Form>

      </>
    )
  }



  const CreateTransaction = () => {




    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className="p-2 text-center p-0 place-self-end bg-green-700">
            Add new +
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black bg-opacity-55 data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] xl:max-h-[100vh] lg:max-h-[95vh] w-[90vw] md:max-w-[1000px] sm:max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Create New Transaction
            </AlertDialog.Title>
            <AlertDialog.Description className="text-mauve mt-2   text-[15px] leading-normal">
              Create a new transaction under one of your accounts
            </AlertDialog.Description>
            <hr className='w-full bg-slate-700' />
            <div className='container '>
              <CreateTransactionForm />

            </div>
            <AlertDialog.Action asChild>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>)
  }



  const deleteTransaction = (params: CustomCellRendererProps) => {
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
              This action cannot be undone. This will permanently delete this account and remove this
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
                  await removeTransaction(params.data.id);
                  // Remove the account from the state without fetching all data again
                  setRawMap(prevMap => {
                    const updatedMap = new Map(prevMap);
                    updatedMap.delete(params.data.id); // Remove account from the map
                    return updatedMap;
                  })

                  setRowData(prevRowData => prevRowData.filter(transaction => transaction.id !== params.data.id));

                }} className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                  Yes, delete account
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>)
  }






  const getRowId = useCallback(
    (params: GetRowIdParams) => String(params.data.id),
    [],
  );

  const [rowData, setRowData] = useState([]);
  const [rawMap, setRawMap] = useState(new Map<number, any>())
  const [gridKey, setGridKey] = useState<string>(`grid-key-${Math.random()}`);



  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    const data = await getUserRawTransactions();
    const formattedData = formatTransactionData(data);

    setRowData(formattedData);

    let act = new Map()
    Array.from(accounts.values()).forEach(a => {
      act.set(a.id, a)
    })
    let cat = new Map()
    Array.from(categories.values()).forEach(c => {
      cat.set(c.id, c)
    })
    const coldef = [{
      field: "id",
      flex: 0.5,
      cellEditor: false,
    },
    {
      field: "amount",
      flex: 1,
      editable: true,
      cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        precision: 2,
      } as INumberCellEditorParams,
    },
    {
      field: "company",
      flex: 2,
      editable: true,
      cellEditor: "agTextCellEditor",
      filter: true,
      cellEditorParams: {
        maxLength: 55,

      } as ITextCellEditorParams,
    },
    {
      field: "account",
      flex: 1,
      editable: true,
      cellEditor: "agSelectCellEditor",
      filter: true,
      cellEditorParams: {
        values: Array.from(act.values()).map(account => account.nickName), // Display account names
      },
      valueFormatter: (params) => {
        const account = act.get(params.value); // Map back to the account object using act map
        return account ? account.nickName : ''; // Show the nickname in the grid
      },
      onCellValueChanged: (event) => {
        const selectedAccount = Array.from(act.values()).find(account => account.nickName === event.newValue);
        if (selectedAccount) {
          event.data.accountid = selectedAccount.id; // Store the account ID in the backend
        }
      },
    },
    {
      field: "category",
      editable: true,
      cellEditor: 'agSelectCellEditor',
      filter: true,
      cellEditorParams: {
        values: Array.from(cat.values()).map(cat => cat.name), // Use the fetched category names
      } as ISelectCellEditorParams,
      flex: 1,
      valueFormatter: (params) => {
        const category = cat.get(params.value); // Map back to the account object using act map
        return category ? category.name : ''; // Show the nickname in the grid
      },
      onCellValueChanged: (event) => {
        const selectedCategory = Array.from(cat.values()).find(category => category.nickName === event.newValue);
        if (selectedCategory) {
          event.data.category = selectedCategory.id; // Store the category ID in the backend
        }
      },
    },
    {
      headerName: 'Frequency (days)',
      field: "Frequency",
      filter: 'agNumberColumnFilter',
      editable: true,
      cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        precision: 2,
      } as INumberCellEditorParams,
      flex: 1,
    },
    {
      field: "date",
      cellEditor: "agNumberCellEditor",
      filter: 'agDateColumnFilter',
      cellEditorParams: {
        precision: 2,
      } as INumberCellEditorParams,
      editable: true,
      flex: 1,
    },
    {
      field: "type",
      editable: true,
      filter:true,
      cellEditor: 'agSelectCellEditor',
      valueFormatter: (p) => String(p.value).charAt(0).toUpperCase() + String(p.value).slice(1),
      cellEditorParams: {
        values: ['purchase', 'creditCardPayment', 'savingsDeposit', 'recurring', 'income'],
      },
      flex: 1,
    },
    {
      field: "Delete",
      headerName: "Delete",
      cellRenderer: deleteTransaction,
      flex: 1,
    },
    ];

    setColDefs(coldef)
    setRawMap(data);

  }, []);


  function formatTransactionData(data: Map<number, financialAccount>) {
    let result = [];

    Array.from(data.values()).forEach(account => {
      try {
        account.transactions.forEach(transaction => {
          result.push({
            ...transaction,
            account: account.id,
            date: new Date(transaction.date).toLocaleDateString(),
            category: transaction.category.id,
            categoryid: transaction.category.id,

          });
        });
      } catch (error) {
        console.error('error')
      }
    });

    return result;
  }


  /* Handles cell edit requests in a grid component. */
  const onCellEditRequest = useCallback(
    (event: CellEditRequestEvent) => {
      const data = event.data; // Data from the field that was changed
      const field = event.colDef.field; // Name of the column that was changed
      let newValue = event.newValue; // New value in that column

      // Copy the original rawMap to avoid direct mutation
      const updatedRawMap = new Map(rawMap);

      // Build a map for accounts and categories
      const act = new Map(accounts.values().map(a => [a.id, a]));
      const cat = new Map(categories.values().map(c => [c.id, c]));

      // Find the account containing the transaction by searching for it
      const accountContainingTransaction = Array.from(updatedRawMap.values()).find(account =>
        account.transactions.some(transaction => transaction.id === data.id)
      );

      // Find the original transaction in the rawMap
      const transactionIndex = accountContainingTransaction.transactions.findIndex(trx => trx.id === data.id);
      const originalTransaction = accountContainingTransaction.transactions[transactionIndex];

      // Handle moving transaction to another account
      switch (field) {
        case "account":


          // Guard to check if the "Field" or "accountContainingTransaction" is missing
          if (!accountContainingTransaction || !field) {
            return;
          }


          // Check to make sure that the transaction actually exists
          if (!originalTransaction) {
            return;
          }

          const selectedAccount = Array.from(act.values()).find(account => account.nickName === newValue);

          if (selectedAccount && selectedAccount.id !== accountContainingTransaction.id) {
            // Move transaction to the new account

            // Remove the transaction from the old account
            accountContainingTransaction.transactions = accountContainingTransaction.transactions.filter(trx => trx.id !== originalTransaction.id);

            // Add the transaction to the new account in rawMap
            const newAccount = updatedRawMap.get(selectedAccount.id);
            if (newAccount) {
              newAccount.transactions.push({
                ...originalTransaction,
                accountid: newAccount.id
              });
            }

            // Update rawMap for both the old and new accounts
            updatedRawMap.set(accountContainingTransaction.id, accountContainingTransaction);
            updatedRawMap.set(selectedAccount.id, newAccount);
            setRawMap(updatedRawMap);
            const updatedRowData = formatTransactionData(updatedRawMap)

            setRowData(updatedRowData);
            updateTransaction({ ...originalTransaction, accountid: newAccount.id })
          }
          break;
        case "category":
          // Find the selected category based on the new value
          const selectedCategory = Array.from(cat.values()).find(category => category.name === newValue);

          // Ensure a valid category is found
          if (selectedCategory) {
            // Create a modified transaction with the correct category
            const modifiedTransaction = {
              ...originalTransaction,
              category: {
                id: selectedCategory.id,
                name: selectedCategory.name,
              },
              categoryid: selectedCategory.id
            };

            // Update the transaction in the account's transactions array
            const updatedTransactions = [...accountContainingTransaction.transactions];
            updatedTransactions[transactionIndex] = modifiedTransaction;

            // Update the rawMap with the modified account and transactions
            updatedRawMap.set(accountContainingTransaction.id, {
              ...accountContainingTransaction,
              transactions: updatedTransactions
            });

            // Set the updated rawMap in state
            setRawMap(updatedRawMap);

            // Prepare the updated row data
            const updatedRowData = [];
            Array.from(updatedRawMap.values()).forEach(account => {
              account.transactions.forEach(transaction => {
                updatedRowData.push({
                  ...transaction,
                  account: account.id,
                  date: new Date(transaction.date).toLocaleDateString(),
                  category: transaction.category.id, // Show category name in the grid
                  categoryid: transaction.category.id, // Use category id for backend updates
                });
              });
            });

            // Update the rowData to trigger a re-render
            setRowData(updatedRowData);

            // Optionally update the backend with the modified transaction
            updateTransaction(modifiedTransaction);
          } else {
            console.error("Selected category not found.");
          }
          break;

        default:
          // Update the field in the original transaction
          const updatedTransaction = { ...originalTransaction, [field]: newValue };
          accountContainingTransaction.transactions[transactionIndex] = updatedTransaction;

          // Ensure rawMap reflects the changes
          updatedRawMap.set(accountContainingTransaction.id, accountContainingTransaction);

          // Update state with the original rawMap structure intact
          setRawMap(updatedRawMap);

          // Update rowData to trigger re-render
          const updatedRowData = formatTransactionData(updatedRawMap)
          setRowData(updatedRowData);

          // Update backend with the updated transaction
          updateTransaction(updatedTransaction);
          break;
      }


    },
    [rawMap, accounts, categories]
  );


  const [colDefs, setColDefs] = useState<any[]>([])

  return (
    <>
      <div
        className="ag-theme-alpine-dark" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact
          rowData={rowData}
          key={gridKey}
          columnDefs={colDefs}
          getRowId={getRowId}
          readOnlyEdit={true}
          onGridReady={onGridReady}
          onCellEditRequest={onCellEditRequest}
        />
      </div>
      <CreateTransaction />
    </>
  )
}
