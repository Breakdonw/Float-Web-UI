import { useState, useEffect } from "react";
import { Linechart } from "../charts/linechart/linechart";


export default function Savings({spenddata}) {
    const [showExtraSavingsdata, setshowExtraSavingsdata] = useState(true)

    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 2000 && !showExtraSavingsdata) {
                setshowExtraSavingsdata(true);
            } else if (window.innerWidth <= 2000 && showExtraSavingsdata) {
                setshowExtraSavingsdata(false);
            }
        };

        // Call handleResize on component mount to set initial state
        handleResize();

        // Listen for resize events and update state accordingly
        window.addEventListener("resize", handleResize);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [showExtraSavingsdata]);
    return (
        <div className="flex flex-row h-full ">
            <Linechart />
            {showExtraSavingsdata && (
                <div className="">
                    <span><b>Savings Goal</b>: $14,000</span>
                    <span><b>Eta to Goal</b>: 5/8/2028</span>
                    <span><b>Current Bal</b>: $6,000</span>
                    <span><b>Monthly Contribution</b>: $200</span>
                    <span><b>Interest Rate</b>: 4.25%</span>
                </div>
            )}
        </div>
    )
}