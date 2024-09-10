import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Transaction } from "@/types"
import { useEffect, useState } from "react"

export default function Transactions({ spendData }) {


    const [data, setData] = useState<Transaction[]>([])
    useEffect(()=>{
        const importData = () =>{
            setData(spendData)
        }

        return () =>{
           importData()
        }
    })

    return (
        <>
            <Table>
                {/* <TableCaption>A list of your transactions this month.</TableCaption> */}
                <TableHeader>
                    <TableRow >
                        <TableHead>id</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Reoccuring</TableHead>
                        <TableHead>Reoccuring Freq.</TableHead>
                        <TableHead className="text-right">Company</TableHead>
                        <TableHead className="w-[100px]">Remove?</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody >
                    {data.map((legend) => (
                        <TableRow key={legend.id}>
                            <TableCell>{legend.id}</TableCell>
                            <TableCell>{legend.value}</TableCell>
                            <TableCell>{legend.date}</TableCell>
                            <TableCell>{legend.reoccuring ? '✅' : '❌' }</TableCell>
                            <TableCell>{legend.reoccuringFrequency}</TableCell>
                            <TableCell>{legend.company}</TableCell>
                            <TableCell>{legend.remove}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6}>Total:</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>


        </>
    )
}