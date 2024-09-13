import { simpleTransaction } from '@/api/Transactions'
import { LegendDatum, ResponsivePie, } from '@nivo/pie'
import { useCallback, useEffect, useState } from 'react'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.





/**
 * The `CenteredMetric` function calculates the total value from an array of data points and displays
 * it along with additional text in a centered position on a React component.
 * 
 * Args:
 *   : The `CenteredMetric` component takes in the following parameters:
 * 
 * Returns:
 *   The `CenteredMetric` component is returning a JSX element that consists of a `<text>` element with
 * the total value of the dataWithArc array displayed at the specified centerX and centerY coordinates.
 * Additionally, there are two `<tspan>` elements within the `<text>` element that display messages
 * about monthly spending. The text elements have specific styling for font size, weight, color, and
 * positioning.
 */
const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0
    dataWithArc.forEach(datum => {
        total += datum.value
    })
    return (
        <>
            <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="top"
                style={{
                    fontSize: '250%',
                    fontWeight: 600,
                    fill: 'white',
                }}
            >
                ${total.toLocaleString("en-us")}
                <tspan
                    y={centerY + 30}
                    x={centerX}
                    style={{
                        color: 'white',
                        fontSize: '24%',
                    }}
                >Your monthly spend </tspan>
                <tspan
                    y={centerY + 45}
                    x={centerX}
                    style={{
                        color: 'white',
                        fontSize: '24%',
                    }}
                >is up this month!</tspan>
            </text>

        </>
    )
}


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
    let combinedData = new Map()

    Array.from(data.values()).forEach(transact => {
        const existing = combinedData.get(transact.category.name) || { id: transact.category.name, label: transact.category.name, value: 0, color: transact.category.color };
        combinedData.set(transact.category.name, {
            id: transact.category.name,
            label: transact.category.name,
            value: existing.value + transact.amount,
            color: transact.category.color
        })
    })

    const combinedDataArray = Array.from(combinedData, ([key, value]) => ({
        id: String(value.id).charAt(0).toUpperCase() + String(value.id).slice(1),
        label: String(value.label).charAt(0).toUpperCase() + String(value.label).slice(1),
        value: value.value,
        color: value.color
    }));



    return combinedDataArray

}


export default function MonthlySpendingChart({ spendData, info }) {
    const [customLegends, setCustomLegends] = useState<LegendDatum<SampleDatum>[]>([])
    const [data, setdata] = useState([{}])
    useEffect(() => {
        setdata(formatData(spendData))
    },[])

    return (<>
        <ResponsivePie

            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.6}
            theme={{
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
            padAngle={0.7}
            cornerRadius={3}
            valueFormat={"$,.2f"}
            activeOuterRadiusOffset={8}
            forwardLegendData={setCustomLegends}
            borderWidth={2}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        -5
                    ]
                ]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#fff"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        -5
                    ]
                ]
            }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(0, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}

            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
            layers={['legends', 'arcs', 'arcLabels', 'arcLinkLabels', CenteredMetric]}
        />


    </>)
}