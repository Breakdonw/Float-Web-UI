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
    isOverLimit:boolean,
}

export const calculatePayOffData = (
    account: CreditCardAccount
): PayOffChartData => {
    let { balance, intrest, paymentDue, maxBalance } = account;

    // Amount to avoid interest is the entire balance due
    const amountToAvoidInterest = balance > 0  ? balance : balance * -1 ;
    if (paymentDue === undefined) {
        paymentDue = balance * (intrest / 100);
    }
    // Calculate the remaining balance
    let remainingBalance = maxBalance - (paymentDue + amountToAvoidInterest);

    // If remaining balance is negative, cap it to 0 and mark the account as over-limit
    const isOverLimit = remainingBalance < 0;
    if (isOverLimit) {
        remainingBalance = 0;
    }

    // Interest amount is only applied if the balance is within the limit
    const interestAmount = amountToAvoidInterest * (intrest / 100);

    return {
        amountToAvoidInterest,
        interestAmount,
        remainingBalance,
        isOverLimit, // Mark if the account is over the limit
    };
};

export const generatePieChartData = (account: CreditCardAccount): any[] => {
    const { amountToAvoidInterest, interestAmount, remainingBalance, isOverLimit } =
        calculatePayOffData(account);

    // Initialize chart data
    const chartData = [
        {
            name:account.nickName,
            id: "Total Accrued Debt",
            label: "Total Accrued Debt",
            value: amountToAvoidInterest,
        },
        {
            id: "Interest Charged",
            label: "Interest Charged",
            value: interestAmount,
        },
    ];

    // Only add "Remaining Balance" if user is not over the limit
    if (!isOverLimit) {
        chartData.push({
            id: "Remaining Balance",
            label: "Remaining Balance",
            value: remainingBalance,
        });
    }

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
                    fontSize: "100%",
                    fontWeight: 600,
                    fill: "white",
                }}
            >
                ${(total - dataWithArc[2].value).toLocaleString("en-us")}
                <tspan
                    y={centerY + 20}
                    x={centerX}
                    style={{
                        color: "white",
                        fontSize: "70%",
                    }}
                >
                    {total > 0? "Total Spend" : "Debt"}
                </tspan>

            </text>
        </>
    );
};

export default function CreditCardSpending({ spendData }) {
    const [customLegends, setCustomLegends] = useState<LegendDatum[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [isOverLimit, setIsOverLimit] = useState<boolean>(false);
    const [currentSelected, setCurrentSelected] = useState(0)
    let tempData = [];
      Array.from(spendData.values()).forEach((account) => {
        tempData.push(account);
      });
    function viewNextAccount() {
      if (currentSelected >= tempData.length - 1) {
        setCurrentSelected(0)
      } else { setCurrentSelected(currentSelected + 1) }
    }
  
    function viewPrevAccount() {
      if (currentSelected == 0) {
        setCurrentSelected(tempData.length -1)
      } else { setCurrentSelected(currentSelected - 1) }
      
    }
    useEffect(() => {
  
        const payoffData = calculatePayOffData(tempData[currentSelected]);
      setIsOverLimit(payoffData.isOverLimit);
      setData(generatePieChartData(tempData[currentSelected]));
    }, [spendData,currentSelected]);
  
    return (
      <>
        <div className="flex flex-row h-full w-full ">

        <div className="flex-col w-[120%]  col col-auto">
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
            theme={{
                "text": {
                  "fontSize": 11,
                  "fill": "#ffffff",
                  "outlineWidth": 0,
                  "outlineColor": "#ffffff"
                },
                "tooltip": {
                  "wrapper": {},
                  "container": {
                    "background": "#ffffff",
                    "color": "#333333",
                    "fontSize": 12
                  },
                  "basic": {},
                  "chip": {},
                  "table": {},
                  "tableCell": {},
                  "tableCellValue": {}
                }
              }}
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
            layers={["legends", "arcs", "arcLabels", CenteredMetric]}
          ></ResponsivePie>
        </div>
        {data && data.length > 0 ? (
          <div className="flex flex-col p-5 justify-center items-center">
            {isOverLimit ? (
              <span className="">
                You are <b>over your credit limit</b>. Consider paying off the full
                balance of <b>${data[0].value.toLocaleString("en-us")}</b> to
                prevent damage to your credit score.
              </span>
            ) : (
              <>
                <span className="">
                  You need to pay a minimum of <b>${data[1].value.toLocaleString("en-us")}</b> to avoid paying interest this month, in addition to your minimum monthly payment.
                </span>
                <hr className="w-[100%] my-3" />
                <h3 className="mt-5">Spending breakdown</h3>
                <ul>
                  <li>Total Accrued Debt: ${data[0].value.toLocaleString("en-us")}</li>
                  <li>Minimum Interest Payment: ${data[1].value.toLocaleString("en-us")}</li>
                  {data[2] && (
                    <li>Remaining Balance: ${data[2].value.toLocaleString("en-us")}</li>
                  )}
                </ul>
              </>
            )}
          </div>
        ) : null}
        </div>
        <div className="mt-auto flex-row">
          <button onClick={viewPrevAccount}>prev</button>
          <span> | <i>{data.length > 0 ? data[0].name : null}</i> |</span>
          <button onClick={viewNextAccount}>next</button>
      </div>
      </>
    );
  }
  