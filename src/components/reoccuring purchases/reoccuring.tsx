import { simpleTransaction } from "@/api/Transactions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react";


/**
 * The function `formatData` takes a Map of simple transactions, combines data based on category name,
 * and returns an array of formatted transaction objects.
 * 
 * Args:
 *   data: The `data` parameter in the `formatData` function is a Map that contains simpleTransaction
 * objects with numeric keys. Each simpleTransaction object has properties like `category`, `amount`,
 * etc. The goal of the function is to format this data into an array of objects with specific
 * properties like `id
 * 
 * Returns:
 *   The function `formatData` is returning an array of objects that represent the combined data from
 * the input `Map<number, simpleTransaction>`. Each object in the array contains the following
 * properties: `id`, `label`, `value`, and `color`.
 */
function formatData(data: Map<number, simpleTransaction>) {



    const combinedDataArray = Array.from(data, ([key, value]) => ({
        id: value.id,
        label: value.company,
        value: value.amount,
    }));

    return combinedDataArray

}

/**
 * The function `getInitials` takes a company name as input, extracts the first letter of each word,
 * converts them to uppercase, and returns the initials as a string.
 * 
 * Args:
 *   companyName (string): A string representing the name of a company.
 * 
 * Returns:
 *   The function `getInitials` takes a `companyName` as input, splits the company name into words,
 * extracts the first letter of each word, converts it to uppercase, and then joins these initials
 * together. The function returns the initials of the company name as a string.
 */


export default function Reoccuring({ reoccuringPurchases }) {
    const [data, setdata] = useState([{}])
    useEffect(() => {
        setdata(formatData(reoccuringPurchases))
    }, [])

    function getInitials(companyName): string {
        console.log(companyName)
        const words = companyName.split(' ');
    
        const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    
        return initials;
    }

    const reoccuring = []
    const calculateOpacity = (index: number, totalItems: number): number => {
        const middleIndex = Math.floor(totalItems / 2); // Calculate the middle index

        const distanceFromMiddle = Math.abs(index - middleIndex); // How far the item is from the middle
        const maxDistance = Math.floor(totalItems / 2); // Max possible distance from the middle

        // Linearly decrease opacity based on the distance from the middle
        const opacity = 1 - (distanceFromMiddle / maxDistance);

        return opacity;
    };

    let index =0
    data.forEach(value => {
        index++;
        reoccuring.push(
            <>
                <div className="flex flex-col items-center justify-center mx-5" style={{ opacity: calculateOpacity(index, data.length) }}>
                    <Avatar className="mb-5">
                        <AvatarImage src="" />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <span className=" " >$ <span className="text-red-600">{value.value}</span></span>
                    <span>{value.label}</span>
                </div>
            </>)
    })


    return (
        <>

            {reoccuring}

        </>
    )
}