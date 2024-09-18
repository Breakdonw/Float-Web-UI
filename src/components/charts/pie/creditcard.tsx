import { simpleTransaction } from "@/api/Transactions";
import { LegendDatum, ResponsivePie } from "@nivo/pie";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

interface CreditCardAccount {
    id: number;
    accountNumber: number;
    provider: string;
    nickName: string;
    balance: number; // Total amount owed
    intrest: number; // Annual interest rate in percentage
    maxBalance: number; // Maximum credit limit
    paymentDue: number; // Amount due for the next payment
    nextPaymentDueDate: Date;
}

interface PayOffChartData {
    amountToAvoidInterest: number;
    interestAmount: number;
    remainingBalance: number;
}

export const calculatePayOffData = (
    account: CreditCardAccount
): PayOffChartData => {
    let { balance, intrest, paymentDue, maxBalance } = account;
    // Amount to avoid interest is the entire balance due
    const amountToAvoidInterest = balance;
    if (paymentDue === undefined) {
        paymentDue = balance * (intrest / 100);
    }
    // If the payment due is less than the total balance, calculate interest on the remaining balance
    const remainingBalance = maxBalance - (paymentDue + amountToAvoidInterest );
    const interestAmount =
        remainingBalance > 0 ? amountToAvoidInterest * (intrest / 100) : 0;

    return {
        amountToAvoidInterest,
        interestAmount,
        remainingBalance,
    };
};

// Generate the pie chart data for the Nivo chart
export const generatePieChartData = (account: CreditCardAccount): any[] => {
    const { amountToAvoidInterest, interestAmount, remainingBalance } =
        calculatePayOffData(account);
    const chartData = [
        {
            id: "Total accured debt",
            label: "Total accured debt",
            value: amountToAvoidInterest,
        },
        {
            id: "Interest Charged",
            label: "Interest Charged",
            value: interestAmount,
        },
        {
            id: "Remaining Balance",
            label: "Remaining Balance",
            value: remainingBalance,
        },
    ];

    return chartData;
};

const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0;
    dataWithArc.forEach((datum) => {
        total += datum.value;
    });

    return (
        <>
            <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="top"
                style={{
                    fontSize: "150%",
                    fontWeight: 600,
                    fill: "white",
                }}
            >
                ${(total - dataWithArc[2].value).toLocaleString("en-us")}
                <tspan
                    y={centerY + 30}
                    x={centerX}
                    style={{
                        color: "white",
                        fontSize: "50%",
                    }}
                >
                    Total monthly spend{" "}
                </tspan>

            </text>
        </>
    );
};

export default function CreditCardSpending({ spendData}) {
    const [customLegends, setCustomLegends] = useState<
        LegendDatum<SampleDatum>[]
    >([]);
    const [data, setdata] = useState(undefined);
    useEffect(() => {
        let tempData = [];
        Array.from(spendData.values()).forEach((account) => {
            tempData.push(account);
        });

        setdata(generatePieChartData(tempData[0]));
    }, []);

    return (
        <>
            <div className="container w-[60%] h-full col col-auto">
                <ResponsivePie
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 80, left: 40 }}
                    innerRadius={0.6}
                    padAngle={0.7}
                    cornerRadius={3}
                    valueFormat={"$,.2f"}
                    activeOuterRadiusOffset={8}
                    forwardLegendData={setCustomLegends}
                    borderWidth={1}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", -5]],
                    }}
                    arcLinkLabelsSkipAngle={0}
                    arcLinkLabelsTextColor="#fff"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={0}
                    arcLabelsTextColor={{
                        from: "color",
                        modifiers: [["darker", -5]],
                    }}
                    defs={[
                        {
                            id: "dots",
                            type: "patternDots",
                            background: "inherit",
                            color: "rgba(255, 255, 255, 0.3)",
                            size: 4,
                            padding: 1,
                            stagger: true,
                        },
                        {
                            id: "lines",
                            type: "patternLines",
                            background: "inherit",
                            color: "rgba(255, 255, 255, 0.3)",
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10,
                        },
                    ]}
                    fill={[]}
                    theme={{
                        text: {
                            fontSize: 11,
                            fill: "#ffffff",
                            outlineWidth: 0,
                            outlineColor: "#ffffff",
                        },
                        tooltip: {
                            wrapper: {},
                            container: {
                                background: "#ffffff",
                                color: "#333333",
                                fontSize: 12,
                            },
                            basic: {},
                            chip: {},
                            table: {},
                            tableCell: {},
                            tableCellValue: {},
                        },
                    }}
                    legends={[
                        {
                            anchor: "bottom",
                            direction: "row",
                            justify: false,
                            translateX: 10,
                            translateY: 56,
                            itemsSpacing: 20,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: "#fff",
                            itemDirection: "left-to-right",
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: "circle",
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemTextColor: "#000",
                                    },
                                },
                            ],
                        },
                    ]}
                    layers={["legends", "arcs", "arcLabels", CenteredMetric]}
                ></ResponsivePie>
            </div>
            {data && data.length > 0  ? 
            <div className="flex flex-col p-5 justify-center items-center">
                <span className="">You need to pay a minimum of <b>${data[1].value.toLocaleString('en-us')}</b> to avoid paying intrest this month. In addition to your minimum monthly payment.</span>
                    <hr className="w-[100%] my-3" />
                <h3 className="mt-5">Spending breakdown</h3>
                <ul>
                    <li>Total Accured Debt: ${data[0].value.toLocaleString('en-us')}</li>
                    <li>Minimum Intrest Payment: ${data[1].value.toLocaleString('en-us')}</li>
                    <li>Remaining Balance: ${data[2].value.toLocaleString('en-us')}</li>

                </ul>
            </div> : null}

        </>
    );
}
